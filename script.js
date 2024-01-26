import {possibleWords} from "./words.js";

const WORD = possibleWords[Math.floor(Math.random() * possibleWords.length)];
const rows = document.getElementsByClassName("word-row");
const keyboardKeys = document.getElementsByClassName("keyboard-key");
let activeRow;

rows[0].classList.add("active-row");
for (const key of keyboardKeys) {
    if (key.textContent === "GİR") {
        key.addEventListener("click", () => {
            checkWord();
        })
    } else if (key.textContent === "SİL") {
        key.addEventListener("click", () => {
            deleteChar();
        })
    } else {
        key.addEventListener("click", () => {
            addChar(key.textContent);
        })
    }
}
function turkishUpperCase(text) {
    return text.replace(/i/g, "İ").toUpperCase();
}
function turkishLowerCase(text) {
    return text.replace(/I/g, "ı").toLowerCase();
}

function deleteChar() {
    for (const row of rows) {
        if (row.classList.contains("active-row")) {
            activeRow = row;
        }
    };
    if (activeRow) {
        const filledCells = activeRow.querySelectorAll(".filled:not(.correct-letter):not(.incorrect-letter):not(.contains-letter)");
        if (filledCells.length > 0) {
            filledCells[filledCells.length - 1].innerHTML = "";
            filledCells[filledCells.length - 1].classList.remove("filled");
        }
    }
}
function addChar(key) {
    // Find the active row
    for (const row of rows) {
        if (row.classList.contains("active-row")) {
            activeRow = row;
        }
    };
    // Check if the active row exists and has empty cells
    if (activeRow) {
        const emptyCells = activeRow.querySelectorAll(".letter-cell:not(.filled)");
        if (emptyCells.length > 0) {
            // Fill the first empty cell with the key character
            emptyCells[0].textContent = key === "i" ? "İ" : key.toUpperCase();
            emptyCells[0].classList.add("filled");
        }
    }
}

function checkWord() {
    let currRowNum;
    for (let i = 0; i < 6; i++) {
        let row = rows[i];
        if (row.classList.contains("active-row")) {
            activeRow = row;
            currRowNum = i;
        }
    }
    if (activeRow) {
        const filledCells = activeRow.querySelectorAll(".filled");
        if (filledCells.length === 5) {
            const guess = filledCells[0].textContent + filledCells[1].textContent + filledCells[2].textContent + filledCells[3].textContent + filledCells[4].textContent;
            if (guess === turkishUpperCase(WORD)) {
                for (let i = 0; i < 5; i++) {
                    filledCells[i].classList.add("correct-letter");
                }
                activeRow.classList.remove("active-row");
                alert("TEBRİKLER");
            } else if (possibleWords.includes(guess)) {
                let wordArray = turkishUpperCase(WORD).split("");
                while (Object.values(wordArray).length > 0) {
                    for (let i = 0; i < 5; i++) {
                        let letter = guess[i];
                        if (letter === WORD[i]) {
                            filledCells[i].classList.add("correct-letter");
                            document.getElementById(letter+"-key").classList.add("correct-letter");
                            delete wordArray[i];
                        }
                    }
                    for (let i = 0; i < 5; i++) {
                        let letter = guess[i];
                        if (wordArray.includes(letter) && (filledCells[i].classList.contains("correct-letter")) === false) {
                            filledCells[i].classList.add("contains-letter");
                            document.getElementById(letter+"-key").classList.add("contains-letter");
                            delete wordArray[wordArray.indexOf(letter)];
                        }
                    }
                    for (let i = 0; i < 5; i++) {
                        let letter = guess[i];
                        if (letter !== wordArray[i] && ((filledCells[i].classList.contains("contains-letter") || filledCells[i].classList.contains("correct-letter")) === false)) {
                            filledCells[i].classList.add("incorrect-letter");
                            document.getElementById(letter+"-key").classList.add("incorrect-letter");
                        }
                        delete wordArray[i];
                    }
                }
                activeRow.classList.remove("active-row");
                if (currRowNum === 5) {
                    alert("YANLIŞ! Kelime: " + WORD);
                } else {
                    rows[currRowNum + 1].classList.add("active-row");
                }
                // alert("YANLIŞ");
            } else {
                alert(turkishLowerCase(guess)+", geçerli bir kelime değildir.");
            }
        }
    }
}

document.addEventListener('keydown', function(event) {
    const key = event.key;
    if (key.length === 1 && key.match(/[a-zğüşıöç]/i)) {
        addChar(key);
    } else if (key === 'Enter') {
        checkWord();
    } else if (key === 'Backspace') {
        deleteChar();
    }
});