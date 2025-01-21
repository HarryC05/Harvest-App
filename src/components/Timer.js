import { useState, useEffect } from 'react';

/**
 * Timer component
 *
 * @param {object} props      - The props object
 * @param {object} props.task - The task object
 *
 * @returns {JSX.Element} - The Timer component
 */
const Timer = ({ task }) => {
	const [elapsedTime, setElapsedTime] = useState(0);

	const { timer_started_at, hours_without_timer = 0 } = task;

	/**
	 * Format the time
	 *
	 * @param {number} seconds - The number of seconds
	 *
	 * @returns {string} - The formatted time
	 */
	const formatTime = (seconds) => {
		const hours = Math.floor(seconds / 3600);
		const mins = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		return `⏱ ${hours > 0 ? `${hours}:` : ''}${mins < 10 && hours > 0 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
	};

	useEffect(() => {
		const startTime = new Date(timer_started_at);
		const interval = setInterval(() => {
			const now = new Date();
			const elapsed = Math.floor((now - startTime) / 1000);
			const seconds_without_timer = Math.floor(hours_without_timer * 3600);

			const total = seconds_without_timer + elapsed;

			setElapsedTime(total);
		}, 1000);

		return () => clearInterval(interval);
	}, [timer_started_at, hours_without_timer]);

	return <div className="timer">{formatTime(elapsedTime)}</div>;
};

export default Timer;
