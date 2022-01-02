var rows = 24;
var cols = 24;

var playing = false;
var grid = new Array(rows);
var nextGrid = new Array(rows);

//inicialize
function initialize(){
    createTable();
    initializeGrids();
    resetGrids();
    setupControlButtons();
}


function initializeGrids(){
    for(var i=0; i< rows; i++){
        grid[i] = new Array(cols);
        nextGrid[i] = new Array(cols);
    }
}

function resetGrids(){
    for(var i=0; i< rows; i++){
        for (var j=0; j< cols; j++){
            grid[i][j] = 0;
            nextGrid[i][j] = 0; 
        }
    }
}

//lay out your board
function createTable(){
    var gridContainer = document.getElementById("gridContainer");
    if(!gridContainer){
        console.error("Problem: no div for the grid table!");
    }


    var table = document.createElement("table");

    for(var i=0; i < rows; i++){
        var tr = document.createElement("tr");
        for(var j=0; j < cols; j++){
            var cell = document.createElement("td");
            cell.setAttribute("id", i + "_" + j);
            cell.setAttribute("class", "dead");
            cell.onclick = cellClickHandler;
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }

    gridContainer.appendChild(table);
}


function cellClickHandler(){
    var rowcol = this.id.split("_");
    var row = rowcol[0];
    var col = rowcol[1];

    var classes = this.getAttribute("class");
    if(classes.indexOf("live")>-1){
        this.setAttribute("class", "dead");
        grid[row][col] = 0;     
    }else{
        this.setAttribute("class", "live");
        grid[row][col] = 1;
    }
}

function setupControlButtons(){
//button to start 
var startButton = document.getElementById("start");
startButton.onclick = startButtonHandler;

//button to clear selection
var clearButtton = document.getElementById("clear");
clearButtton.onclick = clearButttonHandler;
}

function startButtonHandler(){
    console.log("TODO");
}

function clearButttonHandler(){
    console.log("TODO");
}

function play(){
    console.log("Play the game");
    computeNextGen();
}

function computeNextGen(){
    for(var i=0; i< rows; i++){
        for (var j=0; j<cols; j++){
            applyRules(i,j);
        }
    }
}
//Any live cell with two or three live neighbours lives on to the next generation of
//Any live cell with more than three live neighbourds dies, as if by overcrowing.
//Any dead cell with exactly three live nbeighbours becomes a live cell, as if by reproduction

function applyRules(row, col){
    var numNeighbors = countNeighbors(row, col);
    if(grid[row][col] == 1){
        if(numNeighbors < 2){
            nextGrid[row][col] = 0;
        }else if(numNeighbors == 2 || numNeighbors == 3){
            nextGrid[row][col] = 1;
        }else if(numNeighbors > 3){
            nextGrid[row][col] = 0;
        }
    }else if(grid[row][col] == 0){
        if(numNeighbors == 3){
            nextGrid[row][col] = 1;
        }
    }

}
function countNeighbors(row, col){
    var count = 0;
    if(row-1>=0){
        if(grid[row-1][col] == 1) count++;
    }
    if(row-1 >=0 && col-1 >=0){
        if(grid[row-1][col-1] == 1) count++;
    }
    if(row-1 >=0 && col+1 < cols){
        if(grid[row-1][col+1] == 1) count++;
    }
    if(col-1>=0){
        if(grid[row][col-1] == 1) count++;
    }
    if(col+1 < cols){
        if(grid[row][col+1] == 1) count++;
    }
    if(row+1 < rows){
        if(grid[row+1][col] == 1) count++;
    }
    if(row+1 < rows && col-1>=0){
        if(grid[row+1][col-1] == 1) count++;
    }
    if(row+1 < rows && col+1<cols){
        if(grid[row+1][col+1]==1) count++;
    }
    return count;
}




//start everything
window.onload = initialize;
