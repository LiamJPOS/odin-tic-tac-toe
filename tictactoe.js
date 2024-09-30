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
    const boardSize = 9;

}

const board = []
boardSize = 9;
for(let i = 0; i < boardSize; i++){
    board.push(Cell())
}