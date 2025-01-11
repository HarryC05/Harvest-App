import { UnassignedIcon } from "./icons";

/**
 * JiraTicket component
 *
 * @param {object}   props        - The props object
 * @param {object}   props.ticket - The object containing the ticket data
 * @param {number}   props.key    - The key for the ticket
 * @param {function} startTimer   - The function to start the timer
 * @param {object}   column       - The column object
 * @param {object}   board        - The board object
 *
 * @returns {JSX.Element}
 */
const JiraTicket = ({
	ticket,
	key,
	startTimer,
	column,
	board,
}) => {
	const jiraConfig = JSON.parse(localStorage.getItem('linkedHarvestTasks'))?.[`${board.name}-${board.id}`] || {};

	return (
		<li key={key} className="jira-ticket-card">
			<button
				className="jira-ticket-timerBtn"
				title="Start Timer"
				onClick={() => {
					const id = jiraConfig?.[column.name] || null;

					if ( ! id ) {
						return;
					}

					startTimer(
						{
							task: { id }
						},
						`${ticket.key}: ${ticket.fields.summary}`
					)
				}}
			>
				⏱
			</button>
			<span className="jira-ticket-key">{ticket.key}</span>
			<h5 className="jira-ticket-title">{ticket.fields.summary}</h5>
			<div className='jira-ticket-footer'>
				<span className='jira-ticket-assignee'>
					{
						ticket.fields.assignee?.displayName
						? <img src={ticket.fields.assignee?.avatarUrls['48x48']} alt={ticket.fields.assignee?.displayName} />
						: <UnassignedIcon />
					}

					{ticket.fields.assignee?.displayName || 'Unassigned'}
				</span>
				<span className={`jira-ticket-priority jira-priority-${ticket.fields.priority.id}`}>
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
