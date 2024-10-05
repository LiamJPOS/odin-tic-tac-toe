function Cell() {
    let cellValue = 0
    const getValue = () => cellValue;
    //Value is either X or O representing either player's symbol, or 0 for empty cell
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

    const getRowCount = () => rows

    const getColCount = () => cols
    
    const printBoard = function() {
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
        getRowCount,
        getColCount,
    }
}

function Player(name) {
    let token = '';

    // Counters for player's progress on rows, columns, and diagonals
    const rowCounters = [0, 0, 0];
    const colCounters = [0, 0, 0];
    const diagCounters = [0, 0];  // diagCounters[0] = top-left to bottom-right, diagCounters[1] = top-right to bottom-left

    const getName = () => name;

    const assignToken = (choice) => token = choice;

    const chooseToken = function() {
        let choice = ''
        while(choice !== "X" && choice !== "O"){
            choice = prompt(`${name}, choose X or O`);
        }
        return choice;
    }
    
    const getToken = () => token;

    const makeMove = function() {
        let move = prompt(`${name} Make your move. Choose row and then column. Like 0,2 for middle right.`).split(",");
        move = move.map(Number); //Convert string input from prompt into numbers
        return move;
    }

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

    return {
        getName,
        getToken,
        assignToken,
        chooseToken,
        makeMove,
        updateCounters,
        winCheck
    };
}

function UIConroller() {
    
    const createGrid = function(rows, cols) {
        gameContainer = document.getElementById("game-container");
        
        for(let i = 0; i < rows; i++){
            const rowDiv = document.createElement("div");
            rowDiv.classList.add('row-div');

            for(let j = 0; j < cols; j++){
                const cellBtn = document.createElement("button");
                cellBtn.classList.add("cell");
                cellBtn.id = `cell-${i}-${j}`;
                
                rowDiv.appendChild(cellBtn);
            }
        gameContainer.appendChild(rowDiv);
        }
                         
    }

    return {
        createGrid
    }
} 

function Gamecontroller() {
    const board = Gameboard();
    board.printBoard()

    const player1 = Player("Test 1")
    const player2 = Player("Test 2")
    const players = [player1, player2];

    player1.assignToken(player1.chooseToken());
    player2.assignToken(player1.getToken() === "X" ? "O" : "X");

    console.log(`Player 1 has been assigned ${player1.getToken()}. Player 2 has been assigned ${player2.getToken()}.`)

    const toggleActivePlayer = () => {activePlayerIndex = (activePlayerIndex + 1) % 2} 
    
    let activePlayerIndex = 0
    let moveCounter = 0
    
    //Game loop
    while(true) {
        let nextMove = null;
        let activePlayerToken = players[activePlayerIndex].getToken();
        
        while(true){
            nextMove = players[activePlayerIndex].makeMove();
            if(board.validateMove(nextMove)) {
                break;
            }
            else {
                console.log("Invalid move. The cell is already taken, try again.")
            }
        }

        board.updateBoard(nextMove, activePlayerToken);
        board.printBoard();
        players[activePlayerIndex].updateCounters(nextMove);
        moveCounter++

        //Check win
        if (moveCounter >= 5) {
            if(players[activePlayerIndex].winCheck(nextMove)){
                console.log(`${players[activePlayerIndex].getName()} is the winner!`)
                break;
            }
            else if (moveCounter >= 9) {
                console.log("It's a draw")
                break;
            }
        }

        //Next move
        toggleActivePlayer();
    }

}

// let game = Gamecontroller();
let board = Gameboard();
let ui = UIConroller();

