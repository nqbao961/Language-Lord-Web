import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Level, Quiz } from '../../../services/models';
import clock from '../../../assets/images/alarm-clock.png';
import brain from '../../../assets/images/brain.png';
import bulb from '../../../assets/images/light-bulb.png';
import wrong from '../../../assets/images/wrong.png';
import styles from '../Play.module.scss';
import { keyframes } from 'styled-components';
import { useModalRef } from '../../../services/hooks';
import { Button, Modal } from '../../../components';
import { correctStrings } from '../../../services/helpers';
import { PlayState } from '../type';
import { CSSTransition } from 'react-transition-group';

type PlayingProps = {
  level: Level;
  setPlayState: React.Dispatch<React.SetStateAction<PlayState>>;
};

export default function Playing({ level, setPlayState }: PlayingProps) {
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
  const [countDown, setCountDown] = useState(50);
  const [intervalId, setIntervalId] = useState<any>(0);
  const [isPausing, setIsPausing] = useState(false);
  const [showWrong, setShowWrong] = useState(false);

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

      case 'multipleChoice':
        return currentQuiz.choices.map((choice, index) => (
          <Button
            key={`choice-${index}`}
            label={choice}
            className={styles.choiceItem}
            handleClick={() => onChooseChoice(choice)}
          />
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

  function onChooseChoice(chosenChoice: string) {
    if (chosenChoice.toLowerCase() === currentQuiz.answer.toLowerCase()) {
      trueModalRef.current?.showModal();
      setIsPausing(true);
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
    setIsPausing(false);
    if (currentQuizIndex < level.quizList.length - 1) {
      const nextQuiz = level.quizList[currentQuizIndex + 1];
      setCurrentQuizIndex(currentQuizIndex + 1);
      setCurrentQuiz(nextQuiz);

      switch (nextQuiz.type) {
        case 'shuffleLetters':
        case 'shuffleIdiom':
          setIndexPositions(initIndexPositions(nextQuiz));
          setCellStyles(initCellStyles(nextQuiz));
          break;

        case 'multipleChoice':

        default:
          break;
      }
    } else {
      setPlayState('result');
    }
  }

  // Time count down
  useEffect(() => {
    if (!isPausing) {
      const timer = setInterval(() => {
        setCountDown(countDown => countDown - 1);
      }, 1000);
      setIntervalId(timer);
    } else {
      clearInterval(intervalId);
    }
  }, [isPausing]);

  useEffect(() => {
    countDown <= 0 && clearInterval(intervalId);
  }, [countDown]);

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
        if (currentQuiz.answer.toLowerCase() === mergedAnswer.toLowerCase()) {
          trueModalRef.current?.showModal();
          setIsPausing(true);
        } else if (currentQuiz.answer.length === mergedAnswer.length) {
          setShowWrong(true);
          setTimeout(() => {
            setShowWrong(false);
          }, 1000);
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
          <img
            src={clock}
            alt="clock-icon"
            style={
              countDown <= 0 || isPausing ? { animationName: 'unset' } : {}
            }
          />
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
        <div className={styles.multipleChoiceContainer}>
          <div className={styles.multipleChoiceWrapper}>{choices}</div>
        </div>
      )}

      <div className={styles.actions}>
        <img src={bulb} alt="bulb-icon" />
      </div>

      <Modal
        ref={trueModalRef}
        header={<div className={styles.headerModal}>{correctStrings[0]}</div>}
        body={
          <>
            <div className={styles.bodyModal}>
              <div className={styles.answerText}>{currentQuiz.answer}</div>
              {currentQuiz.explaination && (
                <div>{currentQuiz.explaination}</div>
              )}
              {currentQuiz.info && (
                <div className={styles.infoText}>{currentQuiz.info}</div>
              )}
            </div>
            <div className={styles.gainedScore}>
              <img src={brain} alt="brain-icon" />
              +10
            </div>
          </>
        }
        handleOkay={gotoNextQuiz}
        showClose={true}
      />
      <button onClick={() => trueModalRef.current?.showModal()}></button>

      <CSSTransition
        in={showWrong}
        timeout={300}
        unmountOnExit
        classNames={{
          enter: styles.wrongEnter,
          enterActive: styles.wrongEnterActive,
          exit: styles.wrongExit,
          exitActive: styles.wrongExitActive,
        }}
      >
        <img className={styles.wrongAnswer} src={wrong} alt="wrong" />
      </CSSTransition>
    </div>
  );
}
