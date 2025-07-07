"use client";
import { useEffect, useRef, useState } from "react";
import "./indexStyle.css";
import { Button } from "@/components/ui/button";
import { CircleStop, Pause, Play, Square, StopCircle } from "lucide-react";
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
import RoundButton from "@/components/RoundButton";
import { CSSTransition } from "react-transition-group";

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
  const [hasStarted, setHasStarted] = useState(false);
  const [displayCustomTime, setDisplayCustomTime] = useState(false);
  const buttonNodeRef = useRef<HTMLDivElement>(null);
  const stopButtonNodeRef = useRef<HTMLDivElement>(null);

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
    if (!hasStarted) {
      setHasStarted(true);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(initialTime);
    setHasStarted(false);
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
    <main className="flex flex-col gap-8 items-center justify-center w-full flex-1">
      <div
        className={`text-[25vw] md:text-9xl font-bold transition-all duration-6000 select-none ${
          isRunning ? "animate-breathing" : "scale-100"
        }`}
      >
        {formatTime(time)}
      </div>
      <div className="flex flex-col gap-8 mb-8 flex-wrap justify-center items-center w-full">
        <div className="min-h-32 md:min-h-12">
          <CSSTransition
            in={!hasStarted}
            nodeRef={buttonNodeRef}
            timeout={1000}
            classNames="alert"
            unmountOnExit
          >
            <div
              className="flex gap-2 flex-wrap justify-center"
              ref={buttonNodeRef}
            >
              {TIME_PRESETS.map((preset) => (
                <Button
                  key={preset.value}
                  size="sm"
                  onClick={() => handleTimeChange(preset.value)}
                  disabled={isRunning}
                  className="w-12 h-12 px-8 cursor-pointer"
                >
                  {preset.label}
                </Button>
              ))}

              <Popover
                open={displayCustomTime}
                onOpenChange={setDisplayCustomTime}
              >
                <PopoverTrigger asChild>
                  <Button
                    size="sm"
                    disabled={isRunning}
                    className="w-12 h-12 px-10 cursor-pointer"
                  >
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
            </div>
          </CSSTransition>
        </div>

        <div className="flex gap-2 items-center w-full max-w-screen-sm justify-center px-4">
          <div className="flex-1" />
          <div className="flex-1 flex justify-center">
            {!isRunning ? (
              <RoundButton onClick={handlePlayPause}>
                <Play size={64} />
              </RoundButton>
            ) : (
              <RoundButton onClick={handlePlayPause}>
                <Pause size={64} />
              </RoundButton>
            )}
          </div>
          <div className="flex-1">
            <CSSTransition
              in={hasStarted && !isRunning}
              nodeRef={stopButtonNodeRef}
              timeout={500}
              classNames="alert"
              unmountOnExit
            >
              <div className="flex gap-16 items-center" ref={stopButtonNodeRef}>
                <RoundButton onClick={handleReset}>
                  <Square size={"sm"} />
                </RoundButton>
              </div>
            </CSSTransition>
          </div>
        </div>
      </div>
    </main>
  );
}
