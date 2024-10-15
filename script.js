function Player(defaultToken) {
    let token = defaultToken

     // Counters for player's progress on rows, columns, and diagonals
     const rowCounters = [0, 0, 0];
     const colCounters = [0, 0, 0];
     const diagCounters = [0, 0];  // diagCounters[0] = top-left to bottom-right, diagCounters[1] = top-right to bottom-left

     let winCount = 0

     const assignToken = (choice) => token = choice;

     const getToken = () => token;

     const updateCounters = (move) => {
        const row = move[0];
        const col = move[1];

        rowCounters[row]++
        colCounters[col]++

        //Check for diagonal line and update counters if needed
        if (row === col) {
            diagCounters[0]++;
        }

        if (row + col === 2) {
            diagCounters[1]++;
        }
    }

    const winCheck = (move) => {
        const row = move[0];
        const col = move[1];
        return rowCounters[row] === 3 || colCounters[col] === 3 || diagCounters[0] === 3 || diagCounters[1] === 3;
    }

    const increaseWinCount = () => {winCount++};

    return {
        assignToken,
        getToken,
        updateCounters,
        winCheck,
        increaseWinCount
    }
}

function Cell() {
    let cellValue = null

    const getValue = () => cellValue;

    //Value is either X or O representing either player's symbol, or null for empty cell
    const setValue = (value) => {
        if(value === "X" || value === "O"){
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

    const printBoard = function() {
        let rowValues = []
        console.group("Tic Tac Toe Board");
        for(let row of board) {
            for(let cell of row) {
                rowValues.push(cell.getValue())
            }
            console.log(rowValues.join("|"));
            rowValues = []    
        }
        console.groupEnd();
        console.log("\n"); //Seperate boards on multiple calls
    }

    const updateBoard = (move, playerToken) => {
        const row = move[0];
        const col = move[1];
        board[row][col].setValue(playerToken);
    } 

    const validateMove = (move) => {
        const row = move[0];
        const col = move[1];
        return board[row][col].getValue() === 0;
    }

    return {
        printBoard,
        updateBoard,
        validateMove,
    }
}

function UIController() {
    const svgX = `
    <svg fill="#a0b2a2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9,7L11,12L9,17H11L12,14.5L13,17H15L13,12L15,7H13L12,9.5L11,7H9Z" /></svg>
    `
    const svgO = `
    <svg fill="#f5f5f5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11,7A2,2 0 0,0 9,9V15A2,2 0 0,0 11,17H13A2,2 0 0,0 15,15V9A2,2 0 0,0 13,7H11M11,9H13V15H11V9Z" /></svg>
    `
    //Cache DOM
    const p1TokenSVG  = document.getElementById("p1-token-svg")
    const p2TokenSVG  = document.getElementById("p2-token-svg")

    renderPlayerTokens = function(p1token) {
        if(p1token === "X") {   
            p1TokenSVG.innerHTML = svgX;
            p2TokenSVG.innerHTML = svgO;
        }
        else {
            p1TokenSVG.innerHTML = svgO;
            p2TokenSVG.innerHTML = svgX;
        }

    }

    return {
        renderPlayerTokens
    }


}

function gameController() {
    //Initialise board and UI
    const board = Gameboard();
    const ui = UIController();
    
    //Initialise players
    const player1 = Player('X')
    const player2 = Player('O')
    const players = [player1, player2];

    //Render default tokens
    ui.renderPlayerTokens(players[0].getToken())

    

}

let game = gameController();

// const p1TokenSVG = document.getElementById("p1-token-svg");
// const svgX = `
// <svg fill="#a0b2a2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9,7L11,12L9,17H11L12,14.5L13,17H15L13,12L15,7H13L12,9.5L11,7H9Z" /></svg>
// `
// p1TokenSVG.innerHTML = svgX;


// let grid = document.getElementById("grid")
// let OToken = document.getElementById("o-token")
// let gridRows = grid.rows
// let row1 = gridRows[0].cells;
// row1[0].style = "background: url(/images/alpha-o.svg)"
// .rows method for a table and .cells method for a row. access with index as usual. 
// Use background url to get x or o svg

//When game is started unbind event on player score buttons
//assign tokens based on values of player buttons
