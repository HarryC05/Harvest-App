import Timer from '../components/Timer';
import { startTimer, stopTimer } from '../utils/api';

const Project = ({ projectData, setSelectedProject, runningTask, setRunningTask, setCurrentView, setPreviouseView }) => {
	const linkedProjects = JSON.parse(localStorage.getItem('linkedProjects')) || {};

	const onTaskClick = async (task) => {
		if (runningTask && runningTask.task_id === task.task.id && runningTask.project_id === projectData.project.id) {
			await stopTimer(runningTask.time_entry_id);
			setRunningTask(null);
			return;
		} else if (runningTask) {
			await stopTimer(runningTask.time_entry_id);
		}

		const response = await startTimer({
			project_id: projectData.project.id,
			task_id: task.task.id
		});

		setRunningTask({ project_id: projectData.project.id, task_id: task.task.id, time_entry_id: response.id, timer_started_at: response.timer_started_at });
	}

	let notes = runningTask && runningTask.notes ? runningTask.notes : '';

	// check to see if the notes match this regex: /NYP-[0-9]*/
	if (notes.match(/NYP-[0-9]*/)) {
		notes = notes.replace(/NYP-[0-9]*/, 'NYP-XXXX');
	}

	return (
		<div>
			<div className="heading">
				<button
					className='back-btn'
					onClick={() => {
						setSelectedProject(null);
						setCurrentView('projectList');
					}}
				>
					➜
				</button>
				<h1 id={projectData.project.id}>{projectData.project.name}</h1>
				<button
					className='settings-btn'
					onClick={() => {
						setCurrentView('settings');
						setPreviouseView('project');
					}}
				>
					⚙
				</button>
			</div>
			<div className='main'>
				<ul className='task-wrapper'>
					{projectData.task_assignments.map((task) => (
						<li
							key={task.task.id}
							id={task.task.id}
							className={`task ${runningTask && runningTask.task_id === task.task.id && runningTask.project_id === projectData.project.id ? 'running' : ''}`}
							onClick={() => onTaskClick(task)}
						>
							{task.task.name}
							{runningTask && runningTask.task_id === task.task.id && runningTask.project_id === projectData.project.id && runningTask.notes && <span className='notes'>{notes}</span>}
							{runningTask && runningTask.task_id === task.task.id && runningTask.project_id === projectData.project.id && <Timer start={runningTask.timer_started_at} />}
						</li>
					))}
				</ul>
				{linkedProjects[projectData.project.id] && (
					<p>{`JIRA Project ${linkedProjects[projectData.project.id]} is linked`}</p>
				)}
			</div>
		</div>
	)
}

export default Project;
