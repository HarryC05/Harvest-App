import { useEffect, useState } from 'react';

import { getProjects, getJiraProjects } from '../utils/api';
import PillBox from '../components/PillBox';

/**
 * Settings page to set the harvest api token and key,
 * as well as the jira api token and key.
 *
 * These keys will be stored in the local storage and will be automatically set to the input fields
 */
const Settings = ( {
	setCurrentView,
	previousView,
	setProjectToConfigure,
	notificationsList,
	setNotificationsList,
	setCurrentProfile,
} ) => {
	const [harvestProjects, setHarvestProjects] = useState([]);
	const [jiraProjects, setJiraProjects] = useState([]);
	const [linkedProjects, setLinkedProjects] = useState(JSON.parse(localStorage.getItem('linkedProjects')) || {});
	const [jiraProfiles, setJiraProfiles] = useState(JSON.parse(localStorage.getItem('jiraProfiles')) || []);
	const [pillSuggestions, setPillSuggestions] = useState([]);

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

		if ( jiraProfiles.length === 0 ) {
			return;
		}

		const tempJiraProjects = [];

		for (const profile of jiraProfiles) {
			const resp = await getJiraProjects( profile );

			// check if the response has an error
			if ( ! resp.ok ) {
				// show error message
				setNotificationsList([
					...notificationsList,
					{
						type: 'error',
						message: `Error getting Jira projects for ${profile.name} profile`,
						id: 'error-getting-jira-projects',
						disappearTime: 3000
					}
				]);
				return;
			}

			const data = await resp.json();

			tempJiraProjects.push( ...data );
		};

		const formattedJiraProjects = tempJiraProjects.map( project => {
			return {
				id: project.id,
				name: project.name,
				key: project.key
			}
		} );

		const suggestions = tempJiraProjects.map( project => {
			return `${project.name} (${project.key})`;
		} );

		setJiraProjects( formattedJiraProjects );
		setPillSuggestions( suggestions );
	}

	const onSave = () => {
		localStorage.setItem('harvestToken', document.getElementById('harvest-token').value);
		localStorage.setItem('harvestAccountId', document.getElementById('harvest-account-id').value);
		localStorage.setItem('linkedProjects', JSON.stringify(linkedProjects));
		setLinkedProjects(JSON.parse(localStorage.getItem('linkedProjects')) || {});
		setNotificationsList([...notificationsList, {type: 'success', message: 'Settings Saved', id: 'settings-saved-success', disappearTime: 3000}]);

		// refresh the page to get the new data if the user has changed the api keys
		if (
			document.getElementById('harvest-token').value !== localStorage.getItem('harvestToken')
			|| document.getElementById('harvest-account-id').value !== localStorage.getItem('harvestAccountId')
		) {
			window.location.reload();
		}
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
					<div className='harvest-api-inputs'>
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
					</div>
					<div className='jira-api-inputs'>
						<h3>Jira Profiles</h3>
						<ul className='jira-profile-list'>
							{jiraProfiles.map( profile => (
								<li key={profile.id}>
									<button
										className='profile-btn'
										onClick={ () => {
											setCurrentView('jiraProfile');
											setCurrentProfile( profile );
										} }
									>
										{profile.avatarUrl && <img src={profile.avatarUrl} alt={profile.name} width='48' height='48' />}
										{profile.name}
									</button>
								</li>
							))}
							<li key='add-profile'>
								<button
									className='profile-btn add-profile'
									onClick={() => {
										setCurrentView('jiraProfile');
										setCurrentProfile( {} );
									}}
								>
									<span role='img' aria-label='add'>+</span>
									Add Profile
								</button>
							</li>
						</ul>
					</div>
				</div>
				<div className="Projects">
					<h2>Harvest Projects</h2>
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
									<PillBox suggestions={pillSuggestions} />
									{/* { jiraProjects.length > 0 && (
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
									) } */}
								</li>
							)})}
						</ul>
					</div>
				</div>

				<button
						className="save-btn"
						onClick={onSave}
					>
						Save
					</button>
			</div>
		</div>
	)
}

export default Settings;
