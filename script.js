let rightAnswer = 0;
let currentQuestionIndex = 0;
let questions = [];

async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
        displayQuestion();
    } catch (error) {
        console.error('Error loading JSON file:', error);
    }
}

let timeLeft = 45;

function displayQuestion() {
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options-container');

    fetch('questions.json')
    .then(response => response.json()) 
    .then(data => {

        const questionCount = data.length;
        
        
        document.getElementById('questionCount').textContent = `${currentQuestionIndex + 1} / ${questionCount}`;
    })
    .catch(error => console.error('Error fetching the JSON:', error));

    timeLeft = 45;
    const countdownElement = document.getElementById('countdown');
    const answerButton = document.querySelector('button');
    
    const countdownTimer = setInterval(() => {
        if (timeLeft < 0) {
            clearInterval(countdownTimer);
            answerButton.click();
        } else {
            countdownElement.textContent = `${timeLeft}`;
            timeLeft--;
        }
    }, 1000);

    optionsContainer.innerHTML = '';

    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;

    currentQuestion.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.classList.add('option');
        optionDiv.setAttribute('data-correct', option === currentQuestion.correct_answer);
        optionDiv.innerHTML = `
            <span>${String.fromCharCode(97 + index)}. ${option}</span>
            <input type="number" class="votes" value="0" min="0">
        `;
        optionsContainer.appendChild(optionDiv);
    });
}

function endQuestions() {
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options-container');
    document.getElementById('nextQuestion').remove();
    document.getElementById('analyze').remove();
    const totalQuestions = currentQuestionIndex + 1;
    const percentage = (rightAnswer / totalQuestions) * 100;
    questionElement.innerHTML = `End of quizz - ${percentage.toFixed(2)}% of questions correct`;
    optionsContainer.innerHTML = '';
}

document.getElementById('analyze').addEventListener('click', function() {
    const options = document.querySelectorAll('.option');
    let correctVotes = 0;
    let maxVotes = 0;
    timeLeft = 0;
    options.forEach(option => {
        const isCorrect = option.getAttribute('data-correct') === 'true';
        const votes = parseInt(option.querySelector('.votes').value) || 0; 

        if (isCorrect) {
            correctVotes = votes;
            option.classList.add('correct');
        } else {
            option.classList.add('wrong');
            if (votes > maxVotes) {
                maxVotes = votes;
            }
        }
    });

    if (correctVotes > maxVotes) {
        rightAnswer++;
    }

    document.getElementById('nextQuestion').style.display = 'block';
    this.style.display = 'none'; 
});

document.getElementById('nextQuestion').addEventListener('click', function() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
        this.style.display = 'none'; 
        document.getElementById('analyze').style.display = 'block'; 
    } else {
        endQuestions();
    }
});




        


loadQuestions();
