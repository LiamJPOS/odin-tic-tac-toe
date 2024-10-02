function Cell() {
    let cellValue = '0'
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
        validateMove
    }
}

function Player(name) {

    let token = ''

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
        move = prompt(`${name} Make your move. Choose row and then column. Like 0,2 for middle right.`).split(",");
        console.log(move);
        return move;
    }

    return {
        getToken,
        assignToken,
        chooseToken,
        makeMove
    };
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

    let activePlayerIndex = 0
    const toggleActivePlayer = () => {activePlayerIndex = (activePlayerIndex + 1) % 2} 

    let nextMove = []
    let activePlayerToken = players[activePlayerIndex].getToken();

    //TODO Develop game logic and win conditions to break loop here
    while(true) {
        nextMove = players[activePlayerIndex].makeMove();
        //TODO implement validate move and loop back if cell taken already
        board.updateBoard(nextMove, activePlayerToken);
        board.printBoard();
        toggleActivePlayer();
        activePlayerToken = players[activePlayerIndex].getToken();
    }
}

let game = Gamecontroller();



