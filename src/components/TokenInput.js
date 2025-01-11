import { ShowPasswordIcon, HidePasswordIcon } from "./icons";

/**
 * The TokenInput component
 *
 * @param {object} props - The props object
 *
 * @returns {JSX.Element}
 */
const TokenInput = ( {
	showToken,
	defaultValue,
	setShowToken,
	id,
	size = null,
} ) => (
	<div className='token-input'>
		<input
			type={showToken}
			className="token-input-field"
			id={id}
			defaultValue={defaultValue}
			size={size} />
		<button
			className='show-token'
			onClick={() => {
				setShowToken(showToken === 'password' ? 'text' : 'password');
			}}
		>
			{ /* show eye symbols for show and hide */
				showToken === 'password' ? <ShowPasswordIcon /> : <HidePasswordIcon />
			}
		</button>
	</div>
);

export default TokenInput;
