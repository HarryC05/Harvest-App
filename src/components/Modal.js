import { CloseIcon } from './icons';

/**
 * Modal component
 *
 * @param {object}   props           - The props
 * @param {object}   props.children  - The children of the modal
 * @param {boolean}  props.isOpen    - Whether the modal is open or not
 * @param {Function} props.onClose   - The function to call when the modal is closed
 * @param {string}   props.className - The class name of the
 * @param {string}   props.title     - The title of the modal
 *
 * @returns {JSX.Element} - The modal view element
 */
const Modal = ({ children, isOpen, onClose, className = '', title = '' }) => {
	// Prevent the background from scrolling when the modal is open
	if (isOpen) {
		document.body.style.overflow = 'hidden';
	} else {
		document.body.style.overflow = 'auto';
	}

	if (!isOpen) {
		return null;
	}

	// Listen for the escape key to close the modal
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			onClose();
		}
	});

	return (
		<div
			className="modal"
			onClick={(e) => e.target.classList.contains('modal') && onClose()}
		>
			<div className={`modal-content ${className}`}>
				<div className="modal-header">
					<h2>{title}</h2>
					<button onClick={onClose}>
						<CloseIcon />
					</button>
				</div>
				<div className="modal-body">{children}</div>
			</div>
		</div>
	);
};

export default Modal;
