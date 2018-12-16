
/**
* Removes the css class from the element, if it is present
* @param { HTMLElement } element The element to remove the class from
* @param { string } className The className to be removed
*/
function removeClass(element, className){
  element.className = element.className.replace(className, '');
}

/**
* Adds the css class to the element, if it is not already present
* @param { HTMLElement } element The element to add the class to
* @param { string } className The className to be added
*/
function addClass(element, className){
  if(element.className.search(className) != -1) return; // don't add the className if it's already present
  element.className += ` ${className} `;
}

/**
* Sleep for delay ms
* @param { number } delay The number of ms to sleep for
* @return { Promise } Resolves after delay ms
*/
function sleep(delay){
  return new Promise(resolve => setTimeout(resolve, delay));
}

class SudokuSolver{
  /**
  * @constructor
  */
  constructor(){
    this.solvableState = false;
    this.solutionGrid = [];
    this.createTable();
  }

  /**
  * Initializes the table with empty cells
  * Also links the inputs of the table to the underlying grid 2D array
  */
  createTable(){
    const table = document.getElementById("sudokuTable");

    for(let i = 0; i < 9; i++){
      this.solutionGrid.push([]); // add a new row to the 2D array
      let row = document.createElement('tr'); // create a row for the table

      for(let j = 0; j < 9; j++){
        let cell = document.createElement('td'); // create the cell
        let input = document.createElement('input'); // create the input in the cell

        input.value = ''; // initialize input to empty string
        input.row = i; // set the row for the input
        input.col = j; // set the column for the input
        input.addEventListener('change', this.checkInput.bind(this)); // add an event handler for changing values

        this.solutionGrid[i].push(input); //  add the input to the 2D array

        cell.appendChild(input); // add the input to the cell

        // give sudoku table styling to every 3rd cell to give it an extra wide right border
        if((j + 1) % 3 == 0){
          addClass(cell, 'extra-wide-r');
        }

        // give sudoku table styling to every 3rd cell to give it extra wide bottom border
        if((i + 1) % 3 == 0){
          addClass(cell, 'extra-wide-b');
        }

        row.appendChild(cell); // add the cell to the row
      }

      table.appendChild(row); // add the row to the table
    }

    this.solvableState = true;
  }

  /**
  * Solves the Sudoku table asynchronously
  * Takes a 10ms pause between recursive calls for dramatic effect
  * @return { boolean }
  */
  async solveTable(){
    if(!this.solvableState) return false;
    await sleep(10); // take a 10ms pause for dramatic effect (no need to do this, just looks cooler)

    // initialize variables indicating the next empty cell, or if there is one
    let row = -1;
    let col = -1;
    let isEmpty = true;

    // find the next empty cell
    for(let i = 0; i < 9; i++){
      for(let j = 0; j < 9; j++){
        if(this.solutionGrid[i][j].value == ''){
          row = i;
          col = j;
          isEmpty = false;
          break;
        }
      }
      if(!isEmpty){
        break;
      }
    }

    // no more empty cells, must mean the table is solved
    if(isEmpty){
      return true;
    }

    // try each number 1-9, see if it works in this spot. if so, move on to try more. if they all fail, then we were wrong here
    for(let num = 1; num <= 9; num++){
      if(this.isSafe(row, col, num)){
        this.solutionGrid[row][col].value = num; // assign the guess that works
        let good = await this.solveTable(); // see if the guess worked out
        if(good){
          return true; // guess was good
        }
        else {
          this.solutionGrid[row][col].value = ''; // guess was bad, reassign the cell as empty and try again
        }
      }
    }

    return false;
  }

  /**
  * Checks if the given number is safe to go at the location specified by (row, col) based on rules of Sudoku
  * @param { number } row
  * @param { number } col
  * @param { number } num
  * @return { boolean }
  */
  isSafe(row, col, num){
    // see if the row works
    for(let i = 0; i < 9; i++){
      if(this.solutionGrid[row][i].value == num){
        // console.log(`column ${i} matches`);
        return false;
      }
    }

    // see if the column works
    for(let i = 0; i < 9; i++){
      if(this.solutionGrid[i][col].value == num){
        // console.log(`row ${i} matches`);
        return false;
      }
    }

    // see if the box works
    let minRow = row - row % 3; // starting row of the box
    let minCol = col - col % 3; // starting column of the box
    for(let i = minRow; i < minRow + 3; i++){
      for(let j = minCol; j < minCol + 3; j++){
        if(this.solutionGrid[i][j].value == num){
          // console.log(`cell ${i},${j} matches`);
          return false;
        }
      }
    }

    return true;
  }

  /**
  * Clears the inputs of the table to be empty strings
  */
  clearTable(event){
    document.getElementById('errorMessage').hidden = true; // put away the error message

    for(let i = 0; i < 9; i++){
      for(let j = 0; j < 9; j++){
        // take away any colour classes from the cell
        removeClass(this.solutionGrid[i][j].parentElement, 'green');
        removeClass(this.solutionGrid[i][j].parentElement, 'red');
        removeClass(this.solutionGrid[i][j], 'green');
        removeClass(this.solutionGrid[i][j], 'red');
        this.solutionGrid[i][j].value = ''; // reset the value
      }
    }

    this.solvableState = true;
  }

  /**
  * Applies a puzzle found as a top result of a search for Sudoku puzzle samples
  */
  applyEasyPuzzleSample(){
    const template = [
      [8 , 7, 6,   9 ,'','',  '','',''],
      ['', 1,'',   '','', 6,  '','',''],
      ['', 4,'',   3 ,'', 5,  8 ,'',''],

      [4 ,'','',  '','','',   2 , 1,''],
      ['', 9,'',  5 ,'','',   '','',''],
      ['', 5,'',  '', 4,'',   3 ,'', 6],

      ['', 2, 9,  '','','',   '','', 8],
      ['','', 4,  6 , 9,'',   1 , 7, 3],
      ['','','',  '','', 1,   '','', 4],
    ];

    for(let i = 0; i < 9; i++){
      for(let j = 0; j < 9; j++){
        this.solutionGrid[i][j].value = template[i][j]; // set the value of the indexed input to the template value at the same index

        // if there is a value at the template, make the cell green
        // else no colour in the cell
        if(template[i][j]){
          removeClass(this.solutionGrid[i][j].parentElement, 'red');
          removeClass(this.solutionGrid[i][j], 'red');
          addClass(this.solutionGrid[i][j].parentElement, 'green');
          addClass(this.solutionGrid[i][j], 'green');
        }
        else {
          removeClass(this.solutionGrid[i][j].parentElement, 'red');
          removeClass(this.solutionGrid[i][j], 'red');
          removeClass(this.solutionGrid[i][j].parentElement, 'green');
          removeClass(this.solutionGrid[i][j], 'green');
        }
      }
    }

    this.solvableState = true;
  }

  /**
  * Checks the input value of an onchange for an input
  * @param { Event } event
  */
  checkInput(event){
    let input = event.target; // get a reference to the HTMLElement (should be an input element)

    let value = parseInt(input.value); // get the value of the cell as a number

    // must be a number 1-9
    if(input.value == '' || isNaN(value) || value < 1 || value > 9){
      input.value = '';
      removeClass(input, 'red');
      removeClass(input.parentElement, 'red');
      removeClass(input, 'green');
      removeClass(input.parentElement, 'green');
      this.solvableState = this.checkSolvableState();
      return;
    }

    input.value = ''; // temporarily remove the value from the table while checking if its valid. We'll add it back later

    // the best way to get the table indexed position
    let row = input.row;
    let col = input.col;


    // colour green if safe, red otherwise
    if(this.isSafe(row, col, value)){
      removeClass(input, 'red');
      removeClass(input.parentElement, 'red');
      addClass(input, 'green');
      addClass(input.parentElement, 'green');
    }
    else {
      removeClass(input, 'green');
      removeClass(input.parentElement, 'green');
      addClass(input, 'red');
      addClass(input.parentElement, 'red');
    }

    input.value = value; // put the value back in now that we're done
    this.solvableState = this.checkSolvableState();
  }

  /**
  * Checks if the table has a possible solution in its current state
  * @return { boolean }
  */
  checkSolvableState(){
    const self = this;

    const checkRow = function(rowNum){
      let verify = [1,2,3,4,5,6,7,8,9];
      for(let j = 0; j < 9; j++){
        let value = parseInt(self.solutionGrid[rowNum][j].value);
        if(isNaN(value)) continue; // ignore empty strings

        console.log(rowNum, verify, value, verify.indexOf(value));
        let index = verify.indexOf(value); // find the index of the value in the list of 1-9, then remove it if present
        if(index == -1){
          return false;
        }
        else {
          verify.splice(index, 1);
        }
      }

      return true;
    };

    const checkColumn = function(colNum){
      let verify = [1,2,3,4,5,6,7,8,9];
      for(let i = 0; i < 9; i++){
        let value = parseInt(self.solutionGrid[i][colNum].value);
        if(isNaN(value)) continue; // ignore empty strings

        let index = verify.indexOf(value); // find the index of the value in the list 1-9, then remove it  if present
        if(index == -1){
          return false;
        }
        else {
          verify.splice(index, 1);
        }
      }

      return true;
    }

    const checkBox = function(boxNum){
      let verify = [1,2,3,4,5,6,7,8,9];
      let minRow = 3 * Math.floor(boxNum / 3);
      let minCol = 3 * (boxNum % 3);

      for(let i = minRow; i < minRow + 3; i++){
        for(let j = minCol; j < minCol + 3; j++){
          let value = parseInt(self.solutionGrid[i][j].value);
          if(isNaN(value)) continue;

          let index = verify.indexOf(value);
          if(index == -1){
            return false;
          }
          else {
            verify.splice(index, 1);
          }
        }
      }

      return true;
    }

    for(let i = 0; i < 9; i++){
      if(!checkRow(i)){
        console.log(`cannot solve due to row ${i}`);
        return false;
      }
      if(!checkColumn(i)){
        console.log(`cannot solve due to col ${i}`);
        return false;
      }
      if(!checkBox(i)){
        console.log(`cannot solve due to box ${i}`);
        return false;
      }
    }

    return true;
  }

  /**
  * Set the input disabled on or off
  * @param { boolean } disabled
  */
  setInputsDisabled(disabled){
    for(let i = 0; i < 9; i++){
      for(let j = 0; j < 9; j++){
        this.solutionGrid[i][j].readOnly = disabled;
      }
    }
  }
}

const solver = new SudokuSolver(); // create a new instance
solver.applyEasyPuzzleSample(); // add the sample puzzle by default

// add event listener to solve button
document.getElementById('solveButton').addEventListener('click', () => {
  // disable the buttons, puzzle inputs, and remove the error message
  document.getElementById('solveButton').disabled = true;
  document.getElementById('clearButton').disabled = true;
  document.getElementById('errorMessage').hidden = true;
  solver.setInputsDisabled(true);

  // try solve the table, find out if it  has a solution, use the error output if needed
  solver.solveTable().then(possible => {
    if(!possible){
      document.getElementById('errorMessage').hidden = false;
    }
    else {
      document.getElementById('errorMessage').hidden = true;
    }

    // enable the buttons and puzzle inputs
    document.getElementById('solveButton').disabled = false;
    document.getElementById('clearButton').disabled = false;
    solver.setInputsDisabled(false);
  });
});

// add an event listener to clear the table
document.getElementById('clearButton').addEventListener('click', solver.clearTable.bind(solver));
