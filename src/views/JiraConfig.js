import { useState, useEffect } from "react";

import { getJiraBoards, getJiraColumns, getProject } from "../utils/api";

/**
 * The Jira Configuration view element
 *
 * @param {object}   props                       - The props object
 * @param {object}   props.projectToConfigure    - The object containing the data for the project to configure
 * @param {function} props.setProjectToConfigure - The function to set the project to configure
 * @param {function} props.setCurrentView        - The function to set the current view
 * @param {array}    props.notificationsList     - The list of notifications
 * @param {function} props.setNotificationsList  - The function to set the notifications list
 *
 * @returns {JSX.Element}
 */
const JiraConfig = ( { projectToConfigure, setProjectToConfigure, setCurrentView, notificationsList, setNotificationsList } ) => {
	const [projectData, setProjectData] = useState({});
	const [jiraBoards, setJiraBoards] = useState({});
	const [selectedBoard, setSelectedBoard] = useState(null);
	const [columns, setColumns] = useState({});
	const [harvestTasks, setHarvestTasks] = useState({});
	const jiraProjects = JSON.parse(localStorage.getItem('linkedProjects'))?.[projectToConfigure.harvest.id] || {};
	const jiraProfiles = JSON.parse(localStorage.getItem('jiraProfiles')) || [];

	/**
	 * Fetch the project data
	 *
	 * @returns {void}
	 */
	const fetchProjectData = async () => {
		const project = await getProject(projectToConfigure.harvest.id);
		setProjectData(project);
	}

	/**
	 * Fetch all Jira boards for the linked projects
	 *
	 * @returns {void}
	 */
	const fetchJiraBoards = async () => {
		const tempBoardData = {};
		for (const project of jiraProjects) {
			const profile = jiraProfiles.find(profile => profile.id === project.info.id);
			const boards = await getJiraBoards(project.id, profile);

			// check if the response has an error
			if ( ! boards.ok ) {
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

			const boardsJSON = await boards.json();

			const boardData = boardsJSON.values;

			boardData.forEach( board => {
				tempBoardData[`${board.name}-${board.id}`] = {
					...board,
					info: project.info,
				};
			} );
		}

		setJiraBoards(tempBoardData);
		setSelectedBoard(Object.keys(tempBoardData)[0]);
	};

	/**
	 * Fetch the columns for the currently selected board
	 *
	 * @returns {void}
	 */
	const fetchColumns = async () => {
		// if the columns are already fetched, return
		if (columns[selectedBoard]) {
			return;
		}

		// get the board
		const board = jiraBoards[selectedBoard];

		const profile = jiraProfiles.find(profile => profile.id === board.info.id);

		const response = await getJiraColumns(board.id, profile);

		// check if the response has an error
		if ( ! response.ok ) {
			// show error message
			setNotificationsList([
				...notificationsList,
				{
					type: 'error',
					message: `Error getting Jira columns for ${board.name}`,
					id: 'error-getting-jira-columns',
					disappearTime: 3000
				}
			]);
			return;
		}

		const data = await response.json();

		const respColumns = data.columnConfig.columns;

		const tempColumns = { ...columns };

		tempColumns[selectedBoard] = respColumns;

		setColumns(tempColumns);
	};

	/**
	 *
	 * @param {event}  e      - The event object
	 * @param {string} column - The column name
	 *
	 * @returns {void}
	 */
	const setTask = (e, column) => {
		const task = e.target.value;
		const tempTasks = { ...harvestTasks };
		if (!tempTasks[selectedBoard]) {
			tempTasks[selectedBoard] = {};
		}
		tempTasks[selectedBoard][column] = task;
		setHarvestTasks(tempTasks);
		localStorage.setItem('linkedHarvestTasks', JSON.stringify(tempTasks));
	};

	useEffect(() => {
		fetchProjectData();
		fetchJiraBoards();
		setHarvestTasks(JSON.parse(localStorage.getItem('linkedHarvestTasks')) || {});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (selectedBoard) {
			fetchColumns();
		}
	} , [selectedBoard]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div id="jira-config">
			<div className="heading">
				<button
					className='back-btn'
					onClick={() => {
						setCurrentView('settings');
						setProjectToConfigure(null);
					}}
				>
					➜
				</button>
				<h1>{`${projectToConfigure.harvest.name} Jira Configuration`}</h1>
			</div>
			<div className="main">
				<h2>Boards</h2>
				{/** Tabs to select each board */}
				<div className="tabs">
					{Object.keys(jiraBoards).map( board => {
						return (
							<button
								key={board}
								onClick={() => {
									setSelectedBoard(board);
								}}
								className={`tab ${selectedBoard === board ? 'selected' : ''}`}
							>
								{jiraBoards[board].name}
							</button>
						);
					})}
				</div>
				{/** Board configuration */}
				<div className="board-config">
					<h3>Columns</h3>
					{/** Columns */}
					<ul className="columns">
						{columns[selectedBoard] && columns[selectedBoard].map( column => {
							return (
								<li key={column.name}>
									<span>{column.name}</span>
									<select
										value={harvestTasks?.[selectedBoard]?.[column.name] || ''}
										onChange={(e) => setTask(e, column.name)}
									>
										<option value=''>Select a Harvest Task</option>
										{projectData.task_assignments.map( task_assignment => {
											const task = task_assignment.task;
											return (
												<option key={`${jiraBoards[selectedBoard].name}-${task.id}`} value={task.id}>{task.name}</option>
											);
										})}
									</select>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		</div>
	);
}

export default JiraConfig;
