import Notification from './Notification';

const Notifications = ( { notificationsList, setNotificationsList } ) => {

	return (
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
};

export default Notifications;
