/****
 * Equity, I Choose You
 * Documentation: https://docs.google.com/document/d/1yyedx9eUpFpxBtxoGwSyUS3A4SADYg30l48Vd3eLO7M/edit
 * (please ignore the terrible style...WIP)
 **/

let INSTRUCTIONS = ["For the following questions, choose the option which best describes your beliefs and values.",
					"Now, imagine you are a parent with a child who is about to start school for the first time.",
					"You are trying to choose a school for your child and have a few options:"];
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
					[7, [[0,0,1,0,0,0],[0,0,0,0,0,0]]]]); //Value statement index to score effects (a tuple of [left score array, right score array])

let curr_index = 0;
let value_choices = [];   //each index represents value choice; 0=left value, 1=right value
let user_scores = [0,0,0,0,0,0]; // corresponding index to score category: [0: support equity, 1: opportunity equity, 2: testing,
								 //											3: diversity, 4: resource equity, 5: discipline]

// Called each time the user selects a value statement
// Increments 
function next(clicked_panel) {
	value_choices[curr_index] = clicked_panel;
	for (let i = 0; i < 6; i++) {
		user_scores[i] += SCORES.get(curr_index)[clicked_panel][i];
	}
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
	$('#instructions').text(INSTRUCTIONS[0]);
	$('#value_statements').hide();
	$('#parent_instructions_button').hide();
	$('#display_schools_button').hide();
	$('#school1-overlay').hide();
	$('#school2-overlay').hide();
	$('#school3-overlay').hide();
}


// lol need to fix all the button names/make these methods clearer...
// there's probably a better way to do this than three separate buttons
function showNextInstructions() {
	$('#instructions').hide();
	$('#intro_instructions_button').hide();
	$('#value_statements').show();
}

function showParentInstructions() {
	$('#instructions').show();
	$('#parent_instructions_button').show();
	$('#value_statements').hide();
	$('#instructions').text(INSTRUCTIONS[1]);
}

function showSchoolInstructions() {
	$('#instructions').text(INSTRUCTIONS[2]);
	$('#parent_instructions_button').hide();
	$('#display_schools_button').show();
}

function displaySchools() {
	$('#instructions').hide();
	$('#display_schools_button').hide();
	$("#schools").load("schools-display.html", function() {
		insertSchoolData();
	});
	// Add code to display schools based on school maps
}

function insertSchoolData() {
	school1.forEach(function(value, key, map) {
		$.get("schools-display.html", function(data){
			let rowHtml = generateSchoolPropHtml(key, data);
			$("#schools").append(rowHtml);
		});
	});
	$('#school1-overlay').show();
	$('#school2-overlay').show();
	$('#school3-overlay').show();
	$('#school1-overlay').css("display", "block");
	$('#school2-overlay').css("display", "block");
	$('#school3-overlay').css("display", "block");
}

function generateSchoolPropHtml(prop, data) {
	data = data.replace("School Name", prop);
	data = data.replace("School1", school1.get(prop));
	data = data.replace("School2", school2.get(prop));
	data = data.replace("School3", school3.get(prop));
	return data;
}

function chooseSchool(num) {
	$('#instructions').show();
	$('#instructions').text("You choose school " + num);
	$('#schools').hide();
}

window.onload = function(){
	start();
};



let school1 = new Map([['school type', 'public school'], ['demographics', 'a']]);
let school2 = new Map([['school type', 'charter school'], ['demographics', 'b']]);
let school3 = new Map([['school type', 'private school'], ['demographics', 'c']]);
let schools = [school1, school2, school3];