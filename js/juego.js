class Juego {
    constructor(preguntas, timeLimit, timeRemaining) {
        this.preguntas = preguntas;
        this.timeLimit = timeLimit;
        this.timeRemaining = timeRemaining;
        this.correctAnswers = 0;
        this.currentQuestionIndex = 0;
    }

    getQuestion() {
        return this.preguntas[this.currentQuestionIndex];
    }

    moveToNextQuestion() {
        this.currentQuestionIndex++;
    }

    shuffleQuestions() {
        this.preguntas = this.preguntas.sort(() => Math.random() - 0.5);
    }

    shuffleRespuesta() {
        const currentQuestion = this.getQuestion();
        if (currentQuestion) {
            currentQuestion.shuffleChoices();
        }
    }

    checkAnswer(answer) {
        if (answer === this.getQuestion().answer) {
            this.correctAnswers++;
        }
    }

    hasEnded() {
        return this.currentQuestionIndex >= this.preguntas.length;
    }

    filterQuestionsByDifficulty(difficulty) {
        if (difficulty > 0 && difficulty <= 3) {
            this.preguntas = this.preguntas.filter((pregunta) => pregunta.difficulty === difficulty);
        }
        console.log(this.preguntas);
    }

    averageDifficulty() {
        const averageDifficulty = this.preguntas.reduce((total, pregunta) => total + pregunta.difficulty, 0) / this.preguntas.length;
        console.log(averageDifficulty);
        return averageDifficulty;
    }
}

