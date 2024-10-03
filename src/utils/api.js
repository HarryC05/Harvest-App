// Harvest API tokens and configuration
const TOKEN = localStorage.getItem( 'harvestToken' );
const ACCOUNTID = localStorage.getItem( 'harvestAccountId' );

// JIRA API tokens and configuration
const JIRATOKEN = localStorage.getItem( 'jiraToken' );
const JIRAEMAIL = localStorage.getItem( 'jiraEmail' );
let JIRAURL = localStorage.getItem( 'jiraUrl' );

// Ensure the JIRA URL is properly formatted
if ( JIRAURL && !JIRAURL.startsWith( 'https://' ) ) {
	JIRAURL = `https://${JIRAURL}`;
}

if ( JIRAURL && JIRAURL.startsWith( 'http://' ) ) {
	JIRAURL = JIRAURL.replace( 'http://', 'https://' );
}

if ( JIRAURL && JIRAURL.endsWith( '/' ) ) {
	JIRAURL = JIRAURL.slice( 0, -1 );
}

// Create global Headers
const headers = {
	harvest: {
		'Authorization': `Bearer ${TOKEN}`,
		'Harvest-Account-ID': ACCOUNTID,
		'User-Agent': 'Harvest API Example',
		'Content-Type': 'application/json'
	},
	jira: {
		'Authorization': `Basic ${btoa(`${JIRAEMAIL}:${JIRATOKEN}`)}`,
		'Content-Type': 'application/json',
		'User-Agent': 'JIRA API Example',
		'X-Target-URL': JIRAURL ? `${JIRAURL}/rest` : ''
	}
}

// Harvest API: Get all projects
export const getProjects = async () => {
	if ( !TOKEN || !ACCOUNTID ) {
		return [];
	}

	const response = await fetch('https://api.harvestapp.com/v2/users/me/project_assignments', {
		method: 'GET',
		headers: headers.harvest,
	});
	const data = await response.json();

	const projectsData = data.project_assignments;

	return projectsData;
}

// Harvest API: Get specific project
export const getProject = async (projectId) => {
	if ( !TOKEN || !ACCOUNTID ) {
		return [];
	}
	const projects = await getProjects();

	const project = projects.find(project => project.project.id === projectId);

	return project;
}

// Harvest API: Start a timer
export const startTimer = async (task, notes = '') => {
	if ( !TOKEN || !ACCOUNTID ) {
		return [];
	}

	const now = new Date();
	const offset = now.getTimezoneOffset() * 60000;
	const localISOTime = new Date(now - offset).toISOString();

	const body = JSON.stringify({
		project_id: task.project_id,
		task_id: task.task_id,
		spent_date: localISOTime,
		notes
	});

	const response = await fetch('https://api.harvestapp.com/v2/time_entries', {
		method: 'POST',
		headers: headers.harvest,
		body,
	});

	const data = await response.json();

	return data;
}

// Harvest API: Stop a timer
export const stopTimer = async (time_entry_id) => {
	if ( !TOKEN || !ACCOUNTID ) {
		return [];
	}

	const response = await fetch(`https://api.harvestapp.com/v2/time_entries/${time_entry_id}/stop`, {
		method: 'PATCH',
		headers: headers.harvest,
	});

	const data = await response.json();

	return data;
}

// Harvest API: Get last running timer
export const getLastTimer = async () => {
	if ( !TOKEN || !ACCOUNTID ) {
		return [];
	}

	const response = await fetch('https://api.harvestapp.com/v2/time_entries?is_running=true', {
		method: 'GET',
		headers: headers.harvest,
	});

	const data = await response.json();

	return data;
}

// JIRA API: Get all projects
export const getJiraProjects = async ( {token, email, url} ) => {
	if (!token || !email || !url) {
			return [];
	}

	const header = {
		'Authorization': `Basic ${btoa(`${email}:${token}`)}`,
		'Content-Type': 'application/json',
		'User-Agent': 'JIRA API Example',
		'X-Target-URL': url ? `${url}/rest` : ''
	}

	const response = await fetch('/rest/api/3/project', {
			method: 'GET',
			headers: header,
	});

	return response;
};


// JIRA API: Get board by project key
export const getJiraBoards = async (id, {token, email, url}) => {
	if (!token || !email || !url) {
			return [];
	}

	const header = {
		'Authorization': `Basic ${btoa(`${email}:${token}`)}`,
		'Content-Type': 'application/json',
		'User-Agent': 'JIRA API Example',
		'X-Target-URL': url ? `${url}/rest` : ''
	}

	const response = await fetch(`/rest/agile/1.0/board?projectKeyOrId=${id}`, {
			method: 'GET',
			headers: header,
	});

	return response;
};

// JIRA API: Get columns by board ID
export const getJiraColumns = async (boardId, {token, email, url}) => {
	if (!token || !email || !url) {
			return [];
	}

	const header = {
		'Authorization': `Basic ${btoa(`${email}:${token}`)}`,
		'Content-Type': 'application/json',
		'User-Agent': 'JIRA API Example',
		'X-Target-URL': url ? `${url}/rest` : ''
	}

	const response = await fetch(`/rest/agile/1.0/board/${boardId}/configuration`, {
			method: 'GET',
			headers: header,
	});

	return response;
};

// JIRA API: Get the current sprint
export const getCurrentSprint = async (boardId) => {
	if (!JIRATOKEN || !JIRAEMAIL || !JIRAURL) {
			return [];
	}

	const response = await fetch(`/rest/agile/1.0/board/${boardId}/sprint?state=active`, {
			method: 'GET',
			headers: headers.jira,
	});

	const data = await response.json();

	return data?.values[0];
};

// JIRA API: Get tickets for a sprint
export const getSprintTickets = async (sprintId) => {
	if (!JIRATOKEN || !JIRAEMAIL || !JIRAURL) {
			return [];
	}

	const response = await fetch(`/rest/agile/1.0/sprint/${sprintId}/issue?maxResults=100`, {
			method: 'GET',
			headers: headers.jira,
	});

	const data = await response.json();

	return data?.issues;
};

// JIRA API: Get profile
export const getProfile = async ( {url, email, token} ) => {
	const header = {
		'Authorization': `Basic ${btoa(`${email}:${token}`)}`,
		'Content-Type': 'application/json',
		'User-Agent': 'JIRA API Example',
		'X-Target-URL': url ? `${url}/rest` : ''
	}

	// set the priority of the request to be as high as possible
	const response = await fetch('/rest/api/3/myself', {
			method: 'GET',
			headers: header,
	});

	return response;
};
