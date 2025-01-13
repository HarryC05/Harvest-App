import { useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';

import JiraTicket from './JiraTicket';
import { postMoveTicket } from '../utils/api';

/**
 * The Jira Column component
 *
 * @param {object}   props                      - The props object
 * @param {object}   props.column               - The object containing the column data
 * @param {Array}    props.tickets              - The list of tickets
 * @param {Function} props.startTimer           - The function to start the timer
 * @param {object}   props.board                - The board object
 * @param {string}   props.assignee             - The assignee filter
 * @param {number}   props.key                  - The key of the column
 * @param {Array}    props.columnTransitions    - The list of column transitions
 * @param {Function} props.fetchTickets         - The function to fetch the tickets
 * @param {Array}    props.notificationsList    - The list of notifications
 * @param {Function} props.setNotificationsList - The function to set the notifications list
 *
 * @returns {JSX.Element} - The Jira Column component
 */
const JiraColumn = ({
	column,
	tickets,
	startTimer,
	board,
	assignee,
	key,
	columnTransitions,
	fetchTickets,
	notificationsList,
	setNotificationsList,
}) => {
	const columnTransitionsRef = useRef(columnTransitions);
	/**
	 *
	 * @param {object} ticket - The ticket to move
	 * @param {object} column - The column to move the ticket to
	 *
	 * @returns {void}
	 */
	const moveTicket = async (ticket, column) => {
		if (!columnTransitionsRef.current.length) {
			setNotificationsList([
				...notificationsList,
				{
					type: 'error',
					message: `Error moving ticket ${ticket.key} no transitions found`,
					id: 'error-moving-ticket',
					disappearTime: 3000,
				},
			]);
			return;
		}

		if (ticket.fields.status.id === column.statuses[0].id) {
			return;
		}

		const transition = columnTransitionsRef.current.find(
			(transition) => transition.to.id === column.statuses[0].id
		);

		if (!transition) {
			setNotificationsList([
				...notificationsList,
				{
					type: 'error',
					message: `Error moving ticket ${ticket.key} transition not found`,
					id: 'error-moving-ticket',
					disappearTime: 3000,
				},
			]);
			return;
		}

		const response = await postMoveTicket(ticket.id, transition.id, board.info);

		if (!response.ok) {
			setNotificationsList([
				...notificationsList,
				{
					type: 'error',
					message: `Error moving ticket ${ticket.key}`,
					id: 'error-moving-ticket',
					disappearTime: 3000,
				},
			]);
			return;
		}

		await fetchTickets();
	};

	const [{ isOver }, drop] = useDrop(() => ({
		accept: 'TICKET',
		drop: (item) => moveTicket(item.ticket, column), // eslint-disable-line jsdoc/require-jsdoc
		// eslint-disable-next-line jsdoc/require-jsdoc
		collect: (monitor) => ({
			isOver: !!monitor.isOver(),
		}),
	}));

	useEffect(() => {
		columnTransitionsRef.current = columnTransitions;
	}, [columnTransitions]);

	return (
		<li
			key={key}
			className={`jira-column ${isOver ? 'is-over' : ''}`}
			ref={drop}
		>
			<h4>{column.name}</h4>
			<ul className="jira-tickets">
				{tickets
					.filter(
						(ticket) =>
							assignee === 'all' ||
							ticket.fields.assignee?.emailAddress === assignee ||
							(assignee === 'unassigned' && !ticket.fields.assignee)
					)
					.filter((ticket) =>
						column.statuses.some(
							(status) => status.id === ticket.fields.status.id
						)
					)
					.map((ticket, i) => (
						<JiraTicket
							key={i}
							ticket={ticket}
							startTimer={startTimer}
							column={column}
							board={board}
						/>
					))}
			</ul>
		</li>
	);
};

export default JiraColumn;
