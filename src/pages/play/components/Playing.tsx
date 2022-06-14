import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Level } from '../../../services/models';
import clock from '../../../assets/images/alarm-clock.png';
import bulb from '../../../assets/images/light-bulb.png';
import styles from '../Play.module.scss';

export default function Playing({ level }: { level: Level }) {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [currentQuiz, setCurrentQuiz] = useState(level.quizList[0]);
  const [chosenAnswer, setChosenAnswer] = useState<string[]>([]);
  const [countDown, setCountDown] = useState(60);

  const { t, i18n } = useTranslation();

  const quizRequirement = useMemo(() => {
    switch (currentQuiz.type) {
      case 'shuffleLetters':
        return t('Combine letters to make a correct word');

      default:
        break;
    }
  }, [currentQuiz.type]);

  const chosenChoices = useMemo(() => {
    switch (currentQuiz.type) {
      case 'shuffleLetters':
        return Array(Math.round(currentQuiz.content.length / 2))
          .fill('')
          .map((_, index) => (
            <div
              key={`chosen-${index}`}
              className={styles.toChooseLetterCell}
            ></div>
          ));

      default:
        break;
    }
  }, [currentQuiz]);

  const choices = useMemo(() => {
    switch (currentQuiz.type) {
      case 'shuffleLetters':
        return splitQuizContent(currentQuiz.content).map((letter, index) => (
          <div
            key={`letter-${index}`}
            className={styles.letterCell}
            onClick={() => onChooseLetter(letter)}
          >
            {letter}
          </div>
        ));

      default:
        break;
    }
  }, [currentQuiz]);

  const mergedAnswer = useMemo(() => chosenAnswer.join(''), [chosenAnswer]);

  function onChooseLetter(letter: string) {
    setChosenAnswer(chosenAnswer => [...chosenAnswer, letter]);
  }

  return (
    <div className={styles.playing}>
      <div className={styles.playingTitle}>
        <div className={styles.currentLevel}>
          <p>{`${t('Level')} ${level.levelNumber}`}</p>
          <p>{`${t('Quiz')} ${currentQuizIndex + 1}/${
            level.quizList.length
          }`}</p>
        </div>
        <div className={styles.time}>
          <img src={clock} alt="clock-icon" />
          <div className={styles.countDown}>{countDown}</div>
        </div>
      </div>

      <div className={styles.quizRequirement}>{quizRequirement}</div>

      <div className={styles.quizContent}>{currentQuiz.content}</div>

      <div className={styles.belowWrapper}>
        <div className={styles.chosenChoices}>{chosenChoices}</div>

        <div className={styles.mergedAnswer}>{mergedAnswer}</div>

        <div className={styles.choices}>{choices}</div>

        <div className={styles.actions}>
          <img src={bulb} alt="bulb-icon" />
        </div>
      </div>
    </div>
  );
}

function splitQuizContent(word: string) {
  return word.split('/');
}
