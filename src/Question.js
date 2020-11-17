const countWords = (word, text) => text.split(word).length - 1;

class Question {

    constructor() {
        this.text = '';
        this.lines = [];
        this.alternatives = [];
        this.hints = [];
        this.acceptedAnswers = [];
        this.gaps = 0;
        this.longestAlternative = 0;
    }

    static from(json) {
        const jsonObj = JSON.parse(json);
        const question = new Question();
        question.text = jsonObj.text.join('\n');
        question.lines = jsonObj.text;
        question.alternatives = jsonObj.alternatives;
        question.hints = jsonObj.hints;
        question.acceptedAnswers = jsonObj.acceptedAnswers;
        question.gaps = countWords("{{GAP}}", question.text);
        question.longestAlternative = jsonObj.alternatives.reduce((max, item) => item.value.length > max ? item.value.length : max, 0);
        return question;
    }

}

export default Question