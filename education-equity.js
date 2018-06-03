/****
 * Equity, I Choose You
 * Documentation: https://docs.google.com/document/d/1yyedx9eUpFpxBtxoGwSyUS3A4SADYg30l48Vd3eLO7M/edit
 * (please ignore the terrible style...WIP)
 **/


let equitable_statements = [[],[],[],[],[],[]];
let user_scores = [0,0,0,0,0,0]; // >0 means the user's value statements prioritized equity for that category
let curr_index = 0;

// Called each time the user selects a value statement
// Increments the user's scores according to selected statement
function next(clicked_panel) {
	let statement = VALUE_STATEMENTS[curr_index][clicked_panel];
	for (let i = 0; i < 6; i++) {
		let category_change = SCORES.get(curr_index)[clicked_panel][i]
		user_scores[i] += category_change;
		// If statement valued equity, store in equitable_statements
		if (category_change > 0) {
			equitable_statements[i].push(statement);
		}
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
	data = data.replace("Washington Elementary", SCHOOL1.get(prop));
	data = data.replace("Lincoln Elementary", SCHOOL2.get(prop));
	data = data.replace("Stony Brook Elementary", SCHOOL3.get(prop));
	return data;
}

// Handles school selection
function chooseSchool(num) {
	$('#instructions').show();
	$('#instructions').text("You chose school " + (num+1));
	$('#schools').hide();

	let summaryString = "";
	let chosenSchool = SCHOOLS[num];
	for (let i = 0; i < user_scores.length; i++) {
		if (SCHOOL_EQUITY_CATEGORIES.get(chosenSchool)[i] && (user_scores[i] > 0)) {
			let category = CATEGORY_TO_INDEX_MAP.get(i);
			summaryString += "<p>School " + (num+1) + " is inequitable in " + category;
			summaryString += " because of the following properties: </p><ul>";
			let properties = CATEGORY_TO_SCHOOL_PROPERTIES.get(category);
			for (let j = 0; j < properties.length; j++) {
				if (properties[j]) {
					summaryString += "<li>" +SCHOOL_PROPERTY_TO_INDEX_MAP.get(j) + ": " + chosenSchool.get(SCHOOL_PROPERTY_TO_INDEX_MAP.get(j)) + "</li>";
				}
			}
			summaryString += "</ul><p>This conflicts with your chosen values: </p><ul>";
			for (let j = 0; j < equitable_statements[i].length; j++) {
				summaryString += "<li>" + equitable_statements[i][j] + "</li>";
			}
			summaryString += "</ul>";
		}
	}

	$('#summary').html(summaryString);
}

window.onload = function(){
	start();
};