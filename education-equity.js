let curr_index = 0;
let VALUE_STATEMENTS = [["I believe all students in a classroom should receive equal attention from the teacher.", "I believe students who are struggling should receive more attention from the teacher."],
						["I believe schools should have different classes for advanced and underperforming students.", "I believe that students should be in heterogeneous classrooms that cater to all abilities."],
						["I believe quantitative metrics like test scores and college admission rates are better measures of school quality than environmental factors.", "I believe environmental factors like racial and ethnic diversity are better measures of school quality than quantitative metrics like test scores."], 
						["I believe that in education everyone should benefit equally regardless of their financial contributions.", "I believe that in education those who contribute the most money should benefit the most."], 
						["I believe that it is important to prioritize creating racially and ethnically diverse schools.", "I believe that it is important to prioritize academic achievement over racial and ethnic diversity."], 
						["I believe that suspension should be allowed as a form of discipline in schools.", "I believe that suspension should not be allowed as a form of discipline in schools."], 
						["I believe it is the job of policymakers to create policies that promote racial integration in schools.", "I believe that policymakers are not responsible for creating policies around racial integration in schools."], 
						["I believe that schools should prioritize academic rigor.", "I believe that schools should prioritize students’ happiness and emotional well-being."]];
let SCORES = new Map([[0,[[-1,0,0,0,0,0], [1,0,0,0,0,0]]], 
					[1, [[0,-1,0,0,0,0],[0,1,0,0,0,0]]], 
					[2, [[0,0,1,0,0,0],[0,0,-1,1,0,0]]], 
					[3, [[0,0,0,0,1,0,],[0,0,0,0,-1,0]]],
					[4, [[0,0,0,1,0,0],[0,0,1,-1,0,0]]],
					[5, [[0,0,0,0,0,-1],[0,0,0,0,0,1]]],
					[6, [[0,0,0,1,0,0],[0,0,0,0,0,0]]],
					[7, [[0,0,1,0,0,0],[0,0,0,0,0,0]]]]);
let value_choices = [];   //each index represents value choice; 0=left value, 1=right value
let user_scores = [0,0,0,0,0,0];

function next(clicked_panel) {
	value_choices[curr_index] = clicked_panel;
	for (let i = 0; i < 6; i++) {
		user_scores[i] += SCORES.get(curr_index)[clicked_panel][i];
		console.log(SCORES.get(curr_index)[clicked_panel][i]);
	}
	console.log(user_scores);

	changePanels();
}

function changePanels() {
	curr_index++;
	if (curr_index < 8) {
		$('#left_panel').text(VALUE_STATEMENTS[curr_index][0]);
		$('#right_panel').text(VALUE_STATEMENTS[curr_index][1]);
	} else {
		showParentInstructions();
	}
}

function start() {
	console.log("STARTING");
	$('#instructions').text("For the following questions, choose the option which best describes your beliefs and values.");
	$('#value_statements').hide();
}

function showNextInstructions() {
	$('#instructions').hide();
	$('#instructions_button').hide();
	$('#value_statements').show();
}

function showParentInstructions() {
	$('#instructions').show();
	$('#instructions_button').show();
	$('#value_statements').hide();
	$('#instructions').text("Now, imagine you are a parent with a child who is about to start school for the first time.");
	console.log(user_scores);
}

window.onload = function(){
	start();
};







let schools = [school1, school2, school3];
let school1 = new Map([['school type', 'public school'], ['demographics', '...']]);
let school2 = new Map([]);
let school3 = new Map([]);

