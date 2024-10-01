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
    
    return {
        printBoard
    }
}

function Player() {
    let token = ''

    const assignToken = (choice) => token = choice;

    const chooseToken = function() {
        let choice = ''
        while(choice !== "X" && choice !== "O"){
            choice = prompt("Player 1, choose X or O");
        }
        return choice;
    }
    
    const getToken = () => token;

    return {
        getToken,
        assignToken,
        chooseToken
    };
}

function Gamecontroller() {
    const board = Gameboard();
    board.printBoard()

    const player1 = Player()
    const player2 = Player()

    player1.assignToken(player1.chooseToken());
    player2.assignToken(player1.getToken() === "X" ? "O" : "X");

    console.log(`Player 1 has been assigned ${player1.getToken()}. Player 2 has been assigned ${player2.getToken()}.`)
}

let game = Gamecontroller();



