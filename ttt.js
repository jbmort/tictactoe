let docPrompt = document.getElementById('prompt');
let boardButton = document.getElementsByClassName('button');
let resetButton = document.getElementById('reset');
let humScore = document.getElementById('human');
let compScore = document.getElementById('comp');
let inputs = document.getElementsByTagName('input')
let opButton = document.getElementById('opButton')

let humanScore = (function(){
    let humanScore = 0;
    function getHScore(){
        return humanScore;
    };
    function humWin() {
        ++humanScore
    };
    return {score: getHScore, win: humWin}
})();

let cScore = (function(){
    let compScore = 0;
    function getCScore(){
        return compScore;
    };
    function compWin(){
        ++compScore
    };
    return {score: getCScore, win: compWin}
})();

let gameCount = (function(){
    let count = 0
    let turn = 0
    let add = () => {
        ++count}
    let nextTurn = () => {
        ++turn
    }
    let getTurn = () => {
        return turn
    }
    let getCount = () =>{
        return count}
    return {change: add, get: getCount, turn: getTurn, next: nextTurn}
})()

let Gameboard = {
    colorize: ()=>{
        for(i=0; i<boardButton.length; i++){
            let compColor = document.getElementById('compColor');
            let humColor = document.getElementById('humColor');
            if(boardButton[i].innerText==="X"){
                boardButton[i].style.color=humColor.value;
            }
            if(boardButton[i].innerText==="O"){
                boardButton[i].style.color=compColor.value;
            }
            humScore.style.color=humColor.value;
            compScore.style.color=compColor.value;
        }
    },
    reset: () => {
        Human.choices = [];
        Comp.choices = [];
        HumanTwo.choices = [];
        for(i=0; i<boardButton.length; i++){
            boardButton[i].innerHTML = "";
        };
        docPrompt.innerText = " ";
        start();
        },
    end:  () => {for (i=0; i<boardButton.length; i++){
        boardButton[i].removeEventListener('click', Gameboard.click)
        }
        resetButton.innerText = "Play Again";
        setTimeout(Gameboard.reset, "2000");
        },
    button: (value) => {return boardButton[value];},
    humUpdate: () => {
        for(i=0; i<Human.choices.length; i++){
            Gameboard.button((Human.choices[i])-1).innerText = 'X';}
            Gameboard.colorize();
        if (Gameboard.check(Human.choices)){
            console.log('win')
            humanScore.win();
            if(gameCount.get() % 2 == 0 || gameCount.get() == 0){
            docPrompt.innerText = Human.prompt();}
            else if(gameCount.get() % 2 != 0){
                docPrompt.innerText = "Player One Wins"
            };
            humScore.innerText = "Player One Score: " + humanScore.score();
            Gameboard.end();
        }
        else if (Human.choices.length + Comp.choices.length == 9){
            docPrompt.innerText = 'Tie';
            Gameboard.end();
        }
        else if (gameCount.get() % 2 == 1){
            gameCount.next;
            humScore.style.fontWeight = 100;
            compScore.style.fontWeight = 900}
        else {setTimeout(Comp.compValue, "400");}
    },
    compUpdate: () => {
        console.log('update');
        for(j=0; j<Comp.choices.length; j++){
            Gameboard.button((Comp.choices[j])-1).innerText = 'O';
        };
        Gameboard.colorize();
        if (Gameboard.check(Comp.choices)){
            console.log('lose')
            cScore.win();
            docPrompt.innerText = Comp.prompt();
            compScore.innerText = "Computer Score: " + cScore.score();
            Gameboard.end();
        };
    },
    check: (array) => {
        if(array.includes('1') && array.includes('2') && array.includes('3') ||
        array.includes('4') && array.includes('5') && array.includes('6') ||
        array.includes('7') && array.includes('8') && array.includes('9') ||
        array.includes('1') && array.includes('4') && array.includes('7') ||
        array.includes('2') && array.includes('5') && array.includes('8') ||
        array.includes('3') && array.includes('6') && array.includes('9') ||
        array.includes('1') && array.includes('5') && array.includes('9') ||
        array.includes('3') && array.includes('5') && array.includes('7'))
        {return 'true';}
    },
    // winCombo: [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['1', '4', '7'], ['2', '5', '8'], ['3', '6', '9'], ['1', '5', '9'], ['3', '5', '7']],
    click: (event) => {
        let number = event.target.id;
        if (gameCount.get() % 2 == 0 || gameCount.get() == 0){
        Human.humTurn(number);}
        else if (gameCount.get() % 2 == 1){
            if (gameCount.turn() % 2 == 0 || gameCount.turn() == 0){
                Human.humTurn(number)
            }
            if (gameCount.turn() % 2 == 1){
                HumanTwo.humTurn(number)
            }
        }
    }
}

let Human = {
    choices: [],
    humTurn: (value) => {
            if (Human.choices.includes(String(value))){
                return;
            }
            if (Comp.choices.includes(String(value))){
                return;
            }
            if (HumanTwo.choices.includes(String(value))){
                return;
            }
            else{
                Human.choices.push(String(value));
                if (gameCount.get() % 2 == 1){ gameCount.next()}
                Gameboard.humUpdate(); 
            }
    },
    win: ["you WIN!!!", "You defeated the computer!", "Great job! You won!"],
    prompt: () => {
        let humPrompt = Human.win[Math.round(Math.random()*(Human.win.length - 1))]
        return humPrompt;
    },
}

let HumanTwo = {
    choices: [],
    humTurn: (value) => {
            if (HumanTwo.choices.includes(String(value))){
                return;
            }
            if (Human.choices.includes(String(value))){
                return;
            }
            else{
                HumanTwo.choices.push(String(value));
                gameCount.next();
                HumanTwo.humUpdate(); 
            }
    },
    humUpdate: () => {
        for(i=0; i<HumanTwo.choices.length; i++){
            Gameboard.button((HumanTwo.choices[i])-1).innerText = 'O';}
            Gameboard.colorize();
        if (Gameboard.check(HumanTwo.choices)){
            console.log('win')
            cScore.win();
            docPrompt.innerText = "Player Two Wins"
            compScore.innerText = "Player Two Score: " + cScore.score();

            Gameboard.end();
        }
        else if (Human.choices.length + HumanTwo.choices.length == 9){
            docPrompt.innerText = 'Tie';
            Gameboard.end();
        }
        humScore.style.fontWeight = 900;
        compScore.style.fontWeight = 100;

    },
    win: ["you WIN!!!", "You defeated the computer!", "Great job! You won!"],
}


let Comp = {
    choices: [],
    compValue: () => {
        let value = (Math.floor(Math.random()*9))+1
        console.log(value);
        if (Human.choices.length >= 5){return};
        if(Comp.choices.includes(String(value)) || Human.choices.includes(String(value))){
            Comp.compValue();
        }
        else {
            Comp.choices.push(String(value));
            Gameboard.compUpdate();
        }
    },
    checkWin: (array) => {array.every((value) => {return Comp.choices.includes(value)})},
    win: ["The Computer Won", "Better luck next time", "Gotta be smarter than the computer"],
    prompt: () => {
        let compPrompt = Comp.win[Math.round(Math.random()*(Comp.win.length - 1))]
        return compPrompt;
    },
    }

    
start();
function start(){
    for (i=0; i<boardButton.length; i++){
    boardButton[i].addEventListener('click', Gameboard.click)
    };
    resetButton.innerText = "RESET";
    resetButton.addEventListener('click', Gameboard.reset);
    for (let index = 0; index < inputs.length; index++) {
        inputs[index].addEventListener('change', Gameboard.colorize)
    };
    opButton.addEventListener('click', changeOpp)
}

function changeOpp() {
        gameCount.change();
        if (gameCount.get() % 2 == 0 || gameCount.get() == 0){
            opButton.innerText = 'Human'
            compScore.innerText = "Computer Score: " + cScore.score();
        }
        if (gameCount.get() % 2 != 0){
            opButton.innerText = 'Computer'
            compScore.innerText = "Player Two Score: " + cScore.score();
        }
    }