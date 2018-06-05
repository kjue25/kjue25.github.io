let INSTRUCTIONS = ["</br>\"Education is the most powerful weapon which you can use to change the world.\" - Nelson Mandela <br/><br/> This explorable explanation aims to help you better understand issues in education while also encouraging you to think about your beliefs.<br/> ", "In the following section, please choose the option that best matches your values for the education system. <br/><br/>There are no “right” choices or “wrong” choices, and you may not always fall exactly on one side or the other. However, the binary decisions reflect difficult tradeoffs that you may face in the real world. <br/><br/>Are you ready?", "Now, imagine you are a parent with a child who is about to start elementary school for the first time. </br> </br> You are trying to choose an elementary school for your child and have a few options."];

let VALUE_STATEMENTS = [["I believe all students in a classroom should receive equal attention from the teacher.", "I believe students who are struggling should receive more attention from the teacher."],
						["I believe schools should have different classes for advanced and underperforming students.", "I believe that students should be in heterogeneous classrooms that cater to all abilities."],
						["I believe quantitative metrics like test scores should be weighted higher than environmental factors when assessing school success.", "I believe environmental factors like school culture should be weighted higher than quantitative metrics like test scores when assessing school success."],
						["I believe that in education everyone should benefit equally regardless of their financial contributions.", "I believe that in education those who contribute the most money should benefit the most."],
						["I believe that it is important to prioritize racial and ethnic diversity in schools over academic achievement.", "I believe that it is important to prioritize academic achievement over racial and ethnic diversity."],
						["I believe that suspension should be allowed as a form of discipline in schools.", "I believe that suspension should not be allowed as a form of discipline in schools."],
						["I believe it is the job of policymakers to create policies that promote racial integration in schools.", "I believe that policymakers are not responsible for creating policies around racial integration in schools."],
						["I believe that schools should prioritize academic rigor.", "I believe that schools should prioritize students’ happiness and emotional well-being."]];

//map from value statement number to Left and Right arrays which represent score
//increments in each user_score category for choices of left or right value statement
let SCORES = new Map([[0,[[-1,0,0,0,0,0], [1,0,0,0,0,0]]],
					  [1, [[0,-1,0,0,0,0],[0,1,0,0,0,0]]],
					  [2, [[0,0,-1,0,0,0],[0,0,1,0,0,0]]],
					  [3, [[0,0,0,0,1,0,],[0,0,0,0,-1,0]]],
					  [4, [[0,0,1,1,0,0],[0,0,-1,-1,0,0]]],
					  [5, [[0,0,0,0,0,-1],[0,0,0,0,0,1]]],
					  [6, [[0,0,0,2,0,0],[0,0,0,0,0,0]]],
					  [7, [[0,0,-1,0,0,0],[0,0,0,0,0,0]]]]);

// Corresponding indices to score category for equitable_statements, user_score, SCHOOL_EQUITY_CATEGORIES:
let CATEGORY_TO_INDEX_MAP = new Map([[0, 'support equity'],
					  	   	 [1, 'opportunity equity'],
					  	   	 [2, 'testing'],
					  	   	 [3, 'diversity'],
					  	   	 [4, 'resource equity'],
					  	   	 [5, 'discipline']]);

// School maps of school property to property of specific school.
let SCHOOL1 = new Map([['school type', 'public school'],
					   ['demographics', 'Majority Asian and white students, with 10% black and Latinx students'],
					   ['discipline', 'Students cannot be suspended; instead, they are required to attend counseling services.'],
					   ['academics', 'Below average test scores'],
					   ['tracking', 'After 1st grade, students are separated into classes based on academic performance; students can switch tracks each year given standardized test performance.'],
					   ['support programs', 'Provides bare minimum for legally required support services, such as mental and physical health counseling and disability accommodations. There is one counselor for the entire school.'],
					   ['supplemental programs', 'No organized art or music program.'],
					   ['class size', '20-25 students / teacher'],
					   ['school size', '486']]);
let SCHOOL2 = new Map([['school type', 'Public charter school with private K to guarantee admission'],
					   ['demographics', 'Majority black and Latinx students'],
					   ['discipline', 'Disciplinary process includes meetings with parents and staff process; suspension occurs after third disciplinary infraction.'],
					   ['academics', 'Average test scores'],
					   ['tracking', 'Students are primarily randomly assigned; gifted ed program can be tested into.'],
					   ['support programs', 'Good quality support services, such as mental and physical health counseling and disability accommodations. There are 4 school counselors.'],
					   ['supplemental programs', 'After school music lessons that parents can opt in and pay for.'],
					   ['class size', '25+ students / teacher'],
					   ['school size', '553']]);
let SCHOOL3 = new Map([['school type', 'Private school with sufficient need-based financial aid to support your family.'],
					   ['demographics', 'Majority white students, with 2% black and Latinx students'],
					   ['discipline', 'Disciplinary process includes meetings with parents and staff, and suspension as a last resort.'],
					   ['academics', 'Above average test scores'],
					   ['tracking', 'Students are randomly assigned to classes.'],
					   ['support programs', 'High quality support services, such as mental and physical health counseling and disability accommodations. There is a specialized team of 10 support personnel who provide hyper individualized care for each student.'],
					   ['supplemental programs', 'Has arts and music program with specialized facilities and instructors.'],
					   ['class size', '15-20 students / teacher'],
					   ['school size', '204']]);

//arrays of schools
let SCHOOLS = [SCHOOL1, SCHOOL2, SCHOOL3];
let SCHOOL_NAMES = ['Washington Elementary', 'Lincoln Elementary', 'Stony Brook Elementary'];

//Map of schools to arrays of flags which represent potential value mismatches for the category represented by
//the CATEGORY_TO_INDEX_MAP above. If flag is up for the user-selected school and user_score for same index is >0,
//a value/choice mismatch has occured
let SCHOOL_EQUITY_CATEGORIES = new Map([[SCHOOL1, [1,1,0,1,0,0]],
									    [SCHOOL2, [0,1,0,0,1,1]],
									    [SCHOOL3, [0,0,1,1,1,1]]]); // 1s represent value categories that will misalign the user_score is > 0 for that category

//School properties which correspond to school property indices.
let SCHOOL_PROPERTY_TO_INDEX_MAP = new Map([[0, 'school type'],
											[1, 'demographics'],
											[2, 'discipline'],
											[3, 'academics'],
											[4, 'tracking'],
											[5, 'support programs'],
											[6, 'supplemental programs'],
											[7, 'class size'],
											[8, 'school size']]);

//Value category keys that map to arrays of school property flags defined by the SCHOOL_PROPERTY_TO_INDEX_MAP above. If property is flagged,
//it indicates that the property relates to the equity category and should be flagged if there is a school choice/equity category mismatch.

let CATEGORY_TO_SCHOOL_PROPERTIES = new Map([['support equity', [0,0,0,0,0,1,0,0,0]],
											 ['opportunity equity', [0,0,0,0,1,0,0,0,0]],
											 ['testing', [0,0,0,1,0,0,0,0,0]],
 											 ['diversity', [0,1,0,0,0,0,0,0,0]],
											 ['resource equity', [1,0,0,0,0,0,1,0,0]],
											 ['discipline', [0,0,1,0,0,0,0,0,0]]]);

let SCHOOL_PROPERTY_TO_CATEGORY = new Map([['school type', 4],
										   ['demographics', 3],
										   ['discipline', 5],
										   ['academics', 2],
										   ['tracking', 1],
										   ['support programs', 0],
										   ['supplemental programs', 4]]);

let CATEGORY_TO_SUMMARY = new Map([[0, ['Students have different needs, backgrounds, and learning styles.  As indicated in your chosen value, equity means providing students with the support they need rather than distributing attention equally among them.  However, equity in support mechanisms for students often means that these resources are taken away from other areas and vice versa.  In this case, Washington Elementary does not have the resources to provide equitable support programs to its students.',
												 'While tracking can be seen as a form of personalized education, the reality of its implementation reveals an inherently inequitable system.  Personalized learning is used to cater to students\' individual needs and goals, but tracking has been referred to as "modern-day segregation in public schools" (Kohli & Quartz, 2014). Early tracking separates students into different educational paths based on their perceived ability (tracks eventually feed into AP, Honors, Standard, College Prep, and similar courses). Many education researchers have shown these groupings perpetuate class inequalities and the achievement gap. As a University of Colorado report bluntly stated, although tracking does not explicitly refer to "race or class differences... the preservation of privilege is always the subtext."',
												 'As Sean Reardon, an endowed Professor of Poverty and Inequality in Education at the Stanford Graduate School of Education, says, "test scores reflect not just the quality of schools or their teachers, but all kinds of other factors in children\'s lives, including their home environment" (2016). While test scores and other quantitative measures can be a convenient snapshot of student performance, they have many limitations. For instance, tests unfairly advantage students whose families can afford additional test prep classes. Standardized tests also neglect and penalize nonstandard ways of learning and thinking.', 
												 'Many underestimate the importance of diversity, particularly in learning environments. "By disrupting conformity, racial and ethnic diversity actually prompts people to scrutinize facts, think more deeply, and develop their own opinions" (Levine & Stark, 2015). Simply being exposed to people who look different from us can enhance creativity and encourage the search for novel information and perspectives, thereby leading to not only openmindedness, but also better outcomes. However, many parents inherently associate crime and safety with the demographics of a school and its neighborhood – a phenomenon that prevents integration from happening naturally and perpetuates false stereotypes.', 
												 'In 2013, a report from Arne Duncan stated, "Our system does not distribute opportunity equitably." Because school funding is mostly local, schools that serve families of lower income tend to get significantly less money than schools that serve families of higher income, despite greater need. These disparities in funding results in large inequities of resources and opportunities for children of different backgrounds, which is seemingly at odds with our nation\'s values.', 
												 'In an analysis of school and juvenile justice records in 2011, Fabelo et al. highlighted two primary findings: 1) that African Americans and students with disabilities are disproportionately removed for disciplinary reasons, and 2) that students who were suspended were more likely to be held back or to drop out. Although suspensions were originally intended to improve student culture and achievement, they have instead been a driving force of the "school-to-prison pipeline," denying students of learning time and amplifying injustices in schools.  However, balancing these issues of equity can be difficult, especially in cases where discipline is enforced for the safety of other students.  Supporters of suspension often don\'t have a clear-cut line of when the disciplinary measure should be used.']],
									[1, ['Students have different needs, backgrounds, and learning styles.  As indicated in your chosen value, equity means providing students with the support they need rather than distributing attention equally among them.  However, equity in support mechanisms for students often means that these resources are taken away from other areas and vice versa.  In this case, Washington Elementary does not have the resources to provide equitable support programs to its students.', 
												 'Although gifted and talented programs have been shown to have value for participating students, there exist disparities between schools who offer such programs (primarily schools serving white students) and schools who do not (primarily schools serving students of color).  Studies have also shown that the selection process for these programs often contains implicit bias – students of color are disproportionately underrepresented in the screening process.',
												 'As Sean Reardon, an endowed Professor of Poverty and Inequality in Education at the Stanford Graduate School of Education, says, "test scores reflect not just the quality of schools or their teachers, but all kinds of other factors in children\'s lives, including their home environment" (2016). While test scores and other quantitative measures can be a convenient snapshot of student performance, they have many limitations. For instance, tests unfairly advantage students whose families can afford additional test prep classes. Standardized tests also neglect and penalize nonstandard ways of learning and thinking.', 
												 'Many underestimate the importance of diversity, particularly in learning environments. "By disrupting conformity, racial and ethnic diversity actually prompts people to scrutinize facts, think more deeply, and develop their own opinions" (Levine & Stark, 2015). Simply being exposed to people who look different from us can enhance creativity and encourage the search for novel information and perspectives, thereby leading to not only openmindedness, but also better outcomes.  However, many parents inherently associate crime and safety with the demographics of a school and its neighborhood – a phenomenon that prevents integration from happening naturally and perpetuates false stereotypes.', 
												 'In 2013, a report from Arne Duncan stated, "Our system does not distribute opportunity equitably." Because school funding is mostly local, schools that serve families of lower income tend to get significantly less money than schools that serve families of higher income, despite greater need. These disparities in funding results in large inequities of resources and opportunities for children of different backgrounds, which is seemingly at odds with our nation\'s values. Although the charter school is public, its private kindergarten may exclude families from lower socioeconomic backgrounds since only those who can afford to pay are guaranteed admission into the public elementary school.  This trend is reflected in the private music lessons that parents can opt into.',
												 'In an analysis of school and juvenile justice records in 2011, Fabelo et al. highlighted two primary findings: 1) that African Americans and students with disabilities are disproportionately removed for disciplinary reasons, and 2) that students who were suspended were more likely to be held back or to drop out. Although suspensions were originally intended to improve student culture and achievement, they have instead been a driving force of the "school-to-prison pipeline," denying students of learning time and amplifying injustices in schools.  However, balancing these issues of equity can be difficult, especially in cases where discipline is enforced for the safety of other students.  Supporters of suspension often don\'t have a clear-cut line of when the disciplinary measure should be used.']],
									[2, ['Students have different needs, backgrounds, and learning styles.  As indicated in your chosen value, equity means providing students with the support they need rather than distributing attention equally among them.  However, equity in support mechanisms for students often means that these resources are taken away from other areas and vice versa.  In this case, Washington Elementary does not have the resources to provide equitable support programs to its students.', 
												'Personalization vs tracking: while personalized learning is used to cater to students\' individual needs and goals, tracking has been referred to as "modern-day segregation in public schools" (Kohli & Quartz, 2014). Tracking has manifested in the designation of students for separate educational paths (APs, Honors, Standard, College Prep, etc.) based on their academic performance. Many education researchers have shown that grouping students by academic ability perpetuates class inequality and the achievement gap. As a University of Colorado report bluntly stated, although tracking does not explicitly refer to "race or class differences... the preservation of privilege is always the subtext."',
												 'As Sean Reardon, an endowed Professor of Poverty and Inequality in Education at the Stanford Graduate School of Education, says, "test scores reflect not just the quality of schools or their teachers, but all kinds of other factors in children\'s lives, including their home environment" (2016). While test scores and other quantitative measures can be a convenient snapshot of student performance, they have many limitations. For instance, tests unfairly advantage students whose families can afford additional test prep classes. Standardized tests also neglect and penalize nonstandard ways of learning and thinking.', 
												 'Many underestimate the importance of diversity, particularly in learning environments. "By disrupting conformity, racial and ethnic diversity actually prompts people to scrutinize facts, think more deeply, and develop their own opinions" (Levine & Stark, 2015). Simply being exposed to people who look different from us can enhance creativity and encourage the search for novel information and perspectives, thereby leading to not only openmindedness, but also better outcomes. However, many parents inherently associate crime and safety with the demographics of a school and its neighborhood – a phenomenon that prevents integration from happening naturally and perpetuates false stereotypes.', 
												 'In 2013, a report from Arne Duncan stated, "Our system does not distribute opportunity equitably." Because school funding is mostly local, schools that serve families of lower income tend to get significantly less money than schools that serve families of higher income, despite greater need. These disparities in funding results in large inequities of resources and opportunities for children of different backgrounds, which is seemingly at odds with our nation\'s values. The more abundant financial resources of private schools often allow them to have high quality supplemental programs like arts, as well as specialized facilities.  However, even with financial aid, high cost schools often create greater socioeconomic divides or segregation.  Additionally, private schools can result in fewer resources being channeled into more accessible public schools.', 
												 'In an analysis of school and juvenile justice records in 2011, Fabelo et al. highlighted two primary findings: 1) that African Americans and students with disabilities are disproportionately removed for disciplinary reasons, and 2) that students who were suspended were more likely to be held back or to drop out. Although suspensions were originally intended to improve student culture and achievement, they have instead been a driving force of the "school-to-prison pipeline," denying students of learning time and amplifying injustices in schools.  However, balancing these issues of equity can be difficult, especially in cases where discipline is enforced for the safety of other students.  Supporters of suspension often don\'t have a clear-cut line of when the disciplinary measure should be used.']]])

let NUM_STATEMENT_PANELS = 8;
let NUM_VALUE_CATEGORIES = 6;
