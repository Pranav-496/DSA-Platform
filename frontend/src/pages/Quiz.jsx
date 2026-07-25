import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import API_BASE from "../config/api";
import {
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Trophy,
  RotateCcw,
  Filter,
  RefreshCw,
} from "lucide-react";
import QUIZ_DATA from "../data/quizData";

export default function Quiz() {
  const { topic } = useParams();
  const { token } = useContext(AuthContext);
  const topicKey = topic || "arrays";
  const allQuestions = QUIZ_DATA[topicKey] || QUIZ_DATA.arrays;

  const [difficulty, setDifficulty] = useState("all");
  const [retryWrong, setRetryWrong] = useState(false);
  const [wrongOnly, setWrongOnly] = useState([]);

  const filtered =
    retryWrong && wrongOnly.length > 0
      ? wrongOnly
      : difficulty === "all"
        ? allQuestions
        : allQuestions.filter((q) => q.difficulty === difficulty);

  const questions = filtered.length > 0 ? filtered : allQuestions;

  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    setCurrentQ(0);
    setAnswers([]);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setTimeLeft(30);
    setRetryWrong(false);
    setWrongOnly([]);
  }, [topicKey, difficulty]);

  useEffect(() => {
    if (showResult || isAnswered) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleTimeout();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentQ, showResult, isAnswered]);

  const handleTimeout = () => {
    if (!isAnswered) {
      setAnswers((prev) => [
        ...prev,
        {
          question: currentQ,
          selected: null,
          correct: questions[currentQ].answer,
          isCorrect: false,
        },
      ]);
      setIsAnswered(true);
      setShowExplanation(true);
      setTimeout(() => {
        setShowExplanation(false);
        nextQuestion();
      }, 2500);
    }
  };

  const handleAnswer = (option) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);
    setShowExplanation(true);
    const isCorrect = option === questions[currentQ].answer;
    setAnswers((prev) => [
      ...prev,
      {
        question: currentQ,
        selected: option,
        correct: questions[currentQ].answer,
        isCorrect,
      },
    ]);
    setTimeout(() => {
      setShowExplanation(false);
      nextQuestion();
    }, 2500);
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= questions.length) setShowResult(true);
    else {
      setCurrentQ((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(30);
    }
  };

  const restart = () => {
    setCurrentQ(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowResult(false);
    setTimeLeft(30);
    setIsAnswered(false);
    setRetryWrong(false);
    setWrongOnly([]);
  };

  const retryWrongAnswers = () => {
    const wrong = answers
      .filter((a) => !a.isCorrect)
      .map((a) => questions[a.question]);
    if (wrong.length === 0) return;
    setWrongOnly(wrong);
    setRetryWrong(true);
    setCurrentQ(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setShowResult(false);
    setTimeLeft(30);
    setIsAnswered(false);
  };

  const score = answers.filter((a) => a.isCorrect).length;
  const percentage = Math.round((score / questions.length) * 100);

  useEffect(() => {
    if (showResult && token) {
      fetch(`${API_BASE}/api/progress/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: "quiz",
          data: { topic: topicKey, score: percentage },
        }),
      }).catch(() => {
        setSaveError('Could not save quiz progress. Check your connection.');
      });
    }
  }, [showResult]);

  if (showResult) {
    const wrongCount = answers.filter((a) => !a.isCorrect).length;
    return (
      <div className="max-w-2xl mx-auto text-text space-y-8 animate-fade-in p-6 brutal-card">
        {saveError && (
          <div className="p-3 bg-warning border-4 border-text text-text font-bold text-sm shadow-brutal-sm">
            ⚠ {saveError}
          </div>
        )}
        <div className="text-center space-y-4">
          <Trophy
            className={`mx-auto ${percentage >= 80 ? "text-warning" : percentage >= 50 ? "text-primary" : "text-text"}`}
            size={64}
          />
          <h2 className="text-4xl font-geist font-black uppercase tracking-wider text-text">
            Quiz Complete!
          </h2>
          <div className="text-6xl font-black font-geist">
            <span
              className={`px-4 py-2 border-4 border-text shadow-[4px_4px_0px_#111] inline-block
                ${percentage >= 80
                  ? "bg-success text-surface"
                  : percentage >= 50
                    ? "bg-warning text-text"
                    : "bg-danger text-surface"
              }`}
            >
              {percentage}%
            </span>
          </div>
          <p className="text-text font-bold uppercase tracking-wider mt-6">
            {score}/{questions.length} correct •{" "}
            {retryWrong
              ? "Retry Mode"
              : `${difficulty === "all" ? "All" : difficulty} difficulty`}
          </p>
        </div>

        <div className="bg-surface border-4 border-text p-6 space-y-3 max-h-[350px] overflow-y-auto shadow-inner">
          {answers.map((ans, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 p-4 rounded-none border-2 border-text shadow-[2px_2px_0px_#111] ${ans.isCorrect ? "bg-success text-surface" : "bg-danger text-surface"}`}
            >
              {ans.isCorrect ? (
                <CheckCircle
                  size={20}
                  className="text-surface flex-shrink-0 mt-0.5"
                />
              ) : (
                <XCircle
                  size={20}
                  className="text-surface flex-shrink-0 mt-0.5"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold">
                  {questions[idx]?.question}
                </p>
                {!ans.isCorrect && (
                  <p className="text-xs font-black uppercase tracking-wider mt-1 border-t-2 border-surface pt-1">
                    Correct: {ans.correct}
                  </p>
                )}
                {questions[idx]?.explanation && (
                  <p className="text-xs font-medium mt-2 bg-surface/20 p-2 border-l-4 border-surface">
                    {questions[idx].explanation}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4 flex-wrap mt-8">
          <button
            onClick={restart}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-text border-4 border-text font-black uppercase tracking-wider shadow-[4px_4px_0px_#111] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#111] transition-all"
          >
            <RotateCcw size={18} /> Restart
          </button>
          {wrongCount > 0 && (
            <button
              onClick={retryWrongAnswers}
              className="flex items-center gap-2 px-6 py-3 bg-warning text-text border-4 border-text font-black uppercase tracking-wider shadow-[4px_4px_0px_#111] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#111] transition-all"
            >
              <RefreshCw size={18} /> Retry Wrong ({wrongCount})
            </button>
          )}
          <Link
            to="/learn"
            className="flex items-center gap-2 px-6 py-3 bg-surface text-text border-4 border-text font-black uppercase tracking-wider shadow-[4px_4px_0px_#111] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#111] transition-all"
          >
            Back to Learn <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  const q = questions[currentQ];
  const diffBadge = {
    easy: "text-surface bg-success border-2 border-text",
    medium: "text-text bg-warning border-2 border-text",
    hard: "text-surface bg-danger border-2 border-text",
  };

  return (
    <div className="max-w-2xl mx-auto text-text space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3 brutal-card p-4">
        <h2 className="text-2xl font-geist font-black uppercase tracking-tight text-text">
          Quiz: {topicKey.charAt(0).toUpperCase() + topicKey.slice(1)}
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-text" />
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="bg-surface border-4 border-text text-text px-2 py-1 font-bold uppercase focus:border-primary outline-none shadow-[2px_2px_0px_#111] cursor-pointer"
            >
              <option value="all">All ({allQuestions.length})</option>
              <option value="easy">
                Easy (
                {allQuestions.filter((q) => q.difficulty === "easy").length})
              </option>
              <option value="medium">
                Medium (
                {allQuestions.filter((q) => q.difficulty === "medium").length})
              </option>
              <option value="hard">
                Hard (
                {allQuestions.filter((q) => q.difficulty === "hard").length})
              </option>
            </select>
          </div>
          <div
            className={`flex items-center gap-2 text-sm font-black uppercase px-3 py-1 border-4 border-text shadow-[2px_2px_0px_#111] ${timeLeft <= 10 ? "bg-danger text-surface animate-pulse" : "bg-surface text-text"}`}
          >
            <Clock size={16} /> {timeLeft}s
          </div>
          <span className="text-sm font-black text-surface bg-text px-3 py-1 shadow-[2px_2px_0px_#111]">
            {currentQ + 1}/{questions.length}
          </span>
        </div>
      </div>

      <div className="w-full bg-surface border-4 border-text h-4 shadow-[4px_4px_0px_#111]">
        <div
          className="bg-primary h-full border-r-4 border-text transition-all duration-500"
          style={{ width: `${(currentQ / questions.length) * 100}%` }}
        />
      </div>

      <div className="brutal-card p-8 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <span
            className={`text-xs px-2 py-0.5 font-black uppercase shadow-[2px_2px_0px_#111] ${diffBadge[q.difficulty] || ""}`}
          >
            {q.difficulty}
          </span>
          <span className="text-xs px-2 py-0.5 bg-surface text-text border-2 border-text font-black uppercase shadow-[2px_2px_0px_#111]">
            {q.type}
          </span>
        </div>
        <h3 className="text-2xl font-bold text-text leading-relaxed">
          {q.question}
        </h3>

        <div className="grid gap-4 mt-6">
          {q.options.map((option, idx) => {
            let btnClass =
              "bg-surface border-text text-text hover:bg-primary hover:-translate-y-1 shadow-[4px_4px_0px_#111]";
            if (isAnswered) {
              if (option === q.answer)
                btnClass =
                  "bg-success border-text text-surface shadow-inner";
              else if (option === selectedAnswer && option !== q.answer)
                btnClass = "bg-danger border-text text-surface shadow-inner";
              else btnClass = "bg-surface border-text text-text opacity-50 shadow-none";
            }
            return (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                disabled={isAnswered}
                className={`w-full text-left px-5 py-4 border-4 transition-all duration-200 font-bold text-lg ${btnClass} disabled:cursor-default flex items-center`}
              >
                <span className="text-sm font-black bg-text text-surface px-2 py-1 mr-4 shadow-[2px_2px_0px_#111]">
                  {String.fromCharCode(65 + idx)}
                </span>
                {option}
              </button>
            );
          })}
        </div>

        {showExplanation && q.explanation && (
          <div className="p-4 bg-primary border-4 border-text text-text font-bold mt-6 shadow-[4px_4px_0px_#111] animate-fade-in flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <p>{q.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
