// import './style.css'

$(document).ready(function() {
	fetch('https://cors-anywhere.herokuapp.com/https://fake-or-real.herokuapp.com/api/tweets/10')
		.then((response) => response.json())
		.then((data) => {
			// console.log(data);

			$('#loading').hide();
			setupQuiz(data);

			// define behavior for when user makes a guess + goes to next question
			$('#vote-real').click(function() {
				checkAnswer(data, true);
				userResponses.push("real");
			});
			$('#vote-fake').click(function() {
				checkAnswer(data, false);
				userResponses.push("fake");
			});
			$('#next').click(function() {
				nextQuestion(data);
			});

			// fun dialogs that occur when users press the fake buttons on the Tweets
			$('.tweet-follow').click(function() {
				thisButtonDoesntWork();
			});
			$('.tweet-reply').click(function() {
				thisButtonDoesntWork();
			});
			$('.tweet-retweet').click(function() {
				thisButtonDoesntWork();
			});
			$('.tweet-heart').click(function() {
				thisButtonDoesntWork();
			});
	    }).catch((error) => {
	    	$('#loading p').html('This game is a hoax (just kidding, something went wrong).');
	    });
});

let current = 1; // current question number
let score = 0;
let userResponses = []; // logs the user's guesses

const GREEN = "#19CF86";
const RED = "#E81C4F";

// comments + images that show when users get the answers right
const rightAnswers = [
	{
		"msg": "That's huge.",
		"img": "images/huge.png",
	},
	{
		"msg": "Winning.",
		"img": "images/winning.jpg",
	},
	{
		"msg": "You have a very, very large brain.",
		"img": "images/brain.jpg",
	},
	{
		"msg": "Making America great again.",
		"img": "images/ass.jpg",
	}
];

// comments + images that show when users get the answers wrong
const wrongAnswers = [
	{
		"msg": "Wrong.",
		"img": "images/wrong.jpg",
	},
	{
		"msg": "So weak.",
		"img": "images/weak.jpg",
	},
	{
		"msg": "You're fake news.",
		"img": "images/fakenews.jpg",
	},
	{
		"msg": "Loser.",
		"img": "images/loser.jpg",
	}
];

// const finalOutcomes = ["You have small hands.", ""];

function setupQuiz(data) {
	// populates question counter in top-left corner of page.
	$('#question-number').html(current);
	$('#question-total').html(data.length);
	renderQuestion(data, current);
	userResponses = [];
}

function nextQuestion(data) {
	if (current === data.length) {
		$('.modal-wrapper').hide();
		endGame(data);
	}
	else {
		$('.modal-wrapper').hide();
		renderQuestion(data, ++current);
	}
}

// given the entire dataset of questions, renders one specific question
function renderQuestion(data, number) {
	let index = number - 1;
	let question = data[index];
	$('#question-number').html(number);
	$('.tweet-content').html(question['tweet']);
	$('.tweet-retweet span').html(randomIntFromInterval(1, 99));
	$('.tweet-heart span').html(randomIntFromInterval(1, 99));
}

function checkAnswer(data, guess) {
	let answer = data[current - 1]['answer'] === 'real';
	if (guess === answer) {
		showModal(true);
	}
	else {
		showModal(false);
	}
}

function showModal(isCorrect) {
	if (isCorrect) {
		let rand = randomIntFromInterval(0, rightAnswers.length - 1);
		$('.modal .result').html('<i class="fa fa-check"></i> ' + rightAnswers[rand]['msg']);
		$('.modal .result').css('color', GREEN)
		$('.modal img').attr('src', rightAnswers[rand]['img']);
		score++;
	}
	else {
		let rand = randomIntFromInterval(0, wrongAnswers.length - 1);
		$('.modal .result').html('<i class="fa fa-times"></i> ' + wrongAnswers[rand]['msg']);
		$('.modal .result').css('color', RED)
		$('.modal img').attr('src', wrongAnswers[rand]['img']);
	}
	$('.modal-wrapper').show('slow');
}

function endGame(data) {
	// shows the end-game screen with the final score
	$('#progress').hide();
	$('#quiz').hide();
	$('#endgame').show();
	$('#num-correct').html(score);
	$('#num-total').html(current);
	// $('#score-desc').html();

	// shows all the questions and the user's answers vs the correct answers
	for (let i = 1; i <= userResponses.length; i++) {
		let solution = $('<div class="solution">');
		solution.append(i + ". You guessed " + colorize(userResponses[i-1]) + ". The Tweet was " + colorize(data[i-1]['answer']) + ".");
		solution.append(renderTweet(data[i-1]['tweet']))
		$('#answers').append(solution);
	}
}

// used to color the strings "real" and "fake" on the endgame answers section green/red
function colorize(str) {
	if (str === "real") {
		return "<span class='green'>real</span>";
	}
	else if (str === "fake") {
		return "<span class='red'>fake</span>";
	}
}

// renders tweets on the endgame answers section (NOT on the quiz part)
function renderTweet(text) {
	return '<div class="tweet"> <div class="tweet-top"> <img src="images/trump.jpg" class="tweet-photo"> <div class="tweet-name"> <p>Donald J. Trump <i class="fa fa-check-circle"></i><br><span>@realDonaldTrump</span></p> </div> <div class="tweet-follow"><i class="fa fa-twitter"></i> Follow</div> </div> <div class="tweet-content">' + text + '</div> <div class="tweet-bottom"> <div class="tweet-action tweet-reply"> <i class="fa fa-reply"></i> </div> <div class="tweet-action tweet-retweet"> <i class="fa fa-retweet"></i> <span>' + randomIntFromInterval(1, 99) + '</span>K </div> <div class="tweet-action tweet-heart"> <i class="fa fa-heart"></i> <span>' + randomIntFromInterval(1, 99) + '</span>K </div> </div> </div>';
}

function randomIntFromInterval(min, max) { 
	return Math.floor(Math.random() * (max - min + 1) + min);
}

let buttonErrorCount = 0;
const buttonErrorMessages = ['These buttons are fake.', 'What we mean is that these buttons don\'t actually do anything.', 'Can you read?', 'Nothing is going to happen if you keep pressing these.', 'You can keep trying. We don\'t care.', 'You\'re wasting your own time.', 'Don\'t you have anything better to do?', 'I suppose if you had anything better to do, you wouldn\'t be on this website to begin with.', 'Ok seriously, cut it out.', 'We\'re going to start fighting back if you don\'t stop this.', 'If you press it one more time, we\'re voting for Trump in the 2020 election.', 'Yeah, you called our bluff, we wouldn\'t do that.', 'Ok, clearly you can keep doing this forever.', 'But WE have better things to do than to sit here and write more of these.', 'So I guess we\'ve reached a standstill.'];

function thisButtonDoesntWork() {
	if (buttonErrorCount === buttonErrorMessages.length) {
		window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
	}
	else {
		alert(buttonErrorMessages[buttonErrorCount++]);
	}
}