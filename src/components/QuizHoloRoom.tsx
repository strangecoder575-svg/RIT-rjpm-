import React from 'react';
import { Department } from '../data/departments';
export const QuizHoloRoom: React.FC<{ department: Department; question?: string; score: number; total: number }> = ({ department, question, score, total }) => (
  <div className="holo-room" style={{'--accent': department.accent} as React.CSSProperties}>
    <div className="holo-ceiling" /><div className="holo-floor" />
    <div className="holo-podium"><div className="holo-core" /><span>QUIZ</span><b>ARENA</b></div>
    <div className="holo-panel left-panel"><small>DEPARTMENT</small><strong>{department.code}</strong><span>{department.name}</span></div>
    <div className="holo-panel right-panel"><small>SCORE</small><strong>{score}<em> / {total}</em></strong><span>LIVE ACCURACY MATRIX</span></div>
    <div className="holo-question"><small>HOLOGRAPHIC QUESTION</small><strong>{question || 'SELECT AN ANSWER TO SYNC THE ARENA'}</strong></div>
    <div className="holo-beam" />
  </div>
);
