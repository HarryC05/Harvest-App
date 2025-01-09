// -------------------------- Harvest API --------------------------
/**
 * @group HarvestAPI
 * @description Functions to interact with the Harvest API
 */

// Harvest API tokens and configuration
const TOKEN = localStorage.getItem( 'harvestToken' );
const ACCOUNTID = localStorage.getItem( 'harvestAccountId' );

// Create global Headers
const headers = {
	harvest: {
		'Authorization': `Bearer ${TOKEN}`,
		'Harvest-Account-ID': ACCOUNTID,
		'User-Agent': 'Harvest API Example',
		'Content-Type': 'application/json'
	},
}

/**
 * Fetch the projects from the Harvest API
 *
 * @returns {object} projectData - The projects data
 */
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

/**
 * Fetch a project from the Harvest API
 *
 * @param {number} projectId - The project ID
 *
 * @returns {object} project - The project data
 */
export const getProject = async (projectId) => {
	if ( !TOKEN || !ACCOUNTID ) {
		return [];
	}
	const projects = await getProjects();

	const project = projects.find(project => project.project.id === projectId);

	return project;
}

/**
 * Start a timer
 *
 * @param {object} task  - The task object
 * @param {string} notes - The notes to be added to the task
 *
 * @returns {object} data - The response data
 */
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

/**
 * Stop a timer
 *
 * @param {string} time_entry_id - The time entry ID
 *
 * @returns {object} data - The response data
 */
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

/**
 * Get the latest running timer
 *
 * @returns {object} data - The response data
 */
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

// ---------------------------- JIRA API ----------------------------

/**
 * @group JiraAPI
 * @description Functions to interact with the Jira API
 */

/**
 * Fetch the projects from the Jira API
 *
 * @param {object} auth       - The object containing the authentication data
 * @param {string} auth.token - The Jira API token
 * @param {string} auth.email - The Jira API email
 * @param {string} auth.url   - The Jira API URL
 *
 * @returns {Promise} response - The response object
 */
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


/**
 * Fetch the boards from the Jira API
 *
 * @param {number} id         - The project ID
 * @param {object} auth       - The object containing the authentication data
 * @param {string} auth.token - The Jira API token
 * @param {string} auth.email - The Jira API email
 * @param {string} auth.url   - The Jira API URL
 *
 * @returns {Promise} response - The response object
 */
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

/**
 * Fetch the columns from the Jira API
 *
 * @param {number} boardId    - The board ID
 * @param {object} auth       - The object containing the authentication data
 * @param {string} auth.token - The Jira API token
 * @param {string} auth.email - The Jira API email
 * @param {string} auth.url   - The Jira API URL
 *
 * @returns {Promise} response - The response object
 */
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

/**
 * Fetch the profile from the Jira API
 *
 * @param {object} auth       - The object containing the authentication data
 * @param {string} auth.token - The Jira API token
 * @param {string} auth.email - The Jira API email
 * @param {string} auth.url   - The Jira API URL
 *
 * @returns {Promise} response - The response object
 */
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

// JIRA API: Get the current sprint
// export const getCurrentSprint = async (boardId) => {
// 	if (!JIRATOKEN || !JIRAEMAIL || !JIRAURL) {
// 			return [];
// 	}

// 	const response = await fetch(`/rest/agile/1.0/board/${boardId}/sprint?state=active`, {
// 			method: 'GET',
// 			headers: headers.jira,
// 	});

// 	const data = await response.json();

// 	return data?.values[0];
// };

// JIRA API: Get tickets for a sprint
// export const getSprintTickets = async (sprintId) => {
// 	if (!JIRATOKEN || !JIRAEMAIL || !JIRAURL) {
// 			return [];
// 	}

// 	const response = await fetch(`/rest/agile/1.0/sprint/${sprintId}/issue?maxResults=100`, {
// 			method: 'GET',
// 			headers: headers.jira,
// 	});

// 	const data = await response.json();

// 	return data?.issues;
// };
