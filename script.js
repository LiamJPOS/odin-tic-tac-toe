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
    const p1TokenSVG  = document.getElementById("p1-token-svg");
    const p2TokenSVG  = document.getElementById("p2-token-svg");
    const playerBtns = document.querySelectorAll(".player-btn");
    const grid = document.getElementById("grid");    

    renderPlayerTokens = function(player) {
        const p1Token = player.getToken();

        if(p1Token === "X") {   
            p1TokenSVG.innerHTML = svgX;
            p2TokenSVG.innerHTML = svgO;
        }
        else {
            p1TokenSVG.innerHTML = svgO;
            p2TokenSVG.innerHTML = svgX;
        }
    }

    renderCellToken = function() {

    }

    renderCurrentPlayer = function() {

    }

    handleTokenSelect = function(players) {
        const p1Token = players[0].getToken();

        if (p1Token === "X") {
            players[0].assignToken("O");
            players[1].assignToken("X");
        }
        else {
            players[0].assignToken("X");
            players[1].assignToken("O");
        }

        renderPlayerTokens(players[0])
    }

    const bindPlayerBtns = function(players) {
        for (btn of playerBtns) {
            btn.addEventListener('click', () => handleTokenSelect(players));
        }
    }

    const handleCellClick = function() {
        console.log(this.id)

    }

    const bindCells = function() { 
        for (row of grid.rows) {
            for (cell of row.cells) {
                cell.addEventListener('click', () => handleCellClick());
            }
        } 

    }

    return {
        renderPlayerTokens,
        bindPlayerBtns,
        bindCells
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

    //Render default tokens (Default is player '1' assigned X and player 2 assigned 'O')
    ui.renderPlayerTokens(players[0]);

    //bind token selection event to player buttons
    ui.bindPlayerBtns(players);

    //bind cell selection event to cells
    ui.bindCells();


    return {

    }
}

let game = gameController();
