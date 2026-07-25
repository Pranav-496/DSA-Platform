const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const PendingUser = require('../models/PendingUser');
const nodemailer = require('nodemailer');

const router = express.Router();


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("FATAL ERROR: JWT_SECRET is not defined in environment variables. Refusing to start in insecure mode.");
}

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user (Request OTP)
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if user already exists and is verified in DB
        let user = await User.findOne({ email });
        if (user && user.isVerified !== false) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 2. Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // 3. Store in database
        await PendingUser.findOneAndUpdate(
            { email },
            { name, email, password, otp },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );


        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            console.log(`Attempting to send verification email to: ${email}`);
            await transporter.sendMail({
                from: `"AlgoNova" <${process.env.EMAIL_USER}>`,
                to: email, // Use email from req.body directly
                subject: 'AlgoNova - Verify Your Identity',
                html: `
                    <div style="font-family: Arial, sans-serif; background: #0a0a0a; padding: 20px; color: #fff; border: 1px solid #00f3ff; border-radius: 8px;">
                        <h2 style="color: #00f3ff; margin-bottom: 20px;">AlgoNova Registration</h2>
                        <p>Operator, verify your identity to join the grid.</p>
                        <p>Your access code is:</p>
                        <h1 style="color: #bc13fe; letter-spacing: 4px; padding: 10px; background: #111; border: 1px solid #333; display: inline-block;">${otp}</h1>
                        <p>This code will self-destruct in 10 minutes.</p>
                    </div>
                `,
            });
            console.log("Email sent successfully!");
        } else {
            console.log("Nodemailer credentials missing. Mock Email Sent. Registration OTP:", otp);
        }

        res.status(200).json({ message: 'OTP sent to email for verification' });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Verify Registration OTP
// @route   POST /api/auth/verify-registration
router.post('/verify-registration', async (req, res) => {
    try {
        const { email, otp } = req.body;
        
        // 1. Check in database
        const pendingUser = await PendingUser.findOne({ email });

        if (!pendingUser) {
            return res.status(400).json({ message: 'Registration session expired or not found. Please register again.' });
        }

        if (pendingUser.otp !== otp) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // 2. Create the user in database ONLY AFTER verification
        const user = await User.create({
            name: pendingUser.name,
            email: pendingUser.email,
            password: pendingUser.password, // Will be hashed by pre-save hook in model
            isVerified: true,
            progress: {
                problemsSolved: 0,
                accuracy: 100,
                placementReadiness: 10,
                weakAreas: [],
                recentActivity: [{
                    type: 'system',
                    text: 'Identity Verified. Operator active.',
                    time: new Date()
                }]
            }
        });

        // 3. Clear from database
        await PendingUser.deleteOne({ email });


        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            if (user.isVerified === false) {
                return res.status(403).json({ message: 'Account not verified. Please register again to receive a new OTP.' });
            }
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Forgot Password (Send OTP)
// @route   POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        user.resetOtp = otp;
        user.resetOtpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
        await user.save();

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            await transporter.sendMail({
                from: `"AlgoNova" <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: 'AlgoNova - Password Reset OTP',
                html: `
                    <div style="font-family: Arial, sans-serif; background: #0a0a0a; padding: 20px; color: #fff; border: 1px solid #00f3ff; border-radius: 8px;">
                        <h2 style="color: #00f3ff; margin-bottom: 20px;">AlgoNova Password Reset</h2>
                        <p>Operator, we received a request to reset your password.</p>
                        <p>Your authentication code is:</p>
                        <h1 style="color: #bc13fe; letter-spacing: 4px; padding: 10px; background: #111; border: 1px solid #333; display: inline-block;">${otp}</h1>
                        <p>This code will self-destruct in 10 minutes.</p>
                        <p style="color: #888; font-size: 12px; margin-top: 10px;">If you did not request this, ignore this email.</p>
                    </div>
                `,
            });
        } else {
            console.log("Mock Email Sent. OTP:", otp); // For local testing without credentials
        }

        res.json({ message: 'OTP sent to email' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.resetOtp !== otp || user.resetOtpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        res.json({ message: 'OTP verified successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Reset Password
// @route   POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.resetOtp !== otp || user.resetOtpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.password = newPassword; // Will be hashed by pre-save hook in User model
        user.resetOtp = undefined;
        user.resetOtpExpires = undefined;
        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = { router, JWT_SECRET };
