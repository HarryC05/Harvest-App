import { useEffect, useState } from 'react';

import { getProjects, getJiraProjects } from '../utils/api';

/**
 * Settings page to set the harvest api token and key,
 * as well as the jira api token and key.
 *
 * These keys will be stored in the local storage and will be automatically set to the input fields
 */
const Settings = ( { setCurrentView, previousView, setProjectToConfigure, notificationsList, setNotificationsList } ) => {
	const [harvestProjects, setHarvestProjects] = useState([]);
	const [jiraProjects, setJiraProjects] = useState([]);
	const [linkedProjects, setLinkedProjects] = useState(JSON.parse(localStorage.getItem('linkedProjects')) || {});

	const getProjectData = async () => {
		const harvestProjectsResp = await getProjects();

		const formattedHarvestProjects = harvestProjectsResp.map( project => {
			return {
				id: project.project.id,
				name: project.project.name,
				code: project.project.code
			}
		} );

		setHarvestProjects( formattedHarvestProjects );

		const jiraProjectsResp = await getJiraProjects();

		const formattedJiraProjects = jiraProjectsResp.map( project => {
			return {
				id: project.id,
				name: project.name,
				key: project.key
			}
		} );

		setJiraProjects( formattedJiraProjects );
	}

	useEffect( () => {
		getProjectData();
	}, [] );

	return (
		<div id="settings">
			<div className="heading" id="settings">
				<button
					className='back-btn'
					onClick={() => {
						setCurrentView(previousView);
					}}
				>
					➜
				</button>
				<h1>Settings</h1>
			</div>
			<div className="main">
				<div className="api-keys">
					<h2>API Keys</h2>
					<h3>Harvest</h3>
					<h4>Harvest API Token</h4>
					<input
						type='text'
						id='harvest-token'
						defaultValue={localStorage.getItem('harvestToken')}
						size={75}
					/>
					<h4>Harvest Account ID</h4>
					<input
						type='text'
						id='harvest-account-id'
						defaultValue={localStorage.getItem('harvestAccountId')}
						size={50}
					/>
					<h3>Jira</h3>
					<h4>Jira API Token</h4>
					<input
						type='text'
						id='jira-token'
						defaultValue={localStorage.getItem('jiraToken')}
						size={75}
					/>
					<h4>Jira Email</h4>
					<input
						type='text'
						id='jira-email'
						defaultValue={localStorage.getItem('jiraEmail')}
						size={50}
					/>
					<h4>Jira URL</h4>
					<input
						type='text'
						id='jira-url'
						defaultValue={localStorage.getItem('jiraUrl')}
						size={50}
					/>
				</div>
				<div className="Projects">
					<h2>Projects</h2>
					<div className="harvest-projects">
						<ul className='project-list'>
							{harvestProjects.map( project => {return(
								<li key={project.id}>
									<h4>{`${project.name} ${project.code ? `(${project.code})` : ''}`}</h4>

									{
										(JSON.parse(localStorage.getItem('linkedProjects')) || {})[project.id] &&
										linkedProjects[project.id] !== '' &&
										(
											<button
												className='configure-btn'
												onClick={ () => {
													setCurrentView('configureJiraProject');
													setProjectToConfigure( {
														harvest: {
															id: project.id,
															name: project.name,
															code: project.code
														},
														jira: {
															id: linkedProjects[project.id]
														}
													} );
												} }
											>
												Configure Jira Project
											</button>
										)
									}

									{ jiraProjects.length > 0 && (
										<select
											onChange={ ( e ) => {
												if ( e.target.value === linkedProjects[project.id] ) {
													return;
												}

												const newLinkedProjects = { ...linkedProjects, [project.id]: e.target.value };
												setLinkedProjects( newLinkedProjects );
											} }
											defaultValue={linkedProjects[project.id] || ''}
										>
											<option value={''}>Select a Jira Project</option>
											{jiraProjects.map( jiraProject => {return(
												<option
													key={jiraProject.id}
													value={jiraProject.id}
												>
													{`${jiraProject.name} (${jiraProject.key})`}
												</option>
											)})}
										</select>
									) }
								</li>
							)})}
						</ul>
					</div>
				</div>

				<button
						className="save-btn"
						onClick={() => {
							localStorage.setItem('harvestToken', document.getElementById('harvest-token').value);
							localStorage.setItem('harvestAccountId', document.getElementById('harvest-account-id').value);
							localStorage.setItem('jiraToken', document.getElementById('jira-token').value);
							localStorage.setItem('jiraEmail', document.getElementById('jira-email').value);
							localStorage.setItem('jiraUrl', document.getElementById('jira-url').value);
							localStorage.setItem('linkedProjects', JSON.stringify(linkedProjects));
							setLinkedProjects(JSON.parse(localStorage.getItem('linkedProjects')) || {});
							setNotificationsList([...notificationsList, {type: 'success', message: 'Settings Saved', id: 'settings-saved-sucess', disappearTime: 3000}]);
						}}
					>
						Save
					</button>
			</div>
		</div>
	)
}

export default Settings;
