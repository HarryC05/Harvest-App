import { useState } from 'react';

/**
 * PillBox component
 *
 * @param {mixed} param0 Props
 * @param {array} param0.suggestions List of suggestions
 * @param {function} param0.onChange Function to call when the value changes
 * @param {array} param0.selected Selected tags
 *
 * @returns JSX.Element
 */
const PillBox = ( { suggestions = [], onChange, selected = [] } ) => {
	const [tags, setTags] = useState([ ...selected ]);
	const [inputValue, setInputValue] = useState('');
	const [filteredSuggestions, setFilteredSuggestions] = useState([]);

	// Handle input change
	const handleInputChange = (e) => {
		const value = e.target.value;
		setInputValue(value);

		if (value) {
			const filtered = suggestions.filter(
				(suggestion) =>
					suggestion.toLowerCase().includes(value.toLowerCase()) && !tags.includes(suggestion)
			);
			setFilteredSuggestions(filtered);
		} else {
			setFilteredSuggestions([]);
		}
	};

	// Add a new tag
	const addTag = (tag) => {
		if ( !tags.includes(tag) ) {
			const newTags = [...tags, tag];
			setTags(newTags);
			setInputValue('');
			setFilteredSuggestions([]);

			if (onChange) {
				onChange(newTags);
			}
		}
	};

	// Remove a tag
	const removeTag = (tagToRemove) => {
		const newTags = tags.filter((tag) => tag !== tagToRemove);
		setTags(newTags);

		if (onChange) {
			onChange(newTags);
		}
	};

	// Handle click on autocomplete suggestion
	const handleSuggestionClick = (suggestion) => {
		addTag(suggestion);
	};

	console.log(filteredSuggestions);

	return (
		<div className="pillbox-container">
			<div className="pillbox-inputs">
				<div className="pillbox-pills">
				{tags.map((tag) => (
					<div
						className="pillbox-pill"
						key={tag}
					>
						<span>{tag}</span>
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
							key={suggestion}
							onClick={() => handleSuggestionClick(suggestion)}
						>
							{suggestion}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export default PillBox;
