# Snake-game
A snake game on the web

## How to play 
 The game is currently being hosted on https://sjoegd.github.io/snake-game/,
 to play it simple go there and click play.
 
 The movement is pretty simple, use the WASD keys to move up(w) left(a) down(s) and right(d)
 and to pause the game you can either press ESC or click the menu button at the top right corner of the game.
 
 You can also play on mobile or use your mouse for movement, simply click on the screen and the snake will go
 to a certain direction based on where you clicked. So when your click is at the left side of the snake it will go left, right side: right etc.
 

## How was it made
### Languages
The languages used to create this project are:
- HTML5
- CSS3
- Javascipt

### How it works 
The code is made in OOP (Object Orientated Programming) style,
for every object of the game a class is made which contains the necessary information for that object.
The snake is represented in the Snake class, which actually represents the head of the snake, this class contains an array of all the body parts (SnakeNodes) which follow it and the head updates their internals based on what happends with the snake(head) itself. Then there is a class called SnakeMover, which has a reference to the snake and moves it based on which direction the player wants to go and also sets the rotation of the snake right. This class also handles things like crashing into the wall, eating the apple and the snake colliding with itself. You can see it as an instance of a game of snake. Lastly there is the GameHandler which creates game instances and handles the UI.
    
__How does the snake move?__

To make the snake move, css grid is used. A big matrix of 192 grid blocks(by default) is made and the snake moves 1 block (based on speed) around every 20ms, but the snake's size itself is 8x8 blocks by default. This creates a smooth movement for the snake and to make sure the snake can only move in 8x8 rows and columns it can only rotate when it is at the beginning of such a block (this is managed in the SnakeMover class)

## Made by
This project was entirely made by Sjoegd

