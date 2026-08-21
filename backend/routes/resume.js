const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// ========================================
// Resume ATS Screener — Backend Route
// ========================================

// ATS keyword database organized by job category
const ATS_KEYWORDS = {
  general: [
    'team', 'collaboration', 'communication', 'leadership', 'problem solving',
    'project management', 'agile', 'scrum', 'stakeholder', 'deadline',
    'metrics', 'kpi', 'optimization', 'strategy', 'cross-functional'
  ],
  technical: [
    'javascript', 'python', 'java', 'c++', 'typescript', 'react', 'node.js',
    'sql', 'nosql', 'mongodb', 'postgresql', 'aws', 'docker', 'kubernetes',
    'ci/cd', 'git', 'rest api', 'graphql', 'microservices', 'cloud',
    'machine learning', 'data structures', 'algorithms', 'system design',
    'testing', 'unit test', 'integration', 'deployment', 'devops', 'linux'
  ],
  impact: [
    'increased', 'decreased', 'improved', 'reduced', 'optimized', 'built',
    'designed', 'implemented', 'developed', 'launched', 'led', 'managed',
    'architected', 'scaled', 'automated', 'streamlined', 'delivered',
    'achieved', 'grew', 'saved', 'created', 'established', 'mentored'
  ],
  sections: [
    'experience', 'education', 'skills', 'projects', 'certifications',
    'summary', 'objective', 'achievements', 'awards', 'publications'
  ]
};

// Rule-based ATS analysis engine
function analyzeResumeText(text) {
  const lower = text.toLowerCase();
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const lines = text.split('\n').filter(l => l.trim().length > 0);

  // ── 1. Section Detection ──
  const detectedSections = [];
  const missingSections = [];
  ATS_KEYWORDS.sections.forEach(section => {
    const regex = new RegExp(`\\b${section}\\b`, 'i');
    if (regex.test(text)) {
      detectedSections.push(section);
    } else {
      missingSections.push(section);
    }
  });

  // ── 2. Keyword Matching ──
  const matchedTechnical = [];
  const matchedImpact = [];
  const matchedGeneral = [];

  ATS_KEYWORDS.technical.forEach(kw => {
    if (lower.includes(kw.toLowerCase())) matchedTechnical.push(kw);
  });
  ATS_KEYWORDS.impact.forEach(kw => {
    const regex = new RegExp(`\\b${kw}\\b`, 'i');
    if (regex.test(lower)) matchedImpact.push(kw);
  });
  ATS_KEYWORDS.general.forEach(kw => {
    if (lower.includes(kw.toLowerCase())) matchedGeneral.push(kw);
  });

  // ── 3. Quantification Check (numbers / metrics in bullet points) ──
  const quantifiedLines = lines.filter(line => /\d+%|\d+\+|\$[\d,]+|\d{2,}/.test(line));
  const quantificationRatio = lines.length > 0 ? quantifiedLines.length / lines.length : 0;

  // ── 4. Contact Information Check ──
  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(text);
  const hasPhone = /(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/.test(text);
  const hasLinkedIn = /linkedin\.com|linkedin/i.test(text);
  const hasGitHub = /github\.com|github/i.test(text);
  const hasPortfolio = /portfolio|website|\.dev|\.io|\.com\/[a-z]/i.test(text);

  // ── 5. Formatting Checks ──
  const hasBulletPoints = /^[\s]*[•\-\*▪▸→]/m.test(text);
  const avgLineLength = lines.reduce((sum, l) => sum + l.length, 0) / (lines.length || 1);
  const hasLongParagraphs = lines.some(l => l.length > 300);

  // ── 6. Score Calculation ──
  const scores = {
    sectionStructure: 0,
    keywordOptimization: 0,
    impactLanguage: 0,
    quantification: 0,
    contactCompleteness: 0,
    formatting: 0,
    length: 0
  };

  // Section Structure (15 pts)
  const essentialSections = ['experience', 'education', 'skills'];
  const foundEssential = essentialSections.filter(s => detectedSections.includes(s)).length;
  scores.sectionStructure = Math.round((foundEssential / essentialSections.length) * 10 + (detectedSections.length >= 4 ? 5 : detectedSections.length >= 3 ? 3 : 0));

  // Keyword Optimization (25 pts)
  const techScore = Math.min(15, matchedTechnical.length * 1.5);
  const generalScore = Math.min(10, matchedGeneral.length * 2);
  scores.keywordOptimization = Math.round(techScore + generalScore);

  // Impact Language (20 pts)
  scores.impactLanguage = Math.min(20, matchedImpact.length * 2.5);

  // Quantification (15 pts)
  if (quantificationRatio >= 0.3) scores.quantification = 15;
  else if (quantificationRatio >= 0.15) scores.quantification = 10;
  else if (quantificationRatio >= 0.05) scores.quantification = 5;
  else scores.quantification = 1;

  // Contact Completeness (10 pts)
  let contactScore = 0;
  if (hasEmail) contactScore += 3;
  if (hasPhone) contactScore += 2;
  if (hasLinkedIn) contactScore += 2;
  if (hasGitHub) contactScore += 2;
  if (hasPortfolio) contactScore += 1;
  scores.contactCompleteness = Math.min(10, contactScore);

  // Formatting (10 pts)
  if (hasBulletPoints) scores.formatting += 4;
  if (!hasLongParagraphs) scores.formatting += 3;
  if (avgLineLength > 20 && avgLineLength < 120) scores.formatting += 3;

  // Length (5 pts)
  if (wordCount >= 200 && wordCount <= 800) scores.length = 5;
  else if (wordCount >= 100 && wordCount <= 1200) scores.length = 3;
  else scores.length = 1;

  const totalScore = Math.min(100, Object.values(scores).reduce((a, b) => a + b, 0));

  // ── 7. Build Suggestions ──
  const suggestions = [];
  const strengths = [];

  // Strengths
  if (matchedTechnical.length >= 5) strengths.push(`Strong technical keyword presence (${matchedTechnical.length} keywords detected).`);
  if (matchedImpact.length >= 5) strengths.push(`Excellent use of action verbs and impact language.`);
  if (quantificationRatio >= 0.2) strengths.push(`Good quantification of achievements with metrics and numbers.`);
  if (detectedSections.length >= 4) strengths.push(`Well-structured resume with clear section organization.`);
  if (hasEmail && hasLinkedIn && hasGitHub) strengths.push(`Complete contact information with professional profiles.`);
  if (hasBulletPoints) strengths.push(`Proper use of bullet points for readability.`);

  // Suggestions for improvement
  if (matchedTechnical.length < 5) suggestions.push(`Add more technical keywords. ATS systems scan for specific technologies. Found only ${matchedTechnical.length}—aim for 8-12+.`);
  if (matchedImpact.length < 3) suggestions.push(`Use stronger action verbs: "Implemented", "Architected", "Optimized", "Scaled" instead of passive descriptions.`);
  if (quantificationRatio < 0.15) suggestions.push(`Quantify your achievements. Instead of "Improved performance", write "Improved API response time by 40%, reducing latency from 800ms to 480ms".`);
  if (missingSections.includes('skills')) suggestions.push(`Add a dedicated "Skills" section. ATS systems specifically scan for a skills block.`);
  if (missingSections.includes('experience')) suggestions.push(`Ensure you have a clear "Experience" or "Work Experience" section header.`);
  if (missingSections.includes('projects') && matchedTechnical.length < 5) suggestions.push(`Add a "Projects" section to demonstrate hands-on technical skills.`);
  if (!hasLinkedIn) suggestions.push(`Include your LinkedIn profile URL for professional credibility.`);
  if (!hasGitHub && matchedTechnical.length > 0) suggestions.push(`Add your GitHub profile link to showcase your code and open-source contributions.`);
  if (hasLongParagraphs) suggestions.push(`Break long paragraphs into concise bullet points (1-2 lines each). ATS and recruiters prefer scannable content.`);
  if (wordCount < 150) suggestions.push(`Your resume seems too brief. Aim for 300-700 words with detailed accomplishments.`);
  if (wordCount > 1000) suggestions.push(`Your resume may be too long. Keep it concise—1-2 pages maximum for most roles.`);
  if (!missingSections.includes('summary') && lower.includes('objective')) suggestions.push(`Replace "Objective" with a "Professional Summary" — objectives are considered outdated by modern ATS.`);

  // Grade
  let grade;
  if (totalScore >= 90) grade = 'A+';
  else if (totalScore >= 80) grade = 'A';
  else if (totalScore >= 70) grade = 'B+';
  else if (totalScore >= 60) grade = 'B';
  else if (totalScore >= 50) grade = 'C';
  else if (totalScore >= 35) grade = 'D';
  else grade = 'F';

  return {
    totalScore,
    grade,
    scores,
    wordCount,
    lineCount: lines.length,
    detectedSections,
    missingSections: missingSections.filter(s => ['experience', 'education', 'skills', 'projects', 'summary'].includes(s)),
    keywords: {
      technical: matchedTechnical,
      impact: matchedImpact,
      general: matchedGeneral,
      totalFound: matchedTechnical.length + matchedImpact.length + matchedGeneral.length
    },
    contact: { hasEmail, hasPhone, hasLinkedIn, hasGitHub, hasPortfolio },
    formatting: { hasBulletPoints, hasLongParagraphs, avgLineLength: Math.round(avgLineLength) },
    quantification: { ratio: Math.round(quantificationRatio * 100), quantifiedLines: quantifiedLines.length, totalLines: lines.length },
    strengths: strengths.length > 0 ? strengths : ['Your resume was parsed successfully. Follow the suggestions below to improve your score.'],
    suggestions: suggestions.length > 0 ? suggestions : ['Your resume looks solid! Consider tailoring it to specific job descriptions for even better ATS performance.'],
  };
}


// ========================================
// POST /api/resume/analyze
// Accepts: { resumeText: string }
// ========================================
router.post('/analyze', protect, async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 30) {
      return res.status(400).json({ error: 'Resume text is required (minimum 30 characters).' });
    }

    // Step 1: Run the rule-based analysis engine
    const ruleAnalysis = analyzeResumeText(resumeText.trim());

    // Step 2: Try to get an AI-powered deep critique via Gemini
    let aiCritique = null;
    let aiSource = 'rule_engine';

    if (process.env.GEMINI_API_KEY && resumeText.trim().length > 100) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `You are a senior tech recruiter and ATS (Applicant Tracking System) expert at a top FAANG company. Analyze this resume text critically.

Resume Text:
"""
${resumeText.substring(0, 3000)}
"""

Rule-based ATS Score: ${ruleAnalysis.totalScore}/100
Technical keywords found: ${ruleAnalysis.keywords.technical.join(', ')}
Missing sections: ${ruleAnalysis.missingSections.join(', ') || 'None'}
Quantification ratio: ${ruleAnalysis.quantification.ratio}%

Provide a comprehensive analysis in this EXACT JSON format (no markdown, no code fences):
{
  "overallImpression": "2-3 sentence overall impression of this resume",
  "topStrengths": ["strength 1", "strength 2", "strength 3"],
  "criticalImprovements": ["improvement 1 with specific actionable advice", "improvement 2 with specific actionable advice", "improvement 3 with specific actionable advice"],
  "missingKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "bulletRewrites": [
    {
      "original": "a weak bullet point you found in the resume",
      "improved": "the same bullet rewritten with impact metrics and action verbs"
    }
  ],
  "adjustedScore": ${ruleAnalysis.totalScore}
}

Return ONLY the raw JSON object, no markdown formatting.` }] }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 800 }
          })
        });

        const data = await response.json();
        if (data.candidates && data.candidates[0]) {
          const raw = data.candidates[0].content.parts[0].text.replace(/```json|```/g, "").trim();
          aiCritique = JSON.parse(raw);
          aiSource = 'gemini';
        }
      } catch (e) {
        console.error("Gemini resume analysis error:", e.message);
        // Fall through to rule-based fallback
      }
    }

    // Step 3: Combine rule-based + AI analysis
    const result = {
      ...ruleAnalysis,
      aiCritique,
      source: aiSource,
    };

    res.json(result);
  } catch (error) {
    console.error("Resume Analysis Error:", error);
    res.status(500).json({ error: "Failed to analyze resume. Please try again." });
  }
});

// ========================================
// POST /api/resume/jobs
// Matches resume skills → job recommendations
// with direct apply links
// ========================================
router.post('/jobs', protect, async (req, res) => {
  try {
    const { skills, resumeText } = req.body;

    if ((!skills || skills.length === 0) && (!resumeText || resumeText.length < 30)) {
      return res.status(400).json({ error: 'Resume skills or text is required.' });
    }

    const skillsList = skills && skills.length > 0
      ? skills.join(', ')
      : 'general software engineering';

    let jobTitles = [];
    let experienceLevel = 'entry';
    let usedAI = false;

    // ── Strategy 1: Gemini AI ──
    if (process.env.GEMINI_API_KEY) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        
        const prompt = `You are an expert career advisor and recruiter. A candidate has the following skills on their resume:
Skills: ${skillsList}

${resumeText ? `Full resume text (first 2000 chars):\n"""${resumeText.substring(0, 2000)}"""` : ''}

TASK: Analyze this candidate's profile deeply and recommend exactly 6 job roles they should apply for. Each job must have a UNIQUE and REALISTIC match score based on how well their specific skills align.

CRITICAL SCORING RULES:
- Match scores MUST vary between 40 and 95. Never give the same score to two jobs.
- A job that requires skills the candidate HAS should score 75-95.
- A job that requires SOME skills the candidate has but is missing key ones should score 55-74.
- A stretch role where the candidate only partially qualifies should score 40-54.
- Include 2 high-match jobs, 2 medium-match jobs, and 2 stretch/aspirational jobs.

Return ONLY this JSON (no markdown, no code fences, no extra text):
{"experienceLevel":"intern or entry or mid or senior","recommendations":[{"title":"Job Title","matchScore":85,"matchedSkills":["skill1","skill2"],"missingSkills":["skill1"],"salaryRange":"₹4L - ₹8L","demandLevel":"High","description":"Why this fits"}]}`;

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.7, maxOutputTokens: 1500 }
          })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0]) {
          let raw = data.candidates[0].content.parts[0].text.trim();
          // Strip markdown fences
          raw = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
          const parsed = JSON.parse(raw);
          jobTitles = parsed.recommendations || [];
          experienceLevel = parsed.experienceLevel || 'entry';
          usedAI = jobTitles.length > 0;
          console.log(`✅ AI Job matching returned ${jobTitles.length} recommendations`);
        } else {
          console.error("Gemini returned no candidates:", JSON.stringify(data).substring(0, 300));
        }
      } catch (e) {
        console.error("Gemini job matching error:", e.message);
      }
    } else {
      console.warn("GEMINI_API_KEY not set, using fallback job matcher");
    }

    // ── Strategy 2: Dynamic Fallback (Skill-Based Matching) ──
    if (jobTitles.length === 0) {
      jobTitles = generateDynamicFallback(skills || [], resumeText || '');
      experienceLevel = detectExperienceLevel(resumeText || '');
    }

    // Build direct apply/search URLs for each recommendation
    const recommendations = jobTitles.map(job => {
      const query = encodeURIComponent(job.title);
      return {
        ...job,
        source: usedAI ? 'ai' : 'engine',
        applyLinks: {
          indeed: `https://www.indeed.com/jobs?q=${query}&fromage=14`,
          linkedin: `https://www.linkedin.com/jobs/search/?keywords=${query}&f_E=1%2C2%2C3`,
          glassdoor: `https://www.glassdoor.co.in/Job/jobs.htm?sc.keyword=${query}`,
          naukri: `https://www.naukri.com/${job.title.toLowerCase().replace(/\s+/g, '-')}-jobs`,
          internshala: `https://internshala.com/internships/${job.title.toLowerCase().replace(/\s+/g, '-')}-internship`,
          aicte: `https://internship.aicte-india.org/`,
        }
      };
    });

    // Sort by matchScore descending
    recommendations.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      experienceLevel,
      totalRecommendations: recommendations.length,
      recommendations,
      searchedSkills: skills || [],
      source: usedAI ? 'gemini_ai' : 'rule_engine',
    });

  } catch (error) {
    console.error("Job Matching Error:", error);
    res.status(500).json({ error: "Failed to generate job recommendations." });
  }
});

// ========================================
// Dynamic Fallback: Real skill-intersection matching
// ========================================
const JOB_PROFILES = [
  {
    title: 'Frontend Developer',
    requiredSkills: ['react', 'javascript', 'html', 'css', 'typescript', 'vue', 'angular', 'tailwind', 'redux', 'next.js'],
    salaryRange: '₹4L - ₹12L',
    demandLevel: 'High',
  },
  {
    title: 'Backend Developer',
    requiredSkills: ['node.js', 'express', 'python', 'django', 'flask', 'java', 'spring', 'rest api', 'sql', 'mongodb'],
    salaryRange: '₹5L - ₹15L',
    demandLevel: 'High',
  },
  {
    title: 'Full Stack Developer',
    requiredSkills: ['react', 'node.js', 'javascript', 'mongodb', 'express', 'html', 'css', 'git', 'rest api', 'typescript'],
    salaryRange: '₹6L - ₹18L',
    demandLevel: 'High',
  },
  {
    title: 'Data Scientist',
    requiredSkills: ['python', 'machine learning', 'tensorflow', 'pandas', 'numpy', 'sql', 'data', 'statistics', 'deep learning', 'scikit-learn'],
    salaryRange: '₹8L - ₹25L',
    demandLevel: 'High',
  },
  {
    title: 'DevOps Engineer',
    requiredSkills: ['docker', 'kubernetes', 'aws', 'ci/cd', 'linux', 'jenkins', 'terraform', 'git', 'cloud', 'monitoring'],
    salaryRange: '₹8L - ₹22L',
    demandLevel: 'High',
  },
  {
    title: 'Mobile App Developer',
    requiredSkills: ['react native', 'flutter', 'swift', 'kotlin', 'javascript', 'android', 'ios', 'firebase', 'dart', 'java'],
    salaryRange: '₹5L - ₹16L',
    demandLevel: 'Medium',
  },
  {
    title: 'Machine Learning Engineer',
    requiredSkills: ['python', 'tensorflow', 'pytorch', 'machine learning', 'deep learning', 'nlp', 'computer vision', 'data structures', 'algorithms', 'gpu'],
    salaryRange: '₹10L - ₹30L',
    demandLevel: 'High',
  },
  {
    title: 'Java Developer',
    requiredSkills: ['java', 'spring', 'hibernate', 'microservices', 'sql', 'rest api', 'maven', 'junit', 'design patterns', 'multithreading'],
    salaryRange: '₹5L - ₹18L',
    demandLevel: 'Medium',
  },
  {
    title: 'Python Developer',
    requiredSkills: ['python', 'django', 'flask', 'fastapi', 'sql', 'rest api', 'celery', 'redis', 'testing', 'docker'],
    salaryRange: '₹5L - ₹16L',
    demandLevel: 'High',
  },
  {
    title: 'Cloud Solutions Architect',
    requiredSkills: ['aws', 'azure', 'gcp', 'cloud', 'docker', 'kubernetes', 'microservices', 'networking', 'security', 'terraform'],
    salaryRange: '₹15L - ₹40L',
    demandLevel: 'High',
  },
  {
    title: 'QA / Test Engineer',
    requiredSkills: ['testing', 'selenium', 'jest', 'cypress', 'unit test', 'integration', 'automation', 'javascript', 'python', 'ci/cd'],
    salaryRange: '₹4L - ₹12L',
    demandLevel: 'Medium',
  },
  {
    title: 'UI/UX Designer',
    requiredSkills: ['figma', 'design', 'user research', 'wireframe', 'prototype', 'css', 'html', 'accessibility', 'responsive', 'adobe'],
    salaryRange: '₹4L - ₹14L',
    demandLevel: 'Medium',
  },
  {
    title: 'Database Administrator',
    requiredSkills: ['sql', 'mongodb', 'postgresql', 'mysql', 'nosql', 'redis', 'database', 'optimization', 'backup', 'replication'],
    salaryRange: '₹6L - ₹18L',
    demandLevel: 'Medium',
  },
  {
    title: 'Cybersecurity Analyst',
    requiredSkills: ['security', 'networking', 'linux', 'firewall', 'penetration testing', 'encryption', 'siem', 'vulnerability', 'compliance', 'python'],
    salaryRange: '₹6L - ₹20L',
    demandLevel: 'High',
  },
  {
    title: 'Software Engineer Intern',
    requiredSkills: ['data structures', 'algorithms', 'javascript', 'python', 'java', 'c++', 'git', 'sql', 'html', 'problem solving'],
    salaryRange: '₹10K - ₹40K/mo',
    demandLevel: 'High',
  },
];

function generateDynamicFallback(skills, resumeText) {
  const userSkills = new Set(skills.map(s => s.toLowerCase()));
  // Also extract skills from resume text
  const textLower = resumeText.toLowerCase();

  const scored = JOB_PROFILES.map(profile => {
    let matched = [];
    let missing = [];

    profile.requiredSkills.forEach(req => {
      if (userSkills.has(req) || textLower.includes(req)) {
        matched.push(req);
      } else {
        missing.push(req);
      }
    });

    const overlap = matched.length / profile.requiredSkills.length;
    // Score: 40-95 range mapped from overlap ratio (0.0-1.0)
    const matchScore = Math.round(40 + overlap * 55);

    return {
      title: profile.title,
      matchScore,
      matchedSkills: matched.slice(0, 5),
      missingSkills: missing.slice(0, 3),
      salaryRange: profile.salaryRange,
      demandLevel: profile.demandLevel,
      description: matched.length > 0 
        ? `You have ${matched.length}/${profile.requiredSkills.length} key skills for this role.`
        : `A stretch role to explore — build skills in ${missing.slice(0, 2).join(' and ')}.`,
    };
  });

  // Sort by matchScore desc, take top 6
  scored.sort((a, b) => b.matchScore - a.matchScore);
  return scored.slice(0, 6);
}

function detectExperienceLevel(text) {
  const lower = text.toLowerCase();
  if (/\b(senior|lead|principal|staff|architect|director|manager|8\+?\s*years|10\+?\s*years)\b/.test(lower)) return 'senior';
  if (/\b(mid[\s-]?level|3\+?\s*years|4\+?\s*years|5\+?\s*years)\b/.test(lower)) return 'mid';
  if (/\b(intern|internship|trainee|fresher|student|pursuing|semester)\b/.test(lower)) return 'intern';
  return 'entry';
}

module.exports = router;
