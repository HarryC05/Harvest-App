import { useState, useEffect } from "react";

import { getJiraBoard, getJiraColumns, getProject } from "../utils/api";

const JiraConfig = ( { projectToConfigure, setProjectToConfigure, setCurrentView, notificationsList, setNotificationsList } ) => {
	const [jiraColumns, setJiraColumns] = useState(null);
	const [jiraConfig, setJiraConfig] = useState(JSON.parse(localStorage.getItem('jiraConfig')) || {});
	const [projectData, setProjectData] = useState({});

	const fetchJiraBoard = async () => {
		const board = await getJiraBoard(projectToConfigure.jira.id);
		const columns = await getJiraColumns(board.id);
		setJiraColumns(columns);
	}

	const fetchProjectData = async () => {
		const project = await getProject(projectToConfigure.harvest.id);
		setProjectData(project);
	}

	useEffect(() => {
		fetchJiraBoard();
		fetchProjectData();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

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
				<h2>Columns</h2>
				<ul>
					{jiraColumns && jiraColumns.map(column => {console.log(column);return(
						<li key={column.statuses[0].id}>
							{column.name}
							<select
								value={jiraConfig[projectToConfigure.harvest.id]?.[column.name] || null}
								onChange={(e) => {
									setJiraConfig({
										...jiraConfig,
										[projectToConfigure.harvest.id]: {
											[column.name]: e.target.value
										}
									});
								}}
							>
								<option value={null}>None</option>
								{projectData?.task_assignments.map(task => (
									<option
										value={task.task.id}
										key={task.task.id}
									>
										{task.task.name}
									</option>
								))}
							</select>
						</li>
					)})}
				</ul>
				<button
					className="save-btn"
					onClick={() => {
						localStorage.setItem('jiraConfig', JSON.stringify(jiraConfig));
						setNotificationsList([
							...notificationsList,
							{
								id: 'jira-config-saved-success',
								type: 'success',
								message: 'Jira Configuration Saved',
								disappearTime: 3000,
							}
						]);
					} }
				>
					Save
				</button>
			</div>
		</div>
	);
}

export default JiraConfig;
