# Harvest App

Harvest App allows you to manage and track time efficiently with a clean user interface that integrates seamlessly with Jira. With just one click, start and stop timers for your Jira tasks, ensuring accurate time logging across multiple projects.

- [Harvest App](#harvest-app)
	- [Installation](#installation)
	- [Setup](#setup)
	- [Usage](#usage)
		- [Basic](#basic)
		- [Jira Integration](#jira-integration)
	- [Contributing](#contributing)
	- [License](#license)


## Installation

1. Clone the plugin:
    ```sh
    git clone git@github.com:HarryC05/Harvest-App.git
    ```
2. Navigate to the project directory:
    ```sh
    cd Harvest-App
    ```
3. Install the packages:
    ```sh
    yarn
    ```
4. Start the development server:
    ```sh
    yarn start
    ```
5. Open the site in your browser at [`https://localhost:3000`](https://localhost:3000).


## Setup

1. Create a Harvest API token and account ID [here](https://id.getharvest.com/oauth2/access_tokens/new).
2. Create a Jira API key [here](https://id.atlassian.com/manage-profile/security/api-tokens).
3. Input the following on the settings view to get started.
   - **Harvest API Token** (required)
   - **Harvest Account ID** (required)
   - **Jira API Token** (optional)
   - **Jira Email** (optional) – The email associated with your Jira account
   - **Jira URL** (optional) – The root URL of your Jira workspace (e.g. https://{workspace}.atlassian.net/)


## Usage

### Basic

You can use this app for just managing your harvest timers, simply add your Harvest API Token and Harvest Account ID to the settings view which you will be prompted to go to if you haven't already.

Once your settings are configured, you'll see a list of your Harvest projects. Clicking on a project will take you to its tasks, where you can start or stop a timer by clicking on any task.

Inside the project view, you can click on any of the tasks to start a timer for that task, and click it again to end the task.


### Jira Integration

You can also add Jira integration to this app which will allow you to link a Jira board to a Harvest project.

To link Jira with Harvest, create a Jira API token (create it [here](https://id.atlassian.com/manage-profile/security/api-tokens)) and enter it in the settings view. Add your Jira email and the root URL of your Jira workspace.

Once these settings are saved, the Projects section will display a dropdown with all your Jira boards. You can then associate each Jira board with a Harvest project. After linking a board, you'll see a `Configure Jira Project` button. Click this to assign each column from the Jira board to a corresponding Harvest task.

You will then need to add your email which is linked to your Jira account to the Jira Email input, and the root URL of your Jira Workspace to the Jira URL input.

Once these settings are filled in, you will see the Projects section of the settings view becomes populated with a dropdown selector with all the Jira boards you are able to view. You can then select which Jira board is associated with which Harvest project.

When a board is linked with a project, a `Configure Jira Project` button will appear, once clicked, you will be taken to the project configuration view.

Inside the project configuration view, you will be able to assign each column from a Jira board a harvest task from the dropdown selector, e.g. you can link the In Progress column with the development jira task meaning that when you start a timer for a Jira task inside the In Progress column it will assign the task development to the Harvest timer.

Once you have configured your jira board click save and then you can click the back arrow and configure your other boards.

When all your boards are configure, you will now be able to click into a project from the home screen and once inside the project view, you will see your jira tasks below your harvest tasks. Once you click a Jira task a Harvest timer will start, with a comment which is formatted as `{Ticket ID}: {Ticket Title}` you can then click it again to stop the timer.


## Contributing

1. Create a new branch (`git checkout -b feature/your-feature-name`).
2. Commit your changes (`git commit -m 'Add some feature'`).
3. Push to the branch (`git push origin feature/your-feature-name`).
4. Open a pull request.


## License

This project is licensed under the MIT License.
