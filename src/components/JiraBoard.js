import { useState, useEffect } from "react";
import { getCurrentSprint, getJiraColumns, getSprintTickets } from "../utils/api";
import JiraTicket from "./JiraTicket";

/**
 * The Jira Board component
 *
 * @param {object}   props                      - The props object
 * @param {object}   props.board                - The object containing the data for the board
 * @param {array}    props.notificationsList    - The list of notifications
 * @param {function} props.setNotificationsList - The function to set the notifications list
 *
 * @returns {JSX.Element}
 */
const JiraBoard = ( {
	board,
	notificationsList,
	setNotificationsList
} ) => {
	const [ columns, setColumns ] = useState([]);
	const [currentSprint, setCurrentSprint] = useState(null);
	const [tickets, setTickets] = useState([]);
	const [assignee, setAssignee] = useState('all');

	/**
	 * Fetch the boards columns
	 *
	 * @returns {void}
	 */
	const fetchColumns = async () => {
		// fetch the columns
		const columnsResp = await getJiraColumns(board.id, board.info);

		// check if the response has an error
		if ( ! columnsResp.ok ) {
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

		const json = await columnsResp.json();

		// set the columns
		setColumns(json.columnConfig.columns);
	};

	/**
	 * Fetch the tickets from the current sprint for the board
	 *
	 * @returns {void}
	 */
	const fetchTickets = async () => {
		// fetch the current sprint
		const sprintResp = await getCurrentSprint(board.id, board.info);

		// check if the response has an error
		if ( ! sprintResp.ok ) {
			// show error message
			setNotificationsList([
				...notificationsList,
				{
					type: 'error',
					message: `Error getting current sprint for ${board.name}`,
					id: 'error-getting-current-sprint',
					disappearTime: 3000
				}
			]);
			return;
		}

		const sprintJSON = await sprintResp.json();

		// set the current sprint
		setCurrentSprint(sprintJSON.values[0]);

		// fetch the tickets
		const ticketsResp = await getSprintTickets(sprintJSON.values[0].id, board.info);

		// check if the response has an error
		if ( ! ticketsResp.ok ) {
			// show error message
			setNotificationsList([
				...notificationsList,
				{
					type: 'error',
					message: `Error getting tickets for ${board.name}`,
					id: 'error-getting-tickets',
					disappearTime: 3000
				}
			]);
			return;
		}

		const ticketsJSON = await ticketsResp.json();

		// set the tickets
		setTickets(ticketsJSON.issues);
	};

	useEffect(() => {
		fetchColumns();
		fetchTickets();
	}, []);

	return (
		<div className="jira-board">
			<ul className="jira-columns" style={{ gridTemplateColumns: `repeat(${columns.length}, 19%)` }}>
				{columns.map((column, index) => (
					<li key={index} className="jira-column">
						<h4>{column.name}</h4>
						<ul className="jira-tickets">
							{tickets
								.filter( ticket => assignee === 'all' || ticket.fields.assignee?.emailAddress === board.info.email )
								.filter( ticket => column.statuses.some( status => status.id === ticket.fields.status.id ) )
								.map( (ticket, i) => (
									<JiraTicket key={i} ticket={ticket} />
								) )
							}
						</ul>
					</li>
				))}
			</ul>
		</div>
	)
}

export default JiraBoard
