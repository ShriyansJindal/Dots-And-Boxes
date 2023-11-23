let player1score = localStorage.getItem("Player1Score")
let player2score = localStorage.getItem("Player2Score")

let win =[]

if(player1score>player2score){
    document.getElementById("result").textContent = localStorage.getItem("Player1")+" won the game"
}
else if(player1score<player2score){
    document.getElementById("result").textContent = localStorage.getItem("Player2")+" won the game"    
}