// const smallSize = 3
// const mediumSize = 4
// const largeSize = 6


var selected = false;
var playerTurn = 'A';
// var gameComplete; 
var bSize;
var clickCircle = false;
//var firstNodeId = '';
var currentNode = {
    id : "",
    x1 : "",
    y1 : ""
}

var connArr = [];
var completeArr = [];
var winnerArr = [];

function checkWinner(){
    let playerACount = 0;
    let playerBCount = 0;
    let playerTurnText = document.getElementById('playerTurn');
    
    if(completeArr.length == parseInt(bSize)*parseInt(bSize)){
        for(let i=0; i< completeArr.length; i++){
            let tempArr = completeArr[i].split("x");
    
            if(String(tempArr[0]) == 'A'){
                playerACount++;
            }
            if(String(tempArr[0]) == 'B'){
                playerBCount++;
            }
        }
        if(playerACount>playerBCount){
            let winnerText = document.getElementById('winner');
                winnerText.innerHTML = ' Winner : A';
                winnerText.style.color = "#28ab2d";
                playerTurnText.innerHTML = '';
        }
        else if(playerACount<playerBCount ){
            let winnerText = document.getElementById('winner');
                winnerText.innerHTML = ' Winner : B';
                winnerText.style.color = "#f44336";
                playerTurnText.innerHTML = '';
        }
        else{
            let winnerText = document.getElementById('winner');
                winnerText.innerHTML = ' Draw';
                winnerText.style.color = "black";
                playerTurnText.innerHTML = '';
        }
    }
    
}

function connExist(e,f){
    let linkFound = false;
    for(let i=0; i< connArr.length; i++){
        if(connArr[i] == `${e},${f}`){
            linkFound = true;
        }
        if(connArr[i] == `${f},${e}`){
            linkFound = true;
        }
    }
    return linkFound;
}

function checkQuater(a,b,c,d,qn){
    //console.log(' a :'+a+' qn: '+qn); 
    let countLink = 0;
    if(connExist(a,b) == true){
        countLink++;
    }
    if(connExist(b,c) == true){
        countLink++;
    }
    if(connExist(c,d) == true){
        countLink++;
    }
    if(connExist(d,a) == true){
        countLink++;
    }
    if(countLink == 4){
        let posX,posY;
        if(qn == 1){
            let idArr = a.split('_');
            let x = parseInt(idArr[1]);
            let y = parseInt(idArr[2]);
            posX = x;posY = y;
        }
        if(qn == 2){
            let idArr = a.split('_');
            let x = parseInt(idArr[1]);
            let y = parseInt(idArr[2]);
            posX = x;posY = y;
        }
        if(qn == 3){
            let idArr = a.split('_');
            let x = parseInt(idArr[1]);
            let y = parseInt(idArr[2]);
            posX = x;posY = y;
        }
        if(qn == 4){
            let idArr = a.split('_');
            let x = parseInt(idArr[1]);
            let y = parseInt(idArr[2]);
            posX = x;posY = y;
        }
        let isAlreadyMarked = false;
        for(let i=0;i<completeArr.length;i++){
            let tempArr = completeArr[i].split("x");
            if(`${tempArr[1]}x${tempArr[2]}` == `${posX+15}x${posY+25}`){
                isAlreadyMarked = true;
            }
        }
        if(isAlreadyMarked == false){
            //winnerArr.push(playerTurn);
            const svg = "http://www.w3.org/2000/svg";
            let gameSvg = document.getElementById('game_svg');
            let txt = document.createElementNS(svg,'text');
            txt.setAttribute("x",posX+15);
            txt.setAttribute("y",posY+28);
            txt.setAttribute("font-weight", "800");
            txt.setAttribute("font-size", "24px");
            if(playerTurn == 'A'){
                txt.textContent = "A";
                txt.setAttribute("fill", '#28ab2d');
            }
            else{
                txt.textContent = "B";
                txt.setAttribute("fill", '#f44336');
            }
            gameSvg.appendChild(txt);
            completeArr.push(`${playerTurn}x${posX+15}x${posY+25}`);
            clickCircle = false;
        }
    }
    
}

function checkBoxComplete(idPos){
    let idArr = idPos.split('_');
    let x = parseInt(idArr[1]);
    let y = parseInt(idArr[2]);
    clickCircle = true;
    checkQuater(`id_${x-35}_${y-35}`,`id_${x}_${y-35}`,`id_${x}_${y}`,`id_${x-35}_${y}`,1);
    checkQuater(`id_${x}_${y-35}`,`id_${x+35}_${y-35}`,`id_${x+35}_${y}`,`id_${x}_${y}`,2);
    checkQuater(`id_${x}_${y}`,`id_${x+35}_${y}`,`id_${x+35}_${y+35}`,`id_${x}_${y+35}`,3);
    checkQuater(`id_${x-35}_${y}`,`id_${x}_${y}`,`id_${x}_${y+35}`,`id_${x-35}_${y+35}`,4);
    if(clickCircle == false){
        if(playerTurn == 'A'){
            playerTurn = 'B';
        }
        else{
            playerTurn = 'A';
        }
    }
    checkWinner();
}

function checkNeighbour(x1,y1,x2,y2){
    x1 = parseInt(x1.replace(/px/,""));
    x2 = parseInt(x2.replace(/px/,""));
    y1 = parseInt(y1.replace(/px/,""));
    y2 = parseInt(y2.replace(/px/,""));

    if(x1==x2 && (Math.abs(y1-y2)==35)){
        return true;
    }
    else if(y1==y2 && (Math.abs(x1-x2)==35)){
        return true;
    }
    else{
        return false;
    }
}

function dotClick(id){
    let dot = document.getElementById(id);
    let compStyles = window.getComputedStyle(dot);
    let top = compStyles.top;
    let left = compStyles.left;
    if(!selected){
        selected = true;
        currentNode.x1 = left;
        currentNode.y1 = top;
        currentNode.id = id;
    }
    else{
        const svg = "http://www.w3.org/2000/svg";
        let gameSvg = document.getElementById('game_svg');
        let isNeighbour = checkNeighbour(currentNode.x1,currentNode.y1,left,top);
        let x2 = left.replace(/px/,"");
        let y2 = top.replace(/px/,"");
        if(isNeighbour == true && connExist(currentNode.id,`id_${x2}_${y2}`) == false){
            let line = document.createElementNS(svg,'line');
            line.setAttribute("x1", parseInt(currentNode.x1.replace(/px/,""))+5+"px");
            line.setAttribute("y1", parseInt(currentNode.y1.replace(/px/,""))+5+"px");
            line.setAttribute("x2", parseInt(left.replace(/px/,""))+5+"px");
            line.setAttribute("y2", parseInt(top.replace(/px/,""))+5+"px");
            line.setAttribute("stroke", "black");
            gameSvg.appendChild(line);
            selected = false;

            connArr.push(currentNode.id+","+id);
            checkBoxComplete(id);
            
            if(playerTurn == 'A'){
                playerTurn = 'B';
                let playerTurnText = document.getElementById('playerTurn');
                playerTurnText.innerHTML = 'B';
                playerTurnText.style.color = "#f44336";
            }
            else{
                playerTurn = 'A';
                let playerTurnText = document.getElementById('playerTurn');
                playerTurnText.innerHTML = 'A';
                playerTurnText.style.color = "#28ab2d";
            }      
        }
        else{
            selected = true;
            currentNode.x1 = left;
            currentNode.y1 = top;
            currentNode.id = id;
        }   
    }
}

function createBoard(boardSize){
    
    let game = document.getElementById('app');
    let playerTurnText = document.getElementById('playerTurn');
    playerTurnText.innerHTML = 'A';
    playerTurnText.style.color = "#28ab2d";
    bSize = boardSize;
    let top = 0;
    let left = 0;
    let count = 0;
    for(let i=0; i<=boardSize; i++){
        top = top+35;
        left = 0;
        for(let j=0; j<=boardSize; j++){
            count = count + 1;
            left = left+35;
            let id = 'id_'+left+'_'+top;
            let dot = document.createElement('div');
            dot.id = id;
            dot.className = 'dot';
            dot.style.top = top+"px";
            dot.style.left = left+'px';
            dot.addEventListener("click", function(e){
                dotClick(e.target.id);
            });
            game.appendChild(dot);
        }
    } 
    // document.getElementById("getSizeBtn1").disabled = true; 
    // document.getElementById("getSizeBtn2").disabled = true; 
    // document.getElementById("getSizeBtn3").disabled = true; 
    
}


createBoard(6)