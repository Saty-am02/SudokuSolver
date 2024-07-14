import React, { useEffect } from 'react';

function App() {
  useEffect(() => {
    const gridSize = 9;
    const solveButton = document.getElementById("solve-btn");
    const resetButton = document.getElementById("reset-btn");

    solveButton.addEventListener('click', solveSudoku);
    resetButton.addEventListener('click', resetSudoku);

    const sudokuGrid = document.getElementById("sudoku-grid");
    // Clear any existing rows to avoid duplicates
    while (sudokuGrid.firstChild) {
      sudokuGrid.removeChild(sudokuGrid.firstChild);
    }

    // Create the sudoku grid and input cells
    for (let row = 0; row < gridSize; row++) {
      const newRow = document.createElement("tr");
      for (let col = 0; col < gridSize; col++) {
        const cell = document.createElement("td");
        const input = document.createElement("input");
        input.type = "number";
        input.className = "cell";
        input.id = `cell-${row}-${col}`;
        input.max = 9;
        input.min = 1;
        cell.appendChild(input);
        newRow.appendChild(cell);
      }
      sudokuGrid.appendChild(newRow);
    }
  }, []);

  const solveSudoku = async () => {
    const gridSize = 9;
    const sudokuArray = [];
    let hasUserInput = false;

    // Fill the sudokuArray with input values from the grid
    for (let row = 0; row < gridSize; row++) {
      sudokuArray[row] = [];
      for (let col = 0; col < gridSize; col++) {
        const cellId = `cell-${row}-${col}`;
        const cellValue = document.getElementById(cellId).value;
        if (cellValue !== "") {
          hasUserInput = true;
        }
        sudokuArray[row][col] = cellValue !== "" ? parseInt(cellValue) : 0;
      }
    }

    if (!hasUserInput) return; // No user input, exit

    // Identify user-input cells and mark them
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const cellId = `cell-${row}-${col}`;
        const cell = document.getElementById(cellId);

        if (sudokuArray[row][col] !== 0) {
          cell.classList.add("user-input");
        }
      }
    }

    // Solve the sudoku and display the solution
    if (await solveSudokuHelper(sudokuArray)) {
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const cellId = `cell-${row}-${col}`;
          const cell = document.getElementById(cellId);

          // Fill in solved values and apply animation
          if (!cell.classList.contains("user-input")) {
            cell.value = sudokuArray[row][col];
            cell.classList.add("solved");
            await sleep(20); // Add a delay for visualization
          }
        }
      }
    } else {
      console.log("No solution exists for the given Sudoku puzzle.");
    }
  };

  const resetSudoku = () => {
    const gridSize = 9;
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const cellId = `cell-${row}-${col}`;
        const cell = document.getElementById(cellId);
        cell.value = "";
        cell.classList.remove("user-input", "solved");
      }
    }
  };

  const solveSudokuHelper = async (board) => {
    const gridSize = 9;

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValidMove(board, row, col, num)) {
              board[row][col] = num;

              // Recursively attempt to solve the Sudoku
              if (await solveSudokuHelper(board)) {
                return true; // Puzzle solved
              }

              board[row][col] = 0; // Backtrack
            }
          }
          return false; // No valid number found
        }
      }
    }

    return true; // All cells filled
  };

  const handleConflict = (row, col) => {
    const cellId = `cell-${row}-${col}`;
    const cell = document.getElementById(cellId);
    cell.value = ""; // Clear the cell value
  };

  const isValidMove = (board, row, col, num) => {
    const gridSize = 9;

    // Check row for conflicts
    for (let i = 0; i < gridSize; i++) {
      if (board[row][i] === num) {
        handleConflict(row, col);
        return false;
      }
    }

    // Check column for conflicts
    for (let i = 0; i < gridSize; i++) {
      if (board[i][col] === num) {
        handleConflict(row, col);
        return false;
      }
    }

    // Check the 3x3 subgrid for conflicts
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (board[i][j] === num) {
          handleConflict(row, col);
          return false;
        }
      }
    }

    return true; // No conflicts found
  };

  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  return (
    <>
      <div id='demo'>
        <span className="color-1">S</span>
        <span className="color-6">U</span>
        <span className="color-3">D</span>
        <span className="color-4">O</span>
        <span className="color-5">K</span>
        <span className="color-6">U</span>
        <span className="color-7">&nbsp;</span>
        <span className="color-8">S</span>
        <span className="color-5">o</span>
        <span className="color-4">L</span>
        <span className="color-3">v</span>
        <span className="color-6">E</span>
        <span className="color-1">R</span>
      </div>

      <div className="sudoku-container">
        <table>
          <tbody id="sudoku-grid">
          </tbody>
        </table>
      </div>

      <div className='flex gap-14 relative top-10'>
        <button id='solve-btn'>
          Solve Sudoku
          <div class="star-1">
            <svg
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 784.11 815.53"
              version="1.1"
              xml:space="preserve"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs></defs>
              <g id="Layer_x0020_1">
                <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                <path
                  d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                  class="fil0"
                ></path>
              </g>
            </svg>
          </div>
          <div class="star-2">
            <svg
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 784.11 815.53"
              
              version="1.1"
              xml:space="preserve"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs></defs>
              <g id="Layer_x0020_1">
                <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                <path
                  d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                  class="fil0"
                ></path>
              </g>
            </svg>
          </div>
          <div class="star-3">
            <svg
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 784.11 815.53"

              version="1.1"
              xml:space="preserve"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs></defs>
              <g id="Layer_x0020_1">
                <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                <path
                  d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                  class="fil0"
                ></path>
              </g>
            </svg>
          </div>
          <div class="star-4">
            <svg
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 784.11 815.53"
              
              version="1.1"
              xml:space="preserve"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs></defs>
              <g id="Layer_x0020_1">
                <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                <path
                  d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                  class="fil0"
                ></path>
              </g>
            </svg>
          </div>
          <div class="star-5">
            <svg
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 784.11 815.53"
              version="1.1"
              xml:space="preserve"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs></defs>
              <g id="Layer_x0020_1">
                <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                <path
                  d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                  class="fil0"
                ></path>
              </g>
            </svg>
          </div>
          <div class="star-6">
            <svg
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 784.11 815.53"
              version="1.1"
              xml:space="preserve"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs></defs>
              <g id="Layer_x0020_1">
                <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                <path
                  d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                  class="fil0"
                ></path>
              </g>
            </svg>
          </div>
        </button>

        <button id='reset-btn'>
          Reset Sudoku
          <div class="star-1">
            <svg
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 784.11 815.53"
              version="1.1"
              xml:space="preserve"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs></defs>
              <g id="Layer_x0020_1">
                <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                <path
                  d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                  class="fil0"
                ></path>
              </g>
            </svg>
          </div>
          <div class="star-2">
            <svg
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 784.11 815.53"
              
              version="1.1"
              xml:space="preserve"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs></defs>
              <g id="Layer_x0020_1">
                <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                <path
                  d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                  class="fil0"
                ></path>
              </g>
            </svg>
          </div>
          <div class="star-3">
            <svg
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 784.11 815.53"

              version="1.1"
              xml:space="preserve"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs></defs>
              <g id="Layer_x0020_1">
                <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                <path
                  d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                  class="fil0"
                ></path>
              </g>
            </svg>
          </div>
          <div class="star-4">
            <svg
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 784.11 815.53"
              
              version="1.1"
              xml:space="preserve"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs></defs>
              <g id="Layer_x0020_1">
                <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                <path
                  d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                  class="fil0"
                ></path>
              </g>
            </svg>
          </div>
          <div class="star-5">
            <svg
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 784.11 815.53"
              version="1.1"
              xml:space="preserve"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs></defs>
              <g id="Layer_x0020_1">
                <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                <path
                  d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                  class="fil0"
                ></path>
              </g>
            </svg>
          </div>
          <div class="star-6">
            <svg
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 784.11 815.53"
              version="1.1"
              xml:space="preserve"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs></defs>
              <g id="Layer_x0020_1">
                <metadata id="CorelCorpID_0Corel-Layer"></metadata>
                <path
                  d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
                  class="fil0"
                ></path>
              </g>
            </svg>
          </div>

        </button>
      </div>
    </>
  );
}

export default App;
