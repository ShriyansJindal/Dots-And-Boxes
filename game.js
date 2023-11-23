var device = window.innerWidth
var height,width;
if(device<600){
  height = 300
  width = 300
}
else{
  height = 400
  width = 400
}

let grid_size = 5;
// let height = 400;
// let width = 400;

let cell = width / (grid_size + 2);
let stroke = cell / 12;
let dot = stroke;
let margin = height - (grid_size + 1) * cell;

// colours
let color_bord = "	#000d37";
let color_border = "transparent";
let color_player2 = "yellow";
let color_player2_hover = "#ffff7f";
let color_dot = "orange";
let color_player1 = "#00ff00";
let color_player1_hover = "#b7ffb7";

// game variables
var currentCells;
var playersTurn;
var squares;
var score_player2;
var score_player1;

// canvas
var canvas = document.createElement("canvas");
canvas.height = height;
canvas.width = width;
document.getElementById("game").appendChild(canvas);
var canvasRect = canvas.getBoundingClientRect();
var ctx = canvas.getContext("2d");
ctx.lineWidth = stroke;
ctx.textAlign = "center";
ctx.textBaseline = "middle";

newGame();

// highlightgrid
canvas.addEventListener("mousemove", (ev)=>{
    // mouse position 
    let x = ev.clientX - canvasRect.left;
    let y = ev.clientY - canvasRect.top;
  
    // highlight the square's side
    highlightSide(x, y);
});
canvas.addEventListener("click", (ev)=>{
  selectSide()
});

setInterval(() => {
  drawBoard();
  drawSquares();
  drawGrid();
  drawScores();
  winner()
}, 1000 / 120);

function drawBoard() {
  ctx.fillStyle = color_bord;
  ctx.strokeStyle = color_border;
  ctx.fillRect(0, 0, width, height);
  ctx.strokeRect(stroke / 2, stroke / 2, width - stroke, height - stroke);
}

function drawDot(x,y) {
  ctx.fillStyle = color_dot;
  ctx.beginPath();
  ctx.arc(x, y, dot, 0, Math.PI * 2);
  ctx.fill();
}

function drawGrid() {
  for (let i = 0; i < grid_size + 1; i++) {
    for (let j = 0; j < grid_size + 1; j++) {
      drawDot(getGridX(j), getGridY(i));
    }
  }
}

function drawLine(x0, y0, x1, y1, color) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}

function drawScores() {
  document.getElementById("player1_score").textContent = score_player1;
  document.getElementById("player2_score").textContent = score_player2;
}

function drawSquares() {
  for (let row of squares) {
    for (let square of row) {
      square.drawSides();
      square.drawFill();
    }
  }
}

function getColor(player, light) {
  if (player) {
    if (light) {
      return color_player1_hover;
    } else {
      return color_player1;
    }
  } else {
    if (light) {
      return color_player2_hover;
    } else {
      return color_player2;
    }
  }
}

function getGridX(col) {
  return cell * (col + 1);
}

function getGridY(row) {
  return margin + cell * row;
}
let Side = {  bot: 0,  left: 1,  right: 2,  top: 3,};
function highlightSide(x, y) {
  for (let row of squares) {
    for (let square of row) {
      square.highlight = null;
    }
  }
  // check each cell
  let rows = squares.length;
  let cols = squares[0].length;
  currentCells = [];
 for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (squares[i][j].contains(x, y)) {
        let side = squares[i][j].highlightSide(x, y);
        if (side != null) {
          currentCells.push({ row: i, col: j });
        }
        // determine neighbour
        let row = i,
          col = j,
          highlight,
          neighbour = true;
        if (side == Side.left && j > 0) {
          col = j - 1;
          highlight = Side.right;
        } else if (side == Side.right && j < cols - 1) {
          col = j + 1;
          highlight = Side.left;
        } else if (side == Side.top && i > 0) {
          row = i - 1;
          highlight = Side.bot;
        } else if (side == Side.bot && i < rows - 1) {
          row = i + 1;
          highlight = Side.top;
        } else {
          neighbour = false;
        }
        // highlight box
        if (neighbour) {
          squares[row][col].highlight = highlight;
          currentCells.push({ row: row, col: col });
        }
      }
    }
  }
}

function newGame() {
  currentCells = [];
  // playersTurn = Math.random() >= 0.5;
  playersTurn = true
  // console.log(playersTurn)
  score_player2 = 0;
  score_player1 = 0;
  timeEnd = 0;
  // set up the squares
  squares = [];
  for (let i = 0; i < grid_size; i++) {
    squares[i] = [];
    for (let j = 0; j < grid_size; j++) {
      squares[i][j] = new Square(getGridX(j), getGridY(i), cell, cell);
    }
  }
}

function selectSide() {
  if (currentCells == null || currentCells.length == 0) {
    return;
  }

  // select the side(s)
  let filledSquare = false;
  for (let cell of currentCells) {
    if (squares[cell.row][cell.col].selectSide()) {
      filledSquare = true;
    }
  }
  currentCells = [];

  if(!filledSquare){
    playersTurn = !playersTurn;
  }
}
// create the Square object constructor
function Square(x, y, w, h) {
  this.w = w;
  this.h = h;
  this.bot = y + h;
  this.left = x;
  this.right = x + w;
  this.top = y;
  this.highlight = null;
  this.numSelected = 0;
  this.owner = null;
  this.sideBot = { owner: null, selected: false };
  this.sideLeft = { owner: null, selected: false };
  this.sideRight = { owner: null, selected: false };
  this.sideTop = { owner: null, selected: false };

  this.contains = function (x, y) {
    return x >= this.left && x < this.right && y >= this.top && y < this.bot;
  };

  this.drawFill = function () {
    if (this.owner == null) {
      return;
    }
    // background for selected box
    ctx.fillStyle = getColor(this.owner, true);
    ctx.fillRect(
      this.left + stroke,
      this.top + stroke,
      this.w - stroke * 2,
      this.h - stroke * 2
    );

  };

  this.drawSide = function (side, color) {
    switch (side) {
      case Side.bot:
        drawLine(this.left, this.bot, this.right, this.bot, color);
        break;
      case Side.left:
        drawLine(this.left, this.top, this.left, this.bot, color);
        break;
      case Side.right:
        drawLine(this.right, this.top, this.right, this.bot, color);
        break;
      case Side.top:
        drawLine(this.left, this.top, this.right, this.top, color);
        break;
    }
  };

  this.drawSides = function () {
    // highlighting
    if (this.highlight != null) {
      this.drawSide(this.highlight, getColor(playersTurn, true));
    }
    // selected sides
    if (this.sideBot.selected) {
      this.drawSide(Side.bot, getColor(this.sideBot.owner, false));
    }
    if (this.sideLeft.selected) {
      this.drawSide(Side.left, getColor(this.sideLeft.owner, false));
    }
    if (this.sideRight.selected) {
      this.drawSide(Side.right, getColor(this.sideRight.owner, false));
    }
    if (this.sideTop.selected) {
      this.drawSide(Side.top, getColor(this.sideTop.owner, false));
    }
  };

  this.highlightSide = function (x, y) {
    // calculate the distances to each side
    let dBot = this.bot - y;
    let dLeft = x - this.left;
    let dRight = this.right - x;
    let dTop = y - this.top;

    // determine closest value
    let dClosest = Math.min(dBot, dLeft, dRight, dTop);

    // highlight the closest 
    if (dClosest == dBot && !this.sideBot.selected) {
      this.highlight = Side.bot;
    } else if (dClosest == dLeft && !this.sideLeft.selected) {
      this.highlight = Side.left;
    } else if (dClosest == dRight && !this.sideRight.selected) {
      this.highlight = Side.right;
    } else if (dClosest == dTop && !this.sideTop.selected) {
      this.highlight = Side.top;
    }

    // return the highlighted side
    return this.highlight;
  };

  this.selectSide = function () {
    if (this.highlight == null) {
      return;
    }

    // select the highlighted side
    switch (this.highlight) {
      case Side.bot:
        this.sideBot.owner = playersTurn;
        this.sideBot.selected = true;
        break;
      case Side.left:
        this.sideLeft.owner = playersTurn;
        this.sideLeft.selected = true;
        break;
      case Side.right:
        this.sideRight.owner = playersTurn;
        this.sideRight.selected = true;
        break;
      case Side.top:
        this.sideTop.owner = playersTurn;
        this.sideTop.selected = true;
        break;
    }
    this.highlight = null;
    this.numSelected++;
    if (this.numSelected == 4) {
      this.owner = playersTurn;

      // increment score
      if (playersTurn) {
        score_player1++;
      } else {
        score_player2++;
      }

      return true;
    }

    return false;
  };

  document.getElementById("player1").textContent = localStorage.getItem("Player1Nick") +" - "
  document.getElementById("player2").textContent = localStorage.getItem("Player2Nick") +" - "
}

function winner(){
  if(score_player1 + score_player2 == grid_size*grid_size){
    localStorage.setItem("Player1Score",score_player1)
    localStorage.setItem("Player2Score",score_player2)
    location.href = 'win.html'
  }
}


// setInterval(() => {
  
//   const mediaQuery = window.matchMedia('(max-width: 500px)')
//   // Check if the media query is true
//   if (mediaQuery.matches) {
//     // Then trigger an alert
//     let grid_size = 5;
//   let height = 300;
//   let width = 300;
  
//   let cell = width / (grid_size + 2);
//   let stroke = cell / 12;
//   let dot = stroke;
//   let margin = height - (grid_size + 1) * cell;
  
//   // colours
//   let color_bord = "	#000d37";
//   let color_border = "transparent";
//   let color_player2 = "yellow";
//   let color_player2_hover = "#ffff7f";
//   let color_dot = "orange";
//   let color_player1 = "#00ff00";
//   let color_player1_hover = "#b7ffb7";
  
//   // game variables
//   var currentCells;
//   var playersTurn;
//   var squares;
//   var score_player2;
//   var score_player1;
  
//   // canvas
//   var canvas = document.createElement("canvas");
//   canvas.height = height;
//   canvas.width = width;
//   document.getElementById("game").appendChild(canvas);
//   var canvasRect = canvas.getBoundingClientRect();
//   var ctx = canvas.getContext("2d");
//   ctx.lineWidth = stroke;
//   ctx.textAlign = "center";
//   ctx.textBaseline = "middle";
  
//   newGame();
  
//   // highlightgrid
//   canvas.addEventListener("mousemove", (ev)=>{
//       // mouse position 
//       let x = ev.clientX - canvasRect.left;
//       let y = ev.clientY - canvasRect.top;
    
//       // highlight the square's side
//       highlightSide(x, y);
//   });
//   canvas.addEventListener("click", (ev)=>{
//     selectSide()
//   });
  
//   setInterval(() => {
//     drawBoard();
//     drawSquares();
//     drawGrid();
//     drawScores();
//     winner()
//   }, 1000 / 120);
  
//   function drawBoard() {
//     ctx.fillStyle = color_bord;
//     ctx.strokeStyle = color_border;
//     ctx.fillRect(0, 0, width, height);
//     ctx.strokeRect(stroke / 2, stroke / 2, width - stroke, height - stroke);
//   }
  
//   function drawDot(x,y) {
//     ctx.fillStyle = color_dot;
//     ctx.beginPath();
//     ctx.arc(x, y, dot, 0, Math.PI * 2);
//     ctx.fill();
//   }
  
//   function drawGrid() {
//     for (let i = 0; i < grid_size + 1; i++) {
//       for (let j = 0; j < grid_size + 1; j++) {
//         drawDot(getGridX(j), getGridY(i));
//       }
//     }
//   }
  
//   function drawLine(x0, y0, x1, y1, color) {
//     ctx.strokeStyle = color;
//     ctx.beginPath();
//     ctx.moveTo(x0, y0);
//     ctx.lineTo(x1, y1);
//     ctx.stroke();
//   }
  
//   function drawScores() {
//     document.getElementById("player1_score").textContent = score_player1;
//     document.getElementById("player2_score").textContent = score_player2;
//   }
  
//   function drawSquares() {
//     for (let row of squares) {
//       for (let square of row) {
//         square.drawSides();
//         square.drawFill();
//       }
//     }
//   }
  
//   function getColor(player, light) {
//     if (player) {
//       if (light) {
//         return color_player1_hover;
//       } else {
//         return color_player1;
//       }
//     } else {
//       if (light) {
//         return color_player2_hover;
//       } else {
//         return color_player2;
//       }
//     }
//   }
  
//   function getGridX(col) {
//     return cell * (col + 1);
//   }
  
//   function getGridY(row) {
//     return margin + cell * row;
//   }
//   let Side = {  bot: 0,  left: 1,  right: 2,  top: 3,};
//   function highlightSide(x, y) {
//     for (let row of squares) {
//       for (let square of row) {
//         square.highlight = null;
//       }
//     }
//     // check each cell
//     let rows = squares.length;
//     let cols = squares[0].length;
//     currentCells = [];
//    for (let i = 0; i < rows; i++) {
//       for (let j = 0; j < cols; j++) {
//         if (squares[i][j].contains(x, y)) {
//           let side = squares[i][j].highlightSide(x, y);
//           if (side != null) {
//             currentCells.push({ row: i, col: j });
//           }
//           // determine neighbour
//           let row = i,
//             col = j,
//             highlight,
//             neighbour = true;
//           if (side == Side.left && j > 0) {
//             col = j - 1;
//             highlight = Side.right;
//           } else if (side == Side.right && j < cols - 1) {
//             col = j + 1;
//             highlight = Side.left;
//           } else if (side == Side.top && i > 0) {
//             row = i - 1;
//             highlight = Side.bot;
//           } else if (side == Side.bot && i < rows - 1) {
//             row = i + 1;
//             highlight = Side.top;
//           } else {
//             neighbour = false;
//           }
//           // highlight box
//           if (neighbour) {
//             squares[row][col].highlight = highlight;
//             currentCells.push({ row: row, col: col });
//           }
//         }
//       }
//     }
//   }
  
//   function newGame() {
//     currentCells = [];
//     // playersTurn = Math.random() >= 0.5;
//     playersTurn = true
//     // console.log(playersTurn)
//     score_player2 = 0;
//     score_player1 = 0;
//     timeEnd = 0;
//     // set up the squares
//     squares = [];
//     for (let i = 0; i < grid_size; i++) {
//       squares[i] = [];
//       for (let j = 0; j < grid_size; j++) {
//         squares[i][j] = new Square(getGridX(j), getGridY(i), cell, cell);
//       }
//     }
//   }
  
//   function selectSide() {
//     if (currentCells == null || currentCells.length == 0) {
//       return;
//     }
  
//     // select the side(s)
//     let filledSquare = false;
//     for (let cell of currentCells) {
//       if (squares[cell.row][cell.col].selectSide()) {
//         filledSquare = true;
//       }
//     }
//     currentCells = [];
  
//     if(!filledSquare){
//       playersTurn = !playersTurn;
//     }
//   }
//   // create the Square object constructor
//   function Square(x, y, w, h) {
//     this.w = w;
//     this.h = h;
//     this.bot = y + h;
//     this.left = x;
//     this.right = x + w;
//     this.top = y;
//     this.highlight = null;
//     this.numSelected = 0;
//     this.owner = null;
//     this.sideBot = { owner: null, selected: false };
//     this.sideLeft = { owner: null, selected: false };
//     this.sideRight = { owner: null, selected: false };
//     this.sideTop = { owner: null, selected: false };
  
//     this.contains = function (x, y) {
//       return x >= this.left && x < this.right && y >= this.top && y < this.bot;
//     };
  
//     this.drawFill = function () {
//       if (this.owner == null) {
//         return;
//       }
//       // background for selected box
//       ctx.fillStyle = getColor(this.owner, true);
//       ctx.fillRect(
//         this.left + stroke,
//         this.top + stroke,
//         this.w - stroke * 2,
//         this.h - stroke * 2
//       );
  
//     };
  
//     this.drawSide = function (side, color) {
//       switch (side) {
//         case Side.bot:
//           drawLine(this.left, this.bot, this.right, this.bot, color);
//           break;
//         case Side.left:
//           drawLine(this.left, this.top, this.left, this.bot, color);
//           break;
//         case Side.right:
//           drawLine(this.right, this.top, this.right, this.bot, color);
//           break;
//         case Side.top:
//           drawLine(this.left, this.top, this.right, this.top, color);
//           break;
//       }
//     };
  
//     this.drawSides = function () {
//       // highlighting
//       if (this.highlight != null) {
//         this.drawSide(this.highlight, getColor(playersTurn, true));
//       }
//       // selected sides
//       if (this.sideBot.selected) {
//         this.drawSide(Side.bot, getColor(this.sideBot.owner, false));
//       }
//       if (this.sideLeft.selected) {
//         this.drawSide(Side.left, getColor(this.sideLeft.owner, false));
//       }
//       if (this.sideRight.selected) {
//         this.drawSide(Side.right, getColor(this.sideRight.owner, false));
//       }
//       if (this.sideTop.selected) {
//         this.drawSide(Side.top, getColor(this.sideTop.owner, false));
//       }
//     };
  
//     this.highlightSide = function (x, y) {
//       // calculate the distances to each side
//       let dBot = this.bot - y;
//       let dLeft = x - this.left;
//       let dRight = this.right - x;
//       let dTop = y - this.top;
  
//       // determine closest value
//       let dClosest = Math.min(dBot, dLeft, dRight, dTop);
  
//       // highlight the closest 
//       if (dClosest == dBot && !this.sideBot.selected) {
//         this.highlight = Side.bot;
//       } else if (dClosest == dLeft && !this.sideLeft.selected) {
//         this.highlight = Side.left;
//       } else if (dClosest == dRight && !this.sideRight.selected) {
//         this.highlight = Side.right;
//       } else if (dClosest == dTop && !this.sideTop.selected) {
//         this.highlight = Side.top;
//       }
  
//       // return the highlighted side
//       return this.highlight;
//     };
  
//     this.selectSide = function () {
//       if (this.highlight == null) {
//         return;
//       }
  
//       // select the highlighted side
//       switch (this.highlight) {
//         case Side.bot:
//           this.sideBot.owner = playersTurn;
//           this.sideBot.selected = true;
//           break;
//         case Side.left:
//           this.sideLeft.owner = playersTurn;
//           this.sideLeft.selected = true;
//           break;
//         case Side.right:
//           this.sideRight.owner = playersTurn;
//           this.sideRight.selected = true;
//           break;
//         case Side.top:
//           this.sideTop.owner = playersTurn;
//           this.sideTop.selected = true;
//           break;
//       }
//       this.highlight = null;
//       this.numSelected++;
//       if (this.numSelected == 4) {
//         this.owner = playersTurn;
  
//         // increment score
//         if (playersTurn) {
//           score_player1++;
//         } else {
//           score_player2++;
//         }
  
//         return true;
//       }
  
//       return false;
//     };
  
//     document.getElementById("player1").textContent = localStorage.getItem("Player1Nick") +" - "
//     document.getElementById("player2").textContent = localStorage.getItem("Player2Nick") +" - "
//   }
  
//   function winner(){
//     if(score_player1 + score_player2 == grid_size*grid_size){
//       localStorage.setItem("Player1Score",score_player1)
//       localStorage.setItem("Player2Score",score_player2)
//       location.href = 'win.html'
//     }
//   }
  
//   }
  
// }, 1000);
