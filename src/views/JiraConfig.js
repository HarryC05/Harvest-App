import { useState, useEffect } from "react";

import { getJiraBoards, getJiraColumns, getProject } from "../utils/api";

const JiraConfig = ( { projectToConfigure, setProjectToConfigure, setCurrentView, notificationsList, setNotificationsList } ) => {
	const [projectData, setProjectData] = useState({});
	const [jiraBoards, setJiraBoards] = useState({});
	const [selectedBoard, setSelectedBoard] = useState(null);
	const [columns, setColumns] = useState({});

	const jiraProjects = JSON.parse(localStorage.getItem('linkedProjects'))?.[projectToConfigure.harvest.id] || {};
	const jiraProfiles = JSON.parse(localStorage.getItem('jiraProfiles')) || [];

	const fetchProjectData = async () => {
		const project = await getProject(projectToConfigure.harvest.id);
		setProjectData(project);
	}
	const fetchJiraBoards = async () => {
		const tempBoardData = {};
		for (const project of jiraProjects) {
			const profile = jiraProfiles.find(profile => profile.name === project.info);
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

	const fetchColumns = async () => {
		// if the columns are already fetched, return
		if (columns[selectedBoard]) {
			return;
		}

		// get the board
		const board = jiraBoards[selectedBoard];

		const profile = jiraProfiles.find(profile => profile.name === board.info);

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

	useEffect(() => {
		fetchProjectData();
		fetchJiraBoards();
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
								class={`tab ${selectedBoard === board ? 'selected' : ''}`}
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
								<li key={column.id}>
									<span>{column.name}</span>
									<select>
										<option value=''>Select a Harvest Task</option>
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
