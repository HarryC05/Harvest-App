import { useState, useEffect } from 'react';

/**
 * Timer component
 *
 * @param {object} props       - The props object
 * @param {string} props.start - The start time
 *
 * @returns {JSX.Element} - The Timer component
 */
const Timer = ({ start }) => {
	const [elapsedTime, setElapsedTime] = useState(0);

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
		const startTime = new Date(start);
		const interval = setInterval(() => {
			const now = new Date();
			const elapsed = Math.floor((now - startTime) / 1000);
			setElapsedTime(elapsed);
		}, 1000);

		return () => clearInterval(interval);
	}, [start]);

	return <div className="timer">{formatTime(elapsedTime)}</div>;
};

export default Timer;
