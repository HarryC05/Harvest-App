import { useState, useEffect } from 'react';

import { startTimer, stopTimer, getJiraBoards } from '../utils/api';
import JiraBoard from '../components/JiraBoard';
import HarvestTask from '../components/HarvestTask';

/**
 * The Harvest Project view element
 *
 * @param {object}   props                      - The props object
 * @param {object}   props.projectData          - The object containing the data for the project
 * @param {Function} props.setSelectedProject   - The function to set the selected project
 * @param {object}   props.runningTask          - The object containing the info for the running task that is currently running
 * @param {Function} props.setRunningTask       - The function to set the currently running task
 * @param {Function} props.setCurrentView       - The function to set the current view
 * @param {Function} props.setPreviousView      - The function to set the previous view (used for the back button)
 * @param {Array}    props.notificationsList    - The list of notifications
 * @param {Function} props.setNotificationsList - The function to set the notifications list
 *
 * @returns {JSX.Element} - The Harvest Project view element
 */
const HarvestProject = ({
	projectData,
	setSelectedProject,
	runningTask,
	setRunningTask,
	setCurrentView,
	setPreviousView,
	notificationsList,
	setNotificationsList,
}) => {
	const linkedProjects =
		JSON.parse(localStorage.getItem('linkedProjects')) || {};
	const jiraProjects = linkedProjects[projectData.project.id] || [];

	const [boards, setBoards] = useState([]);
	const [selectedBoard, setSelectedBoard] = useState(null);

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
			if (!boardsResp.ok) {
				// show error message
				setNotificationsList([
					...notificationsList,
					{
						type: 'error',
						message: `Error getting Jira boards for ${project.name}`,
						id: 'error-getting-jira-boards',
						disappearTime: 3000,
					},
				]);
				return;
			}

			const boardsJSON = await boardsResp.json();

			const boardData = boardsJSON.values;

			boardData.forEach((board) => {
				tempBoardData[`${board.name}-${board.id}`] = {
					...board,
					info: project.info,
				};
			});
		}

		setBoards(tempBoardData);
		setSelectedBoard(Object.keys(tempBoardData)[0]);
	};

	/**
	 * Start or stop a timer for a task
	 *
	 * @param {object}        task     - The task object
	 * @param {string | null} note     - The note to be added to the task
	 * @param {boolean}       jiraTask - Whether the task is a Jira task or not
	 *
	 * @returns {void}
	 */
	const onTaskClick = async (task, note = null, jiraTask = false) => {
		// If the same task is already running and is not a Jira task, stop the timer
		if (
			runningTask &&
			parseInt(runningTask.task_id) === parseInt(task.task.id) &&
			runningTask.project_id === projectData.project.id &&
			note === null &&
			!jiraTask
		) {
			await stopTimer(runningTask.time_entry_id);
			setRunningTask(null);
			return;
		} else if (
			runningTask &&
			parseInt(runningTask.task_id) === parseInt(task.task.id) &&
			runningTask.project_id === projectData.project.id &&
			note === runningTask.notes &&
			jiraTask
		) {
			console.log('stopping timer');
			await stopTimer(runningTask.time_entry_id);
			setRunningTask(null);
			return;
		} else if (runningTask) {
			await stopTimer(runningTask.time_entry_id);
		}

		const response = await startTimer(
			{
				project_id: projectData.project.id,
				task_id: task.task.id,
			},
			note
		);

		setRunningTask({
			project_id: projectData.project.id,
			task_id: task.task.id,
			time_entry_id: response.id,
			timer_started_at: response.timer_started_at,
			notes: note,
		});
	};

	useEffect(() => {
		fetchAllBoards();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div>
			<div className="heading">
				<button
					className="back-btn"
					onClick={() => {
						setSelectedProject(null);
						setCurrentView('projectList');
					}}
				>
					➜
				</button>
				<h1 id={projectData.project.id}>{projectData.project.name}</h1>
				<button
					className="settings-btn"
					onClick={() => {
						setCurrentView('settings');
						setPreviousView('project');
					}}
				>
					⚙
				</button>
			</div>
			<div className="main">
				<ul className="task-wrapper">
					{projectData.task_assignments.map((task) => (
						<HarvestTask
							key={task.task.id}
							task={task}
							runningTask={runningTask}
							onTaskClick={onTaskClick}
							projectData={projectData}
						/>
					))}
				</ul>
			</div>
			{Object.keys(boards).length > 0 && (
				<div className="jira-boards">
					<h2>Jira Boards</h2>
					{/* Tabs to select each board */}
					<div className="tabs">
						{Object.keys(boards).map((board) => {
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
					<JiraBoard
						board={boards[selectedBoard]}
						notificationsList={notificationsList}
						setNotificationsList={setNotificationsList}
						startTimer={onTaskClick}
					/>
				</div>
			)}
		</div>
	);
};

export default HarvestProject;
