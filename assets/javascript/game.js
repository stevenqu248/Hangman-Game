// OOP is OP
var game = 
{
	isRunning: false,
	wordBank: ["Final Fantasy", "Call of Duty", "Gears of War", "Grand Theft Auto", 
	"World of Warcraft", "Legend of Zelda", "Super Mario"],
	incorrectLetters: "",
	guessedLetters: "",
	hiddenWord: "",
	selectedWord: "",
	wins: 0,
	generateWord: function()
	{
		// Find a word
		this.selectedWord = this.wordBank[Math.floor(Math.random() * this.wordBank.length)];
		console.log(this.selectedWord);
		// And conceal the letters
		game.hiddenWord = "";
		for(var i = 0; i < this.selectedWord.length; i++)
		{
			if(this.selectedWord[i] != " ")
			{
				this.hiddenWord += "_";
			}

			else
			{
				this.hiddenWord += " ";
			}
		}
		console.log(this.hiddenWord);
	},

	checkLetter: function(letter) 
	{
		var numCorrectLetters = 0;

		// early out
		for(var i = 0; i < this.guessedLetters.length; i++)
		{
			if(this.guessedLetters[i] === letter)
				return;
		}

		this.guessedLetters += letter;
		console.log(this.guessedLetters);

		// check if you guessed right
		for(var i = 0; i < this.selectedWord.length; i++)
		{
			if(this.selectedWord[i] == letter.toLowerCase() || this.selectedWord[i] == letter.toUpperCase())
			{
				// since strings are immutable, remake the string
				var newHiddenWord = "";
				for(var j = 0; j < this.hiddenWord.length; j++)
				{
					if(j !== i)
						newHiddenWord += this.hiddenWord[j];

					else
						newHiddenWord += this.selectedWord[i];
				}

				this.hiddenWord = newHiddenWord;
				numCorrectLetters++;
			}
		}

		if(numCorrectLetters === 0)
		{
			this.incorrectLetters += letter;
			this.advanceHangman();
		}

		this.updateWindow();
	},

	advanceHangman: function()
	{
		var picture = document.getElementById("hangmanProfile");
		// if it doesn't exist, generate one
		if(picture == null)
		{
			picture = document.createElement("img");
			var idAttr = document.createAttribute("id");
			var srcAttr = document.createAttribute("src");
			var altAttr = document.createAttribute("alt");

			idAttr.value = "hangmanProfile";
			srcAttr.value = "assets/images/Hang1.png";
			altAttr.value = 1;

			picture.setAttributeNode(idAttr);
			picture.setAttributeNode(srcAttr);
			picture.setAttributeNode(altAttr);

			var stockade = document.getElementById("stockade");
			stockade.appendChild(picture);
		}

		// or move him one picture
		else
		{
			var srcAttr = picture.getAttributeNode("src");
			var altAttr = picture.getAttributeNode("alt");
			altAttr.value++;
			srcAttr.value = "assets/images/Hang" + altAttr.value.toString() + ".png";
			console.log(srcAttr);

			picture.setAttributeNode(srcAttr);
			picture.setAttributeNode(altAttr);

		}
		console.log("hang man moves");
	},

	updateWindow: function()
	{
		// replace the hidden word letters
		var element = document.getElementById("hiddenWord");
		element.innerHTML = this.hiddenWord;

		// replace the incorrect letters
		var newString = "IncorrectLetters: ";
		for(var i = 0; i < this.incorrectLetters.length; i++)
		{
			newString += this.incorrectLetters[i];
			
			// add a separator where needed
			if(i !== (this.incorrectLetters.length - 1))
			{
				newString += ", ";
			}
		}
		element = document.getElementById("incorrectLetters");
		element.innerHTML = newString;

		this.checkWinLoseCondition();
	},

	checkWinLoseCondition: function()
	{
		// check win condition
		if(this.hiddenWord.indexOf("_") === -1)
		{
			// due to when it gets updated, update number of wins here
			this.wins++;
			element = document.getElementById("winCount");
			element.innerHTML = "Wins: " + this.wins;
			alert("Congratulations! You Win!");
			this.isRunning = false;
			createReplayButton();
		}

		// check lose condition
		var hangmanPicture = document.getElementById("hangmanProfile");
		if (hangmanPicture != null) 
		{
			var currentPicture = hangmanPicture.getAttribute("alt")
			console.log("current picture: " + currentPicture);
			if(currentPicture == 7)
			{
				alert("Oh no! Looks like the hangman has earned himself another pair of boots. Game Over!");
				this.isRunning = false;	
				createReplayButton();
		}			
		}

	}
};

var keyPressed = false;

function beginGame()
{
	// remove the button to prevent restarting the game
	var button = document.getElementById("gameStart");
	button.parentNode.removeChild(button);
	game.generateWord();
	// add the word to the webpage
	var element = document.getElementById("hiddenWord");
	element.innerHTML = game.hiddenWord;
	console.log(game.hiddenWord);
	element = document.getElementById("incorrectLetters");
	element.innerHTML = "Incorrect Letters: ";

	// reset anything from the previous game
	game.isRunning = true;
	keyPressed = false;
	game.incorrectLetters = "";
	game.guessedLetters = "";
	var previousHangedMan = document.getElementById("hangmanProfile");
	if (previousHangedMan != null)
	{
		previousHangedMan.parentNode.removeChild(previousHangedMan);
	}

};

document.onkeypress = function(event)
{
	// early outs
	if(keyPressed || !game.isRunning)
	{
		console.log("preventing multiple characters at the same time or guessing before the game has begun");
		return;
	}

	keyPressed = true;
	var letterArray = ['a','b','c','d','e','f','g','h','i','j','k','l',
	'm','n','o','p','q','r','s','t','u','v','w','x','y','z'];
	var isALetter = false;
	var chosenKey = String.fromCharCode(event.which || event.keyCode);
	console.log(chosenKey);
	for(var i = 0; i < letterArray.length; i++)
	{
		if(chosenKey === letterArray[i])
			isALetter = true;
	}

	if(isALetter)
	{
		console.log("Going on to check keys");
		game.checkLetter(chosenKey);
	}
};

document.onkeyup = function(event)
{
	keyPressed = false;
}

function createReplayButton()
{
			// create a replay button
		var button = document.createElement("button");
		var classAttr = document.createAttribute("class");
		var clickAttr = document.createAttribute("onclick");
		var idAttr = document.createAttribute("id");
		var h4 = document.createElement("h4");
		var text = document.createTextNode("Replay!");
		h4.appendChild(text);
		classAttr.value = "col-md-2 col-md-offset-5";
		clickAttr.value = "beginGame();";
		idAttr. value = "gameStart";

		button.setAttributeNode(classAttr);
		button.setAttributeNode(clickAttr);
		button.setAttributeNode(idAttr);
		button.appendChild(h4);

		// place it in the correct spot
		var location = document.getElementById("buttonRow");
		location.appendChild(button);
}