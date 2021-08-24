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
* `"action": "startGame"` is send by the `codemaker` indicate to the `codebreaker` that she can start to guess the code.
* `"action": "play"` is send by a player to make her play. The `codebreaker` send her pegs to the `codemaker`, while the last sends feedback.


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
* `"messageType": "feedback"` gives to the `codebreaker` the number of white and black pegs to guess the code.
* `"messageType": "requestFeedback"` informs to the `codemaker` the attempt of the `codebreaker`.
* `"messageType": "fullGame"` informs the player the code he has entered has been already used by two players.