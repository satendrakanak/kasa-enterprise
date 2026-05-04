"use client";

import { Award } from "lucide-react";
interface ProgressCircleProps {
  percent: number;
  size?: number;
}

export const ProgressCircle = ({ percent, size = 36 }: ProgressCircleProps) => {
  const radius = 16;
  const stroke = 3;
  const normalized = radius - stroke;
  const circumference = normalized * 2 * Math.PI;

  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size}>
        <circle
          stroke="rgba(255,255,255,0.1)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalized}
          cx={size / 2}
          cy={size / 2}
        />

        <circle
          stroke="#22c55e"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          r={normalized}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>

      {/* 🔥 CENTER ICON */}
      <Award className="absolute w-4 h-4 text-green-400" />
    </div>
  );
};
