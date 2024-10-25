function Player(defaultToken) {
    let token = defaultToken;

     // Counters for player's progress on rows, columns, and diagonals
     const rowCounters = [0, 0, 0];
     const colCounters = [0, 0, 0];
     const diagCounters = [0, 0];  // diagCounters[0] = top-left to bottom-right, diagCounters[1] = top-right to bottom-left

     let winCount = 0;

     const assignToken = (choice) => token = choice;

     const getToken = () => token;

     const updateCounters = (move) => {
        const row = move[0];
        const col = move[1];

        rowCounters[row]++;
        colCounters[col]++;

        //Check for diagonal line and update counters if needed
        if (row === col) {
            diagCounters[0]++;
        }

        if (row + col === 2) {
            diagCounters[1]++;
        }
    }

    const winCheck = () => rowCounters.includes(3) || colCounters.includes(3) || diagCounters.includes(3);

    const increaseWinCount = () => {winCount++};

    const getWinCount = () => winCount;

    return {
        assignToken,
        getToken,
        updateCounters,
        winCheck,
        increaseWinCount,
        getWinCount

    }
}

function Cell() {
    let cellValue = null;

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
    }
}

function Gameboard() {
    const rows = 3;
    const cols = 3;
    const board = [];
    
    for (let i = 0; i < rows; i++){
        board.push([])
        for(let j = 0; j < cols; j++){
            board[i].push(Cell())
        }
    }
    
    //Track moves made on the board
    let moveCounter = 0;

    const printBoard = function() {
        let rowValues = []
        console.group("Tic Tac Toe Board");
        for (let row of board) {
            for (let cell of row) {
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
        return board[row][col].getValue() === null;
    }

    const updateMoveCounter = () => {moveCounter++}

    const getMoveCounter = () => moveCounter;

    return {
        printBoard,
        updateBoard,
        validateMove,
        updateMoveCounter,
        getMoveCounter
    }
}

//
const EventController = function(players, board) {
    //Cache DOM
    const p1TokenSVG  = document.getElementById("p1-token-svg");
    const p2TokenSVG  = document.getElementById("p2-token-svg");
    const playerBtns = document.querySelectorAll(".player-btn");
    const turnTracker = document.getElementById("turn-tracker");
    const grid = document.getElementById("grid")
    const cells = document.querySelectorAll(".cell");
    const scores = document.querySelectorAll(".score")
    const gameOverScreen = document.getElementById("gameover-screen")
    const gameOverToken = document.getElementById("gameover-token-div")
    const gameOverMessage = document.getElementById("gameover-message")
    
    //Images for X and O to use in DOM
    const svgX = `
    <svg fill="#a0b2a2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9,7L11,12L9,17H11L12,14.5L13,17H15L13,12L15,7H13L12,9.5L11,7H9Z" /></svg>
    `;
    const svgO = `
    <svg fill="#f5f5f5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M11,7A2,2 0 0,0 9,9V15A2,2 0 0,0 11,17H13A2,2 0 0,0 15,15V9A2,2 0 0,0 13,7H11M11,9H13V15H11V9Z" /></svg>
    `;

    //Track active player
    let activePlayerIndex = 0;
    let activePlayerToken = players[activePlayerIndex].getToken(); //Assigns whatever token p1 has been passed as the default

    //Logic controlling functions
    const toggleActivePlayer = function() {
        activePlayerIndex = (activePlayerIndex + 1) % 2;
        activePlayerToken = players[activePlayerIndex].getToken()    
    }

    const assignTokens = function() {
        if (activePlayerToken === "X") {
            players[0].assignToken("O");
            players[1].assignToken("X");
        }
        else {
            players[0].assignToken("X");
            players[1].assignToken("O");
        }

        //active player is always player 1 at this stage
        activePlayerToken = players[0].getToken()

        //debugging statements
        console.log(`Player 1 token has changed to ${players[0].getToken()}`);
        console.log(`player 1 is active player and is ${activePlayerToken}`)
    }

    const unbindBtnEvents = function() {   
        for (btn of playerBtns) {
            btn.removeEventListener("click", assignTokens);
            btn.removeEventListener("click", renderPlayerTokens);
        }
    }

    //Returns array of corresponding cell in grid
    // const getUserMove = (evt) => {evt.target.id.split("-")}
    const getUserMove = function(evt) {
        return evt.currentTarget.id.split("-");
    }

    const shakeElement = function(element) {
        element.classList.remove("shake");
        element.offsetWidth;
        element.classList.add("shake")
    } 

    const handleCellClick = function(evt) {
        const move = getUserMove(evt);
        if (board.validateMove(move)) {
            board.updateBoard(move, activePlayerToken);
            board.updateMoveCounter();
            renderCellValue(evt);
            players[activePlayerIndex].updateCounters(move);
            toggleActivePlayer();
            renderCurrentPlayer();
        }
        else {
            shakeElement(grid)
        }
    }

    const handleWinner = function() {
       if (board.getMoveCounter() >= 5) {
        //fires after active player is toggled so need previous player
        const previous = 1 - activePlayerIndex;

        //If there is a winner
        if (players[previous].winCheck()) {
                players[previous].increaseWinCount();
                renderScore(previous);
                renderWinner(players[previous]);
                //TODO Reset board and render new board in UI with new functions on gameover screen
            }
        }
    }

    //Rendering functions
    const renderPlayerTokens = function() {

        if (activePlayerToken === "X") {
            p1TokenSVG.innerHTML = svgX;
            p2TokenSVG.innerHTML = svgO;
        }
        else {
            p1TokenSVG.innerHTML = svgO;
            p2TokenSVG.innerHTML = svgX;
        }
    }

    const renderCurrentPlayer = function() {
        turnTracker.textContent = `${activePlayerToken} make your move!`;
        playerBtns[activePlayerIndex].classList.add("player-active");
        playerBtns[1 - activePlayerIndex].classList.remove("player-active");
    }

    const renderCellValue = function(evt) {
        if (activePlayerToken === "X") {
            tokenSVG = svgX;
        }
        else {
            tokenSVG = svgO;
        }

        evt.currentTarget.innerHTML = tokenSVG;
    }

    const renderWinner = function(player) {
        const token = player.getToken();
        grid.hidden = true;
        gameOverScreen.style.display = "flex";
        turnTracker.textContent = "Round finished";
        gameOverToken.innerHTML = token === "X" ? svgX : svgO;
        gameOverMessage.textContent = "Win"
    }

    const renderScore = (winnerIndex) => {scores[winnerIndex].textContent = players[winnerIndex].getWinCount()}

    const renderNewGrid = function () {
        //TODO remove SVG from cells
        grid.hidden = false;
        gameOverScreen.display = "none";
    }

    //bind events
    for (btn of playerBtns) {
        btn.addEventListener("click", assignTokens);
        btn.addEventListener("click", renderPlayerTokens);
    }

    for (cell of cells) {
        cell.addEventListener("click", unbindBtnEvents); //Once game starts don't need token select on player btns
        cell.addEventListener("click", handleCellClick);
        cell.addEventListener("click", handleWinner);

    }

    //Run default functions
    renderPlayerTokens();
}

const Game = function() {

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