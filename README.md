# Odin Tic-Tac-Toe

This project is a web-based Tic-Tac-Toe game built in JavaScript, HTML, and CSS. Inspired by Chrome's Tic-Tac-Toe game, it serves as a practice project focused on object-oriented and event-driven programming principles.

## Features

- **Two-Player Mode**: Choose tokens (X or O) for each player and take turns to play on a 3x3 grid.
- **Dynamic Token Assignment**: Players can select their preferred token (X or O) at the start of each game.
- **Visual Turn Indication**: Highlights the active player and updates instructions dynamically to indicate whose turn it is.
- **Grid Interaction**: Handles user clicks on grid cells, displays tokens, and validates moves to prevent overwrites.
- **Win Detection**: Detects a winning combination on rows, columns, or diagonals and announces the winner.
- **Draw Detection**: Detects a draw if all cells are filled without a winner.
- **Score Tracking**: Tracks and displays each player's win count for multiple rounds.
- **Hard Reset**: Resets the game, including scores, tokens, and player assignments.

## Technical Details

- **Object-Oriented Structure**: Key game elements are encapsulated in classes and objects:
  - **Player**: Manages player tokens, win counters, and checks for winning conditions.
  - **Cell**: Tracks each cell's token or empty status.
  - **Gameboard**: Manages the grid, validates moves, and updates cell states.
  - **EventController**: Coordinates the game's event-driven logic, DOM interactions, and rendering.
- **Event-Driven Programming**: Utilizes event listeners to handle user actions, game resets, and dynamic updates.

## Getting Started

To play the game:
1. Open `index.html` in a web browser.
2. Click on a token to assign it to each player.
3. Click on cells in the grid to make moves. The active player's token will appear on the grid, and the game will automatically detect and display a win or draw.
4. Use Restart Game button to hard reset to reset the entire game.

This project is designed to be a foundational example of using JavaScript for DOM manipulation and handling game state through object-oriented principles.
