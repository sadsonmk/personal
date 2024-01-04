import {I,J,L,O,T,S,Z} from './tetrominoes.js'
const canvas = document.getElementById('tetris');
const pen = canvas.getContext('2d');
const scoreElem = document.getElementById('score');

const ROW = 20;
const COLUMN = 10;
const SIZE = 20;
const VACANT = 'WHITE'
let board = [];


//drawing squares
function drawSquare(x,y,color){
    pen.fillStyle = color;
    pen.fillRect(x*SIZE,y*SIZE,SIZE,SIZE)
    pen.lineWidth = 2;
    pen.strokeStyle = 'black';
    pen.strokeRect(x*SIZE,y*SIZE,SIZE,SIZE);
    
}

for(let r=0;r<ROW;r++){
    board[r] = []
    for(let c=0;c<COLUMN;c++){
        board[r][c] = VACANT
    }
}

function drawBoard(){
    for(let r=0;r<ROW;r++){
        for(let c=0;c<COLUMN;c++){
            drawSquare(c,r,board[r][c])
    }
}
}
drawBoard();



const PIECES = [
    [Z,'red'],
    [S,'green'],[T,'yellow'],[O,'blue'],[L,'cyan'],[I,'indigo'],[J,'violet']
]

function randomPiece(){
    let r = Math.floor(Math.random()* PIECES.length);
    return new Piece(PIECES[r][0],PIECES[r][1])

    
}


let p = randomPiece();

function Piece(tetromino,color){
    this.tetromino = tetromino;
    this.color = color;
    this.tetrominoN = 0;
    this.activeTetromino = this.tetromino[this.tetrominoN];
    this.x = 3;
    this.y = 0;
}
Piece.prototype.fill = function(color){
    for(let r=0;r<this.activeTetromino.length;r++){
        for(let c=0;c<this.activeTetromino.length;c++){
            if(this.activeTetromino[r][c]){
                drawSquare(this.x + c, this.y + r,color)
            }
    }
}
}
//drawing the piece
Piece.prototype.draw = function(){
   this.fill(this.color);
}
//undrawing the piece
Piece.prototype.undraw = function(){
 this.fill(VACANT);
}

//moving down
Piece.prototype.moveDown = function(){
    if(!this.collision(0,1,this.activeTetromino)){
      this.undraw();
      this.y++;
      this.draw();
      
        
    }else{
        this.lock();
        p = randomPiece();
    }
    
}
//moving right
Piece.prototype.moveRight = function(){
if(!this.collision(1,0,this.activeTetromino)){
    this.undraw();
    this.x++;
    this.draw();
}
    
}
//moving left
Piece.prototype.moveLeft = function(){
    if(!this.collision(-1,0,this.activeTetromino)){
      this.undraw();
      this.x--;
      this.draw();  
    }
    
}
//rotating
Piece.prototype.rotate = function(){
    let nextPattern = this.tetromino[(this.tetrominoN + 1)% this.tetromino.length];
    let kick = 0;
    if(!this.collision(0,0,nextPattern)){
        if(this.x > COLUMN/2){
            kick = -1;
        }else{
            kick = 1
        }
    }
    if(!this.collision(kick,0,nextPattern)){
       this.undraw();
        this.x += kick;
    this.tetrominoN = (this.tetrominoN + 1)% this.tetromino.length;
    this.activeTetromino = this.tetromino[this.tetrominoN];
    this.draw(); 
    }
    
}
let score = 0;
Piece.prototype.lock = function(){
    for(let r=0;r<this.activeTetromino.length;r++){
        for(let c=0;c<this.activeTetromino.length;c++){
            if(!this.activeTetromino[r][c]){
              continue;
            }
            if(this.y + r <= 0){
                alert('Game Over!!!!');
                gameOver = true;
                break;
            }
            board[this.y + r][this.x+c]=this.color;
    }
}
    for(let r =0;r<ROW;r++){
        let isRowFull = true;
        for(let c= 0;c<COLUMN;c++){
            isRowFull = isRowFull && (board[r][c]!=VACANT);
        }
        if (isRowFull){
            for(let y=r;y>1; y--){
                for(let c= 0;c<ROW;c++){
                    board[y][c]=board[y-1][c];
                }
            }
            for(let c= 0;c<ROW;c++){
                    board[0][c]=VACANT;
                }
            score += 10;
        }
    }
   drawBoard(); 
   scoreElem.innerHTML = score;
}

Piece.prototype.collision = function(x,y,piece){
    for(let r=0;r<piece.length;r++){
        for(let c=0;c<piece.length;c++){
           if(!piece[r][c]){
               continue;
           } 
            let newX = this.x + c + x;
            let newY = this.y + r + y;
            
            if (newX < 0 || newX >= COLUMN || newY >= ROW){
                return true;
            }
            if(newY < 0){
                continue;
            }
            if(board[newY][newX] != VACANT){
                return true;
            }
    }
        
}return false;
}

//control
document.addEventListener('keydown', CONTROL);

function CONTROL(event){
    if(event.keyCode == 37){
        p.moveLeft();
        dropStart = Date.now();
    }else if(event.keyCode==38){
        p.rotate();
        dropStart = Date.now();
    }else if(event.keyCode==39){
        p.moveRight();
        dropStart = Date.now();
    }else if(event.keyCode==40){
        p.moveDown();
    }
}
//dropping the piece every one second
let dropStart = Date.now();
let gameOver = false;

function drop(){
    let now = Date.now();
    let delta = now - dropStart;
    if(delta>1000){
       p.moveDown(); 
        dropStart = Date.now();
    }
    if(!gameOver){
         requestAnimationFrame(drop);
    }
   
}
drop();
