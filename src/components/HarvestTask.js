import { useState } from 'react';

import Timer from './Timer';
import Modal from './Modal';

/**
 * HarvestTask component
 *
 * @param {object}   props             - The props
 * @param {object}   props.task        - The task
 * @param {object}   props.runningTask - The running task
 * @param {Function} props.onTaskClick - The function to call when a task
 * @param {object}   props.projectData - The project data
 *
 * @returns {JSX.Element} - The Harvest Task view element
 */
const HarvestTask = ({ task, runningTask, onTaskClick, projectData }) => {
	const [noteModalOpen, setNoteModalOpen] = useState(false);

	/**
	 *
	 */
	const onTimerStart = () => {
		const note = document.getElementById(
			`note-${task.task.id}-${projectData.project.id}`
		).value;

		onTaskClick(task, note);
		setNoteModalOpen(false);
	};

	return (
		<>
			<Modal
				isOpen={noteModalOpen}
				onClose={() => setNoteModalOpen(false)}
				title="Add Note"
				className="note-modal"
			>
				<div className="note-input">
					<textarea
						id={`note-${task.task.id}-${projectData.project.id}`}
						name={`note-${task.task.id}-${projectData.project.id}`}
						rows="4"
						// cols="50"
						placeholder="Enter a note..."
					/>
				</div>
				<button className="start-timer-btn" onClick={onTimerStart}>
					⏱ Start Timer
				</button>
			</Modal>
			<li
				key={task.task.id}
				id={task.task.id}
				className={`task ${runningTask && runningTask.task_id === task.task.id && runningTask.project_id === projectData.project.id ? 'running' : ''}`}
				onClick={() => onTaskClick(task)}
			>
				<button
					className="add-note-btn"
					onClick={(e) => e.stopPropagation() || setNoteModalOpen(true)}
					title="Add Note"
				>
					🗒
				</button>
				{task.task.name}
				{runningTask &&
					runningTask.task_id === task.task.id &&
					runningTask.project_id === projectData.project.id &&
					runningTask.notes && (
						<span className="notes">{runningTask.notes}</span>
					)}
				{runningTask &&
					runningTask.task_id === task.task.id &&
					runningTask.project_id === projectData.project.id && (
						<Timer start={runningTask.timer_started_at} />
					)}
			</li>
		</>
	);
};

export default HarvestTask;
