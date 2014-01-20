var score = 0;
var questionNumber = 0;
var button = document.getElementById('next');
var backButton = document.getElementById('back');

// set question and answers

function setHeader(questionNumber){
	var question = document.getElementById('question');
	question.innerHTML = questions[questionNumber].question;
}

function setAnswer(elemId,questionNum,choiceNum){
	var elem = document.getElementById(elemId);
	elem.innerHTML = questions[questionNum].choices[choiceNum];
}

function askQuestion(){
	setHeader(questionNumber);
	setAnswer("choice_1",questionNumber,0);
	setAnswer("choice_2",questionNumber,1);
	setAnswer("choice_3",questionNumber,2);
	setAnswer("choice_4",questionNumber,3);
}

// Adds up number of questions answered correctly

function updateScore(){
	var rightAnswer = questions[questionNumber].correctAnswer;
	var chosenAnswer = document.getElementById("answ" + (rightAnswer + 1));
	if (chosenAnswer.checked){
		score++;
	}
}

// displays next question and set of choices when the 'next' button is clicked

function nextQuestion(){
	var validates = validateForm();
	if(validates){
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


addEventListener('load',askQuestion);
button.addEventListener('click',nextQuestion,false);
backButton.addEventListener('click',questionreview,false);
