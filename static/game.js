var socket = io();

var movement = {
  up: false,
  down: false,
  left: false,
  right: false
}
document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 37: // arrowleft
      movement.left = true;
      break;
    case 38: // arrowup
      movement.up = true;
      break;
    case 39: // arrowright
      movement.right = true;
      break;
    case 40: // arrowDown
      movement.down = true;
      break;
  }
});
document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case 37: // arrowleft
      movement.left = false;
      break;
    case 38: // arrowup
      movement.up = false;
      break;
    case 39: // arrowright
      movement.right = false;
      break;
    case 40: // arrowdown
      movement.down = false;
      break;
  }
});

socket.emit('new player',playerName);
setInterval(function() {
  socket.emit('movement', movement);
}, 1000 / 60);

var canvas = document.getElementById('canvas');
canvas.width = 1500;
canvas.height = 650;
var context = canvas.getContext('2d');
socket.on('state', function(players) {
  //console.log(players);
  var colours=['silver','grey','red','black','maroon','yellow','olive','green','blue','purple','aqua'];
  context.clearRect(0, 0, 1500, 650);
  
  loop1:  for(var id1 in players){
  		var player1 =players[id1];
  		  		for(var id2 in players){
  			var player2=players[id2];
       if((id1 != id2) && ((Math.abs(player1.x-player2.x)<20) && (Math.abs(player1.y-player2.y)<20) ))
  			//if((id1 != id2) && (player1.x==player2.x && player1.y==player2.y) && (player1.x!=700 || player1.y!=300))
        {
  				//console.log(player1.name+' wins !');
  				context.clearRect(0,0,1500,650);
  				context.strokeText(player1.name+' GOT a POINT! ',1300,50);
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
    context.arc(player.x, player.y, 15, 0, 2 * Math.PI);
    context.fill();
    context.font="15px Georgia";
    //context.fillStyle = colours[id.charAt(id.length-1).charCodeAt(0)%10];
    context.strokeText(player.num,player.x,player.y-20);
    context.strokeText(player.name,player.x+20,player.y);
    context.strokeText(player.score,player.x,player.y+25);
    
  }
});
var playername
socket.on('winner',function(players){
	var max=0; var playernum;
for(id in players){
	player=players[id];
	if(player.score>max){
		max=player.score;
		playername=player.name;
    playernum=player.num;
	}
}
if(playername!=undefined)
document.getElementById('winner').innerHTML='WINNER : ['+playernum+']   '+playername;

});

//Timer
var min=0;
var sec=0;
socket.on('timer',function(t)
{
  if(t>=0)
  {
    console.log(t);
    min = Math.floor(t/60);
    sec = Math.floor(t%60);
    
    document.getElementById("timer-mins").innerHTML = "<span><strong>0"+ min +" MIN(S)</strong></span>";
    if(sec<10)
      document.getElementById("timer-secs").innerHTML = "<span><strong>0"+ sec +" SEC(S)</strong></span>";
    else
      document.getElementById("timer-secs").innerHTML = "<span><strong>"+ sec +" SEC(S)</strong></span>";
  }
  else
  {
    alert("\t\tGAME OVER!!!\n\n\t\tCONGRATULATIONS!!!!\n\t\tWINNER IS "+playername);
  }
});

//Reload window
socket.on('reload',function()
{
  location.reload(true);
})