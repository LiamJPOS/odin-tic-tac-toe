function Cell() {
    let cellValue = 0
    const getValue = () => cellValue;
    //Value is either 1 or 2 representing either player's symbol, or 0 for empty cell
    const setValue = (value) => {
        if(value === 1 || value === 2){
            cellValue = value; 
        }
    }

    return { 
        getValue,
        setValue
    };
}

function Gameboard() {
    const rows = 3;
    const cols = 3;
    const board = [];

    for(let i = 0; i < rows; i++){
        board.push([])
        for(let j = 0; j < cols; j++){
            board[i].push(Cell())
        }
    }

    function printBoard() {
        let rowValues = []
        console.group("Tic Tac Toe Board");
        for(let row of board) {
            for(cell of row) {
                rowValues.push(cell.getValue())
            }
            console.log(rowValues.join("|"));
            rowValues = []    
        }
        console.groupEnd();
        console.log("\n"); //Seperate boards on multiple calls
    }
    
    return {
        printBoard
    }
}


    
let game = Gameboard()
game.printBoard();








