# Harvest App

Harvest App allows you to manage and track time efficiently with a clean user interface that integrates seamlessly with Jira. With just one click, start and stop timers for your Jira tasks, ensuring accurate time logging across multiple projects.

- [Harvest App](#harvest-app)
	- [Installation](#installation)
	- [Setup](#setup)
	- [Usage](#usage)
		- [Basic](#basic)
		- [Jira Integration](#jira-integration)
	- [Contributing](#contributing)


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

1. Create a Harvest API token and account ID:
   - Generate them [here](https://id.getharvest.com/oauth2/access_tokens/new)
   - Enter the Harvest API Token and Harvest Account ID into the settings view (click the settings button).
2. Enable Jira integration (optional):
   - Create Jira API key [here](https://id.atlassian.com/manage-profile/security/api-tokens).
   - Go to settings and click Add Profile. Fill in all the fields:
     - Profile Name: A nickname for this profile.
     - Jira URL: The root URL of your Jira workspace (e.g. `https://{workspace}.atlassian.net/`).
     - Jira Email: The email associated with your Jira account.
     - Jira API Token: Use the token created earlier.
   - Repeat these steps for each Jira workspace you want to add.
3. Link Jira Projects to Harvest Projects:
   - Navigate to the `Harvest Projects` section in settings.
   - Next to each Harvest project, use the pillbox input to search for and link a Jira project.
4. Configure Jira Boards:
   - Click the `Configure Jira Project` button next to each Harvest project.
   - Assign timers to columns for all boards associated with the project.
   - For example, map "In Progress" to the development timer task in Harvest.

## Usage

### Basic

To manage your Harvest timers:

1. Add your Harvest API Token and Harvest Account ID in the settings view.
2. Once configured, you’ll see a list of your Harvest projects on the home view (click the back arrow). Select a project to view its tasks.
3. Start or stop timers by clicking on any task.

### Jira Integration

Enhance functionality by integrating Jira with Harvest

1. Create a Jira API token and configure a profile in the settings view, as described in the setup section.
2. Link Jira projects to Harvest projects in the settings view.
3. Configure each Jira board by assigning column types to timers.
4. Access your linked Jira boards from the project view:
5. Tabs will display each Jira board for the active sprint.
6. Hover over a Jira ticket to reveal a stopwatch button (`⏱`). Clicking it starts a timer in Harvest, formatted as `{Ticket ID}: {Ticket Title}`.

## Contributing

To get started contributing:

1. Create a new branch:
```sh
git checkout -b feature/your-feature-name
```

2. Commit your changes (using [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) format):
```sh
git commit -m 'feat: Add some feature'
```

3. Push to the branch:
```sh
git push origin feature/your-feature-name
```

4. Open a pull request.
