import { useState, useEffect, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import {
	getCurrentSprint,
	getJiraColumns,
	getSprintTickets,
	getTicketTransitions,
} from '../utils/api';
import Spinner from './Spinner';
import JiraColumn from './JiraColumn';

/**
 * The Jira Board component
 *
 * @param {object}   props                      - The props object
 * @param {object}   props.board                - The object containing the data for the board
 * @param {Array}    props.notificationsList    - The list of notifications
 * @param {Function} props.setNotificationsList - The function to set the notifications list
 * @param {Function} props.startTimer           - The function to start the timer
 *
 * @returns {JSX.Element} - The Jira Board component
 */
const JiraBoard = ({
	board,
	notificationsList,
	setNotificationsList,
	startTimer,
}) => {
	const [columns, setColumns] = useState([]);
	const [currentSprint, setCurrentSprint] = useState(null);
	const [tickets, setTickets] = useState([]);
	const [assignee, setAssignee] = useState('all');
	const [assigneeOptions, setAssigneeOptions] = useState([]);
	const [loading, setLoading] = useState(false);
	const [columnTransitions, setColumnTransitions] = useState([]);

	const boardRef = useRef(board);

	/**
	 * Fetch the boards columns
	 *
	 * @returns {void}
	 */
	const fetchColumns = async () => {
		// fetch the columns
		const columnsResp = await getJiraColumns(
			boardRef.current.id,
			boardRef.current.info
		);

		// check if the response has an error
		if (!columnsResp.ok) {
			// show error message
			setNotificationsList([
				...notificationsList,
				{
					type: 'error',
					message: `Error getting Jira columns for ${boardRef.current.name}`,
					id: 'error-getting-jira-columns',
					disappearTime: 3000,
				},
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
		setLoading(true);
		// fetch the current sprint
		const sprintResp = await getCurrentSprint(
			boardRef.current.id,
			boardRef.current.info
		);

		// check if the response has an error
		if (!sprintResp.ok) {
			// show error message
			setNotificationsList([
				...notificationsList,
				{
					type: 'error',
					message: `Error getting current sprint for ${boardRef.current.name}`,
					id: 'error-getting-current-sprint',
					disappearTime: 3000,
				},
			]);
			return;
		}

		const sprintJSON = await sprintResp.json();

		// set the current sprint
		setCurrentSprint(sprintJSON.values[0]);

		// fetch the tickets
		const ticketsResp = await getSprintTickets(
			sprintJSON.values[0].id,
			boardRef.current.info
		);

		// check if the response has an error
		if (!ticketsResp.ok) {
			// show error message
			setNotificationsList([
				...notificationsList,
				{
					type: 'error',
					message: `Error getting tickets for ${boardRef.current.name}`,
					id: 'error-getting-tickets',
					disappearTime: 3000,
				},
			]);
			return;
		}

		const ticketsJSON = await ticketsResp.json();

		// set the tickets
		setTickets(ticketsJSON.issues);

		// set the assignee options
		let tempAssigneeOptions = ticketsJSON.issues.reduce((acc, ticket) => {
			if (!ticket.fields.assignee) {
				acc['unassigned'] = 'Unassigned';
			} else {
				acc[ticket.fields.assignee.emailAddress] =
					ticket.fields.assignee.displayName;
			}

			return acc;
		}, {});

		// if unassigned is there, move it to the front
		if (tempAssigneeOptions.unassigned) {
			tempAssigneeOptions = {
				unassigned: tempAssigneeOptions.unassigned,
				...tempAssigneeOptions,
			};
		}

		// if the current user is there, change the value to 'Current User' and move it to the front
		if (tempAssigneeOptions[boardRef.current.info.email]) {
			tempAssigneeOptions = {
				[boardRef.current.info.email]:
					tempAssigneeOptions[boardRef.current.info.email],
				...tempAssigneeOptions,
			};
		}

		tempAssigneeOptions = {
			all: 'All',
			...tempAssigneeOptions,
		};

		setAssigneeOptions(tempAssigneeOptions);

		if (columnTransitions.length > 0) {
			setLoading(false);
			return;
		}

		// set the column transitions
		const columnTransitionsResp = await getTicketTransitions(
			ticketsJSON.issues[0].id,
			boardRef.current.info
		);

		// check if the response has an error
		if (!columnTransitionsResp.ok) {
			// show error message
			setNotificationsList([
				...notificationsList,
				{
					type: 'error',
					message: `Error getting ticket transitions for ${boardRef.current.name}`,
					id: 'error-getting-ticket-transitions',
					disappearTime: 3000,
				},
			]);
			return;
		}

		const columnTransitionsJSON = await columnTransitionsResp.json();

		setColumnTransitions(columnTransitionsJSON.transitions);

		setLoading(false);
	};

	/**
	 * Reload the tickets
	 *
	 * @returns {void}
	 */
	const reloadTickets = async () => {
		await fetchTickets();

		// set notification that the tickets have been reloaded
		setNotificationsList([
			...notificationsList,
			{
				type: 'success',
				message: 'Current sprint tickets reloaded',
				disappearTime: 3000,
			},
		]);
	};

	useEffect(() => {
		/**
		 * Poll the tickets every 15 seconds
		 *
		 * @returns {void}
		 */
		const pollTickets = async () => {
			await fetchTickets();
		};

		const interval = setInterval(() => {
			pollTickets();
		}, 15000);

		return () => clearInterval(interval);
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		boardRef.current = board;
		fetchColumns();
		fetchTickets();
	}, [board]); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<DndProvider backend={HTML5Backend}>
			<div className="jira-board">
				<div className="jira-board-header">
					<p className="jira-board-sprint">
						<strong>Sprint:</strong> {currentSprint?.name}
						<span
							className={`jira-sprint-indicator ${currentSprint?.state}`}
							title={`Sprint ${currentSprint?.state}`}
						>
							⦿
						</span>
					</p>
					<div className="jira-board-assignee">
						<label htmlFor="jira-assignee">
							<strong>Assignee:</strong>
						</label>
						<select
							id="jira-assignee"
							value={assignee}
							onChange={(e) => setAssignee(e.target.value)}
						>
							{Object.keys(assigneeOptions).map((key) => (
								<option key={key} value={key}>
									{assigneeOptions[key]}
								</option>
							))}
						</select>
					</div>
					<button
						onClick={reloadTickets}
						className="jira-board-refresh-btn"
						title="Reload tickets"
					>
						↻
					</button>
					{loading && <Spinner />}
				</div>
				<ul
					className="jira-columns"
					style={{ gridTemplateColumns: `repeat(${columns.length}, 19%)` }}
				>
					{columns.map((column, index) => (
						<JiraColumn
							column={column}
							tickets={tickets}
							startTimer={startTimer}
							board={board}
							assignee={assignee}
							key={index}
							columnTransitions={columnTransitions}
							fetchTickets={fetchTickets}
							notificationsList={notificationsList}
							setNotificationsList={setNotificationsList}
						/>
					))}
				</ul>
			</div>
		</DndProvider>
	);
};

export default JiraBoard;
