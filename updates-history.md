# Updates history
#### Release 2.0.0
`WARNING: BREAKING CHANGES`

##### Client
- `bindChannel` was replaced with `assignChannel.`

##### Events
- `Bugfix:` `Notice` listener now gets parameter `message`

##### Channels
- Mode-oriented fields were reworked. Their values were changed from
`{ on: function, off: function }` to `{ enable: function, disable: function }`
due to `on` and `off` look like events listening. Example:
```typescript
// Old
client.channels.followersOnly.on();

// New
client.channels.followersOnly.enable();
```
- `followersMode.enable` now is able to accept duration in minutes. This
time interval means how long should user follow the channel to say something
in chat. (`/followers 60` - if we want to allow to say something only
for users, who is following for 60 minutes at least)

##### Docs
- Added `API documentation` section

#### Release 1.1.6
`WARNING: BREAKING CHANGES`

This update is rather huge and breaks compatibility. Make sure,
you updated package and reworked your code a bit. There are
a lot of internal changes, but they should not touch external interface
too much.

##### Events
- `Join` listener reworked. It now contains additional join data 
about `channelId` and `roomUuid` if someone joined chat-room.
- `Message` listener reworked. It now contains additional message data.
- `ClearChat` listener ready. It detects chat clears and user bans.
- `ClearMessage` listener ready. It detects messages delete.
- `GlobalUserState` listener ready. On successful login, provides 
data about the current logged-in user through IRC tags. It is sent 
after successfully authenticating (sending a PASS/NICK command).
> You can use this listener to detect successful login.
- `Host` listener ready. It detects someone's host start and stop.
- `Reconnect` listener ready. It detects if IRC requested a
reconnect for you.
> Dont use it in case, you want to manually reconnect client. 
> `Socket` will do it for you automatically.
- `RoomState` listener ready. It is triggered when you join some
channel or channel changed its state (like mode change).
- `Notice` listener ready. Receive a general notice from the server.
---
- All listeners now have property `raw`, which contains raw message
from IRC. Notice, that this event listener will be triggered
only ON channel, that triggered HOST, not on channel which IS BEING
HOSTED (IRC does not detect it).
- `UserNotice` listener ready. Trigger specification:
https://dev.twitch.tv/docs/irc/tags#usernotice-twitch-tags
- `UserState` listener ready. Sends user-state data when a user joins a 
channel or sends a PRIVMSG to a channel.
- Constructor now accepts `login` as string additionally.
It is needed due to this repo should recognize, if event
is somehow connected with our client. It means, property
`isSelf` appeared in some listeners returned params.

##### Utils
- `sendRawMessage` was removed. Use `client.socket.send()` now instead.
- `sendCommand` was replaced with `sendSignal`.

##### Socket
- Now `Socket` detects if IRC requested a `RECONNECT` event, 
automatically reconnecting client.
- It is now responsible for requesting initial capabilities. Previously
`Client` did it.

##### Client
- Now **THROWS** error instead of warning user in case password is
invalid. The reason is developer can skip this message, having an unexpected 
behaviour, but client will work fine.
- Now has property `login`, which states currently used Twitch login
by client instance. This field is used by EventsRepository to detect
if called event is ours.

##### Other
- Temporarily removed API documentation. Will be added in `v1.2.0`.
- `EIRCCommand` was renamed to `ESignal` which has a bit more accurate name.
- Template like `moderator/5` (badge information) is now parsed like 
`{ name: "moderator", value: 5 }`. This template can appear in message
event (`ESignal.Message`)
- Template like `Kappa:2-5,29-30` (emotes information) is now parsed like
`{ emoteId: "Kappa", ranges: [{ from: 2, to: 5 }, { from: 29, to: 30 }]}`
- `prepareIRCMessage`'s result field `command` was replaced with `signal`.

#### Release 1.1.5
- Added huge amount of docs
- Added implementation interfaces for classes
- Added warning if password is incorrect (starting not with `oauth:`)
- Reworked `prepareIRCMessage`. It checks if the last letter was `\n`, method 
removes it and split by `\n`.
- Socket is now responsible for keeping a connection alive via responding 
with `PONG` message in server's `PING`.