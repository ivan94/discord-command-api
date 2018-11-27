# Discord Commands
A simple architecture for the commands of a discord bot

![Build Status](https://travis-ci.org/ivan94/discord-command-api.svg)
![Version](https://img.shields.io/npm/v/discord-command-api.svg)
![NPM downloads](https://img.shields.io/npm/dt/discord-command-api.svg)
![Dependencies](https://david-dm.org/ivan94/discord-command-api.svg)


## Development Notice
This package is still under active development, so keep in mind that until 1.0.0 is released the api is subject to change in any release.

## Getting Started
The api revolves around extending the Command class and running the CommandPool

### Creating Commands

Installation: `npm i discord-command-api -s`

Creating commands is as simple as extending the Command class and implementing both ```signature()``` and ```execute()``` methods.

#### Examples
* Using Javascript
```javascript
var { Command, ArgType } = require('discord-command-api');

class MyCommand extends Command {
    // The parent constructor must receive the command keyword
    // Keyword is the word following a marker used to trigger the command (ex: !command)
    constructor() {super('command')}

    // Required implementation
    // Return an array of objects describing each argument 
    // your command expects
    // if your command don't expect argument simply return an empty array
    signature() {
        return [
            {
                name: "arg1", //Required: name of your argument
                type: ArgType.STRING, //Required: Type of your argument (Supported: string, number and boolean)
                description: "The first argument" //Optional: a description for help message generation
            }
        ]
    }
    
    // Required implementation
    // Execute receives two parameters
    // An object containing your arguments, already cast to the correct type
    // An optional reference object, possibly with your discord bot client for sending responses, or any data you want
    execute({arg1}, ref) {
        //Your command code
    }

    // Optional implementation
    // Return an description string for help message generation
    description() {
        return "Do awesome stuff";
    }
}

```
* Using Typescript
```typescript
import { Command, ArgType, ArgSignature } from 'discord-command-api';

class MyCommand extends Command<object> {
    // The parent constructor must receive the command keyword
    // Keyword is the word following a marker used to trigger the command (ex: !command)
    constructor() {super('command')}

    // Required implementation
    // Return an array of objects describing each argument 
    // your command expects
    // if your command don't expect argument simply return an empty array
    signature(): ArgSignature[] {
        return [
            {
                name: "arg1", //Required: name of your argument
                type: ArgType.STRING, //Required: Type of your argument (Supported: string, number and boolean)
                description: "The first argument" //Optional: a description for help message generation
            }
        ]
    }
    
    // Required implementation
    // Execute receives two parameters
    // An object containing your arguments, already cast to the correct type
    // An optional reference object, possibly with your discord bot client for sending responses, or any data you want
    execute({arg1}: {arg1: string}, ref: object): void {
        //Your command code
    }

    // Optional implementation
    // Return an description string for help message generation
    description(): string {
        return "Do awesome stuff";
    }
}
```
### Running the CommandPool
To process and run your commands, you have create an instance of the CommandPool class, registering your commands and parsing incoming messages for execution

#### Examples
* Using Javascript
```javascript
let { CommandPool } = require('discord-command-api');

// Creating a new instance, passing a list of markers as argument
// A marker is a set of characters that appears in the beginning of the message to indicate the message is a command
// Ex: !command (! marker)
let pool = new CommandPool(["!"]);

// Register every class that extends Command you want to use in the application
pool.register(new MyCommand);

// On each message received, pass the message content to the runFromMessage function, along with your payload
// If the message doesn't start with the marker runFromMessage will return silently
try {
    pool.runFromMessage(message.content, message);
} catch (error) {
    //An error is thrown if the passed arguments don't meet the command signature
}
```
* Using Typescript
```typescript
import { CommandPool } from 'discord-command-api';

// Creating a new instance, passing a list of markers as argument
// A marker is a set of characters that appears in the beginning of the message to indicate the message is a command
// Ex: !command (! marker)
// Use the generic to specify the ref type
let pool = new CommandPool<DiscordMessage>(["!"]);

// Register every class that extends Command you want to use in the application
pool.register(new MyCommand);

// On each message received, pass the message content to the runFromMessage function, along with your payload
// If the message doesn't start with the marker runFromMessage will return silently
try{
    pool.runFromMessage(message.content, message);
} catch(error) {
    //An error is thrown if the passed arguments don't meet the command signature
}
```

## Contributing
You are welcome to for the repo and send pull requests with any bug fixes or features you like, but please make sure to:
1. Build and generete docs before you send using `npm run build` and `npm run typedoc`
2. Run tests using `npm run test`
3. Explain your changes the best you can in the pull request.
