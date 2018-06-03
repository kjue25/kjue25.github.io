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
					  [2, [[0,0,-1,0,0,0],[0,0,1,1,0,0]]], 
					  [3, [[0,0,0,0,1,0,],[0,0,0,0,-1,0]]],
					  [4, [[0,0,0,1,0,0],[0,0,-1,-1,0,0]]],
					  [5, [[0,0,0,0,0,-1],[0,0,0,0,0,1]]],
					  [6, [[0,0,0,1,0,0],[0,0,0,0,0,0]]],
					  [7, [[0,0,-1,0,0,0],[0,0,0,0,0,0]]]]); //Value statement index to score effects (a tuple of [left score array, right score array])

// Corresponding indices to score category for equitable_statements, user_choices, SCHOOL_EQUITY_CATEGORIES:
let CATEGORY_TO_INDEX_MAP = new Map([[0, 'support equity'],
					  	   	 [1, 'opportunity equity'],
					  	   	 [2, 'testing'],
					  	   	 [3, 'diversity'],
					  	   	 [4, 'resource equity'], 
					  	   	 [5, 'discipline']]);

// School maps
let SCHOOL1 = new Map([['school type', 'public school'], 
						['demographics', 'Majority Asian and white students, with 10% black and Latinx students'],
						['discipline', 'Students cannot be suspended; instead, they are required to attend counseling services.'],
						['academics', 'Below average test scores'],
						['tracking', 'After 1st grade, students are separated into tracks based on grades; ability to switch tracks each year given standardized test performance.'],
						['support programs', 'Provides bare minimum for legally required support services, such as counseling; however, it is reserved for those who need it the most, and may not be of the best quality.'],
						['class size', '20-25 students / class']]);
let SCHOOL2 = new Map([['school type', 'Public charter school with private K to guarantee admission'], 
						['demographics', 'Majority black and Latinx students'],
						['discipline', 'Disciplinary process includes meetings with parents and staff process; suspension occurs after third disciplinary infraction.'],
						['academics', 'Average test scores'],
						['tracking', 'Students are primarily randomly assigned; gifted ed program can be tested into.'],
						['support programs', 'Provides basic support mechanisms for students, including mental and physical health services, as well as a variety of disabilities supports.'],
						['class size', '25+ students / class']]);
let SCHOOL3 = new Map([['school type', 'Private school with sufficient need-based financial aid to support your family.'], 
						['demographics', 'Majority white students, with 2% black and Latinx students'],
						['discipline', 'Disciplinary process includes meetings with parents and staff, and suspension as a last resort.'],
						['academics', 'Above average test scores'],
						['tracking', 'Students are randomly assigned to classes.'],
						['support programs', 'Strong support mechanisms for struggling students to receive additional support through tutoring, personalized advising, test prep courses, etc.'],
						['class size', '15-20 students / class']]);
let SCHOOLS = [SCHOOL1, SCHOOL2, SCHOOL3];
let SCHOOL_EQUITY_CATEGORIES = new Map([[SCHOOL1, [1,1,0,0,1,0]],
									  [SCHOOL2, [0,1,0,1,0,1]],
									  [SCHOOL3, [0,0,1,1,1,1]]]); // 1s represent value categories that will misalign the user_score is > 0 for that category

let SCHOOL_PROPERTY_TO_INDEX_MAP = new Map([[0, 'school type'],
											[1, 'demographics'],
											[2, 'discipline'],
											[3, 'academics'],
											[4, 'tracking'],
											[5, 'support programs'],
											[6, 'class size']]);

let CATEGORY_TO_SCHOOL_PROPERTIES =new  Map([['support equity', [0,0,0,0,0,1,1]],
											 ['opportunity equity', [0,0,0,0,1,0,1]],
											 ['testing', [0,0,0,1,0,0,0]],
											 ['resource equity', [1,0,0,0,0,0,0]],
											 ['diversity', [0,1,0,0,0,0,0,0]],
											 ['discipline', [0,0,1,0,0,0,0]]]);