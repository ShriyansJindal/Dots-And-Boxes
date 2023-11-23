let player1score = localStorage.getItem("Player1Score")
let player2score = localStorage.getItem("Player2Score")

let win =["Good game, good fight!","I can't wait to play again!","Thanks for the challenge!","I'm the ultimate champion!","I'm the master of the game!","I'm loving this game!"]
let random = Math.floor(Math.random()*win.length)
if(player1score>player2score){
    document.getElementById("result").textContent = localStorage.getItem("Player1")+" won the game"
    setTimeout(() => {
        document.getElementById("result").textContent = win[random] 
    }, 1500);
}
else if(player1score<player2score){
    document.getElementById("result").textContent = localStorage.getItem("Player2")+" won the game" 
    setTimeout(() => {
        document.getElementById("result").textContent = win[random] 
    }, 1500);   
}
else{
    document.getElementById("result").textContent = "Game Tie"    

}
document.getElementById("play-again").onclick =()=>{
    location.href = 'game.html'   
}