import { useEffect, useState } from 'react';

import { getProjects, getJiraProjects } from '../utils/api';
import PillBox from '../components/PillBox';
import TokenInput from '../components/TokenInput';

/**
 * Settings page to set the harvest api token and key,
 * as well as the jira api token and key.
 *
 * These keys will be stored in the local storage and will be automatically set to the input fields
 *
 * @param {object}   props                       - The props object
 * @param {Function} props.setCurrentView        - The function to set the current view
 * @param {string}   props.previousView          - The previous view to go back to when the back button is clicked
 * @param {Function} props.setProjectToConfigure - The function to set the project to configure
 * @param {Array}    props.notificationsList     - The list of notifications
 * @param {Function} props.setNotificationsList  - The function to set the notifications list
 * @param {Function} props.setCurrentProfile     - The function to set the current profile
 *
 * @returns {JSX.Element} - The Settings component
 */
const Settings = ({
	setCurrentView,
	previousView,
	setProjectToConfigure,
	notificationsList,
	setNotificationsList,
	setCurrentProfile,
}) => {
	const [harvestProjects, setHarvestProjects] = useState([]);
	const [linkedProjects, setLinkedProjects] = useState(
		JSON.parse(localStorage.getItem('linkedProjects')) || {}
	);
	const [pillSuggestions, setPillSuggestions] = useState([]);
	const [showToken, setShowToken] = useState('password');

	const jiraProfiles = JSON.parse(localStorage.getItem('jiraProfiles')) || [];

	/**
	 * Get the project data from the Harvest and Jira APIs
	 *
	 * @returns {void}
	 */
	const getProjectData = async () => {
		const harvestProjectsResp = await getProjects();

		const formattedHarvestProjects = harvestProjectsResp.map((project) => {
			return {
				id: project.project.id,
				name: project.project.name,
				code: project.project.code,
			};
		});

		setHarvestProjects(formattedHarvestProjects);

		if (jiraProfiles.length === 0) {
			return;
		}

		const tempJiraProjects = {};

		for (const profile of jiraProfiles) {
			const resp = await getJiraProjects(profile);

			// check if the response has an error
			if (!resp.ok) {
				// show error message
				setNotificationsList([
					...notificationsList,
					{
						type: 'error',
						message: `Error getting Jira projects for ${profile.name} profile`,
						id: 'error-getting-jira-projects',
						disappearTime: 3000,
					},
				]);
				return;
			}

			const data = await resp.json();

			tempJiraProjects[profile.name] = data;
		}

		// format the jira projects to be { value, uuid }
		const suggestions = Object.keys(tempJiraProjects).flatMap((profileName) => {
			return tempJiraProjects[profileName].map((project) => {
				return {
					value: `${project.key}: ${project.name}`,
					uuid: project.uuid,
					info: jiraProfiles.find((profile) => profile.name === profileName),
					id: project.id,
					name: project.name,
					key: project.key,
				};
			});
		});
		setPillSuggestions(suggestions);
	};

	/**
	 * Save the settings to the local storage
	 *
	 * @returns {void}
	 */
	const onSave = () => {
		localStorage.setItem(
			'harvestToken',
			document.getElementById('harvestToken').value
		);
		localStorage.setItem(
			'harvestAccountId',
			document.getElementById('harvest-account-id').value
		);
		localStorage.setItem('linkedProjects', JSON.stringify(linkedProjects));
		setLinkedProjects(JSON.parse(localStorage.getItem('linkedProjects')) || {});
		setNotificationsList([
			...notificationsList,
			{
				type: 'success',
				message: 'Settings Saved',
				id: 'settings-saved-success',
				disappearTime: 3000,
			},
		]);

		// refresh the page to get the new data if the user has changed the api keys
		if (
			document.getElementById('harvestToken').value !==
				localStorage.getItem('harvestToken') ||
			document.getElementById('harvest-account-id').value !==
				localStorage.getItem('harvestAccountId')
		) {
			window.location.reload();
		}
	};

	/**
	 * Update the linked projects when the pill box changes
	 *
	 * @param {Array}  tags    - The tags in the pill box
	 * @param {object} project - The project object
	 *
	 * @returns {void}
	 */
	const onPillBoxChange = (tags, project) => {
		const tempLinkedProjects = { ...linkedProjects };

		tempLinkedProjects[project.id] = tags;

		setLinkedProjects(tempLinkedProjects);
	};

	useEffect(() => {
		getProjectData();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div id="settings">
			<div className="heading" id="settings">
				<button
					className="back-btn"
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
					<div className="harvest-api-inputs">
						<h3>Harvest</h3>
						<h4>Harvest API Token</h4>
						<TokenInput
							showToken={showToken}
							defaultValue={localStorage.getItem('harvestToken')}
							setShowToken={setShowToken}
							id="harvestToken"
							size={75}
						/>
						<h4>Harvest Account ID</h4>
						<input
							type="text"
							id="harvest-account-id"
							defaultValue={localStorage.getItem('harvestAccountId')}
							size={50}
						/>
					</div>
					<div className="jira-api-inputs">
						<h3>Jira Profiles</h3>
						<ul className="jira-profile-list">
							{jiraProfiles.map((profile) => (
								<li key={profile.id}>
									<button
										className="profile-btn"
										onClick={() => {
											setCurrentView('jiraProfile');
											setCurrentProfile(profile);
										}}
									>
										{profile.avatarUrl && (
											<img
												src={profile.avatarUrl}
												alt={profile.name}
												width="48"
												height="48"
											/>
										)}
										{profile.name}
									</button>
								</li>
							))}
							<li key="add-profile">
								<button
									className="profile-btn add-profile"
									onClick={() => {
										setCurrentView('jiraProfile');
										setCurrentProfile({});
									}}
								>
									<span role="img" aria-label="add">
										+
									</span>
									Add Profile
								</button>
							</li>
						</ul>
					</div>
				</div>
				<div className="Projects">
					<h2>Harvest Projects</h2>
					<div className="harvest-projects">
						<ul className="project-list">
							{harvestProjects.map((project) => {
								return (
									<li key={project.id}>
										<h4>{`${project.name} ${project.code ? `(${project.code})` : ''}`}</h4>

										{(JSON.parse(localStorage.getItem('linkedProjects')) || {})[
											project.id
										] &&
											linkedProjects[project.id] !== '' &&
											linkedProjects[project.id].length > 0 && (
												<button
													className="configure-btn"
													onClick={() => {
														setCurrentView('configureJiraProject');
														setProjectToConfigure({
															harvest: {
																id: project.id,
																name: project.name,
																code: project.code,
															},
														});
													}}
												>
													Configure Jira Project
												</button>
											)}
										<PillBox
											suggestions={pillSuggestions}
											onChange={(val) => onPillBoxChange(val, project)}
											selected={linkedProjects[project.id] || []}
										/>
									</li>
								);
							})}
						</ul>
					</div>
				</div>

				<button className="save-btn" onClick={onSave}>
					Save
				</button>
			</div>
		</div>
	);
};

export default Settings;
