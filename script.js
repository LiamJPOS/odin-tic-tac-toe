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

//
const EventController = function(players, gameboard) {
    //Cache DOM
    const p1TokenSVG  = document.getElementById("p1-token-svg");
    const p2TokenSVG  = document.getElementById("p2-token-svg");
    const playerBtns = document.querySelectorAll(".player-btn");
    const cells = document.querySelectorAll(".cell")   
    
    //Images for X and O to use in DOM
    const svgX = `
    <svg fill="#a0b2a2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9,7L11,12L9,17H11L12,14.5L13,17H15L13,12L15,7H13L12,9.5L11,7H9Z" /></svg>
    `
    const svgO = `
    <svg fill="#f5f5f5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11,7A2,2 0 0,0 9,9V15A2,2 0 0,0 11,17H13A2,2 0 0,0 15,15V9A2,2 0 0,0 13,7H11M11,9H13V15H11V9Z" /></svg>
    `
    //Functions to bind
    const renderPlayerTokens = function() {
        const p1Token = players[0].getToken();

        if (p1Token === "X") {
            p1TokenSVG.innerHTML = svgX;
            p2TokenSVG.innerHTML = svgO;
        }
        else {
            p1TokenSVG.innerHTML = svgO;
            p2TokenSVG.innerHTML = svgX;
        }
    }

    const assignTokens = function() {
        const p1Token = players[0].getToken();

        console.log(`Player 1 token is ${p1Token}`)

        if (p1Token === "X") {
            players[0].assignToken("O")
            players[1].assignToken("X")
        }
        else {
            players[0].assignToken("X")
            players[1].assignToken("O")
        }

        console.log(`Player 1 token has changed to ${players[0].getToken()}`)
    }

    const renderCurrentPlayer = function() {

    }

    const unbindEvents = function () {   
        for (btn of playerBtns) {
            btn.removeEventListener("click", assignTokens)
            btn.removeEventListener("click", renderPlayerTokens)
        }
    }


    //bind events
    for (btn of playerBtns) {
        btn.addEventListener("click", assignTokens)
        btn.addEventListener("click", renderPlayerTokens)
    }


    for (cell of cells) {
        cell.addEventListener("click", unbindEvents) //Once game starts don't need token select on player btns
    }


    //Run default functions
    renderPlayerTokens()

}

const Game = function () {
    //Initialise players
    const player1 = Player("X");
    const player2 = Player("O");
    const players = [player1, player2];

    //Initialise gameboard
    const board = Gameboard();

    //Intialise events in DOM
    const events = EventController(players, board);
}

let game = Game();