const fs = require('fs');
const path = require('path');
const readlineSync = require('readline-sync');

const questionFolder = path.dirname(__dirname) + '/questions/';

const game = () => {
  const quizQuestions = [];
  let rightAnswer = 0;

  const files = fs.readdirSync(questionFolder).map(fileName =>  path.join(questionFolder, fileName));

  files.map((file) => {
    const data = fs.readFileSync(file, 'utf8');
    const questionArray = data.toString().replace(/\r\n/g,'\n').split('\n');

    quizQuestions.push({
      // текст вопроса
      questionTitle: questionArray[0],
      // индекс ответа на вопрос
      answerIndex: +questionArray[1],
      arrayAnswers: questionArray.slice(2, questionArray.length),
    });
  });

  // перетасовываем вопросы и ограничиваем их в 5шт
  quizQuestions.sort(() => Math.random() - 0.5).splice(0,5);

  quizQuestions.map((question) => {
    console.log(`\n${question.questionTitle}`);
    console.group();
    question.arrayAnswers.map((answer, key) => console.log(`[${++key}]: ${answer}`));
    console.groupEnd();
    const chooseAnswer = +readlineSync.keyIn(`Your answer: `, {limit: `$<1-${question.arrayAnswers.length}>`});
    // ответили правильно?
    chooseAnswer === question.answerIndex && rightAnswer++;
  })
  
  if (rightAnswer > 0) console.log(`\nПоздравляем! Вы дали ${rightAnswer} правильных ответов\n`);
  else console.log('\nВсё очень плохо. Вы не дали ни одного правильного ответа.\n');

  const playAgain = +readlineSync.keyIn(`Play again?
    [1] - Yes
    [2] - No
  : `, {limit: '$<1-2>'});

  playAgain === 1 && game();
}

module.exports = {
  game,
}