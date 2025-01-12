import { CloseIcon } from './icons';

/**
 * The Notification component
 *
 * @param {object}   props                      - The props object
 * @param {object}   props.notification         - The notification object
 * @param {Array}    props.notificationsList    - The list of notifications
 * @param {Function} props.setNotificationsList - The function to set the notifications list
 * @param {number}   props.key                  - The key of the notification in the list
 *
 * @returns {JSX.Element} - The Notification component
 */
const Notification = ({
	notification,
	notificationsList,
	setNotificationsList,
	key,
}) => {
	// If a disappear time is specified, set a timeout to remove the notification
	if (notification.disappearTime) {
		setTimeout(() => {
			const newNotificationsList = [...notificationsList];
			newNotificationsList.splice(key, 1);
			setNotificationsList(newNotificationsList);
		}, notification.disappearTime);
	}

	return (
		<div
			id={notification.id}
			className={`notification notification-${notification.type}`}
		>
			<p className="notification-message">
				<span className="notification-icon">
					{notification.type === 'success' && '✓'}
					{notification.type === 'error' && '✗'}
					{notification.type === 'warning' && '⚠'}
					{notification.type === 'info' && 'ℹ'}
				</span>
				{notification.message}
			</p>
			<button
				onClick={() => {
					const newNotificationsList = [...notificationsList];
					newNotificationsList.splice(key, 1);
					setNotificationsList(newNotificationsList);
				}}
			>
				<CloseIcon />
			</button>
		</div>
	);
};

export default Notification;
