import { useState, useEffect } from 'react';

import { getProjects, getLastTimer } from '../utils/api';
import ProjectList from '../views/ProjectList';
import HarvestProject from '../views/HarvestProject';
import Settings from '../views/Settings';
import JiraConfig from '../views/JiraConfig';
import Notifications from '../components/Notifications';
import JiraProfile from '../views/JiraProfile';

/**
 * The main App component
 *
 * @returns {JSX.Element | null} - The JSX element
 */
const App = () => {
	const [projects, setProjects] = useState([]);
	const [selectedProject, setSelectedProject] = useState(null);
	const [runningTask, setRunningTask] = useState(null);
	const [currentView, setCurrentView] = useState('projectList');
	const [previousView, setPreviousView] = useState(null);
	const [projectToConfigure, setProjectToConfigure] = useState(null);
	const [notificationsList, setNotificationsList] = useState([]);
	const [currentProfile, setCurrentProfile] = useState(null);

	const apiAuth = {
		harvestToken: localStorage.getItem('harvestToken'),
		harvestAccountId: localStorage.getItem('harvestAccountId'),
	};

	/**
	 * Poll the latest harvest timer every 5 seconds
	 *
	 * @returns {void}
	 */
	const pollTimer = async () => {
		const lastTimer = await getLastTimer();

		if (
			lastTimer?.time_entries?.length === 0 ||
			lastTimer?.time_entries === undefined
		) {
			setRunningTask(null);
			return;
		}

		const latest = lastTimer.time_entries[0];

		setRunningTask({
			project_id: latest.project.id,
			task_id: latest.task.id,
			time_entry_id: latest.id,
			timer_started_at: latest.timer_started_at,
			hours: latest.hours,
			notes: latest.notes,
		});
	};

	/**
	 * Fetch the projects from the Harvest API
	 *
	 * @returns {void}
	 */
	const fetchProjects = async () => {
		const projects = await getProjects();
		setProjects(projects);
	};

	useEffect(() => {
		fetchProjects();
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			if (apiAuth.harvestToken && apiAuth.harvestAccountId) {
				pollTimer();
			}
		}, 5000);

		return () => clearInterval(interval);
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	if (
		(!apiAuth.harvestToken || !apiAuth.harvestAccountId) &&
		currentView !== 'settings'
	) {
		return (
			<div className="noAuth">
				<h1>API Auth Not Found</h1>
				<p>Please set your Harvest API token and account ID in the settings</p>
				<button onClick={() => setCurrentView('settings')}>
					<h3>Settings ⚙</h3>
				</button>
			</div>
		);
	}

	if (!projects.length && currentView !== 'settings') {
		return <div>Loading...</div>;
	}

	if (currentView === 'projectList') {
		return (
			<>
				<Notifications
					notificationsList={notificationsList}
					setNotificationsList={setNotificationsList}
				/>
				<ProjectList
					projects={projects}
					setSelectedProject={setSelectedProject}
					setCurrentView={setCurrentView}
					setPreviousView={setPreviousView}
					notificationsList={notificationsList}
					setNotificationsList={setNotificationsList}
				/>
			</>
		);
	}

	if (currentView === 'settings') {
		return (
			<>
				<Notifications
					notificationsList={notificationsList}
					setNotificationsList={setNotificationsList}
				/>
				<Settings
					setCurrentView={setCurrentView}
					previousView={previousView}
					setProjectToConfigure={setProjectToConfigure}
					notificationsList={notificationsList}
					setNotificationsList={setNotificationsList}
					setCurrentProfile={setCurrentProfile}
				/>
			</>
		);
	}

	if (currentView === 'project') {
		return (
			<>
				<Notifications
					notificationsList={notificationsList}
					setNotificationsList={setNotificationsList}
				/>
				<HarvestProject
					projectData={selectedProject}
					setSelectedProject={setSelectedProject}
					runningTask={runningTask}
					setRunningTask={setRunningTask}
					setCurrentView={setCurrentView}
					setPreviousView={setPreviousView}
					notificationsList={notificationsList}
					setNotificationsList={setNotificationsList}
				/>
			</>
		);
	}

	if (currentView === 'configureJiraProject') {
		return (
			<>
				<Notifications
					notificationsList={notificationsList}
					setNotificationsList={setNotificationsList}
				/>
				<JiraConfig
					projectToConfigure={projectToConfigure}
					setProjectToConfigure={setProjectToConfigure}
					setCurrentView={setCurrentView}
					notificationsList={notificationsList}
					setNotificationsList={setNotificationsList}
				/>
			</>
		);
	}

	if (currentView === 'jiraProfile') {
		return (
			<>
				<Notifications
					notificationsList={notificationsList}
					setNotificationsList={setNotificationsList}
				/>
				<JiraProfile
					setCurrentView={setCurrentView}
					currentProfile={currentProfile}
					setCurrentProfile={setCurrentProfile}
					notificationsList={notificationsList}
					setNotificationsList={setNotificationsList}
				/>
			</>
		);
	}

	return;
};

export default App;
