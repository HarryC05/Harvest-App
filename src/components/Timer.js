import { useState, useEffect } from 'react';

const Timer = ({ start }) => {
	const [elapsedTime, setElapsedTime] = useState(0);

	useEffect(() => {
		const startTime = new Date(start);
		const interval = setInterval(() => {
			const now = new Date();
			const elapsed = Math.floor((now - startTime) / 1000);
			setElapsedTime(elapsed);
		}, 1000);

		return () => clearInterval(interval);
	}, [start]);

	const formatTime = (seconds) => {
		const hours = Math.floor(seconds / 3600);
		const mins = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		return `⏱ ${hours > 0 ? `${hours}:` : ''}${mins < 10 && hours > 0 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
	};

	return (
		<div className='timer'>
			{formatTime(elapsedTime)}
		</div>
	);
};

export default Timer;
