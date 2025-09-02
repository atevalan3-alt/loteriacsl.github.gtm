// Definimos los símbolos (nombre y el nombre del archivo de la imagen)
// **Asegúrate de que los nombres de los archivos coincidan con tus imágenes en la carpeta 'images'**
const symbols = [
    { name: "Monja Blanca", fileName: "5.png" },
    { name: "Ceiba", fileName: "4.png" },
    { name: "Quetzal", fileName: "3.png" },
    { name: "Tecún Umán", fileName: "7.png" },
    { name: "Bandera de Guatemala", fileName: "1.png" },
    { name: "Escudo de Armas", fileName: "2.png" },
    { name: "Marimba", fileName: "6.png" },
    { name: "Tambor", fileName: "11.png" },
    { name: "Maracas", fileName: "10.png" },
    { name: "Volcán de Agua", fileName: "13.png" },
    { name: "Lago de Atitlán", fileName: "9.png" },
    { name: "Volcán de Fuego", fileName: "12.png" },
    { name: "Tikal", fileName: "8.png" },
    { name: "Antigua Guatemala", fileName: "14.png" },
    { name: "Popol Vuh", fileName: "15.png" },
    { name: "Traje Típico", fileName: "16.png" },
    { name: "Iglesia Santo Tomas", fileName: "17.png" },
    { name: "El Baile del Venado", fileName: "18.png" },
    { name: "La Antorcha", fileName: "19.png" },
    { name: "Los Platillos Tipicos", fileName: "20.png" }

];

// Variables del juego
let playerName = '';
let playerBoard = [];
let markedCells = 0;
let drawnSymbols = [];
let gameInterval;
let spinInterval;

// Referencias a los elementos del DOM
const loginScreen = document.getElementById('login-screen');
const gameScreen = document.getElementById('game-screen');
const winnerScreen = document.getElementById('winner-screen');
const playerForm = document.getElementById('player-form');
const playerNameInput = document.getElementById('player-name');
const playerDisplay = document.getElementById('player-display');
const currentSymbolDisplay = document.getElementById('current-symbol');
const boardContainer = document.getElementById('board-container');
const loteriaButton = document.getElementById('loteria-button');

// Función para generar una tarjeta de lotería aleatoria de 3x3
function createRandomBoard() {
    const shuffledSymbols = symbols.sort(() => 0.10 - Math.random());
    return shuffledSymbols.slice(0, 9);
}

// Función para dibujar la tarjeta del jugador en la pantalla con imágenes
function renderBoard(board) {
    boardContainer.innerHTML = '';
    board.forEach(symbol => {
        const cell = document.createElement('div');
        cell.classList.add('card-cell');
        cell.dataset.name = symbol.name;
        
        const img = document.createElement('img');
        img.src = `./La Bandera/${symbol.fileName}`; // Ruta relativa a la carpeta de imágenes
        img.alt = symbol.name;
        
        cell.appendChild(img);
        cell.addEventListener('click', handleCellClick);
        boardContainer.appendChild(cell);
    });
}

// Lógica para marcar una celda
function handleCellClick(event) {
    const cell = event.target.closest('.card-cell');
    if (!cell) return;

    const symbolName = cell.dataset.name;
    const isDrawn = drawnSymbols.some(s => s.name === symbolName);

    if (isDrawn && !cell.classList.contains('marked')) {
        cell.classList.add('marked');
        markedCells++;

        if (markedCells === 9) {
            loteriaButton.classList.remove('hidden');
        }
    }
}

// Función para iniciar el sorteo de símbolos (la ruleta)
function startDrawingSymbols() {
    let availableSymbols = symbols.filter(s => !drawnSymbols.some(ds => ds.name === s.name));
    
    if (availableSymbols.length === 0) {
        clearInterval(gameInterval);
        return;
    }

    const currentSymbol = availableSymbols[Math.floor(Math.random() * availableSymbols.length)];
    let spinCount = 0;
    const maxSpin = 5;

    spinInterval = setInterval(() => {
        if (spinCount < maxSpin) {
            const tempSymbol = symbols[Math.floor(Math.random() * symbols.length)];
            currentSymbolDisplay.innerHTML = `<img id="current-symbol-img" src="./La Bandera/${tempSymbol.fileName}" alt="${tempSymbol.name}">`;
            spinCount++;
        } else {
            clearInterval(spinInterval);
            currentSymbolDisplay.innerHTML = `<img id="current-symbol-img" src="./La Bandera/${currentSymbol.fileName}" alt="${currentSymbol.name}">`;
            drawnSymbols.push(currentSymbol);
            
            gameInterval = setTimeout(startDrawingSymbols, 1500);
        }
    }, 200);
}

// Lógica principal al enviar el formulario
playerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    playerName = playerNameInput.value;
    if (playerName) {
        loginScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        playerDisplay.textContent = `Jugador: ${playerName}`;
        playerBoard = createRandomBoard();
        renderBoard(playerBoard);
        startDrawingSymbols();
    }
});

// Lógica al presionar el botón de "¡Lotería!"
loteriaButton.addEventListener('click', () => {
    if (markedCells === 9) {
        clearTimeout(gameInterval);
        gameScreen.classList.add('hidden');
        winnerScreen.classList.remove('hidden');
        document.getElementById('winner-name').textContent = `¡${playerName} ha ganado!`;
    }
});