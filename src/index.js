document.addEventListener('DOMContentLoaded', () => {
    const gird =9;
    const solveButton = document.getElementById('solve');
    solveButton.addEventListener('click', solveSudoku);
    const sudokuGrid = document.getElementById('sudoku-grid');

    for(let row=0;row<grid;row++){
        const tr = document.createElement('tr');
        for(let col=0;col<grid;col++){
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'cell';;
            input.id = `cell-${row}-${col}`;
            
            td.appendChild(input);
            tr.appendChild(td);
        }
        sudokuGrid.appendChild(tr);
    }
});

async function solveSudoku(){
    const grid = 9;
    const sudokuArray = [];
    for(let row=0;row<grid;row++){
        sudokuArray[row] = [];
        for(let col=0;col<grid;col++){
            const cellId = `td-${row}-${col}`;
            const cellValue = document.getElementById(cellId).value;
            sudokuArray[row][col] = cellValue !== '' ? parseInt(cellValue) : 0;
        }
    }

    for(let row=0;row<grid;row++){
        for(let col=0;col<grid;col++){
            const cellId = `td-${row}-${col}`;
            const cell = document.getElementById(cellId);
            if(sudokuArray[row][col] !== 0){
                cell.classList.add('user-input');
            }

        }
    }

if(solveSudokuHelper(sudokuArray)){
    for(let row=0;row<grid;row++){
        for(let col=0;col<grid;col++){
            const cellId = `td-${row}-${col}`;
            const cell = document.getElementById(cellId);
            cell.value = sudokuArray[row][col];

            if(cell.classList.contains('user-input')){
                cell.value = sudokuArray[row][col];
                cell.classList.add('solved');
                await sleep(20);
            }
        }
    }
}
else{
    alert('No solution found');
}
}

function solveSudokuHelper(sudokuArray){
    const grid = 9;
   

    for(let row=0;row<grid;row++){
        for(let col=0;col<grid;col++){
            if(sudokuArray[row][col] === 0){
                for(let num=1;num<=grid;num++){
                    if(isValidMove(sudokuArray, row, col, num)){
                        sudokuArray[row][col] = num;
                        if(solveSudokuHelper(sudokuArray)){
                            return true;
                        }
                        sudokuArray[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }

return true;
}

function isValidMove(sudokuArray, row, col, num){
    for(let i=0;i<9;i++){
        if(sudokuArray[row][i] === num || sudokuArray[i][col] === num){
            return false;
        }
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for(let i=startRow;i<startRow+3;i++){
        for(let j=startCol;j<startCol+3;j++){
            if(sudokuArray[i][j] === num){
                return false;
            }
        }
    }

    return true;
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}


