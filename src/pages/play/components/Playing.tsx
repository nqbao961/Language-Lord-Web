import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Level, Quiz } from '../../../services/models';
import clock from '../../../assets/images/alarm-clock.png';
import bulb from '../../../assets/images/light-bulb.png';
import styles from '../Play.module.scss';
import { keyframes } from 'styled-components';
import { useModalRef } from '../../../services/hooks';
import { Modal } from '../../../components';

export default function Playing({ level }: { level: Level }) {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [currentQuiz, setCurrentQuiz] = useState(level.quizList[0]);
  const [chosenCellPositions, setChosenCellPositions] = useState<
    { top: number; left: number }[]
  >([]);
  const [cellStyles, setCellStyles] = useState<React.CSSProperties[]>(
    initCellStyles(currentQuiz)
  );
  const [indexPositions, setIndexPositions] = useState<(number | undefined)[]>(
    initIndexPositions(currentQuiz)
  );
  const [countDown, setCountDown] = useState(60);

  const { t, i18n } = useTranslation();
  const trueModalRef = useModalRef();

  const quizRequirement = useMemo(() => {
    switch (currentQuiz.type) {
      case 'shuffleLetters':
        return t('Combine letters to make a correct word');
      case 'shuffleIdiom':
        return t('Combine words to make a correct phrase/idiom');
      case 'multipleChoice':
        return t('Choose a correct answer');
      default:
        return '';
    }
  }, [currentQuiz.type]);

  const splitedQuizContent = useMemo(() => {
    switch (currentQuiz.type) {
      case 'shuffleLetters':
      case 'shuffleIdiom':
        return currentQuiz.content.split('/');

      default:
        return [];
    }
  }, [currentQuiz]);

  const chosenChoices = useMemo(() => {
    switch (currentQuiz.type) {
      case 'shuffleLetters':
      case 'shuffleIdiom':
        return splitedQuizContent.map((_, index) => (
          <div
            key={`chosen-${index}`}
            className={
              currentQuiz.type === 'shuffleLetters'
                ? styles.toChooseLetterCell
                : styles.toChooseWordCell
            }
          ></div>
        ));

      default:
        return undefined;
    }
  }, [currentQuiz]);

  const choices = useMemo(() => {
    switch (currentQuiz.type) {
      case 'shuffleLetters':
      case 'shuffleIdiom':
        return splitedQuizContent.map((letter, index) => (
          <div
            key={`letter-${index}`}
            className={
              currentQuiz.type === 'shuffleLetters'
                ? styles.letterCell
                : styles.wordCell
            }
            onClick={() => onChooseLetter(index)}
            style={cellStyles[index]}
          >
            {letter}
          </div>
        ));

      default:
        return undefined;
    }
  }, [currentQuiz, cellStyles]);

  const mergedAnswer = useMemo(() => {
    const stringArr = indexPositions.map(i =>
      i !== undefined ? splitedQuizContent[i] : ''
    );
    switch (currentQuiz.type) {
      case 'shuffleLetters':
        return stringArr.join('');
      case 'shuffleIdiom':
        return stringArr.join(' ');

      default:
        return '';
    }
  }, [currentQuiz, indexPositions, splitedQuizContent]);

  function onChooseLetter(index: number) {
    const chosenIndex = indexPositions.findIndex(i => i === index);

    if (chosenIndex === -1) {
      // Select
      const firstEmptyIndex = indexPositions.findIndex(i => i === undefined);

      const chosen = keyframes`
        from {
            top:${cellStyles[index].top}px;
            left:${cellStyles[index].left}px;
        }

        to {
            top:${chosenCellPositions[firstEmptyIndex].top}px;
            left:${chosenCellPositions[firstEmptyIndex].left}px;
        }
    `;

      const newCellStyle: React.CSSProperties = {
        ...cellStyles[index],
        animationName: chosen,
        animationDuration: '0.4s',
        animationTimingFunction: 'ease',
        animationFillMode: 'forwards',
      };
      const cloneCellStyles = [...cellStyles];
      cloneCellStyles[index] = newCellStyle;
      setCellStyles(cloneCellStyles);

      const cloneIndexPositions = [...indexPositions];
      cloneIndexPositions[firstEmptyIndex] = index;
      setIndexPositions(cloneIndexPositions);
    } else {
      // Deselect
      const notChosen = keyframes`
        from {
            top:${chosenCellPositions[chosenIndex].top}px;
            left:${chosenCellPositions[chosenIndex].left}px;
        }

        to {
            top:${cellStyles[index].top}px;
            left:${cellStyles[index].left}px;
        }
    `;

      const newCellStyle: React.CSSProperties = {
        ...cellStyles[index],
        animationName: notChosen,
      };
      const cloneCellStyles = [...cellStyles];
      cloneCellStyles[index] = newCellStyle;
      setCellStyles(cloneCellStyles);

      const cloneIndexPositions = [...indexPositions];
      cloneIndexPositions[chosenIndex] = undefined;
      setIndexPositions(cloneIndexPositions);
    }
  }

  function initCellStyles(quiz: Quiz) {
    switch (quiz.type) {
      case 'shuffleLetters':
      case 'shuffleIdiom':
        return quiz.content.split('/').map(() => ({}));

      default:
        return [];
    }
  }

  function initIndexPositions(quiz: Quiz) {
    switch (quiz.type) {
      case 'shuffleLetters':
      case 'shuffleIdiom':
        return quiz.content.split('/').map(() => undefined);

      default:
        return [];
    }
  }

  function gotoNextQuiz() {
    if (currentQuizIndex < level.quizList.length - 1) {
      const nextQuiz = level.quizList[currentQuizIndex + 1];
      setCurrentQuizIndex(currentQuizIndex + 1);
      setCurrentQuiz(level.quizList[currentQuizIndex + 1]);
      setIndexPositions(initIndexPositions(nextQuiz));
      setCellStyles(initCellStyles(nextQuiz));
    }
  }

  // Make position absolute
  useEffect(() => {
    if (
      currentQuiz.type === 'shuffleLetters' ||
      currentQuiz.type === 'shuffleIdiom'
    ) {
      const newCellStyles: any[] = [];
      Array.from(
        document.getElementsByClassName(styles.choices)[0].children!
      ).forEach(cell => {
        newCellStyles.push({
          position: 'absolute',
          top: (cell as HTMLDivElement).offsetTop,
          left: (cell as HTMLDivElement).offsetLeft,
        });
      });
      setCellStyles(newCellStyles);

      const newCellPositions: any[] = [];
      Array.from(
        document.getElementsByClassName(styles.chosenChoices)[0].children!
      ).forEach(cell => {
        newCellPositions.push({
          top: (cell as HTMLDivElement).offsetTop,
          left: (cell as HTMLDivElement).offsetLeft,
        });
      });
      setChosenCellPositions(newCellPositions);
    }
  }, [currentQuiz]);

  // Check answer
  useEffect(() => {
    switch (currentQuiz.type) {
      case 'shuffleLetters':
      case 'shuffleIdiom':
        if (currentQuiz.answer === mergedAnswer) {
          trueModalRef.current?.showModal();
        } else {
        }
        break;

      default:
        break;
    }
  }, [currentQuiz, mergedAnswer]);

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

      {(currentQuiz.type === 'shuffleLetters' ||
        currentQuiz.type === 'shuffleIdiom') && (
        <div className={styles.belowWrapper}>
          <div className={styles.chosenChoices}>{chosenChoices}</div>

          <div className={styles.mergedAnswer}>{mergedAnswer}</div>

          <div className={styles.choices}>{choices}</div>
        </div>
      )}

      {currentQuiz.type === 'multipleChoice' && (
        <div className={styles.multipleChoiceContainer}></div>
      )}

      <div className={styles.actions}>
        <img src={bulb} alt="bulb-icon" />
      </div>

      <Modal
        ref={trueModalRef}
        header={t('Excellent') + '!!!'}
        body={
          <div className={styles.trueModal}>
            <div>{currentQuiz.answer}</div>
            {currentQuiz.explaination && <div>{currentQuiz.explaination}</div>}
            {currentQuiz.info && <div>{currentQuiz.info}</div>}
          </div>
        }
        handleOkay={gotoNextQuiz}
      />
    </div>
  );
}
