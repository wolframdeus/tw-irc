# tw-irc
Here is a library that handles connection to Twitch IRC. It allows you to join
or leave channels, detect and send new messages and other.

We expect, you are using TypeScript, because some error protection mechanism
inside this library are based on TypeScript typings restrictions.

## Documentation
### Create client
Library contains a client, that connects to Twitch IRC. Here is an example
to create an instance of this client:
```javascript
import { Client } from 'twitch-irc';

// Create anonymous client
const client = new Client();

// Create client with authentication. It will allow us to send messages.
const authenticatedClient = new Client({
  auth: {
    login: '...', // your login
    password: '...', // get it here: https://twitchapps.com/tmi/
  },
});
```

### Connect client to IRC
After client is created, we have to initialize socket connection to Twitch
IRC. It will create an instance of WebSocket which will try to reconnect to
IRC. After `connect()` is called, previous WebSocket is being disconnected
and other instance of WebSocket will be created. Remember, that all previously
bound events to old socket will disappear, so, you will have to rebind them.
```javascript
// Create websocket connection to IRC
client.connect();
```

## Events
Client supports 2 types of events - WebSocket events 
("message", "open", "close", "error") and IRC events.

### WebSocket events
These events are directly bound to created WebSocket after `connect()`:
```javascript
client.onWebSocket('message', event => {
  console.log('Some message event ocurred', event);
});
```
Make sure, you are binding events only after `connect()` was firstly called.
Otherwise, an error will occur.

The second thing you have to know is you should not use client commands like
`ban`, `say` and other before the connection was successfully established. You
can detect its existence adding event `open` to socket connection.

### IRC events
Library contains special enum `EIRCCommand` which allows you to use
dictionary instead of raw texts. Here is an example of binding listener
to IRC command.
```javascript
import { EIRCCommand } from 'twitch-irc';

// Firstly, we have to join some channel
client.channels.join('dreadztv');

// Bind event to listen to PRIVMSG event
client.on(EIRCCommand.Message, data => {
  const { channel, message, user, userInfo } = data;
  
  // "user" said "message" in "channel"
  console.log(userInfo, `#${channel} - ${user}: ${message}`);
});
```  

### Custom handling
If you want full control over the messages coming from IRC, you can use
this trick:
```javascript
import { parseIRCMessage, prepareIRCMessage } from 'twitch-irc/utils';

client.onWebSocket('message', event => {
  // Convert raw socket message to array of messages. We need this action
  // because commands can be concatenated in one message and doing this,
  // we just detect them.
  const messages = prepareIRCMessage(event.data);
  
  // Here we get an array of objects with params:
  // prefix: {
  //    nickName: string | null;
  //    user: string | null;
  //    host: string;
  // } | null;
  // meta: Record<string, string | string[] | number | number[] | null> | null;
  // parameters: string[] | null;
  // command: EIRCCommand | string;
  // data: string;
  // raw: string;
  const parsedMessages = messages.map(parseIRCMessage);
  
  // You can react however you want after all of messages are parsed.
});
```
