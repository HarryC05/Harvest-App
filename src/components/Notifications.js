import Notification from './Notification';

/**
 * The Notifications component
 *
 * @param {object}   props                      - The props object
 * @param {Array}    props.notificationsList    - The list of notifications
 * @param {Function} props.setNotificationsList - The function to set the notifications list
 *
 * @returns {JSX.Element} - The Notifications component
 */
const Notifications = ({ notificationsList, setNotificationsList }) => (
	<div className="notifications">
		{notificationsList.map((notification, index) => (
			<Notification
				notification={notification}
				notificationsList={notificationsList}
				setNotificationsList={setNotificationsList}
				key={index}
			/>
		))}
	</div>
);

export default Notifications;
