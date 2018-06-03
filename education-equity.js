/****
 * Equity, I Choose You
 * Documentation: https://docs.google.com/document/d/1yyedx9eUpFpxBtxoGwSyUS3A4SADYg30l48Vd3eLO7M/edit
 * (please ignore the terrible style...WIP)
 **/


let equitable_statements = [[],[],[],[],[],[]]; // Stores statements chosen by the user that value equity
let user_scores = [0,0,0,0,0,0]; // See CATEGORY_TO_INDEX_MAP for meaning of indices
								 // A category score of >0 means the user selected statements that
								 // prioritize equity in that category
let curr_panel_index = 0; // Index to track current value statement panel


// Called at the start of the program to hide html elements
function start() {
	$('#instructions').text(INSTRUCTIONS[0]);
	$('#value_statements').hide();
	$('#parent_instructions_button').hide();
	$('#display_schools_button').hide();
	$('.overlay-parent').hide();
}

// Called each time the user selects a value statement
// Increments the user's scores according to selected statement
// Stores equity-prioritizing statements in equitable_statements
function next(clicked_panel) {
	let statement = VALUE_STATEMENTS[curr_panel_index][clicked_panel];
	for (let i = 0; i < NUM_VALUE_CATEGORIES; i++) {
		let category_change = SCORES.get(curr_panel_index)[clicked_panel][i]
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
	curr_panel_index++;
	if (curr_panel_index < NUM_STATEMENT_PANELS) {
		$('#left_panel').text(VALUE_STATEMENTS[curr_panel_index][0]);
		$('#right_panel').text(VALUE_STATEMENTS[curr_panel_index][1]);
	} else { // User has gone through all value statements
		showParentInstructions();
	}
}

/* * * * * * */
// lol need to fix all the button names/make these methods clearer...
// there's probably a better way to do this than three separate buttons
// The following four button functions show and hide the relevant instruction buttons
// and update the instructions div text
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

// Displays school table using the schools-display.html template
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
		// Generate HTML string for each row
		$.get("schools-display.html", function(data){
			let row_html = generateSchoolPropHtml(key, data);
			$("#schools").append(row_html);
		});
	});

	// Use overlay spans to select a school
	$('.overlay-parent').show();
	$('#school1-overlay').css('display', 'block');
	$('#school2-overlay').css('display', 'block');
	$('#school3-overlay').css('display', 'block');
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
	
	// Just hide the school columns you didn't choose
	for (let i = 0; i < SCHOOLS.length; i++) {
		if (i !== num) {
			$('.school' + i).hide();
		}
	}

	// Generates summary based on selected school
	let summary_string = "";
	let chosen_school = SCHOOLS[num];
	for (let i = 0; i < NUM_VALUE_CATEGORIES; i++) {
		// For given category, if school is not equitable and the user valued equity in that category
		if (SCHOOL_EQUITY_CATEGORIES.get(chosen_school)[i] && (user_scores[i] > 0)) {
			let category = CATEGORY_TO_INDEX_MAP.get(i);
			summary_string += "<p>School " + (num+1) + " is inequitable in " + category;
			summary_string += " because of the following properties: </p><ul>";

			// Display school properties related to that category
			let properties = CATEGORY_TO_SCHOOL_PROPERTIES.get(category);
			for (let j = 0; j < properties.length; j++) {
				if (properties[j]) {
					summary_string += "<li>" + SCHOOL_PROPERTY_TO_INDEX_MAP.get(j) + ": " + chosen_school.get(SCHOOL_PROPERTY_TO_INDEX_MAP.get(j)) + "</li>";
				}
			}

			// Display selected equity value statements related to that category
			summary_string += "</ul><p>This conflicts with your chosen values: </p><ul>";
			for (let j = 0; j < equitable_statements[i].length; j++) {
				summary_string += "<li>" + equitable_statements[i][j] + "</li>";
			}
			summary_string += "</ul>";
		}
	}

	$('#summary').html(summary_string);
}

window.onload = function(){
	start();
};
