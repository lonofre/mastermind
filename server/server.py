import asyncio
import logging
import websockets
from websockets import WebSocketServerProtocol
import json
from player import Player, Role

logging.basicConfig(level = logging.INFO)

class Server:
    
    '''Contains the game, which consists of two players.
    There's a code that is used to connect both players,
    which is provided by the first one that starts the game,
    and is in the dictionary as a key
    '''
    games = {}
    players = {}
    
    async def register(self, ws: WebSocketServerProtocol):
        logging.info(f'{ws.remote_address} connects')
        player = Player(ws)
        self.players[ws] = player


    async def unregister(self, ws: WebSocketServerProtocol):
        '''Ends the game if some player disconnects'''

        player = self.players[ws]
        del self.players[ws]
        code = player.code
        
        # When someone disconnects first
        if code in self.games:
            game = self.games[code]
            
            # This case covers when the
            # game has started with two people
            if len(self.games) == 2:    
                other_player = None
                
                if player.role == Role.CODEMAKER:
                    other_player = game['codebreaker']
                else:
                    other_player = game['codemaker']

                # To notify the disconnection of the other player
                # to end the game
                await self.send_message('disconnection', 
                        'The other player has been disconnected',
                        other_player.ws)
            

            del self.games[code]
            
        
        
        logging.info(f'{ws.remote_address} disconnects')


    async def send_to_client(self, message: str, ws: WebSocketServerProtocol):
        try:
            content = json.loads(message)
            action = content['action']
            data = content['data']

            if action == 'registerCode':
                await self.register_code(data, ws)
            elif action == 'play':
                await self.play(data, ws)

        except json.decoder.JSONDecodeError:
            await self.send_message('error', 'Can\'t process data', ws)
        except FullGameError:
            await self.send_message('full_game', 'The game is full', ws)
        except AttributeError:
            await self.send_message('error', 'There are missing attributes', ws)
    

    async def send_message(self, message_type: str, message: str, ws: WebSocketServerProtocol) -> dict:
            message = {
                'messageType': message_type,
                'data': {
                    'message': message
                }
            }
            await ws.send(json.dumps(message))


    async def ws_handler(self, ws: WebSocketServerProtocol, uri: str):
        await self.register(ws)
        try:
            await self.distribute(ws)
        finally:
            await self.unregister(ws)


    async def distribute(self, ws: WebSocketServerProtocol):
        async for message in ws:
            await self.send_to_client(message, ws)


    async def register_code(self, data: dict, ws: WebSocketServerProtocol):
        '''Creates a game with the code if a player is the first to use it
        or register a player to a game, both cases a role is assigned
        '''

        player = self.players[ws]
        code = data['code']
        player.code = code
        game = None

        if code in self.games:
            game = self.games[code]
            
            # The game is only for two players,
            # if someone else tries to join
            # she isn't going to be registered
            if 'codebreaker' in game:
                raise FullGameError()

            player.role = Role.CODEBREAKER
            game['codebreaker'] = player
            
            other_player = game['codemaker']
            await self.send_message('connection',
                'The codebreaker has been connected',
                other_player.ws)

        else:
            player.role = Role.CODEMAKER
            game = {
                'codemaker': player
            }
    
        self.games[code] = game
        self.players[ws] = player

        message = {
            'messageType': 'role',
            'data': {
                'role': player.role
            }
        }

        await ws.send(json.dumps(message))
        

    async def play(self, data: dict, ws: WebSocketServerProtocol):
        '''Sends feedback to the other player if the sender is
        the codemaker or requests feedback if the sender is the codebreaker'''

        player = self.players[ws]
        
        game = self.games[player.code]
        other_player = None
        message = {
            'messageType': '',
            'data': {} 
        }

        if player.role == Role.CODEMAKER:
            message['data']['feedback'] = data['feedback']
            message['messageType'] = 'feedback'
            other_player = game['codebreaker']
        else:
            message['data']['pegs'] = data['pegs']
            message['messageType'] = 'request_feedback'
            other_player = game['codemaker']
        
        await other_player.ws.send(json.dumps(message))


class FullGameError(Exception):
    '''The game is full and more people cannot enter to'''
