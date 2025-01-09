import Notification from './Notification';

/**
 * The Notifications component
 *
 * @param {object}   props                      - The props object
 * @param {array}    props.notificationsList    - The list of notifications
 * @param {function} props.setNotificationsList - The function to set the notifications list
 *
 * @returns {JSX.Element}
 */
const Notifications = ( { notificationsList, setNotificationsList } ) => (
	<div className="notifications">
		{notificationsList.map((notification, index) => (
			<Notification
				notification={notification}
				notificationsList={notificationsList}
				setNotificationsList={setNotificationsList}
				index={index}
			/>
		))}
	</div>
);

export default Notifications;
