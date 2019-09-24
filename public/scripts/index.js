const start = document.getElementById("start");
const quiz = document.getElementById("quiz");
const question = document.getElementById("question");
const qImg = document.getElementById("qImg");
const choiceA = document.getElementById("A");
const choiceB = document.getElementById("B");
const choiceC = document.getElementById("C");
const counter = document.getElementById("counter");
const timeGauge = document.getElementById("timeGauge");
const progress = document.getElementById("progress");
const scoreDiv = document.getElementById("scoreContainer");
const userName = document.getElementById("username");


//the questions

let questions = [{
    question: "What does HTML stand for?",
    imgSrc: "public/img/html.png",
    choiceA: "Correct",
    choiceB: "Wrong",
    choiceC: "Wrong",
    correct: "A"
}, {
    question: "What does CSS stand for?",
    imgSrc: "public/img/css.png",
    choiceA: "Wrong",
    choiceB: "Correct",
    choiceC: "Wrong",
    correct: "B"
}, {
    question: "What does JS stand for?",
    imgSrc: "public/img/js.png",
    choiceA: "Wrong",
    choiceB: "Wrong",
    choiceC: "Correct",
    correct: "C"
}]

//variables

const lastQuestion = questions.length - 1;
let runningQuestion = 0;
let count = 0;
const questionTime = 10; //10 seconds
const gaugeWidth = 150; //150px
const gaugeUnit = gaugeWidth / questionTime;
let TIMER;
let score = 0;

//render a question
function renderQuestion() {
    let q = questions[runningQuestion];

    question.innerHTML = "<p>" + q.question + "</p>";
    qImg.innerHTML = "<img src=" + q.imgSrc + ">";
    choiceA.innerHTML = q.choiceA;
    choiceB.innerHTML = q.choiceB;
    choiceC.innerHTML = q.choiceC;
}

start.addEventListener("click", startQuiz);


//start quiz function
function startQuiz() {

    if (userName.value.length < 1) {
        alert("please insert a name");
        return;
    }

    start.style.display = "none";
    userName.style.display = "none";
    renderQuestion();
    quiz.style.display = "block";
    renderProgress();
    renderCounter();
    TIMER = setInterval(renderCounter, 1000); //1 second
}
//render progress
function renderProgress() {
    for (let qIndex = 0; qIndex <= lastQuestion; qIndex++) {
        progress.innerHTML += "<div class='prog' id=" + qIndex + "></div>";
    }
}

//counter render

function renderCounter() {
    if (count <= questionTime) {
        counter.innerHTML = count;
        timeGauge.style.width = count * gaugeUnit + "px";
        count++;
    } else {
        count = 0;
        //progress bar becomes red
        answerIsWrong();
        if (runningQuestion < lastQuestion) {
            runningQuestion++;
            renderQuestion();
        } else {
            //end the quiz and show the score to the user
            clearInterval(TIMER);
            scoreRender();
        }
    }
}

//check answer

function checkAnswer(answer) {
    if (answer == questions[runningQuestion].correct) {
        // answer is correct
        score++;
        //progress bar becomes green
        answerIsCorrect();
    } else {
        //answer is wrong
        //progress bar becomes red
        answerIsWrong();
    }
    count = 0;
    if (runningQuestion < lastQuestion) {
        runningQuestion++;
        renderQuestion();
    } else {
        //end the quiz and show the score to the user
        clearInterval(TIMER);
        scoreRender();
    }
}

//function for correct answer
function answerIsCorrect() {
    document.getElementById(runningQuestion).style.backgroundColor = "#0f0";
}

//function for wrong answer
function answerIsWrong() {
    document.getElementById(runningQuestion).style.backgroundColor = "#f00";
}

//score render
function scoreRender() {
    scoreDiv.style.display = "block";

    //calculate the amount of question percent answered by the user
    const scorePerCent = Math.round(100 * score / questions.length);

    //choose the image based on the scorePerCent
    let img = (scorePerCent >= 80) ? "public/img/5.png" :
        (scorePerCent >= 60) ? "public/img/4.png" :
        (scorePerCent >= 40) ? "public/img/3.png" :
        (scorePerCent >= 20) ? "public/img/2.png" :
        "public/img/1.png";

    scoreDiv.innerHTML = "<img src=" + img + ">";
    scoreDiv.innerHTML += "<p>" + scorePerCent + "%</p>";

    let data = {
        user: userName.value,
        score: scorePerCent
    };

    fetch("/user", {
            method: "POST",
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(data)
        }).then((response) => response.json())
        .then((data) => {
            console.log(data)
        })
}