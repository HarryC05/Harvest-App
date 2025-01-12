import { useState } from 'react';

/**
 * PillBox component
 *
 * @param {object}   props             - Props
 * @param {Array}    props.suggestions - List of suggestions
 * @param {Function} props.onChange    - Function to call when the value changes
 * @param {Array}    props.selected    - Selected tags
 *
 * @returns {JSX.Element} - The PillBox component
 */
const PillBox = ({ suggestions = [], onChange, selected = [] }) => {
	const [tags, setTags] = useState([...selected]);
	const [inputValue, setInputValue] = useState('');
	const [filteredSuggestions, setFilteredSuggestions] = useState([]);

	/**
	 * Handle input change
	 *
	 * @param {event} e - The event object
	 *
	 * @returns {void}
	 */
	const handleInputChange = (e) => {
		const value = e.target.value;
		setInputValue(value);

		if (value) {
			const filtered = suggestions.filter(
				(suggestion) =>
					suggestion.value.toLowerCase().includes(value.toLowerCase()) &&
					!tags.includes(suggestion)
			);
			setFilteredSuggestions(filtered);
		} else {
			setFilteredSuggestions([]);
		}
	};

	/**
	 * Add a tag to the list
	 *
	 * @param {Array} tag - The tag to add
	 *
	 * @returns {void}
	 */
	const addTag = (tag) => {
		if (!tags.includes(tag)) {
			const newTags = [...tags, tag];
			setTags(newTags);
			setInputValue('');
			setFilteredSuggestions([]);

			if (onChange) {
				onChange(newTags);
			}
		}
	};

	/**
	 * Remove a tag from the list
	 *
	 * @param {object} tagToRemove - The tag to remove
	 *
	 * @returns {void}
	 */
	const removeTag = (tagToRemove) => {
		const newTags = tags.filter((tag) => tag !== tagToRemove);
		setTags(newTags);

		if (onChange) {
			onChange(newTags);
		}
	};

	return (
		<div className="pillbox-container">
			<div className="pillbox-inputs">
				<div className="pillbox-pills">
					{tags.map((tag) => (
						<div className="pillbox-pill" key={tag.uuid} title={tag.info}>
							<span>{tag.value}</span>
							<button onClick={() => removeTag(tag)}>x</button>
						</div>
					))}
				</div>
				<input
					type="text"
					value={inputValue}
					onChange={handleInputChange}
					placeholder="Start typing..."
				/>
			</div>
			{filteredSuggestions.length > 0 && (
				<ul className="pillbox-suggestions">
					{filteredSuggestions.map((suggestion) => (
						<li
							key={suggestion.uuid}
							onClick={() => addTag(suggestion)}
							title={suggestion.info}
						>
							{suggestion.value}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default PillBox;
