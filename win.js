// getting playscore from localStorage
let player1score = localStorage.getItem("Player1Score")
let player2score = localStorage.getItem("Player2Score")
let names = document.getElementById("name")
// selecting score box
const play1 = document.getElementById("play1")
const play2 = document.getElementById("play2")

//QUIT BUTTON
let quit = document.getElementById("quit")

// Score board name
let player1 = document.getElementById("player1")
let player2 = document.getElementById("player2")

// random phrases for winner
let win =["Good game, good fight!","I can't wait to play again!","Thanks for the challenge!","I'm the ultimate champion!","I'm the master of the game!","I'm loving this game!"]
let random = Math.floor(Math.random()*win.length)

// comparing player score
if(player1score > player2score){
    names.textContent = localStorage.getItem("Player1")
    document.getElementById("result").textContent = win[random] 
    play1.style.boxShadow= '0 0 25px #39ff14'
    play2.style.boxShadow= 'none'
    
}
else if(player1score < player2score){
    names.textContent = localStorage.getItem("Player2") 
    document.getElementById("result").textContent = win[random] 
    play2.style.boxShadow= '0 0 25px #dfff31'  
    play1.style.boxShadow= 'none'  
}
else{
    document.getElementById("cong").textContent = 'GAME OVER!'
    document.getElementById("result").textContent = "Tie"
    document.getElementById("emoji").src = './images/lost.gif'    

}
// redirecting to game page
document.getElementById("play-again").onclick =()=>{
    location.href = 'game.html'   
}

// score board

player1.innerText = localStorage.getItem("Player1")
player2.innerText = localStorage.getItem("Player2")
document.getElementById("player1_score").innerText = player1score
document.getElementById("player2_score").innerText = player2score

// quit game
quit.onclick=()=>{
    location.href='index.html'
}