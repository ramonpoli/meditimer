"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

const Index = () => {
  const [time, setTime] = useState(300); // 5 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(300);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && time > 0) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, time]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(initialTime);
  };

  const handleTimeChange = (newTime: number) => {
    if (!isRunning) {
      setTime(newTime);
      setInitialTime(newTime);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-white">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gray-200/20 rounded-full animate-pulse blur-xl"></div>
        <div
          className="absolute top-3/4 right-1/4 w-48 h-48 bg-gray-300/20 rounded-full animate-pulse blur-xl"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-slate-200/20 rounded-full animate-pulse blur-xl"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/3 w-24 h-24 bg-zinc-300/20 rounded-full animate-pulse blur-xl"
          style={{ animationDelay: "0.5s" }}
        ></div>

        {/* Floating particles */}
        <div className="floating-particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gray-400/10 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${4 + Math.random() * 4}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 text-center">
        {/* Timer Display */}
        <div className="mb-12">
          <div
            className={`text-8xl md:text-9xl font-bold text-gray-900 transition-all duration-1000 select-none ${
              isRunning ? "animate-breathing" : "scale-100"
            }`}
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            {formatTime(time)}
          </div>
          <div className="text-gray-600 text-lg mt-2 font-light">
            {isRunning
              ? "Running..."
              : time === 0
              ? "Time's up!"
              : "Ready to start"}
          </div>
        </div>

        {/* Time Preset Buttons */}
        <div className="flex gap-2 mb-8 flex-wrap justify-center">
          {[
            { label: "1m", value: 60 },
            { label: "5m", value: 300 },
            { label: "10m", value: 600 },
            { label: "15m", value: 900 },
            { label: "25m", value: 1500 },
          ].map((preset) => (
            <Button
              key={preset.value}
              variant="outline"
              size="sm"
              onClick={() => handleTimeChange(preset.value)}
              disabled={isRunning}
              className="bg-white/50 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all duration-300 backdrop-blur-sm"
            >
              {preset.label}
            </Button>
          ))}
        </div>

        {/* Control Buttons */}
        <div className="flex gap-6 items-center">
          <Button
            onClick={handleReset}
            size="lg"
            variant="outline"
            className="w-16 h-16 rounded-full bg-white/50 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
          >
            <RotateCcw className="w-6 h-6" />
          </Button>

          <Button
            onClick={handlePlayPause}
            size="lg"
            className="w-20 h-20 rounded-full bg-gray-900 hover:bg-gray-800 text-white border-2 border-gray-300 hover:border-gray-400 transition-all duration-300 hover:scale-110 backdrop-blur-sm"
          >
            {isRunning ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </Button>
        </div>

        {/* Progress Ring */}
        <div className="mt-12">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="rgba(0,0,0,0.1)"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="rgba(0,0,0,0.6)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${
                2 * Math.PI * 50 * (1 - (initialTime - time) / initialTime)
              }`}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Index;
