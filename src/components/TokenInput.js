import { ShowPasswordIcon, HidePasswordIcon } from './icons';

/**
 * The TokenInput component
 *
 * @param {object}   props              - The props object
 * @param {string}   props.showToken    - The token visibility
 * @param {string}   props.defaultValue - The default value
 * @param {Function} props.setShowToken - The function to set the token visibility
 * @param {string}   props.id           - The id
 * @param {number}   props.size         - The size
 *
 * @returns {JSX.Element} - The TokenInput component
 */
const TokenInput = ({
	showToken,
	defaultValue,
	setShowToken,
	id,
	size = null,
}) => (
	<div className="token-input">
		<input
			type={showToken}
			className="token-input-field"
			id={id}
			defaultValue={defaultValue}
			size={size}
		/>
		<button
			className="show-token"
			onClick={() => {
				setShowToken(showToken === 'password' ? 'text' : 'password');
			}}
		>
			{
				/* show eye symbols for show and hide */
				showToken === 'password' ? <ShowPasswordIcon /> : <HidePasswordIcon />
			}
		</button>
	</div>
);

export default TokenInput;
