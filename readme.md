# TF2 Notify Bot
A simple discord bot that sends a message when a Comp TF2 Stream goes live.

## Running
First, copy `config-template.json` into a new file `config.json.`

Next, Set the following values to the correct ones in `config.json`:

`token` should be your discord bot token.

`mongo` should be the connection URL to a mongodb database.

`twitch` should be the client secret for your Twitch Application.

Then, run `npm i` to install the dependancies required for the app.

Finally, run `npm run test` to start the application.

> If you want to actually deploy the application, run the following 2 commands instead:
> 
> `npm run build`
> 
> `npm run run`
