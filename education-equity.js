let VALUE_STATEMENTS = [];
let SCORES = new Map([[0,[[-1,0,0,0,0,0], [1,0,0,0,0,0]]], [1, [[],[]]], [2, [[],[]]]]);
let user_scores = [];

function next(clicked_panel) {
	for (let i = 0; i < 6; i++) {
		user_scores[i] += SCORES[curr_index][clicked_panel][i];
	}
	console.log(clicked_panel);
	changePanels();
}

function changePanels() {
	curr_index++;
	$('#left_panel').text(VALUE_STATEMENTS[curr_index][0]);
	$('#right_panel').text(VALUE_STATEMENTS[curr_index][1]);
}