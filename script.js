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

function Player() {
    
    let name = '';
    let token = '';

    // Counters for player's progress on rows, columns, and diagonals
    const rowCounters = [0, 0, 0];
    const colCounters = [0, 0, 0];
    const diagCounters = [0, 0];  // diagCounters[0] = top-left to bottom-right, diagCounters[1] = top-right to bottom-left

    const setName = (input) => name = input; 

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
        setName,
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
    const setNameBlock = document.getElementById("set-name-block");
    const p1Info = document.getElementById("p1-info");
    const p2Info = document.getElementById("p2-info");
    const p1DisplayName = document.getElementById("p1-display-name");
    const p2DisplayName = document.getElementById("p2-display-name");
    const gameContainer = document.getElementById("game-container");
    
    const createBoardGrid = function(rows, cols) {
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

    //Open a dialog
    const openModal = function (dialog) {
        dialog.showModal();
    }

    //Handle when user clicks outside of a dialog to close it
    const handleOutsideClick = function(event, dialog) {
        const dialogDimensions = dialog.getBoundingClientRect();
        if (
            event.clientX < dialogDimensions.left ||
            event.clientX > dialogDimensions.right ||
            event.clientY < dialogDimensions.top ||
            event.clientY > dialogDimensions.bottom
        ) {
            dialog.close()
        } 
    }

    const handleNameFormSubmit = function(event, dialog, player1, player2) {
        event.preventDefault();

        const p1NameInput = document.getElementById("p1-name-input");
        const p2NameInput = document.getElementById("p2-name-input");

        const p1Name = p1NameInput.value
        const p2Name = p2NameInput.value

        if(p1Name && p2Name) {
            //If both values present when submitted, set both player names
            player1.setName(p1Name);
            player2.setName(p2Name);

            //Log for testing purposes
            console.log(`Player 1: ${player1.getName()}, Player 2: ${player2.getName()}`)

            //Hide set-name-block in aside
            setNameBlock.style.display = "none";

            //Show player info in aside
            p1Info.style.display = "block";
            p2Info.style.display = "block";
            
            //Set display names
            p1DisplayName.textContent = player1.getName();
            p2DisplayName.textContent = player2.getName();

            //Close name dialog
            dialog.close()
        }

    }

    const setUpNameModal = function(player1, player2) {
        const nameDialog = document.getElementById("name-dialog");
        const setNameBtn = document.getElementById("set-name-btn");
        const nameForm = document.getElementById("name-form");

        // Add event listener to button that opens modal
        setNameBtn.addEventListener("click", () => openModal(nameDialog));

        //Add event listener for closing module when clicking outside it
        nameDialog.addEventListener("click", (event => handleOutsideClick(event, nameDialog)))

        // Add event listener to handle form submission
        nameForm.addEventListener("submit" , (event) => handleNameFormSubmit(event, nameDialog, player1, player2))

        //Open the name dialog by default
        nameDialog.showModal();
    }

    const setUpTokenModal = function(player1, player2) {
        const tokenDialog = document.getElementById("token-dialog");

        //Open the token dialog by default
    }

    return {
        createBoardGrid,
        setUpNameModal,
        setUpTokenModal
    }
} 

function gameController() {
    const toggleActivePlayer = () => {activePlayerIndex = (activePlayerIndex + 1) % 2} 

    //Initialise gameboard and UI
    const board = Gameboard();
    const ui = UIConroller();

    //Create UI grid
    const rows = board.getRowCount();
    const cols = board.getColCount();
    ui.createBoardGrid(rows, cols);

    // Initialise players
    const player1 = Player();
    const player2 = Player();
    const players = [player1, player2];

}
    // player1.assignToken('X');
    // player2.assignToken(player1.getToken() === "X" ? "O" : "X");

    // console.log(`Player 1 has been assigned ${player1.getToken()}. Player 2 has been assigned ${player2.getToken()}.`)

    
    // let activePlayerIndex = 0
    // let moveCounter = 0
    
gameController();


