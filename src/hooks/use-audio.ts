"use client";

type useAudioReturn = {
	start: () => void;
	stop: () => void;
	isPlaying: boolean;
	pause: () => void;
	setCurrentTime: (time: number) => void;
};

const useAudio = (audioFile?: string): useAudioReturn => {
	if (typeof window === "undefined") {
		return {
			start: () => {},
			stop: () => {},
			isPlaying: false,
			pause: () => {},
			setCurrentTime: () => {},
		};
	}
	const audio = new Audio(audioFile || "/space-30s.mp3");
	const start = () => {
		audio.play();
	};
	const pause = () => {
		audio.pause();
	};
	const stop = () => {
		audio.pause();
		audio.currentTime = 0;
	};
	const setCurrentTime = (time: number) => {
		audio.currentTime = time;
	};

	return { start, stop, isPlaying: !audio.paused, pause, setCurrentTime };
};

export default useAudio;
