import { UnassignedIcon } from "./icons";

const JiraTicket = ({ ticket, key }) => {
	return (
		<li key={key} className="jira-ticket-card">
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
