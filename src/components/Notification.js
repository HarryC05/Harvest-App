import {CloseIcon} from './icons'

const Notification = ({notification, notificationsList, setNotificationsList, index}) => {
	// If a disappear time is specified, set a timeout to remove the notification
	if (notification.disappearTime) {
		setTimeout(() => {
			const newNotificationsList = [...notificationsList];
			newNotificationsList.splice(index, 1);
			setNotificationsList(newNotificationsList);
		} , notification.disappearTime);
	}

	return (
		<div id={notification.id} className={`notification notification-${notification.type}`}>
			<p className="notification-message">
				<span className="notification-icon">
					{notification.type === 'success' && '✓' }
					{notification.type === 'error' && '✗' }
					{notification.type === 'warning' && '⚠' }
					{notification.type === 'info' && 'ℹ' }
				</span>
				{notification.message}
			</p>
			<button onClick={() => {
				const newNotificationsList = [...notificationsList];
				newNotificationsList.splice(index, 1);
				setNotificationsList(newNotificationsList);
			}}>
				<CloseIcon />
			</button>
		</div>
	);
}

export default Notification;
