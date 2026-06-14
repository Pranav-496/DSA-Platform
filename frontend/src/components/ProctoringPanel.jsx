import React, { useState, useEffect, useRef, useCallback } from "react";
import * as faceapi from "face-api.js";
import { Video, VideoOff, AlertTriangle, Eye, Users, Shield, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const VIOLATION_WEIGHTS = {
  tab_switch: 5,
  no_face: 15,
  multiple_faces: 20,
  copy_paste: 10,
  window_blur: 5,
  looking_away: 8,
};

export default function ProctoringPanel({ isActive, onViolation, onScoreUpdate }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const detectIntervalRef = useRef(null);

  const [cameraOn, setCameraOn] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [violations, setViolations] = useState([]);
  const [integrityScore, setIntegrityScore] = useState(100);
  const [currentStatus, setCurrentStatus] = useState("Initializing...");
  const [statusColor, setStatusColor] = useState("text-text/60");
  const [faceCount, setFaceCount] = useState(0);
  const [showTimeline, setShowTimeline] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState(null);

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/model/";
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
        setCurrentStatus("Models loaded. Click to start camera.");
      } catch (e) {
        console.error("Face model load error:", e);
        setCurrentStatus("Face models failed — using tab detection only");
        setModelsLoaded(false);
      }
    };
    loadModels();
  }, []);

  // Tab visibility detection
  useEffect(() => {
    if (!isActive) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        logViolation("tab_switch", "Tab switched away during interview");
      }
    };

    const handleWindowBlur = () => {
      logViolation("window_blur", "Window lost focus");
    };

    const handleCopyPaste = (e) => {
      if (e.type === "copy" || e.type === "cut") {
        logViolation("copy_paste", `${e.type} detected during interview`);
      }
      if (e.type === "paste") {
        logViolation("copy_paste", "Paste detected during interview");
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("copy", handleCopyPaste);
    document.addEventListener("paste", handleCopyPaste);
    document.addEventListener("cut", handleCopyPaste);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("copy", handleCopyPaste);
      document.removeEventListener("paste", handleCopyPaste);
      document.removeEventListener("cut", handleCopyPaste);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [isActive]);

  const logViolation = useCallback((type, details) => {
    const weight = VIOLATION_WEIGHTS[type] || 5;
    const violation = {
      type,
      details,
      weight,
      timestamp: new Date().toISOString(),
      timeStr: new Date().toLocaleTimeString(),
    };

    setViolations((prev) => {
      const updated = [...prev, violation];
      const totalWeight = updated.reduce((sum, v) => sum + v.weight, 0);
      const newScore = Math.max(0, 100 - totalWeight);
      setIntegrityScore(newScore);
      onScoreUpdate?.(newScore);
      onViolation?.(violation);
      return updated;
    });
  }, [onViolation, onScoreUpdate]);

  // Start camera + recording
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraOn(true);
      setCurrentStatus("Camera active — Monitoring...");
      setStatusColor("text-success");

      // Start recording
      try {
        const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
        chunksRef.current = [];
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };
        recorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: "video/webm" });
          setRecordedUrl(URL.createObjectURL(blob));
        };
        recorder.start(1000);
        recorderRef.current = recorder;
      } catch (recErr) {
        console.warn("Recording not supported:", recErr);
      }

      // Start face detection loop
      startDetection();
    } catch (err) {
      console.error("Camera error:", err);
      setCurrentStatus("Camera access denied");
      setStatusColor("text-danger");
    }
  };

  const stopCamera = () => {
    if (detectIntervalRef.current) clearInterval(detectIntervalRef.current);
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    setCameraOn(false);
    setCurrentStatus("Camera stopped");
    setStatusColor("text-text/60");
  };

  const startDetection = () => {
    if (!modelsLoaded) return;
    detectIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) return;

      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.4 }))
        .withFaceLandmarks(true);

      setFaceCount(detections.length);

      // Draw detections on canvas
      if (canvasRef.current && videoRef.current) {
        const dims = faceapi.matchDimensions(canvasRef.current, videoRef.current, true);
        const resized = faceapi.resizeResults(detections, dims);
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        faceapi.draw.drawDetections(canvasRef.current, resized);
      }

      if (detections.length === 0) {
        setCurrentStatus("⚠ No face detected!");
        setStatusColor("text-danger");
        logViolation("no_face", "No face detected in camera feed");
      } else if (detections.length > 1) {
        setCurrentStatus(`⚠ ${detections.length} faces detected!`);
        setStatusColor("text-danger");
        logViolation("multiple_faces", `${detections.length} faces detected`);
      } else {
        // Check if looking away using landmarks
        const landmarks = detections[0].landmarks;
        const nose = landmarks.getNose();
        const jaw = landmarks.getJawOutline();
        if (nose && jaw) {
          const noseX = nose[3]?.x || 0;
          const jawLeft = jaw[0]?.x || 0;
          const jawRight = jaw[jaw.length - 1]?.x || 1;
          const faceWidth = jawRight - jawLeft;
          const nosePos = (noseX - jawLeft) / faceWidth;
          if (nosePos < 0.3 || nosePos > 0.7) {
            setCurrentStatus("⚠ Looking away!");
            setStatusColor("text-warning");
            logViolation("looking_away", "Candidate appears to be looking away");
          } else {
            setCurrentStatus("✓ Face detected — OK");
            setStatusColor("text-success");
          }
        } else {
          setCurrentStatus("✓ Face detected — OK");
          setStatusColor("text-success");
        }
      }
    }, 3000); // Check every 3 seconds
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const getScoreColor = (s) => {
    if (s >= 80) return "text-surface";
    if (s >= 50) return "text-text";
    return "text-surface";
  };

  const getScoreBg = (s) => {
    if (s >= 80) return "bg-success";
    if (s >= 50) return "bg-warning";
    return "bg-danger";
  };

  const violationIcons = {
    tab_switch: <Eye size={12} />,
    no_face: <VideoOff size={12} />,
    multiple_faces: <Users size={12} />,
    copy_paste: <AlertTriangle size={12} />,
    window_blur: <Eye size={12} />,
    looking_away: <Eye size={12} />,
  };

  return (
    <div className="bg-surface border-4 border-text flex flex-col h-full overflow-hidden shadow-[4px_4px_0px_#111]">
      {/* Header */}
      <div className="p-3 bg-background border-b-4 border-text flex items-center justify-between">
        <h3 className="text-text text-sm font-black font-geist uppercase flex items-center gap-2 tracking-wider">
          <Shield size={16} className="text-primary" /> PROCTORING
        </h3>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-none border-2 border-text shadow-[2px_2px_0px_#111] ${cameraOn ? "bg-danger animate-pulse" : "bg-text/30"}`} />
          <span className="text-xs text-text font-black uppercase">{cameraOn ? "REC" : "OFF"}</span>
        </div>
      </div>

      {/* Video Feed */}
      <div className="relative bg-text aspect-video w-full overflow-hidden border-b-4 border-text">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`w-full h-full object-cover ${cameraOn ? "" : "hidden"}`}
          style={{ transform: "scaleX(-1)" }}
        />
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full ${cameraOn ? "" : "hidden"}`}
          style={{ transform: "scaleX(-1)" }}
        />
        {!cameraOn && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background">
            <VideoOff size={40} className="text-text/40" />
            <button
              onClick={startCamera}
              className="px-6 py-2 bg-primary text-text border-4 border-text text-sm font-black font-geist uppercase hover:-translate-y-1 hover:shadow-[4px_4px_0px_#111] transition-all shadow-[2px_2px_0px_#111]"
            >
              START PROCTORING
            </button>
          </div>
        )}
        {cameraOn && (
          <button
            onClick={stopCamera}
            className="absolute top-2 right-2 p-2 bg-surface border-2 border-text shadow-[2px_2px_0px_#111] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#111] transition-all"
          >
            <VideoOff size={16} className="text-danger" />
          </button>
        )}
      </div>

      {/* Status Bar */}
      <div className="px-4 py-3 border-b-4 border-text flex items-center justify-between bg-surface">
        <span className={`text-xs font-black uppercase ${statusColor}`}>{currentStatus}</span>
        {cameraOn && (
          <span className="text-xs text-text font-black uppercase">Faces: {faceCount}</span>
        )}
      </div>

      {/* Integrity Score */}
      <div className="px-4 py-3 flex items-center justify-between bg-surface">
        <span className="text-xs text-text font-black uppercase tracking-widest">Integrity</span>
        <div className={`px-3 py-1 border-2 border-text text-sm font-black font-geist shadow-[2px_2px_0px_#111] ${getScoreBg(integrityScore)} ${getScoreColor(integrityScore)}`}>
          {integrityScore}/100
        </div>
      </div>

      {/* Integrity Bar */}
      <div className="px-4 pb-4 bg-surface">
        <div className="w-full bg-background border-2 border-text h-3 overflow-hidden shadow-inner">
          <div
            className={`h-full border-r-2 border-text transition-all duration-500 ${integrityScore >= 80 ? "bg-success" : integrityScore >= 50 ? "bg-warning" : "bg-danger"}`}
            style={{ width: `${integrityScore}%` }}
          />
        </div>
      </div>

      {/* Violations Count + Toggle */}
      <div className="px-4 py-3 border-t-4 border-text bg-background">
        <button
          onClick={() => setShowTimeline(!showTimeline)}
          className="w-full flex items-center justify-between text-sm font-black uppercase tracking-wider text-text transition-all hover:text-primary"
        >
          <span className="flex items-center gap-2">
            <AlertTriangle size={16} className={violations.length > 0 ? "text-danger" : "text-text/50"} />
            {violations.length} Violation{violations.length !== 1 ? "s" : ""}
          </span>
          <span className="text-xs bg-surface px-2 py-1 border-2 border-text shadow-[2px_2px_0px_#111]">{showTimeline ? "▲ HIDE" : "▼ SHOW"}</span>
        </button>
      </div>

      {/* Violation Timeline */}
      <AnimatePresence>
        {showTimeline && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t-4 border-text overflow-hidden bg-surface"
          >
            <div className="max-h-[200px] overflow-y-auto p-4 space-y-3">
              {violations.length === 0 ? (
                <p className="text-xs font-bold uppercase text-text/60 text-center py-4 bg-background border-2 border-text border-dashed">No violations recorded</p>
              ) : (
                violations.map((v, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 bg-background border-2 border-text shadow-[2px_2px_0px_#111] text-xs"
                  >
                    <div className="text-danger mt-1 bg-surface p-1 border-2 border-text">{violationIcons[v.type]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-text font-bold truncate">{v.details}</p>
                      <div className="flex items-center gap-2 mt-2 font-black text-text/70 uppercase">
                        <Clock size={10} />
                        <span>{v.timeStr}</span>
                        <span className="text-danger bg-surface px-1 border border-text">-{v.weight}pts</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Download Recording */}
      {recordedUrl && (
        <div className="px-4 py-4 border-t-4 border-text bg-background">
          <a
            href={recordedUrl}
            download="interview_recording.webm"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-warning text-text border-4 border-text text-sm font-black font-geist uppercase shadow-[4px_4px_0px_#111] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#111] transition-all"
          >
            <Video size={16} /> DOWNLOAD RECORDING
          </a>
        </div>
      )}
    </div>
  );
}
