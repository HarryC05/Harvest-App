import { useState, useEffect } from 'react';

import Timer from '../components/Timer';
import { startTimer, stopTimer, getJiraBoards } from '../utils/api';
import JiraBoard from '../components/JiraBoard';

/**
 * The Harvest Project view element
 *
 * @param {object}   props                      - The props object
 * @param {object}   props.projectData          - The object containing the data for the project
 * @param {function} props.setSelectedProject   - The function to set the selected project
 * @param {object}   props.runningTask          - The object containing the info for the running task that is currently running
 * @param {function} props.setRunningTask       - The function to set the currently running task
 * @param {function} props.setCurrentView       - The function to set the current view
 * @param {function} props.setPreviousView      - The function to set the previous view (used for the back button)
 * @param {array}    props.notificationsList    - The list of notifications
 * @param {function} props.setNotificationsList - The function to set the notifications list
 *
 * @returns {JSX.Element}
 */
const HarvestProject = ({ projectData, setSelectedProject, runningTask, setRunningTask, setCurrentView, setPreviousView, notificationsList, setNotificationsList }) => {
	const linkedProjects = JSON.parse(localStorage.getItem('linkedProjects')) || {};
	const jiraConfig = JSON.parse(localStorage.getItem('jiraConfig')) || {};
	const jiraProjects = linkedProjects[projectData.project.id] || [];

	const [ boards, setBoards ] = useState([]);
	const [ selectedBoard, setSelectedBoard ] = useState(null);

	/**
	 * Fetch all boards for the harvest project
	 *
	 * @returns {void}
	 */
	const fetchAllBoards = async () => {
		const tempBoardData = {};

		for (const project of jiraProjects) {
			const boardsResp = await getJiraBoards(project.id, project.info);

			// check if the response has an error
			if ( ! boardsResp.ok ) {
				// show error message
				setNotificationsList([
					...notificationsList,
					{
						type: 'error',
						message: `Error getting Jira boards for ${project.name}`,
						id: 'error-getting-jira-boards',
						disappearTime: 3000
					}
				]);
				return;
			}

			const boardsJSON = await boardsResp.json();

			const boardData = boardsJSON.values;

			boardData.forEach( board => {
				tempBoardData[`${board.name}-${board.id}`] = {
					...board,
					info: project.info,
				};
			} );
		}

		setBoards(tempBoardData);
		setSelectedBoard(Object.keys(tempBoardData)[0]);
	};

	/**
	 * Start or stop a timer for a task
	 *
	 * @param {object}        task - The task object
	 * @param {string | null} note - The note to be added to the task
	 *
	 * @returns {void}
	 */
	const onTaskClick = async (task, note = null) => {
		if (runningTask && parseInt(runningTask.task_id) === parseInt(task.task.id) && runningTask.project_id === projectData.project.id && (note !== null && runningTask.notes === note)) {
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
	};

	useEffect(() => {
		fetchAllBoards();
	}, []);

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
						setPreviousView('project');
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
			</div>
			{Object.keys(boards).length > 0 && (
				<div className='jira-boards'>
					<h2>Jira Boards</h2>
					{/* Tabs to select each board */}
					<div className="tabs">
						{Object.keys(boards).map( board => {
							return (
								<button
									key={board}
									onClick={() => {
										setSelectedBoard(board);
									}}
									className={`tab ${selectedBoard === board ? 'selected' : ''}`}
								>
									{boards[board].name}
								</button>
							);
						})}
					</div>
					{/* Board View */}
					<div className="board-view">
						<JiraBoard board={boards[selectedBoard]}/>
					</div>
				</div>
			)}
		</div>
	)
}

export default HarvestProject;
