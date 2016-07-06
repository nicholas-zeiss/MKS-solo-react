
function solve(board, row, col) {
  var res = hasUnassigned(board);
  if (!res[0]) {
      console.log("solved", board);
      return true;
  }
  row = res[1];
  col = res[2];

  for (var i = 1; i < 10; i++) {
    if (checkRow(board, row, col, i) && checkColumn(board, row, col, i) && checkGrid(board, row, col, i)) {   
      board[row][col] = i;
      if ( solve(board, row, col) ) {                
        return true;
      }

      board[row][col] = 0;
    }
  }
  return false;
}

function hasUnassigned(board) {
  for (var j = 0; j < 9; j++) {
    for (var i = 0; i < 9; i++) {
      if (board[j][i] === 0) {
        return [true, j, i];
      }
    }
  }
  return [false];
}

function checkRow(board, y, x, num) {
  for (var i = 0; i < 9; i++) {
    if (i !== x && board[y][i] === num) {
      return false;
    }
  }
  return true;
}

function checkColumn(board, y, x, num) {
  for (var j = 0; j < 9; j++) {
    if (j !== y && board[j][x] === num) {
      return false;
    }
  }
  return true;
}

function checkGrid(board, y, x, num) {
  var baseX = 3 * Math.floor(x / 3);
  var baseY = 3 * Math.floor(y / 3);
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      if (!(j + baseY === y && i + baseX === x) && board[j + baseY][i + baseX] === num) {
        return false;
      }
    }
  }
  return true;
}

function isValid(board) {
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      if (board[j][i] !== 0 && 
      (!checkRow(board, j, i, board[j][i]) || !checkColumn(board, j, i, board[j][i]) || !checkGrid(board, j, i, board[j][i]))) {
        return false;
      }
    }
  }
  return true;
}