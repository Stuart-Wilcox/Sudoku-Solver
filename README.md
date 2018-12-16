# Sudoku-Solver
Sudoku solver is a simple web app that solves a given Sudoku puzzle.

You can check it out [here](https://sudoku-solver-js.herokuapp.com/), I have it deployed on a free tier Heroku cloud server.

## Sudoku Rules
Sudoku involves a grid of 81 squares.
The grid is divided into nine blocks, each containing nine squares.
The rules of the game are simple:
- each of the nine blocks has to contain all the numbers 1-9 within its squares
- each number can only appear once in a row, column or box.

## Algorithm
The algorithm used to solve the puzzle is called the backtracking algorithm.

You find an empty space, then try numbers 1-9 in the space until one of them complies with the rules.
Then you move on and try the next empty space. If the next space has no possible solution (ie the numbers 1-9 all don't work),
then the number we picked for the first empty spot was wrong, so we try another. If we make it to the end of the puzzle and every spot is filled,
then the solution is found and we're done.

It's called the backtracking algorithm because every time the numbers don't work, we backtrack to the cell where they last did work.  
