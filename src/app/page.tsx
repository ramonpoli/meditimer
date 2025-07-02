"use client";
import { useEffect, useRef, useState } from "react";
import "./indexStyle.css";
import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const TIME_PRESETS = [
  { label: "5m", value: 300 },
  { label: "10m", value: 600 },
  { label: "20m", value: 1200 },
  { label: "30m", value: 1800 },
  { label: "60m", value: 3600 },
];
const formSchema = z.object({
  time: z.coerce.number().min(1).max(10080), // 1 week in minutes (7 days * 24 hours * 60 minutes)
});

export default function Home() {
  const [time, setTime] = useState(300); // 5 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(300);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasStarted = initialTime !== time;
  const [displayCustomTime, setDisplayCustomTime] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      time: 1200,
    },
  });

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
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;
    return `${
      hours > 0 ? `${hours.toString().padStart(2, "0")}:` : ""
    }${remainingMinutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`
      .replace(/^00:/, "")
      .replace(/^0:/, "");
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
  const handleCustomTimeChange = (data: z.infer<typeof formSchema>) => {
    console.log("data", data);
    handleTimeChange(data.time * 60);
    setDisplayCustomTime(false);
  };

  return (
    <main className="flex flex-col gap-16 items-center justify-center min-h-screen bg-black font-[family-name:var(--font-geist-sans)]">
      {/* TODO: animate the text using css content: https://stackoverflow.com/a/42236739/2091771 */}
      <div
        className={`text-8xl md:text-9xl font-bold text-[var(--color-background)] transition-all duration-1000 select-none ${
          isRunning ? "animate-breathing" : "scale-100"
        }`}
      >
        {formatTime(time)}
      </div>
      <div className="flex gap-2 mb-8 flex-wrap justify-center">
        {!hasStarted ? (
          <>
            {TIME_PRESETS.map((preset) => (
              <Button
                key={preset.value}
                size="sm"
                onClick={() => handleTimeChange(preset.value)}
                disabled={isRunning}
              >
                {preset.label}
              </Button>
            ))}

            <Popover
              open={displayCustomTime}
              onOpenChange={setDisplayCustomTime}
            >
              <PopoverTrigger asChild>
                <Button size="sm" disabled={isRunning}>
                  Custom
                </Button>
              </PopoverTrigger>
              <PopoverContent className="bg-black text-[var(--color-background)]">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleCustomTimeChange)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Enter time in mins: 45...</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Enter time in mins: 45..."
                              {...field}
                            />
                          </FormControl>{" "}
                          <FormDescription />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Set Time</Button>
                  </form>
                </Form>
              </PopoverContent>
            </Popover>
          </>
        ) : isRunning ? (
          <Pause className="w-8 h-8 text-[var(--color-background)]" />
        ) : (
          <Play className="w-8 h-8 ml-1 text-[var(--color-background)]" />
        )}
      </div>
    </main>
  );
}
