import { useState, useEffect } from 'react';

import Timer from '../components/Timer';
import { startTimer, stopTimer, getJiraBoard, getCurrentSprint, getSprintTickets, getJiraColumns } from '../utils/api';

const Project = ({ projectData, setSelectedProject, runningTask, setRunningTask, setCurrentView, setPreviouseView }) => {
	const linkedProjects = JSON.parse(localStorage.getItem('linkedProjects')) || {};
	const jiraConfig = JSON.parse(localStorage.getItem('jiraConfig')) || {};
	const [jiraProject, setJiraProject] = useState(null);
	const [sprintTickets, setSprintTickets] = useState([]);
	const [jiraColumns, setJiraColumns] = useState([]);
	const [loadingTickets, setLoadingTickets] = useState(false);

	const getTickets = async () => {
		setLoadingTickets(true);

		const board = await getJiraBoard(linkedProjects[projectData.project.id]);
		setJiraProject({ ...jiraProject, board: board.id });

		const sprint = await getCurrentSprint(board.id);
		setJiraProject({ ...jiraProject, sprint: sprint.id });

		const tickets = await getSprintTickets(sprint.id);
		setSprintTickets(tickets);
		setLoadingTickets(false);

		const columns = await getJiraColumns(board.id);
		setJiraColumns(columns);
	}

	useEffect(() => {
		if (linkedProjects[projectData.project.id]) {
			getTickets();
		}
	}, []);

	const onTaskClick = async (task, note = '') => {
		if (runningTask && runningTask.task_id === task.task.id && runningTask.project_id === projectData.project.id) {
			await stopTimer(runningTask.time_entry_id);
			setRunningTask(null);
			return;
		} else if (runningTask) {
			await stopTimer(runningTask.time_entry_id);
		}

		const response = await startTimer(
			{
				project_id: projectData.project.id,
				task_id: task.task.id
			},
			note
		);

		setRunningTask({
			project_id: projectData.project.id,
			task_id: task.task.id,
			time_entry_id: response.id,
			timer_started_at: response.timer_started_at,
			notes: note
		 });
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
							{runningTask && runningTask.task_id === task.task.id && runningTask.project_id === projectData.project.id && runningTask.notes && <span className='notes'>{runningTask.notes}</span>}
							{runningTask && runningTask.task_id === task.task.id && runningTask.project_id === projectData.project.id && <Timer start={runningTask.timer_started_at} />}
						</li>
					))}
				</ul>
				{linkedProjects[projectData.project.id] && (
					<div className='linked-projects'>
						<h2>JIRA Tickets</h2>
						<h3>Current Sprint</h3>
						{loadingTickets && <p>Loading...</p>}
						<ul
							className='jira-current-sprint'
							style={{ gridTemplateColumns: `repeat(${jiraColumns.length}, 19.5%)` }}
						>
							{jiraColumns.map((column) => (
								<li key={column.id}>
									<h4>{column.name}</h4>
									<ul className='jira-current-sprint-column'>
										{sprintTickets.filter((ticket) => column.statuses.some((status) => status.id === ticket.fields.status.id)).map((ticket) => (
											<li
												key={ticket.id}
												className={`task ${runningTask && runningTask.notes === `${ticket.key}: ${ticket.fields.summary}` ? 'running' : ''}`}
												onClick={() => onTaskClick(
													{
														task: {
															id: jiraConfig[projectData.project.id]?.[column.name] || projectData.task_assignments[0].task.id
														}
													},
													`${ticket.key}: ${ticket.fields.summary}`,
												)}
											>
												<span className='jira-ticket-key'>
													{ticket.key}
												</span>
												{ticket.fields.summary}
												{runningTask && runningTask.notes === `${ticket.key}: ${ticket.fields.summary}` && <Timer start={runningTask.timer_started_at} />}
												<div className='jira-ticket-footer'>
													<span className='jira-ticket-assignee'>
														<img src={ticket.fields.assignee?.avatarUrls['48x48']} alt={ticket.fields.assignee?.displayName} />
														{ticket.fields.assignee?.displayName || 'Unassigned'}
													</span>
													<span className={`jira-ticket-priority jira-priority-${ticket.fields.priority.id}`}>
														{ticket.fields.priority.id === '1' && '«'}
														{ticket.fields.priority.id === '2' && '‹'}
														{ticket.fields.priority.id === '3' && '᱿'}
														{ticket.fields.priority.id === '4' && '›'}
														{ticket.fields.priority.id === '5' && '»'}
													</span>
												</div>
											</li>
										))}
									</ul>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	)
}

export default Project;
