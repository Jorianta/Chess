# Chess
A discord bot for a personal server.
Much of the boilerplate for this bot (and this ReadMe) is heavily based upon the [Lospec Discord Bot](https://github.com/lospec/lospec-bot-v4)

## Setup

#### Requirements:
* nodeJS v11.6
* npm
* git

### Setting up your development environment

1. [Fork](https://guides.github.com/activities/forking/#fork) this project on Github
2. Locally [clone](https://guides.github.com/activities/forking/#clone) from your fork.
3. In a the project working directory run `npm install` to download the required nodeJS modules

4. ### Creating a Discord application

Make sure you have a discord set-up where you have admin permissions before following these steps
1. Enter the [Discord Developer Portal](https://discord.com/developers/applications) and create a `New Application`. This will be your testing application.
2. With the Application created, select the `Bot` tab from the left panel. Choose `Add bot`.
3. Under the username, there will be a section labelled `token`, this contains the secret token to be added to `CONFIG.json`. Do not share or commit it!
4. Replace `DISCORD_TOKEN` in the following snippet and save it as `CONFIG.json` in the project working directory:   
```json
{
  "token": "DISCORD_TOKEN"
}
```
5. To invite your bot to your development server, go back to the `General Infomration` tab and note down the `Client ID`. Replace `CLIENT_ID` in the following URL with that number and visit it in your browser:   
`https://discord.com/oauth2/authorize?client_id=CLIENT_ID&scope=bot`
6. Follow through the instructions in the web browser and add your bot to your development server.

7. ### Running the bot
To run the bot, access the project working directory in a terminal and run `npm start`. 

8. ### Database
The bot by default looks for an SQL server at localhost:3306. If you have Mysql, Mariadb, etc. listening there it will automatically create the required database and tables (though you may have to edit data.ts if you have a specific user and password you'd like to use.). If you have some other host, set the following key to it's name/ip in CONFIG.json:
```json
{
  "dbHost": "SOME_PLACE_THAT_IS_NOT_LOCALHOST"
}
```

9. ### Contribution

## Commands

Create a command that users can trigger

Add a file to the `./commands` folder with the following exports:
- `config` - an object containing the JSON configuration for a command
- `execute` - an async function that is called when the function is run (passes interaction as first argument)
