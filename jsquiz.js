var questions = [{question: "Whos the best bball player?",
		choices: ["Lebron James", "Kobe Bryant", "Kevin Durant", "Javale McGee"],
		correctAnswer: 0}, {question: "Name the Miami Heat player?",
		choices: ["Camelo Anthony", "Kevin Love", "Paul Pierce", "Dwayne Wade"],
		correctAnswer: 3}, {question: "Name the LA Lakers player?",
		choices: ["James Harden", "Kobe Bryant", "Chris Bosh", "Michael Jordan"],
		correctAnswer: 1}, {question: "What team does Melo play for?",
		choices: ["Chicago Bulls", "Utah Jazz", "New York Knicks", "Orlando Magic"],
		correctAnswer: 2}
];

var score = 0;
var questionNumber = 0;
var answdQuestions = [];
var button = document.getElementById('next');
var backButton = document.getElementById('back');

// set question and answers

function setHeader(questionNumber){
	var containerDiv = document.getElementById("container");
	var myDiv = document.getElementById("welcome");
	var createEle = document.createElement("h3");
	createEle.setAttribute("id","question");
	console.log(createEle);
	var questionText = document.createTextNode(questions[questionNumber].question);
	createEle.appendChild(questionText);
	console.log(createEle);
	document.body.appendChild(createEle);
}

	


//	questionElement.append(header);
//
//	var radioButtons = createRadios(index);
//	questionElement.append(radioButtons);
//
//	return questionElement;
//}

//function createRadios(index){
//	var radioList = $("<ul>");
//	var item;
//	var input = '';
//	for(var i = 0; i < questions[questionNumber].choices.length; i++){
//		item = $("<li>");
//		input = '<input type="radio" name="choice" value=' + i + '>';
//		input += questions[questionNumber].choices[i];
//		item.append(input);
//		radioList.append(item);
//	}
//	return radioList;
//}


//function setHeader(questionNumber){
//	var question = document.getElementById('question');
//	question.innerHTML = questions[questionNumber].question;
//}

function setAnswer(elemId,questionNum,choiceNum){
	var elem = document.getElementById(elemId);
	elem.innerHTML = questions[questionNum].choices[choiceNum];
}

function askQuestion(){
	if(answdQuestions[questionNumber] === undefined){
		setHeader(questionNumber);
		setAnswer("choice_1",questionNumber,0);
		setAnswer("choice_2",questionNumber,1);
		setAnswer("choice_3",questionNumber,2);
		setAnswer("choice_4",questionNumber,3);
	} 
	
	if (answdQuestions[questionNumber] !== undefined){
		setHeader(questionNumber);
		setAnswer("choice_1",questionNumber,0);
		setAnswer("choice_2",questionNumber,1);
		setAnswer("choice_3",questionNumber,2);
		setAnswer("choice_4",questionNumber,3);
		checks();
		//var choices = document.querySelectorAll('input[name="choice"]');
		//console.log(choices[answdQuestions[0]]);
		//console.log(choices);
		//console.log(choices[0]);
		//console.log(answdQuestions[0]);
		//console.log(answdQuestions);
		//choices[answdQuestions[questionNumber]].checked = true;
		//choices[1].checked = true;
		//console.log(choices[0]);
		//var test = document.getElementById('choice_1');
		//test.checked = true;
		//console.log(test);
		
	}
}

function checks(){
	var choices = document.querySelectorAll('input[name="choice"]');
	choices[answdQuestions[questionNumber].value].checked = true;
}

// Adds up number of questions answered correctly

function selectedAnswer(){
	var choseAnswer1 = document.getElementById("answ" + 1);
	var choseAnswer2 = document.getElementById("answ" + 2);
	var choseAnswer3 = document.getElementById("answ" + 3);
	var choseAnswer4 = document.getElementById("answ" + 4);
	if(choseAnswer1.checked){
		answdQuestions[questionNumber] = choseAnswer1;
	} else if(choseAnswer2.checked){
		answdQuestions[questionNumber] = choseAnswer2;
	} else if(choseAnswer3.checked){
		answdQuestions[questionNumber] = choseAnswer3;
	} else {
		answdQuestions[questionNumber] = choseAnswer4;
	}
}

function updateScore(){
	var rightAnswer = questions[questionNumber].correctAnswer;
	var chosenAnswer = document.getElementById("answ" + (rightAnswer + 1));
	if (chosenAnswer.checked){
		score++;
	}
	selectedAnswer();
}

// displays next question and set of choices when the 'next' button is clicked

function nextQuestion(){
	var validates = validateForm();
	if(validates){
		var removeElement = document.getElementById("question");
		removeElement.parentNode.removeChild(removeElement);
		updateScore();
		questionNumber++;
		showScore();
		askQuestion();
	}			
}

// sends user back to first question when 'back' button is clicked

function questionreview(){
	questionNumber = 0;
	score = 0;
	askQuestion();
}

// displays number of questions answered correctly at end of quiz

function showScore(){
	if(questionNumber == questions.length){
		document.body.innerHTML = "Your score is " + score;

	}
}

// ensures a user has answered the current question before moving to the next one

function validateForm(){
	var form = document.getElementsByName('choice');
	var formValid = false;
	var i = 0;

	while(!formValid && i < questions[questionNumber].choices.length){
		if(form[i].checked){
			formValid = true;
		}
		i++;
	}

	if(!formValid){
		alert("Please select an answer");
	}
	return formValid;
}

// jQuery fading animation


function validate(){
	var email = document.login.email.value;
	var pass = document.login.password.value;
	var valid = false;

	var emailArray = ["kwal0203@gmail.com","Mike@gmail.com"];
	var passArray = ["metta123","betta123"];
	var i = 0;
	for(i = 0; i < emailArray.length; i++){
		if((email === emailArray[i]) && (pass === passArray[i])){
			valid = true;
			break;
		}
	}

	if(valid === true){
		alert('login success');
			// window.open('#');
		return false;
	} else {
		alert('login unsuccessful');
	}
}

addEventListener('load',askQuestion);
button.addEventListener('click',nextQuestion,false);
backButton.addEventListener('click',questionreview,false);
