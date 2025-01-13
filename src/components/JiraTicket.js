import { useDrag } from 'react-dnd';

import { UnassignedIcon } from './icons';

/**
 * JiraTicket component
 *
 * @param {object}   props            - The props object
 * @param {object}   props.ticket     - The object containing the ticket data
 * @param {number}   props.key        - The key for the ticket
 * @param {Function} props.startTimer - The function to start the timer
 * @param {object}   props.column     - The column object
 * @param {object}   props.board      - The board object
 *
 * @returns {JSX.Element} - The JiraTicket component
 */
const JiraTicket = ({ ticket, key, startTimer, column, board }) => {
	const jiraConfig =
		JSON.parse(localStorage.getItem('linkedHarvestTasks'))?.[
			`${board.name}-${board.id}`
		] || {};

	const [{ isDragging }, drag] = useDrag(() => ({
		type: 'TICKET',
		item: { ticket, column },
		// eslint-disable-next-line jsdoc/require-jsdoc
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging(),
		}),
	}));

	/**
	 * Handle the timer button click
	 *
	 * @returns {void}
	 */
	const onTimerClick = () => {
		const id = jiraConfig?.[column.name] || null;

		if (!id) {
			return;
		}

		startTimer(
			{
				task: { id },
			},
			`${ticket.key}: ${ticket.fields.summary}`,
			true
		);
	};

	return (
		<li
			key={key}
			className="jira-ticket-card"
			ref={drag}
			style={{
				opacity: isDragging ? 0.5 : 1,
				cursor: 'move',
			}}
		>
			<button
				className="jira-ticket-timerBtn"
				title="Start Timer"
				onClick={onTimerClick}
			>
				⏱
			</button>
			<span className="jira-ticket-key">{ticket.key}</span>
			<h5 className="jira-ticket-title">{ticket.fields.summary}</h5>
			<div className="jira-ticket-footer">
				<span className="jira-ticket-assignee">
					{ticket.fields.assignee?.displayName ? (
						<img
							src={ticket.fields.assignee?.avatarUrls['48x48']}
							alt={ticket.fields.assignee?.displayName}
						/>
					) : (
						<UnassignedIcon />
					)}

					{ticket.fields.assignee?.displayName || 'Unassigned'}
				</span>
				<span
					className={`jira-ticket-priority jira-priority-${ticket.fields.priority.id}`}
				>
					{ticket.fields.priority.id === '1' && '«'}
					{ticket.fields.priority.id === '2' && '‹'}
					{ticket.fields.priority.id === '3' && '᱿'}
					{ticket.fields.priority.id === '4' && '›'}
					{ticket.fields.priority.id === '5' && '»'}
				</span>
			</div>
		</li>
	);
};

export default JiraTicket;
