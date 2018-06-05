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
	$('#title').show();
	$('#instructions').html(INSTRUCTIONS[0]);
    $('#first_intro_button').show();
	$('#intro_instructions_button').show();
	$('#display_schools_button').hide();
	$('.overlay-parent').hide();
	$('#intro_instructions_button').hide();
	$('#schools').hide();

	var acc = document.getElementsByClassName("accordion");
	var i;

	for (i = 0; i < acc.length; i++) {
	  acc[i].addEventListener("click", function() {
	    this.classList.toggle("active");
	    var panel = this.nextElementSibling;
	    if (panel.style.maxHeight){
	      panel.style.maxHeight = null;
	    } else {
	      panel.style.maxHeight = panel.scrollHeight + "px";
	    } 
	  });
	}

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
function showSecondIntro() {
	$('#instructions').html(INSTRUCTIONS[1]);
	$('#first_intro_button').hide();
	$('#intro_instructions_button').show();

}


function showNextInstructions() {
	$('#title').hide();
	$('#intro_instructions_button').hide();
	$('#value_statements').show();

	$('body').css('background-image', 'none');
}

function showParentInstructions() {
	$('#title').show();
	$('#display_schools_button').show();
	$('#value_statements').hide();
	$('#instructions').html(INSTRUCTIONS[2]);
	$('body').css('background-image', 'background.png');
}

// Displays school table using the schools-display.html template
function displaySchools() {
	$('#title').hide();
	$('body').css('background-image', 'none');
	$('#schools').show();
	var acc1 = $(".accordion")[0];
	if (typeof(acc1) !== "undefined")  {
		acc1.click();
	}
}

let chosen_school = "";
// Handles school selection
function chooseSchool(num) {
	chosen_school = SCHOOLS[num];
	let chosen_school_string = "class = 'title2'>You chose " + SCHOOL_NAMES[num] + ".</p>";
	$('#school_name').html(SCHOOL_NAMES[num])
	$('#schools').hide();
	$('#summary').show();

	$('#school_type').html(chosen_school.get('school type'));
	$('#demographics').html(chosen_school.get('demographics'));
	$('#discipline').html(chosen_school.get('discipline'));
	$('#academics').html(chosen_school.get('academics'));
	$('#tracking').html(chosen_school.get('tracking'));
	$('#support_programs').html(chosen_school.get('support programs'));
	$('#supplemental_programs').html(chosen_school.get('supplemental programs'));
	$('#class_size').html(chosen_school.get('class size'));
	$('#school_size').html(chosen_school.get('school size'));


	$('#school_type_button').show();
	$('#demographics_button').show();
	$('#discipline_button').show();
	$('#academics_button').show();
	$('#tracking_button').show();
	$('#support_programs_button').show();
	$('#supplemental_programs_button').show();
	$('#class_size_button').show();
	$('#school_size_button').show();
	$('#conclusion-button').show();

	SCHOOL_PROPERTY_TO_CATEGORY_MAP.forEach(function(category_index, prop, map) {
		// For given category, if school is not equitable and the user valued equity in that category
		if (SCHOOL_EQUITY_CATEGORIES.get(chosen_school)[category_index] && (user_scores[category_index] > 0)) {
			// Enable button
			button = prop.replace(" ", "_");
			$("#" + button + "_button").prop('disabled', false);
		}
	});
}

function showChoiceValueConflicts(school_property) {

	SCHOOL_PROPERTY_TO_CATEGORY_MAP.forEach(function(category_index, prop, map) {
		let related_prop_string = prop.replace(" ", "_");
		$('#' + related_prop_string + '_button').removeClass('pressed-school-prop');
	});

	let prop_string = school_property.replace(" ", "_");
	$('#' + prop_string + '_button').addClass('pressed-school-prop');
	// Generates summary based on selected school and school_property
	let category_index = SCHOOL_PROPERTY_TO_CATEGORY_MAP.get(school_property);
	let category = CATEGORY_TO_INDEX_MAP.get(category_index);
	
	let text_color = ['#886A9E', '#c06c84', '#f67280', '#357BB3'];
	let summary_string = "<p> Your school is inequitable in <span style=\"font-weight:bold;color:" + text_color[category_index%4] + "\">" + category + "</span>";

	// Highlight the school properties related to the associated category
	let properties = CATEGORY_TO_SCHOOL_PROPERTIES.get(category);
	for (let i = 0; i < properties.length; i++) {
		if (properties[i]) {
			let related_prop_string = SCHOOL_PROPERTY_TO_INDEX_MAP.get(i).replace(" ", "_");
			$('#' + related_prop_string + '_button').addClass('pressed-school-prop');
		}
	}

	// Display selected equity value statements related to that category
	summary_string += "<p>This conflicts with your chosen values: </p>";
	for (let i = 0; i < equitable_statements[category_index].length; i++) {
		summary_string += "<hgroup class='value-statement-right'>" + equitable_statements[category_index][i] + "</hgroup><br/><br/>";
	}
	school_summary = CATEGORY_TO_SUMMARY.get(chosen_school);
	summary_string += "<p>" + school_summary[category_index] + "</p>";

	$('#equity-summary-text').html(summary_string);
}

window.onload = function(){
	start();
};


