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
    $('#first_intro_button').css('display', 'block');
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
	data = data.replace("Lincoln Elementary", SCHOOL2.get(prop));
	data = data.replace("Stony Brook Elementary", SCHOOL3.get(prop));
	return data;
}

// Handles school selection
function chooseSchool(num) {
	$('#schools').hide();
	// Hide the school columns you didn't choose
	for (let i = 0; i < SCHOOLS.length; i++) {
		if (i !== num) {
			$('.school' + i).hide();
		} else {
			$('.school' + i).show();
		}
	}

	$('#schools').addClass('col-sm-5');
	$('.category').removeClass('col-sm-3');
	$('.category').addClass('col-sm-3');
	$('.school' + num).removeClass('col-sm-3');
	$('.school' + num).addClass('col-sm-9');
	$('#summary').addClass('col-sm-7');

	// FIXME: Still able to click on not shown schools

	// Generates summary based on selected school
	let summary_string = "<p class = 'title2'>You chose " + SCHOOL_NAMES[num] + ".</p>";
	let chosen_school = SCHOOLS[num];
	let text_color = ['#886A9E', '#c06c84', '#f67280', '#357BB3'];
	for (let i = 0; i < NUM_VALUE_CATEGORIES; i++) {
		// For given category, if school is not equitable and the user valued equity in that category
		if (SCHOOL_EQUITY_CATEGORIES.get(chosen_school)[i] && (user_scores[i] > 0)) {
			let category = CATEGORY_TO_INDEX_MAP.get(i);
			summary_string += "<p>"+ SCHOOL_NAMES[num] + " is inequitable in <span style=\"font-weight:bold;color:" + text_color[i%4] + "\">" + category + "</span>";
			summary_string += " because of the following properties: </p><ul>";

			// Display school properties related to that category
			let properties = CATEGORY_TO_SCHOOL_PROPERTIES.get(category);
			for (let j = 0; j < properties.length; j++) {
				if (properties[j]) {
					summary_string += "<li><span style=\"font-weight:bold;color:" + text_color[i%4] + "\">" + SCHOOL_PROPERTY_TO_INDEX_MAP.get(j) + "</span>: " + chosen_school.get(SCHOOL_PROPERTY_TO_INDEX_MAP.get(j)) + "</li>";
					// TODO: Also highlight the properties in the school column
				}
			}

			// Display selected equity value statements related to that category
			summary_string += "</ul><p>This conflicts with your chosen values: </p><ul>";
			for (let j = 0; j < equitable_statements[i].length; j++) {
				summary_string += "<li>" + equitable_statements[i][j] + "</li>";
			}
			school_summary = CATEGORY_TO_SUMMARY.get(num);
			console.log(school_summary);
			summary_string += "</ul><p>" + school_summary[i] + "</li>";
			summary_string += "</ul><br><br><br>";
		}
	}

	$('#summary').html(summary_string);
}

window.onload = function(){
	start();
};


