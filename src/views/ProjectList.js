import { useState } from 'react';

/**
 * The view element to display all the Harvest projects
 *
 * @param {object}   props                    - The props object
 * @param {array}    props.projects           - The array of Harvest projects
 * @param {function} props.setSelectedProject - The function to set the selected project
 * @param {function} props.setCurrentView     - The function to set the current view
 * @param {function} props.setPreviousView    - The function to set the previous view (used for the back button)
 *
 * @returns {JSX.Element}
 */
const ProjectList = ( { projects, setSelectedProject, setCurrentView, setPreviousView } ) => {
	const [ favourites, setFavourites ] = useState(JSON.parse(localStorage.getItem('favourites')) || []);

	/**
	 * Favourite a project
	 *
	 * @param {number} id - The id of the project to favourite
	 *
	 * @returns {void}
	 */
	const favourite = (id) => {
		let favs = JSON.parse(localStorage.getItem('favourites')) || [];
		if (favs.includes(id)) {
			favs = favs.filter(fav => fav !== id);
		} else {
			favs.push(id);
		}
		localStorage.setItem('favourites', JSON.stringify(favs));
		setFavourites(favs);
	}

	return (
		<div>
			<div className="heading">
				<h1>Projects</h1>
				<button
					onClick={() => {
						setCurrentView('settings');
						setPreviousView('projectList');
					}}
				>
					⚙
				</button>
			</div>
			{favourites.length > 0 && (
				<>
					<h2>Favourites</h2>
					<ul className='projects-wrapper'>
						{favourites.map((fav) => {
							const project = projects.find(project => project.project.id === fav);
							return (
								<li
									key={project.project.id}
									className='project'
								>
									<button
										className="project-button"
										onClick={() => {
											setSelectedProject(project);
											setCurrentView('project');
										}}
									>
										{project.project.name}
									</button>
									<button
										className="fav-button"
										onClick={() => favourite(project.project.id)}
									>
										★
									</button>
								</li>
							)
						})}
					</ul>
					<hr/>
				</>
			)}
			<ul className='projects-wrapper'>
				{projects.map((project) => {
					if (favourites.includes(project.project.id)) {
						return null;
					}

					return (
						<li
							key={project.project.id}
							className='project'
						>
							<button
								className="project-button"
								onClick={() => {
									setSelectedProject(project);
									setCurrentView('project');
								}}
							>
								{project.project.name}
							</button>
							<button
								className="fav-button"
								onClick={() => favourite(project.project.id)}
							>☆</button>
						</li>
					)
				})}
			</ul>
		</div>
	)
}

export default ProjectList;
