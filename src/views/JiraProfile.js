import { useState } from 'react';

import { getProfile } from '../utils/api';
import { ShowPasswordIcon, HidePasswordIcon } from '../components/icons';

const JiraProfile = ( {
	setCurrentView,
	currentProfile,
	setCurrentProfile,
	notificationsList,
	setNotificationsList,
} ) => {
	const [showToken, setShowToken] = useState('password');

	// Setup the current profile if it's empty
	if (currentProfile.length === 0) {
		// Create a new profile
		setCurrentProfile({
			id: '',
			name: 'New Profile',
			url: '',
			email: '',
			token: '',
			avatarUrl: '',
		});
	}

	const onSave = async () => {
		// send saving notification
		setNotificationsList([...notificationsList, {type: 'info', message: 'Saving Profile...', id: 'profile-saving', disappearTime: 3000}]);

		const profile = {
			id: currentProfile.id,
			name: document.getElementById('profileName').value,
			url: document.getElementById('jiraUrl').value,
			email: document.getElementById('jiraEmail').value,
			token: document.getElementById('jiraToken').value,
			avatarUrl: '',
		};

		// get the profile from the API
		let resp = await getProfile(profile)

		// if the response is an error, show the error
		if ( ! resp.ok ) {
			const error = await resp.text();
			setNotificationsList([...notificationsList, {type: 'error', message: `${resp.status}: ${error}`, id: 'profile-save-error', disappearTime: 3000}]);
			return;
		}

		// decode the response
		resp = await resp.json();

		// set the avatar url
		profile.avatarUrl = resp.avatarUrls['48x48'];

		// set the id
		profile.id = resp.accountId;

		// set the profile
		setCurrentProfile(profile);

		// save the profile to the local storage
		const profiles = JSON.parse(localStorage.getItem('jiraProfiles')) || [];
		const profileIndex = profiles.findIndex(p => p.id === profile.id);
		if (profileIndex === -1) {
			profiles.push(profile);
		} else {
			profiles[profileIndex] = profile;
		}
		localStorage.setItem('jiraProfiles', JSON.stringify(profiles));

		// set the notifications
		setNotificationsList([...notificationsList, {type: 'success', message: 'Profile Saved', id: 'profile-saved-success', disappearTime: 3000}]);
	}

	return (
		<div id="jira-profile">
			<div className="heading">
				<button
					className='back-btn'
					onClick={() => {
						setCurrentView('settings');
						setCurrentProfile(null);
					}}
				>
					➜
				</button>
				<h1>Jira Profile</h1>
			</div>
			<div className="main">
				<div className="profile-info-heading">
					{currentProfile.avatarUrl && <img src={currentProfile.avatarUrl} alt={currentProfile.name} />}
					<h2>{currentProfile.name}</h2>
				</div>
				<div className="profile-info">
					<h3>Profile Info</h3>
					<div className='profile-info-input'>
						<h4>Profile Name</h4>
						<input type="text" id="profileName" defaultValue={currentProfile.name} />
					</div>
					<div className='profile-info-input'>
						<h4>Jira URL</h4>
						<input type="text" id="jiraUrl" defaultValue={currentProfile.url} />
					</div>
					<div className='profile-info-input'>
						<h4>Jira Email</h4>
						<input type="text" id="jiraEmail" defaultValue={currentProfile.email} />
					</div>
					<div className='profile-info-input'>
						<h4>Jira Token</h4>
						<div className='token-input'>
							<input type={showToken} id="jiraToken" defaultValue={currentProfile.token} />
							<button
								className='show-token'
								onClick={() => {
									setShowToken(showToken === 'password' ? 'text' : 'password');
								}}
							>
								{ /* show eye symbols for show and hide */
									showToken === 'password' ? <ShowPasswordIcon /> : <HidePasswordIcon />
								}
							</button>
						</div>
					</div>
					<button
						className="save-btn"
						onClick={() => {
							onSave();
						}}
					>
						Save
					</button>
				</div>
			</div>
		</div>
	);
}

export default JiraProfile;
