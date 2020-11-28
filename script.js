
let matchResult = document.querySelector(".playerInfo__result");

/*PLAYERS OBJECT*/
const Players = () => {
    let _score = null;
    let _name = null;
    let _sign = null;

    const setParams = () => {    
        const playerName = document.querySelector(".player__name");
        const playerSign = document.querySelector(".player__sign");
        _name = playerName.value;
        _sign = playerSign.textContent;
        _score = 0;
        playerName.value = "";
    };
    
    const setAI = () => {
        _name = "Computer";
        _sign = "O";
        _score = 0;
    }

    const reset = () => {
        _score = null;
        _name = null;
        _sign = null;
    }
    

    const addPoint = () => _score++;
    const getName = () => _name;
    const getSign = () => _sign;
    const getScore = () => _score;

    const announceWinner = () =>{
        matchResult.textContent = `${_name} win the match`
    }


    const logParams = () => {
        console.log(_name);
        console.log(_sign);
        console.log(_score);
    };
    
    return {setParams, setAI, getName, getSign, logParams, addPoint, getScore, announceWinner, reset}
}

     
/*DISPLAY CONTROLLERS OBJECT*/
const DisplayControllers = (() => {
    let _mode = null;
    const _playerInfo = document.querySelector(".playerInfo");
    const _gameMode = document.querySelector(".gameMode");
    const _resetWrapper = document.querySelector(".resetWrapper");
    let _inputs = document.querySelector(".inputs");

    const _reset = function () {
        const wrapper = document.querySelector(".wrapper");
        wrapper.style.display = "none";
        _playerInfo.style.display = "none";
        _resetWrapper.style.display = "none";
        _gameMode.style.display = "grid";
        _mode = null;
        matchResult.textContent = "";
        playerOne.reset();
        playerTwo.reset();
    };

    const _showReset = function () {
        let resetButton = document.querySelector(".resetButton");
        resetButton.addEventListener("click", () => _reset());
        _resetWrapper.style.display = "flex";
    };

    const showPlayersInfo = function () {
        let playerOneName = document.querySelector(".playerInfo__1__name");
        let playerTwoName = document.querySelector(".playerInfo__2__name");
        let playerOneScore = document.querySelector(".playerInfo__1__score");
        let playerTwoScore = document.querySelector(".playerInfo__2__score");

        _playerInfo.style.display = "grid";
        playerOneName.textContent = playerOne.getName();
        playerTwoName.textContent = playerTwo.getName();
        playerOneScore.textContent = playerOne.getScore();
        playerTwoScore.textContent = playerTwo.getScore();
    };
      
    const setMode = function() {
        console.log(this.value);/* */
        _mode = this.value;
        _checkMode();             
    };

    const _singlePlayer = function() {
        const playerName = document.querySelector(".player__name");

        submitPlayer.addEventListener("click", () => {
            if (!playerOne.getName()) {
                if (playerName.value != "") {
                    playerOne.setParams();
                    playerTwo.setAI();
                    _inputs.style.display = "none";
                    GameBoard.resetBoard();
                    _showReset();
                    showPlayersInfo();
                }
            }
        });
    };
        
    const _multiplayer = function() { 
        const playerName = document.querySelector(".player__name");
        let playerLabel = document.querySelector(".player__label");
        let playerSign = document.querySelector(".player__sign");

        submitPlayer.addEventListener("click", () => {
            if (!playerOne.getName()) {
                if (playerName.value != "") {
                    playerOne.setParams();
                    playerSign.textContent = "O";
                    playerLabel.textContent = "Player 2";
                }
            }else {
                if (playerName.value != "") {
                    playerTwo.setParams();
                    playerSign.textContent = "X";
                    playerLabel.textContent = "Player 1";
                    _inputs.style.display = "none";
                    GameBoard.resetBoard();
                    _showReset(); 
                    showPlayersInfo();
                                   
                }
            }
        });
    };
    
    const _checkMode = function () {

        if (_mode == "multiplayer") {
            _gameMode.style.display = "none";
            _inputs.style.display = "grid";
            _multiplayer();           
        } else if (_mode == "singleplayer"){
            _gameMode.style.display = "none";
            _inputs.style.display = "grid";
            _singlePlayer();
        }
        
    };

    const displayMode = function () {
        return _mode;
    };

    return {setMode, showPlayersInfo, displayMode}

})();


const modes = document.querySelectorAll(".gameMode__mode");
modes.forEach(mode => { mode.addEventListener("click", DisplayControllers.setMode.bind(mode)) });

const submitPlayer = document.querySelector(".submitPlayer");
let playerOne = Players();
let playerTwo = Players();



let GameBoard = (() => {
    let _board = [[null, null, null], [null, null, null], [null, null, null]];
    let _flag = true;
    let _AIrowIndex = null;
    let _AIcellIndex = null;
    const _wrapper = document.querySelector(".wrapper");

    const _changeTurn = function () {
        if (_flag == true) {
            _flag = false;
            return playerOne.getSign();
        } else {
            _flag = true;
            return playerTwo.getSign();
        }
    };

    const _displayTurn = function () {
        let turn = document.querySelector(".playerInfo__turn")
        if (_flag == true) {
            turn.innerHTML = `${playerOne.getName()} is your turn`;
        } else {
            turn.innerHTML = `${playerTwo.getName()} is your turn`;
        }
    };

    
    const _evaluation = (winner) => {
            if(winner == "X"){
                return -1;
            }else if(winner == "O"){
                return 1;
            }
            else{
                return null;
            }
    };

    const _evaluationFunction = function (board) {
                /*CHECK 1 DIAG*/
            if (board[0][0] === board[1][1] && board[2][2] === board[0][0]) {
                return _evaluation(board[0][0]);
                /*CHECK 2 DIAG*/
            } 
            if (board[0][2] === board[1][1] && board[2][0] === board[0][2]) {
                return _evaluation(board[0][2]);
                /*CHECK PAIR*/
            } 
            for (let col = 0; col < 3; col++) {
                if (board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
                    return _evaluation(board[0][col]);
                }
            }
            for (let row = 0; row < 3; row++) {
                if (board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
                    return _evaluation(board[row][0]);
                }
            }
            return 0;        
    };

    const minimax = (_board, depth, isMaximizer) => {

        let result = _evaluationFunction(_board);
        if (result !== null) {
            return result;
        }

        if (isMaximizer) {
            let bestScore = -Infinity;

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (_board[i][j] == null) {
                        _board[i][j] = playerTwo.getSign();
                        let score = minimax(_board, depth + 1, false);
                        _board[i][j] = null;
                        bestScore = Math.max(score, bestScore);
                    }
                }

            }
            return bestScore;

        } else {
            let bestScore = Infinity;

            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (_board[i][j] == null) {
                        _board[i][j] = playerOne.getSign();
                        let score = minimax(_board, depth + 1, true);
                        _board[i][j] = null;
                        bestScore = Math.min(score, bestScore);
                    }
                }
            }
            return bestScore;
        }
    };
    
    const _setAIPlay = () => {
        
        let bestScore = -Infinity;
        let bestMove;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (_board[i][j] == null) {
                    _board[i][j] = playerTwo.getSign();
                    let score = minimax(_board, 0, false);
                    _board[i][j] = null;
                    if(score > bestScore){
                        bestScore = score;
                        bestMove = {i, j}
                    }
                }
            }
        };

        _board[bestMove.i][bestMove.j] = playerTwo.getSign();
        _AIrowIndex = bestMove.i;
        _AIcellIndex = bestMove.j;
        _displayAIPlay(_AIrowIndex, _AIcellIndex);
        _changeTurn();
        _checkWinner();
    };

    


    const _displayAIPlay = (rowIndex, cellIndex) => {
        let AIcell = document.querySelector(`[data-row="${rowIndex}"][data-cell="${cellIndex}"]`);
        AIcell.textContent = playerTwo.getSign();
    }

    

    const _renderSingleplayerBoard = function () {
        _wrapper.style.display = "grid";
        for (let row = 0; row < 3; row++) {
            let rows = document.createElement("div");
            rows.classList.add("row");
            for (let cell = 0; cell < 3; cell++) {
                let cells = document.createElement("div");
                cells.dataset.row = row;
                cells.dataset.cell = cell;
                _displayTurn();
                cells.addEventListener("click", () => {
                    if (_board[row][cell] == null) {
                        _board[row][cell] = playerOne.getSign();
                        cells.textContent = _board[row][cell];
                        matchResult.textContent = "";
                        _checkWinner();
                        _changeTurn();
                        _setAIPlay();   
                    }
                });
                rows.appendChild(cells);
            }
            _wrapper.appendChild(rows);
        }
    };

    const _renderMultiplayerBoard = function () {
        _wrapper.style.display = "grid";
        _board.forEach((row, rowIndex) => {
            let rows = document.createElement("div");
            rows.classList.add("row");
            row.forEach((cell, cellIndex) => {
                let cells = document.createElement("div");
                _displayTurn();
                cells.addEventListener("click", () => {
                    if (_board[rowIndex][cellIndex] == null) {
                        _board[rowIndex][cellIndex] = _changeTurn();
                        _displayTurn();
                        matchResult.textContent = "";
                        cells.textContent = _board[rowIndex][cellIndex];
                        _checkWinner();
                    }
                });
                rows.appendChild(cells);
            });
            _wrapper.appendChild(rows);
        });
    };

    const resetBoard = function() {
        let rows = document.querySelectorAll(".row");
        _board = [[null, null, null], [null, null, null], [null, null, null]];
        rows.forEach(row => {_wrapper.removeChild(row)});
        DisplayControllers.displayMode() == "multiplayer" ? _renderMultiplayerBoard() : _renderSingleplayerBoard();         
    };

    

    
    const _findWinner = function(winner) {
        if(winner != null){
            winner == "X" ? playerOne.addPoint() : playerTwo.addPoint()
            winner == "X" ? playerOne.announceWinner() : playerTwo.announceWinner()
            resetBoard();
            DisplayControllers.showPlayersInfo();  
        }      
    };

    

    const _checkWinner = function() {     
        (function(){      
            /*CHECK 1 COLUMUN*/
            if (this[0][0] === this[1][0] && this[0][0] === this[2][0] && this[0][0]){
                console.log("Winner");
                _findWinner(this[0][0]);          
            /*CHECK 2 COLUMUN*/
            } else if (this[0][1] === this[1][1] && this[0][1] === this[2][1] && this[0][1]){
                console.log("Winner");
                _findWinner(this[0][1]);
            /*CHECK 3 COLUMUN*/
            } else if (this[0][2] === this[1][2] && this[0][2] === this[2][2] && this[0][2]){
                console.log("Winner");
                _findWinner(this[0][2]);
            /*CHECK 1 DIAG*/
            } else if (this[0][0] === this[1][1] && this[2][2] === this[0][0] && this[0][0]){
                console.log("Winner");
                _findWinner(this[0][0]);
            /*CHECK 2 DIAG*/
            } else if (this[0][2] === this[1][1] && this[2][0] === this[0][2] && this[0][2]) {
                console.log("Winner");
                _findWinner(this[0][2]);
            /*CHECK PAIR*/
            } else if (this.every(row => !row.includes(null))){
                console.log("pair");
                matchResult.textContent = "The match finished pair"
                resetBoard();
            }
            /*CHECK ROW*/
            this.forEach(row => {
                if (row[0] === row[1] && row[0] === row[2] && row[0]) {
                    console.log("Winner");
                    _findWinner(row[0]);
                } 
            });  
        }).call(_board);  
    };

    

    const logBoard = function() {
        return _board;
    }

    return {logBoard, resetBoard};
    
})();




