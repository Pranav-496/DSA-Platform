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
  const [violations, setViolations] = useState(() => JSON.parse(sessionStorage.getItem('interview_proctorViolations')) || []);
  const [integrityScore, setIntegrityScore] = useState(() => {
    const saved = sessionStorage.getItem('interview_proctorIntegrity');
    return saved !== null ? Number(saved) : 100;
  });

  useEffect(() => {
    sessionStorage.setItem('interview_proctorViolations', JSON.stringify(violations));
    sessionStorage.setItem('interview_proctorIntegrity', integrityScore);
  }, [violations, integrityScore]);
  const [currentStatus, setCurrentStatus] = useState("Initializing...");
  const [statusColor, setStatusColor] = useState("text-text-muted");
  const [faceCount, setFaceCount] = useState(0);
  const [showTimeline, setShowTimeline] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState(null);

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

  useEffect(() => {
    if (isActive && modelsLoaded && !cameraOn) {
      startCamera();
    }
  }, [isActive, modelsLoaded, cameraOn]);

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
    setStatusColor("text-text-muted");
  };

  const startDetection = () => {
    if (!modelsLoaded) return;
    detectIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) return;

      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.4 }))
        .withFaceLandmarks(true);

      setFaceCount(detections.length);

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
    }, 3000);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

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
    <div className="bg-surface border border-border rounded-xl flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-border flex items-center justify-between flex-shrink-0">
        <h3 className="text-xs font-semibold uppercase flex items-center gap-2 tracking-wider text-text-muted">
          <Shield size={14} className="text-primary" /> Proctoring
        </h3>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${cameraOn ? "bg-danger animate-pulse" : "bg-border"}`} />
          <span className="text-[10px] font-medium text-text-muted uppercase">{cameraOn ? "REC" : "OFF"}</span>
        </div>
      </div>

      {/* Video Feed */}
      <div className="relative bg-background aspect-video w-full overflow-hidden flex-shrink-0">
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
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface-alt">
            <VideoOff size={28} className="text-text-muted opacity-40" />
            <button
              onClick={startCamera}
              className="px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold hover:brightness-110 transition-all shadow-soft"
            >
              Start Proctoring
            </button>
          </div>
        )}
        {cameraOn && (
          <button
            onClick={stopCamera}
            className="absolute top-2 right-2 p-1.5 bg-surface border border-border rounded-lg shadow-soft hover:bg-surface-alt transition-colors"
          >
            <VideoOff size={14} className="text-danger" />
          </button>
        )}
      </div>

      {/* Status */}
      <div className="px-3 py-2 border-b border-border flex items-center justify-between flex-shrink-0">
        <span className={`text-[11px] font-medium ${statusColor}`}>{currentStatus}</span>
        {cameraOn && (
          <span className="text-[10px] text-text-muted font-medium">Faces: {faceCount}</span>
        )}
      </div>

      {/* Integrity Score */}
      <div className="px-3 py-2 flex items-center justify-between flex-shrink-0">
        <span className="text-[11px] text-text-muted font-medium uppercase tracking-wider">Integrity</span>
        <div className={`px-2 py-0.5 rounded text-xs font-semibold text-white ${getScoreBg(integrityScore)}`}>
          {integrityScore}/100
        </div>
      </div>

      {/* Integrity Bar */}
      <div className="px-3 pb-2 flex-shrink-0">
        <div className="w-full bg-surface-alt rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${integrityScore >= 80 ? "bg-success" : integrityScore >= 50 ? "bg-warning" : "bg-danger"}`}
            style={{ width: `${integrityScore}%` }}
          />
        </div>
      </div>

      {/* Violations */}
      <div className="px-3 py-2 border-t border-border flex-shrink-0">
        <button
          onClick={() => setShowTimeline(!showTimeline)}
          className="w-full flex items-center justify-between text-xs font-medium text-text-muted transition-all hover:text-text"
        >
          <span className="flex items-center gap-1.5">
            <AlertTriangle size={13} className={violations.length > 0 ? "text-danger" : "text-text-muted opacity-50"} />
            {violations.length} Violation{violations.length !== 1 ? "s" : ""}
          </span>
          <span className="text-[10px] bg-surface-alt px-2 py-0.5 rounded border border-border">{showTimeline ? "▲ Hide" : "▼ Show"}</span>
        </button>
      </div>

      {/* Violation Timeline */}
      <AnimatePresence>
        {showTimeline && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border overflow-hidden bg-surface"
          >
            <div className="max-h-[150px] overflow-y-auto p-3 space-y-2">
              {violations.length === 0 ? (
                <p className="text-[11px] text-text-muted text-center py-3">No violations recorded</p>
              ) : (
                violations.map((v, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-2 bg-surface-alt border border-border rounded-lg text-xs"
                  >
                    <div className="text-danger mt-0.5">{violationIcons[v.type]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-text font-medium truncate text-[11px]">{v.details}</p>
                      <div className="flex items-center gap-2 mt-1 text-text-muted text-[10px]">
                        <Clock size={9} />
                        <span>{v.timeStr}</span>
                        <span className="text-danger font-medium">-{v.weight}pts</span>
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
        <div className="px-3 py-2 border-t border-border">
          <a
            href={recordedUrl}
            download="interview_recording.webm"
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-xs font-semibold hover:brightness-110 transition-all"
          >
            <Video size={14} /> Download Recording
          </a>
        </div>
      )}
    </div>
  );
}
