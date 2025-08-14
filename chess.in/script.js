// Basic chess logic and rendering (expand for full rules & multiplayer)
const PIECES = {
  p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚",
  P: "♙", R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔"
};

let board = [
  ["r","n","b","q","k","b","n","r"],
  ["p","p","p","p","p","p","p","p"],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["P","P","P","P","P","P","P","P"],
  ["R","N","B","Q","K","B","N","R"]
];
let selected = null, moves = [], turn = "w", localPlay = true;
const boardDiv = document.getElementById("chess-board");
const infoDiv = document.getElementById("game-info");

function renderBoard() {
  boardDiv.innerHTML = "";
  for(let r=0; r<8; r++)
    for(let c=0; c<8; c++) {
      const cell = document.createElement("div");
      cell.className = "chess-cell" + ((r+c)%2 ? " dark" : "");
      cell.dataset.row = r;
      cell.dataset.col = c;
      if(selected && selected[0] === r && selected[1] === c)
        cell.classList.add("selected");
      if(moves.some(([mr,mc]) => mr===r && mc===c))
        cell.classList.add("move");
      if(board[r][c]) {
        cell.innerHTML = `<span class="chess-piece">${PIECES[board[r][c]]}</span>`;
      }
      cell.onclick = () => onCellClick(r, c);
      boardDiv.appendChild(cell);
    }
}
function onCellClick(r, c) {
  if(localPlay) {
    if(selected && moves.some(([mr,mc])=>mr===r&&mc===c)) {
      board[r][c] = board[selected[0]][selected[1]];
      board[selected[0]][selected[1]] = "";
      selected = null; moves = [];
      turn = turn === "w" ? "b" : "w";
      infoDiv.textContent = `${turn === "w" ? "White" : "Black"}'s turn`;
      renderBoard();
    } else if(board[r][c] && ((turn==="w" && board[r][c]==board[r][c].toUpperCase()) || (turn==="b" && board[r][c]==board[r][c].toLowerCase()))) {
      selected = [r,c];
      moves = getLegalMoves(r, c);
      renderBoard();
    } else { selected = null; moves = []; renderBoard(); }
  } else {
    // TODO: Add online multiplayer logic here
  }
}
function getLegalMoves(r, c) {
  // Very basic: pawns one step, pieces random sample (replace with real chess rules!)
  let piece = board[r][c], res = [];
  if(!piece) return res;
  if(piece.toLowerCase()==="p") {
    let dir = piece==="P" ? -1 : 1;
    let nr = r+dir;
    if(nr>=0 && nr<8 && !board[nr][c]) res.push([nr,c]);
    // Add capture & double move logic
  } else {
    // Sample: allow moving to any empty square or capture
    for(let dr=-1; dr<=1; dr++)
      for(let dc=-1; dc<=1; dc++)
        if(dr||dc) {
          let nr = r+dr, nc = c+dc;
          if(nr>=0&&nr<8&&nc>=0&&nc<8&&(board[nr][nc]===""||/[a-zA-Z]/.test(board[nr][nc])!==/[a-zA-Z]/.test(piece)))
            res.push([nr,nc]);
        }
  }
  return res;
}
function resetGame() {
  board = [
    ["r","n","b","q","k","b","n","r"],
    ["p","p","p","p","p","p","p","p"],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["P","P","P","P","P","P","P","P"],
    ["R","N","B","Q","K","B","N","R"]
  ];
  selected = null; moves = []; turn = "w";
  infoDiv.textContent = "White's turn";
  renderBoard();
}
document.getElementById("local-btn").onclick = () => { localPlay = true; resetGame(); };
document.getElementById("online-btn").onclick = () => {
  localPlay = false;
  // TODO: Add matchmaking & WebSocket logic here
  alert("Online multiplayer coming soon!");
};
resetGame();