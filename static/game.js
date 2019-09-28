var socket = io();

var movement = {
  up: false,
  down: false,
  left: false,
  right: false
}
document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = true;
      break;
    case 87: // W
      movement.up = true;
      break;
    case 68: // D
      movement.right = true;
      break;
    case 83: // S
      movement.down = true;
      break;
  }
});
document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = false;
      break;
    case 87: // W
      movement.up = false;
      break;
    case 68: // D
      movement.right = false;
      break;
    case 83: // S
      movement.down = false;
      break;
  }
});

socket.emit('new player',playerName);
setInterval(function() {
  socket.emit('movement', movement);
}, 1000 / 60);

var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');
socket.on('state', function(players) {
  //console.log(players);
  var colours=['silver','grey','red','black','maroon','yellow','olive','green','blue','purple','aqua'];
  context.clearRect(0, 0, 800, 600);
  
  loop1:  for(var id1 in players){
  		var player1 =players[id1];
  		  		for(var id2 in players){
  			var player2=players[id2];
  			if(id1 != id2 && (player1.x==player2.x && player1.y==player2.y) && (player1.x!=300 || player1.y!=300)){
  				//console.log(player1.name+' wins !');
  				context.clearRect(0,0,800,600);
  				context.strokeText(player1.name+' GOT a POINT! ',600,50);
  				socket.emit('score',id1);
  				//player1.score=player1.score+1;
  				break loop1;

  			}
  		}
  }

  for (var id in players) {
    var player = players[id];
    //console.log(player.name);
    
    context.fillStyle = colours[id.charAt(id.length-1).charCodeAt(0)%10];
    context.beginPath();
    context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
    context.strokeText(player.name,player.x+10,player.y);
    context.strokeText(player.score,player.x+60,player.y)
    context.fill();
  }
});

socket.on('winner',function(players){
	var max=0; var playername;
for(id in players){
	player=players[id];
	if(player.score>max){
		max=player.score;
		playername=player.name;
	}
}
if(playername!=undefined)
document.getElementById('winner').innerHTML='winner is : '+playername;

});