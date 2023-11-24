let player1, player2, player1nick, player2nick;
localStorage.clear()
document.getElementById("form").onsubmit =()=>{
    location.href = 'instructions.html'
    player1 = document.getElementById("name1").value
    player2 = document.getElementById("name2").value
    player1nick = document.getElementById("nick-name1").value
    player2nick = document.getElementById("nick-name2").value
    // storing player names in local storage
    localStorage.setItem("Player1",player1)
    localStorage.setItem("Player2",player2)
    localStorage.setItem("Player1Nick",player1nick)
    localStorage.setItem("Player2Nick",player2nick)
    return false
}
