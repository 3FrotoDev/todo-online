"use client";

import { useState, useEffect } from 'react';

interface ProgressCircleProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export default function ProgressCircle({ 
  percentage, 
  size = 60, 
  strokeWidth = 4, 
  className = "" 
}: ProgressCircleProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

  const getProgressColor = (percent: number): string => {
    if (percent < 25) return "#EF4444";
    if (percent < 50) return "#F97316"; 
    if (percent < 75) return "#EAB308"; 
    if (percent < 100) return "#22C55E";
    return "#16A34A"; 
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [percentage]);

  const progressColor = getProgressColor(animatedPercentage);

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="dark:stroke-gray-700"
        />
        
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
}
