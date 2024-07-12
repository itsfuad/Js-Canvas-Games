const canvas = document.getElementById('canvas');
const cells = [].slice.call(document.getElementsByClassName('cell'));
const message = document.getElementsByClassName('message')[0];
const text = document.getElementsByClassName('text')[0];
const close = document.getElementsByClassName('close')[0];
const hint = document.getElementsByClassName('hint')[0];
let button = Math.round(Math.random());
let turn = button ? '😘' : '💙';
let pc_turn = button ? '💙' : '😘';
let played_tiles = 0;



console.log(`${turn} is your symbol`);
hint.innerText += turn;

if (!button) {
    computer();
}

function who(state) {
    if (state == 1) {
        if (turn == '💙') {
            text.innerText = "You won";
        } else {
            text.innerText = "Computer won";
        }
        message.classList.add('active');
    } else if (state == 2) {
        if (turn == '😘') {
            text.innerText = "You won";
        } else {
            text.innerText = "Computer won";
        }
        message.classList.add('active');
    } else if (state == 3) {
        text.innerText = "Tie";
        message.classList.add('active');
        return;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

cells.forEach(cell => {
    cell.addEventListener('click', () => {
        if (cell.innerText != '💙' && cell.innerText != '😘') {
            cell.style.color = button ? '#ff6969' : 'skyblue';
            cell.innerText = turn;
            played_tiles++;
            who(win());
            computer();

        }



    });
});


function computer() {
    let pc_pos = Math.floor(Math.random() * 8);


    console.log(played_tiles);
    if (played_tiles >= 9) {
        who(win() ? 0 : 3);
    } else if (cells[pc_pos].innerText != '💙' && cells[pc_pos].innerText != '😘') {

        cells[pc_pos].innerText = pc_turn;
        cells[pc_pos].style.color = !button ? '#ff6969' : 'skyblue';
        played_tiles++;
        who(win());

    } else {
        computer();
    }
}

// Define the winning combinations
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Function to check if a player has won
function checkWin(player) {
    return winningCombinations.some(combination => {
        return combination.every(index => cells[index].innerText === player);
    });
}

// Main win function
function win() {
    if (checkWin('💙')) {
        return 1;
    } else if (checkWin('😘')) {
        return 2;
    }
    return 0;
}

function reset() {
    cells.forEach(cell => {
        cell.innerText = '';
    });
    played_tiles = 0;
    button = Math.round(Math.random());
    turn = button ? '😘' : '💙';
    pc_turn = button ? '💙' : '😘';
    hint.innerText = `Your Symbol is ${turn}`;
    message.classList.remove('active');
}
close.addEventListener('click', () => {
    reset();
})