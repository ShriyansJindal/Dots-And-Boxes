// getting playscore from localStorage
let player1score = localStorage.getItem("Player1Score")
let player2score = localStorage.getItem("Player2Score")

// random phrases for winner
let win =["Good game, good fight!","I can't wait to play again!","Thanks for the challenge!","I'm the ultimate champion!","I'm the master of the game!","I'm loving this game!"]
let random = Math.floor(Math.random()*win.length)

// comparing player score
if(player1score>player2score){
    document.getElementById("result").textContent = localStorage.getItem("Player1")+" won the game"
    setTimeout(() => {
        document.getElementById("result").textContent = win[random] 
    }, 2000);
}
else if(player1score<player2score){
    document.getElementById("result").textContent = localStorage.getItem("Player2")+" won the game" 
    setTimeout(() => {
        document.getElementById("result").textContent = win[random] 
    }, 2000);   
}
else{
    document.getElementById("result").textContent = "Game Tie"    

}
// redirecting to game page
document.getElementById("play-again").onclick =()=>{
    location.href = 'game.html'   
}

const player1 = document.getElementById("player1")
const player2 = document.getElementById("player2")

player1.innerText = localStorage.getItem("Player1")
player2.innerText = localStorage.getItem("Player2")
document.getElementById("player1_score").innerText = localStorage.getItem("Player1Score")
document.getElementById("player2_score").innerText = localStorage.getItem("Player2Score")