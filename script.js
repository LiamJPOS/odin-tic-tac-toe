function Player(defaultToken) {
    let token = defaultToken;

     // Counters for player's progress on rows, columns, and diagonals
     let rowCounters = [0, 0, 0];
     let colCounters = [0, 0, 0];
     let diagCounters = [0, 0];  // diagCounters[0] = top-left to bottom-right, diagCounters[1] = top-right to bottom-left

     let winCount = 0;

     const assignToken = (choice) => token = choice;

     const getToken = () => token;

     const updateCounters = (move) => {
        const row = Number(move[0]);
        const col = Number(move[1]);

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

    const resetCounters = () => {
        rowCounters = [0, 0, 0];
        colCounters = [0, 0, 0];
        diagCounters = [0, 0]
    }

    const winCheck = () => rowCounters.includes(3) || colCounters.includes(3) || diagCounters.includes(3);

    const increaseWinCount = () => {winCount++};

    const getWinCount = () => winCount;

    const resetWinCount = () => {winCount = 0};

    return {
        assignToken,
        getToken,
        updateCounters,
        winCheck,
        increaseWinCount,
        getWinCount, 
        resetCounters,
        resetWinCount
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

    const resetValue = () => {cellValue = null};

    return { 
        getValue,
        setValue,
        resetValue
    }
}

function Gameboard() {
    const rows = 3;
    const cols = 3;
    const board = [];
    
    //Track moves made on the board
    let moveCounter = 0;

    const newBoard = function() {
        for (let i = 0; i < rows; i++){
            board.push([])
            for(let j = 0; j < cols; j++){
                board[i].push(Cell())
            }
        }
    }

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

    const resetMoveCounter = () => {moveCounter = 0}

    const resetBoard = function () {
        for (let row of board) {
            for (let cell of row) {
                cell.resetValue()
            }
        }
    }

    //Default board when object intiialised
    newBoard();

    return {
        printBoard,
        updateBoard,
        validateMove,
        updateMoveCounter,
        getMoveCounter, 
        resetMoveCounter, 
        newBoard,
        resetBoard
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
    const scores = document.querySelectorAll(".score");
    const gameOverScreen = document.getElementById("gameover-screen");
    const gameOverToken = document.getElementById("gameover-token-div");
    const gameOverMessage = document.getElementById("gameover-message");
    const softResetBtn = document.getElementById("soft-reset-btn");
    const hardResetBtn = document.getElementById("hard-reset-btn")
    
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
    }

    const unbindBtnEvents = function() {   
        for (btn of playerBtns) {
            btn.removeEventListener("click", assignTokens);
            btn.removeEventListener("click", renderPlayerTokens);
        }
    }

    //Returns array of corresponding cell in grid
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
                renderRoundEnd();
                renderWinner(players[previous]);
            }
        //If there is a draw
        if (board.getMoveCounter() === 9) {
            renderRoundEnd();
            renderDraw();
        }
        }
    }

    const newRound = function() {
        board.resetBoard();
        board.resetMoveCounter()
        for (player of players) {
            player.resetCounters();
        }
    }

    const handleHardReset = function() {
        //Reset win counters
        for (player of players) {
            player.resetWinCount();
        }
        //Render scores as 0
        for (let i = 0; i < 2; i++) {
            renderScore(i)
        }
        //Rebind token selection events
        for (btn of playerBtns) {
            btn.addEventListener("click", assignTokens);
            btn.addEventListener("click", renderPlayerTokens);
        }
        
        //Reset player index and token
        activePlayerIndex = 0;
        activePlayerToken = "X"

        //render current player
        renderCurrentPlayer();

        //Reset turn tracker message
        turnTracker.textContent = "Start game or select token";
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

    const renderRoundEnd = function() {
        grid.hidden = true;
        gameOverScreen.style.display = "flex";
        turnTracker.textContent = "Round finished";
    }

    const renderWinner = function(player) {
        const token = player.getToken();
        gameOverToken.innerHTML = token === "X" ? svgX : svgO;
        gameOverToken.style.display = "block"
        gameOverMessage.textContent = "Win"
    }

    const renderDraw = function() {
        gameOverToken.style.display = "none"
        gameOverMessage.textContent = "Draw"
    }
    
    const renderScore = (winnerIndex) => {scores[winnerIndex].textContent = players[winnerIndex].getWinCount()}

    const renderNewGrid = function () {
        grid.hidden = false;
        gameOverScreen.style.display = "none";
        //Remove SVGs from grid
        for (cell of cells) {
            cell.innerHTML = '';
        }
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

    softResetBtn.addEventListener("click", renderNewGrid);
    softResetBtn.addEventListener("click", newRound);

    hardResetBtn.addEventListener("click", renderNewGrid)
    hardResetBtn.addEventListener("click", newRound)
    hardResetBtn.addEventListener("click", handleHardReset)

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