// Declare questions array of objects
var questionsArr = [
    {
        _question: "What is 111 * 1?",
        _responses: ["111", "222", "333", "444"],
        get question() {
            return this._question;
        },
        get responses() {
            return this._responses;
        },
        get answer() {
            return this.responses[0];
        }
    },
    {
        _question: "What is 111 * 2?",
        _responses: ["111", "222", "333", "444"],
        get question() {
            return this._question;
        },
        get responses() {
            return this._responses;
        },
        get answer() {
            return this.responses[1];
        }
    },
    {
        _question: "What is 111 * 3?",
        _responses: ["111", "222", "333", "444"],
        get question() {
            return this._question;
        },
        get responses() {
            return this._responses;
        },
        get answer() {
            return this.responses[2];
        }
    },
    {
        _question: "What is 111 * 4?",
        _responses: ["111", "222", "333", "444"],
        get question() {
            return this._question;
        },
        get responses() {
            return this._responses;
        },
        get answer() {
            return this.responses[3];
        }
    }
];

// Declare game variables
var score = 0;
var questionNumber = 1;
var selectedQuestion = questionsArr[questionNumber - 1];
var isCorrect = false;
var passed = false;

function emptyDisplays() {
    $("#question-display").empty();
    $("#responses-display").empty();
    $("#result-header").empty();
    $("#result-status").empty();
    $("#result-reaction").attr("src", "");
    $(".correct-option").empty();
    $("#score-display").empty();
}

function populateQuestionWindow(questionObj) {
    // Empty all windows and displays.
    emptyDisplays();

    // Populate #question-window window with properties from questionArr object
    $("#question-display").text(questionObj.question);

    // Populate #responses-display with potential responses.
    $.each(questionObj.responses, function(i, val) {
        var responseButton = $("<button>");
        responseButton.addClass("btn btn-outline-success mx-2");
        responseButton.text(val);
        if (responseButton.text() === questionObj.answer) {
            responseButton.attr("data-correct", true);
            console.log(responseButton.text(), responseButton.attr("data-correct"));
        } else {
            responseButton.attr("data-correct", false);
        }
        $("#responses-display").append(responseButton);
    })

    // Reset #time-display display text to 30.
    $("#time-display").text("30");
}

// Declare interval functions
var timeRemaining = 30;

// Declare playRound() function
function playRound() {
    // Populate #question-window with relevant data.
    populateQuestionWindow(selectedQuestion);

    // Run timers
    timeRemaining = 30;
    var timerDisplay = setInterval(function() {
        timeRemaining--;
        $("#time-display").text(timeRemaining);
        if (timeRemaining === 0) {
            clearInterval(timerDisplay);
            timeRemaining = 30;
        }
    }, 1000);

    var timesUp = setTimeout(function() {
        $("#question-window").hide();
        $("#timesup-window").show();
        $(".correct-option").text("The correction option was: " + selectedQuestion.answer);
        clearTimeout(timesUp);
    }, 30000)

    // When user clicks on response button before the timeRemaining reaches 0...
    if (timeRemaining > 0) {
        // ...and they click on the correct response...
        $("[data-correct='true']").on("click", function() {
            // Their score increases by one...
            score++;

            // The #question-window window hides and the #result-window window appears...
            $("#question-window").hide();
            $("#result-window").show();

            // The timer stops...
            clearInterval(timerDisplay);
            clearTimeout(timesUp);

            // The #result-window window informs user they selected the correct response...
            $("#result-header").text("Your response to question #" + questionNumber);
            $("#result-status").text("...Correct!");

            // #result-reaction src set to success gif.
            $("#result-reaction").attr("src", "assets/media/images/sucess.gif");
        });

        // ...and they click on the incorrect response...
        $("[data-correct='false']").on("click", function() {
            // The #question-window window hides and the #result-window window appears...
            $("#question-window").hide();
            $("#result-window").show();

            // The timer stops...
            clearInterval(timerDisplay);
            clearTimeout(timesUp);

            // The #result-window window informs user they selected the incorrect response.
            $("#result-header").text("Your response to question #" + questionNumber);
            $("#result-status").text("...Incorrect!");
            $(".correct-option").text("The correction option was: " + selectedQuestion.answer);

            // #result-reaction src set to fail gif.
            $("#result-reaction").attr("src", "assets/media/images/fail.gif");
        });
    }
}

// Declare game starting function as event
$("#start-button").on("click", function() {
    // emptyDisplays();

    // Proceed to first question window
    $("#start-window").hide();
    $("#question-window").show();
    
    // User plays new round
    playRound();
});

// When the user clicks on a .continue-button...
$(document).on("click", ".continue-button", function() {
    // emptyDisplays();

    // If user is not on the last question...
    if (questionNumber < questionsArr.length) {
        // ...the questionNumber increases by one
        questionNumber++;
        selectedQuestion = questionsArr[questionNumber - 1];

        // ...the #result-window or #timesup-window window disappears
        $("#result-window").hide();
        $("#timesup-window").hide();

        // ...the #question-window window is populated with next question, and user will play new round
        $("#question-window").show();
        playRound();
        

    // ...Otherwise...
    } else {
        // ...the #result-window or #timesup-window window disappears
        $("#result-window").hide();
        $("#timesup-window").hide();

        // ...the .continue-button buttons will take user to score page
        $("#score-window").show();

        // ...we populate the #score-display display with the user's score
        $("#score-display").text(score / questionsArr.length * 100 + "%");

        if ((score / questionsArr.length * 100) >= 75) {
            $("#score-reaction").attr("src", "assets/media/images/win.gif");
        } else {
            $("#score-reaction").attr("src", "assets/media/images/lose.gif");
        }
    }
})

// When the user clicks on #new-game button...
$("#new-game").on("click", function() {
    score = 0;
    questionNumber = 1;
    selectedQuestion = questionsArr[questionNumber - 1];

    $("#score-window").hide();
    $("#question-window").show();
    playRound();
})