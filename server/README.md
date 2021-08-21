# Server

### Messages

#### Client messages

```json
{
    "action": "[NAME OF THE ACTION]",
    "data": {}
}
```

This messages depends  on the role of the player:

* `"action": "registerCode"` creates a game. The first player to enter the code will be the `codemaker` and the following the `codebreaker`.
* `"action": "feedback"` is send by the `codemaker` to give feedback about  the `codemaker`'s page selection. It has a key `"feedback": [] ` inside the key data for this purpose.
* `"action": "startGame"` is send by the `codemaker` indicate to the `codebreaker` that she can start to guess the code.
* `"action": "requestFeedback"` is send by the `codebreaker` to ask for feedback. The key inside data `"pegs": []` to perform correctly this action.

#### Server messages

```json
{
    "messageType": "[MESSAGE TYPE]",
    "data": {}
}
```

* `"messageType": "connection"` informs to the `codemaker` that the `codebreaker` has entered to the game.
* `"messageType": "disconnection"` informs to a player that her opponent has just left the game before finish.
* `"messageType": "role"` informs to the player which role is assigned to her. Inside data, it returns `"role": "[NAME OF THE ROLE]"`.
* `"messageType": "ready"` informs to the `codebreaker` that she can begin to guess the secret code.
* `"messageType": "fullGame"` informs the player the code he has entered has been already used by two players.