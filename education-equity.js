let VALUE_STATEMENTS = [];
let SCORES = new Map([[0,[[-1,0,0,0,0,0], [1,0,0,0,0,0]]], [1, [[],[]]], [2, [[],[]]]]);
let user_scores = [];
let nextPage = 'https://kjue25.github.io/education-equity.html';

let instructions = new Instructions();
instructions.start();

function next(clicked_panel) {
	for (let i = 0; i < 6; i++) {
		user_scores[i] += SCORES[curr_index][clicked_panel][i];
	}
	console.log(clicked_panel);
	changePanels();
}

function changePanels() {
	curr_index++;
	if (curr_index < 6) {
		$('#left_panel').text(VALUE_STATEMENTS[curr_index][0]);
		$('#right_panel').text(VALUE_STATEMENTS[curr_index][1]);
	} else {
		instructions.showParentInstructions();
	}
}

function Instructions() {
	this.$instrutions = $("#instructions");
}

Instructions.prototype.start = function() {
	var obj = this;
	this.text("For the following questions, choose the option which best describes your beliefs and values.");
}

Instructions.prototype.showParentInstructions = function() {
	$obj = $(obj);
	$obj.text("Now, imagine you are a parent with a child who is about to start school for the first time.");
}