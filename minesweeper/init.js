

document.addEventListener('DOMContentLoaded', function () {
  startNewGame(0);
  


  G("board").ondragstart = function () {return false};
  G("pauseScreen").ondragstart = function () {return false};
  G("scoreBoard").ondragstart = function () {return false};
  G("board").oncontextmenu = function () {return false};
  G("pauseScreen").oncontextmenu= function () {return false};
  G("scoreBoard").oncontextmenu= function () {return false};
});
