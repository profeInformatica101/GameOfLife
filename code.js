var rows = 24;
var cols = 24;

var playing = false;
var grid = new Array(rows);
var nextGrid = new Array(rows);

var timer;
var reproductionTime = 100;

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

function copyAndResetGrid(){
    for(var i=0; i<rows; i++){
        for(var j=0; j< cols; j++){
            grid[i][j] = nextGrid[i][j];
            nextGrid[i][j]=0;
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

function updateView(){
    for(var i=0; i<rows; i++){
        for(var j=0; j<cols; j++){
            var cell = document.getElementById(i+"_"+j);
            if(grid[i][j] ==  0){
                cell.setAttribute("class", "dead"); 
            }else{
                cell.setAttribute("class", "live");
            }
        }
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
    if(playing){
        console.log("Pause the game");
        playing = false;
        this.innerHTML = "continue";
        clearTimeout(timer);
    }else{
        console.log("continue the game");
        playing = true
        this.innerHTML = "pause";
        play();
    }
}

function clearButttonHandler(){
    console.log("Clear the game: stop playing, clear the grid");
    playing = false;
    var startButton = document.getElementById("start");
    startButton.innerHTML = "start";

    clearTimeout(timer);

    var cellslist = document.getElementsByClassName("live");
    var cells = [];

    for(var i = 0 ; i < cellslist.length; i++){
        cells.push(cellslist[i]);    
    }

    for(i=0; i< cells.length; i++){
        cells[i].setAttribute("class", "dead");
    }


    resetGrids();
}

function play(){
    console.log("Play the game");
    computeNextGen();

    if(playing){
        timer = setTimeout(play, reproductionTime);
    }

}


//run next life game
function computeNextGen(){
    for(var i=0; i< rows; i++){
        for (var j=0; j<cols; j++){
            applyRules(i,j);
        }
    }
    //copy nextGrid to grid, and reset nextGrid
    copyAndResetGrid();
    //copy all 1 value to "live" in the table
    updateView();

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

