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
var scriptBox = document.getElementById("scripts");

// set question and answers

function setHeader(){
	var questionBox = document.createElement("div");
	questionBox.setAttribute("id","question" + (questionNumber + 1));
	document.body.insertBefore(questionBox,scriptBox);
	var questionElement = document.createElement("h3");
//	questionElement.setAttribute("id","question" + (questionNumber + 1));
	var questionText = document.createTextNode(questions[questionNumber].question);
	questionElement.appendChild(questionText);
	questionBox.appendChild(questionElement);
	$(questionBox).hide().fadeIn(1000);
}

function setChoices(){
	var i;
	var choiceBox = document.createElement("div");
	choiceBox.setAttribute("id","choiceSet" + (questionNumber + 1));
	document.body.insertBefore(choiceBox,scriptBox);
	for(i=0;i<questions[questionNumber].choices.length;i++){
		var choiceElement = document.createElement("input");
		choiceElement.setAttribute("type","radio");
		choiceElement.setAttribute("name","choice");
		choiceElement.setAttribute("id","answ" + (i + 1));
		choiceElement.setAttribute("value",i);
		var labelElement = document.createElement("label");
		labelElement.setAttribute("for","choice");
		labelElement.setAttribute("id","choice_" + (i + 1));
		labelElement.innerHTML = questions[questionNumber].choices[i] + "<br />";
		choiceBox.appendChild(choiceElement);
		choiceBox.appendChild(labelElement);
	}
	$(choiceBox).hide().fadeIn(1000);
}

function setButtons(){
	var backButton = document.createElement("button");
	backButton.setAttribute("id","back");
	backButton.innerHTML = "Back";
	var nextButton = document.createElement("button");
	nextButton.setAttribute("id","next");
	nextButton.innerHTML = "Next";
	document.body.insertBefore(backButton,scriptBox);
	document.body.insertBefore(nextButton,scriptBox);
	nextButton.addEventListener('click',nextQuestion,false);
	backButton.addEventListener('click',questionreview,false);
	$(nextButton).hide().fadeIn(1000);
	$(backButton).hide().fadeIn(1000);
}

function askQuestion(){
	if(answdQuestions[questionNumber] === undefined){
		setHeader();
		setChoices();
		setButtons();
	} 
	
	if (answdQuestions[questionNumber] !== undefined){
		setHeader();
		setChoices();
		setButtons();
		checks();
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
function removePrevious(){
	var removeQuestion = document.getElementById("question" + questionNumber);
	removeQuestion.parentNode.removeChild(removeQuestion);
	var removeChoices = document.getElementById("choiceSet" + questionNumber);
	removeChoices.parentNode.removeChild(removeChoices);
	var removeBackButton = document.getElementById("back");
	removeBackButton.parentNode.removeChild(removeBackButton);
	var removeNextButton = document.getElementById("next");
	removeNextButton.parentNode.removeChild(removeNextButton);
}

function nextQuestion(){
	var validates = validateForm();
	if(validates){
		console.log(questionNumber);
		var fades = document.getElementById("question" + questionNumber);
		console.log(fades);
		$(fades).fadeOut(10000);
		updateScore();
		questionNumber++;
		removePrevious();
		showScore();
		askQuestion();
	}			
}

// sends user back to first question when 'back' button is clicked
function removeCurrent(){
	var removeQuestion = document.getElementById("question" + (questionNumber +1));
	removeQuestion.parentNode.removeChild(removeQuestion);
	var removeChoices = document.getElementById("choiceSet" + (questionNumber + 1));
	removeChoices.parentNode.removeChild(removeChoices);
	var removeBackButton = document.getElementById("back");
	removeBackButton.parentNode.removeChild(removeBackButton);
	var removeNextButton = document.getElementById("next");
	removeNextButton.parentNode.removeChild(removeNextButton);
}

function questionreview(){
	removeCurrent();
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

//var nextButton = document.getElementById('next');
//var backButton = document.getElementById('back');
