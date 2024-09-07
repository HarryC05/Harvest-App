import { useState, useEffect } from 'react';

import { getProjects, getLastTimer } from '../utils/api';
import ProjectList from '../views/ProjectList';
import Project from '../views/Project';
import Settings from '../views/Settings';
import JiraConfig from '../views/JiraConfig';
import Notifications from '../components/Notifications';

const App = () => {
	const [projects, setProjects] = useState([]);
	const [selectedProject, setSelectedProject] = useState(null);
	const [runningTask, setRunningTask] = useState(null);
	const [currentView, setCurrentView] = useState('projectList');
	const [previousView, setPreviouseView] = useState(null);
	const [projectToConfigure, setProjectToConfigure] = useState(null);
	const [notificationsList, setNotificationsList] = useState([]);

	const apiAuth = {
		harvestToken: localStorage.getItem('harvestToken'),
		harvestAccountId: localStorage.getItem('harvestAccountId'),
		jiraToken: localStorage.getItem('jiraToken'),
		jiraAccountId: localStorage.getItem('jiraAccountId')
	}

	const pollTimer = async () => {
		const lastTimer = await getLastTimer();

		if (lastTimer?.time_entries?.length === 0 || lastTimer?.time_entries === undefined) {
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
			notes: latest.notes
		});
	}

	const fetchProjects = async () => {
		const projects = await getProjects();
		setProjects(projects);
	}

	useEffect(() => {
		fetchProjects();
	}, []);

	useEffect(() => {
		const interval = setInterval(() => {
			if ( apiAuth.harvestToken && apiAuth.harvestAccountId) {
				pollTimer();
			}
		}, 5000);

		return () => clearInterval(interval);
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	if ( ( !apiAuth.harvestToken || !apiAuth.harvestAccountId ) && currentView !== 'settings') {
		return (
			<div className='noAuth'>
				<h1>API Auth Not Found</h1>
				<p>Please set your Harvest API token and account ID in the settings</p>
				<button onClick={() => setCurrentView('settings')}><h3>Settings ⚙</h3></button>
			</div>
		)
	}

	if (!projects.length && currentView !== 'settings') {
		return <div>Loading...</div>
	}

	if (currentView === 'projectList') {
		return (
			<>
				<Notifications notificationsList={notificationsList} setNotificationsList={setNotificationsList} />
				<ProjectList
					projects={projects}
					setSelectedProject={setSelectedProject}
					setCurrentView={setCurrentView}
					setPreviouseView={setPreviouseView}
					notificationsList={notificationsList}
					setNotificationsList={setNotificationsList}
				/>
			</>
		);
	}

	if (currentView === 'settings') {
		return (
			<>
				<Notifications notificationsList={notificationsList} setNotificationsList={setNotificationsList} />
				<Settings
					setCurrentView={setCurrentView}
					previousView={previousView}
					setProjectToConfigure={setProjectToConfigure}
					notificationsList={notificationsList}
					setNotificationsList={setNotificationsList}
				/>
			</>
		);
	}

	if (currentView === 'project') {
		return (
			<>
				<Notifications notificationsList={notificationsList} setNotificationsList={setNotificationsList} />
				<Project
					projectData={selectedProject}
					setSelectedProject={setSelectedProject}
					runningTask={runningTask}
					setRunningTask={setRunningTask}
					setCurrentView={setCurrentView}
					setPreviouseView={setPreviouseView}
					notificationsList={notificationsList}
					setNotificationsList={setNotificationsList}
				/>
			</>
		);
	}

	if (currentView === 'configureJiraProject') {
		return (
			<>
				<Notifications notificationsList={notificationsList} setNotificationsList={setNotificationsList} />
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
}

export default App;
