var table = [[],[],[],[],[],[],[],[],[]]

$(document).ready(function() {

	for (var i = 0; i < 9; i++) {
		$("table").append("<tr class='" + i + "'</tr>");
		for (var j = 0; j < 9; j++) {
			$("." + i).append('<td><input type="text" placeholder="0" size="1" id="' + j + '"/></td>');
		}
	}

	$("#messages >").hide();

	$("#checkValid").on('click', function() {
    $("#messages >").hide();
		makeTable()
		if (isValid(table)) {
			$(".valid").show();
		} else {
			$(".invalid").show();
		}
	})

	$("#showSolution").on('click', function() {
    makeTable();
    $("#messages >").hide();
    if (!isValid(table)) {
    	$(".warning").show()
    } else if (solve(table)) {
    	$(".solved").show()
    	loop(function(entry, i, j) {
    		entry.val(table[i][j]);
    	})
    } else {
    	$(".unsolved").show();
    }
	})

	$("#clearBoard").on('click', function() {
		$("#messages >").hide();
		loop(function(entry) {
			entry.val(0)
		})
	})
})

function loop(cb) {
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			cb($("." + i).find("#" + j), i, j);
		}
	}
}

function makeTable() {
	loop(function(entry, i, j) {
		table[i][j] = entry.val() - 0;
	});
}