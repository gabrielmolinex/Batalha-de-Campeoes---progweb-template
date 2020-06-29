$(function () {

  var gameplay = 1;
  var winner = "";
  var jogada = 0;
  var placar = [0, 0, 0];

  function equalpositions(a, b, c) {
    var positionA = $("#position" + a);
    var positionB = $("#position" + b);
    var positionC = $("#position" + c);
    var dataA = $("#position" + a).css("background-image");
    var dataB = $("#position" + b).css("background-image");
    var dataC = $("#position" + c).css("background-image");
    if (dataA == dataB && dataB == dataC && dataA != "none" && dataA != "") {
      if (dataA.indexOf("1.png") >= 0) winner = "1";
      else winner = "2";
      return true;
    } else {
      return false;
    }
  }

  function gameover() {
    if (
      equalpositions(0, 1, 2) ||
      equalpositions(3, 4, 5) ||
      equalpositions(6, 7, 8) ||
      equalpositions(0, 3, 6) ||
      equalpositions(1, 4, 7) ||
      equalpositions(2, 5, 8) ||
      equalpositions(0, 4, 8) ||
      equalpositions(2, 4, 6)
    ) {
      if (winner == 1) {
        $("#winner").html("<h1>Player 1 Wins! </h1>");
        placar[winner]++;
      } else {
        $("#winner").html("<h1>Player 2 Wins! </h1>");
        placar[winner]++;
      }

    } else {
      if (jogada == 9) {
        $("#winner").html("<h1> Draw :D </h1>");
        placar[0]++;

      }
    }
    if (winner != "") {
      $(".position").off("click");
    }
    $("#placar").html("Empate:" + placar[0] + "<br> Player 1:" + placar[1] + "<br>Player 2:" + placar[2]);
  }

  function move(element) {
    var bg = $('#' + element).css("background-image");
    if (bg == "none" || bg == "") {
      var image = "url(./img/" + gameplay.toString() + ".png)";
      $('#' + element).css("background", image);
      gameplay = gameplay == 1 ? 2 : 1;
      jogada = jogada + 1;
      gameover();
    }
  }

  function resetGame () {
    document.getElementById("winner").innerHTML = "<h1>Winner</h1>";
    let img = "none";
    $(".position").css("background", img);
    if (winner == 1 || winner == 2) {
      gameplay = winner;
    }
    winner = "";
    jogada = 0;
    $(".position").click(function () {
      socket.emit('move', $(this).attr('id'));
    });
  }

  $(".position").click(function () {
    socket.emit('move', $(this).attr('id'));
  });

  
  $(".resetGame").click(function () {
    resetGame();
    socket.emit('resetGame');
  });
  
  socket.on('move', move);
  socket.on('resetGame', resetGame);

});