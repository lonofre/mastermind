from enum import Enum
from websockets import WebSocketServerProtocol

class Role(str, Enum):
    UNKNOWN = 'unknown' 
    CODEMAKER = 'codemaker'
    CODEBREAKER = 'codebreaker'


class Player:
    '''A player who is connected to the game by websockets. 
    There are two types of player:
    - Codemaker: Make the code an provides feedback to the codebreaker.
    - Codebreaker: The person who is trying to guess the code and ask for
                   feedback.
    '''
    
    role = Role.UNKNOWN

    '''Code needed to connect with other player'''
    code = None

    '''Constructor that is initialized when the connection with the
    user is created.

    params
    ------
        id (int): Helps to identify the user between multiple connections
        ws (WebSocketServerProtocol): The websocket connection.
    '''
    def __init__(self, ws: WebSocketServerProtocol):
        self.ws = ws

