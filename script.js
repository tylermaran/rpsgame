// var firebase = require("firebase/app");
var updateOnce = true;
// Initialize Firebase
var config = {
	apiKey: "AIzaSyDvmP-ma3_H1RtIO-z0T5w6_Xu69bbQa1k",
	authDomain: "rockpaperscissors-b9dbc.firebaseapp.com",
	databaseURL: "https://rockpaperscissors-b9dbc.firebaseio.com",
	projectId: "rockpaperscissors-b9dbc",
	storageBucket: "rockpaperscissors-b9dbc.appspot.com",
	messagingSenderId: "166650611571"
};
firebase.initializeApp(config);

var round = -1;
var open = false;
// Create a variable to reference the database
var database = firebase.database();

// var gamestats = {
// 	rock: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
// 	paper: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
// 	scissors: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
// 	win: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
// 	loss: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
// }

// database.ref().set({
// 	gamestats: gamestats
// });



var DataArray = [];

$("img").on("click", function () {
	updateOnce = true;
	console.log(this.id);
	round++;

	playGame(this.id, round);
})

function playGame(userPick, round) {
	if (round === 9) {

		playAgain();
	}

	database.ref().on("value", function (snapshot) {

			var currentStats = snapshot.val().gamestats;
			var updatedStats = currentStats;
			var sum = [];
			var rockChance = [];
			var paperChance = [];
			var scissorChance = [];

			// Set sum equal to the total for each position in Array (0,1,2,3...)
			for (let j = 0; j < 5; j++) {
				sum[j] = currentStats.rock[j] + currentStats.rock[j] + currentStats.rock[j]

				rockChance[j] = (currentStats.rock[j] / sum[j]);
				paperChance[j] = rockChance[j] + (currentStats.paper[j] / sum[j]);
				scissorChance[j] = paperChance[j] + (currentStats.scissors[j] / sum[j]);
			}

			var chances = {
				rockChance: rockChance,
				paperChance: paperChance,
				scissorChance: scissorChance
			}


			var computerChoice;
			var random = Math.random();
			if (updateOnce) {
				if (random <= 1 && random > chances.scissorChance[round]) {
					console.log("Scissors");
					computerChoice = "scissors";

					$("#wat").attr("src", "./images/scissors.png");

				}
				if (random <= chances.scissorChance[round] && random > chances.paperChance[round]) {
					console.log("Paper");
					computerChoice = "paper";
					// var image = $("<img>");
					$("#wat").attr("src", "./images/paper.png");

				}
				if (random <= chances.paperChance[round] && random >= 0) {
					console.log("Rock");
					computerChoice = "rock";

					$("#wat").attr("src", "./images/rock.png");

				}
			}


			switch (userPick) {
				case "rock":
					// User Selected Rock, winning move would be paper
					var temp = (updatedStats.paper[round]);
					temp++;
					console.log(temp);
					updatedStats.paper[round] = temp;


					if (updateOnce) {
						updateOnce = false;
						database.ref().set({
							gamestats: updatedStats
						});
					}

					break;
				case "scissors":
					// User Selected scissors, winning move would be rock
					var temp = (updatedStats.rock[round]);
					temp++;
					console.log(temp);
					updatedStats.rock[round] = temp;
					if (updateOnce) {
						updateOnce = false;
						database.ref().set({
							gamestats: updatedStats
						});
					}

					break;
				case "paper":
					// User Selected Paper, winning move would be scissors
					var temp = (updatedStats.paper[round]);
					temp++;
					console.log(temp);
					updatedStats.scissors[round] = temp;
					if (updateOnce) {
						updateOnce = false;
						database.ref().set({
							gamestats: updatedStats
						});
					}
					break;
				default:
					break;
			}

			$(".round").text("Round " + (round + 1));

			// If any errors are experienced, log them to console.
		},
		function (errorObject) {
			console.log("The read failed: " + errorObject.code);
		});

}


// Whenever a user clicks the open button
$(".open").on("click", function () {
	if (open) {
		$(".thehood").html("");
		open = false;
	} else {
		database.ref().on("value", function (snapshot) {
			console.log("AGAAAAAIIINNNN");
			console.log(snapshot.val().gamestats);
			currentStats = snapshot.val().gamestats;
			var table = $("<table>");
			table.addClass("table table-bordered");
			var header = $("<thead>");
			header.append("<th>The Stats!</th>");
			var body = $("<tbody>");

			var rock = $("<tr>");
			var paper = $("<tr>");
			var scissors = $("<tr>");
			var win = $("<tr>");
			var loss = $("<tr>");

			rock.append("<td>Rock Wins</td>");
			paper.append("<td>Paper Wins</td>");
			scissors.append("<td>Scissors Wins</td>");
			win.append("<td>Total Wins</td>");
			loss.append("<td>Total Losses</td>");

			for (let k = 0; k < currentStats.rock.length; k++) {
				header.append("<th>" + k + "</th>");
				rock.append("<td>" + currentStats.rock[k] + "</td>")
				paper.append("<td>" + currentStats.paper[k] + "</td>")
				scissors.append("<td>" + currentStats.scissors[k] + "</td>")
				win.append("<td>" + currentStats.win[k] + "</td>")
				loss.append("<td>" + currentStats.loss[k] + "</td>")
			}

			body.append(rock, paper, scissors, win, loss);

			table.append(header, body);
			$(".thehood").html(table);
			open = true;
		});
	}

	// Prevent default behavior
	event.preventDefault();
});


function playAgain() {
	alert("game over!");
	round = -1;
}