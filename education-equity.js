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
// School maps
// TODO: Move to top of file and make const
let SCHOOL1 = new Map([['school type', 'public school'], 
						['demographics', 'Majority Asian and white students, with 10% black and Latinx students'],
						['discipline', 'Students cannot be suspended; instead, they are required to attend counseling services.'],
						['academic', 'Below average test scores'],
						['tracking', 'After 1st grade, students are separated into tracks based on grades; ability to switch tracks each year given standardized test performance.'],
						['support', 'Provides bare minimum for legally required support services, such as counseling; however, it is reserved for those who need it the most, and may not be of the best quality.'],
						['class size', '20-25 students / class']]);
let SCHOOL2 = new Map([['school type', 'Public charter school with private K to guarantee admission'], 
						['demographics', 'Majority black and Latinx students'],
						['discipline', 'Disciplinary process includes meetings with parents and staff process; suspension occurs after third disciplinary infraction.'],
						['academic', 'Average test scores'],
						['tracking', 'Students are primarily randomly assigned; gifted ed program can be tested into.'],
						['support', 'Provides basic support mechanisms for students, including mental and physical health services, as well as a variety of disabilities supports.'],
						['class size', '25+ students / class']]);
let SCHOOL3 = new Map([['school type', 'Private school with sufficient need-based financial aid to support your family.'], 
						['demographics', 'Majority white students, with 2% black and Latinx students'],
						['discipline', 'Disciplinary process includes meetings with parents and staff, and suspension as a last resort.'],
						['academic', 'Above average test scores'],
						['tracking', 'Students are randomly assigned to classes.'],
						['support', 'Strong support mechanisms for struggling students to receive additional support through tutoring, personalized advising, test prep courses, etc.'],
						['15-20 students / class']]);
let SCHOOLS = [SCHOOL1, SCHOOL2, SCHOOL3];


// Called each time the user selects a value statement
// Increments the user's scores according to selected statement
function next(clicked_panel) {
	value_choices[curr_index] = clicked_panel;
	for (let i = 0; i < 6; i++) {
		user_scores[i] += SCORES.get(curr_index)[clicked_panel][i];
	}
	changePanels();
}

// Called by next() to update panel text after statement has been selected
function changePanels() {
	curr_index++;
	if (curr_index < 8) {
		$('#left_panel').text(VALUE_STATEMENTS[curr_index][0]);
		$('#right_panel').text(VALUE_STATEMENTS[curr_index][1]);
	} else {
		showParentInstructions();
	}
}

// Called at the start of the program to hide html elements
function start() {
	$('#instructions').text(INSTRUCTIONS[0]);
	$('#value_statements').hide();
	$('#parent_instructions_button').hide();
	$('#display_schools_button').hide();
	$('.overlay-parent').hide();
}


// lol need to fix all the button names/make these methods clearer...
// there's probably a better way to do this than three separate buttons
// The following four buttons show and hide the relevant instruction buttons 
// and update the instruction div text
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
}

// Generates school table from school maps
function insertSchoolData() {
	SCHOOL1.forEach(function(value, key, map) {
		$.get("schools-display.html", function(data){
			let rowHtml = generateSchoolPropHtml(key, data);
			$("#schools").append(rowHtml);
		});
	});

	// Use overlay spans to select a school
	$('.overlay-parent').show();
	$('#school1-overlay').css("display", "block");
	$('#school2-overlay').css("display", "block");
	$('#school3-overlay').css("display", "block");
}

// Called by insertSchoolData()
// Updates html from schools-display.html for each school property
function generateSchoolPropHtml(prop, data) {
	data = data.replace("School Name", prop);
	data = data.replace("School1", SCHOOL1.get(prop));
	data = data.replace("School2", SCHOOL2.get(prop));
	data = data.replace("School3", SCHOOL3.get(prop));
	return data;
}

// Handles school selection
function chooseSchool(num) {
	$('#instructions').show();
	$('#instructions').text("You chose school " + num);
	$('#schools').hide();
}

window.onload = function(){
	start();
};