import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Level, Quiz } from '../../../services/models';
import clock from '../../../assets/images/alarm-clock.png';
import brain from '../../../assets/images/brain.png';
import bulb from '../../../assets/images/light-bulb.png';
import wrong from '../../../assets/images/wrong.png';
import styles from '../Play.module.scss';
import { keyframes } from 'styled-components';
import {
  useAppDispatch,
  useAppSelector,
  useModalRef,
} from '../../../services/hooks';
import { Button, Modal } from '../../../components';
import { correctStrings, getRandomInt } from '../../../services/helpers';
import { PlayState } from '../type';
import { CSSTransition } from 'react-transition-group';
import {
  updateGainedHint,
  updateGainedScore,
  updateRemainTime,
} from '../../../services/@redux/actions/app';
import {
  updateUserHint,
  updateUserLevel,
  updateUserQuizzes,
  updateUserScore,
} from '../../../services/@redux/actions';

type PlayingProps = {
  level: Level;
  setPlayState: React.Dispatch<React.SetStateAction<PlayState>>;
};

export default function Playing({ level, setPlayState }: PlayingProps) {
  const { t, i18n } = useTranslation();
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
  const [countDown, setCountDown] = useState(120);
  const [intervalId, setIntervalId] = useState<any>(0);
  const [isPausing, setIsPausing] = useState(false);
  const [showWrong, setShowWrong] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const [correctTitle, setCorrectTitle] = useState(
    t(correctStrings[getRandomInt(5)]).toUpperCase() + '!!!'
  );

  const trueModalRef = useModalRef();
  const dispatch = useAppDispatch();
  const app = useAppSelector(state => state.app);
  const user = useAppSelector(state => state.user);

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
        let letterIndex = 0;
        const groupList =
          currentQuiz.type === 'shuffleLetters'
            ? currentQuiz.answer.split(' ')
            : [currentQuiz.answer];

        return groupList.map((group, index) => (
          <div key={`chosenGroup-${index}`} className={styles.letterGroup}>
            {group
              .split(currentQuiz.type === 'shuffleLetters' ? '' : ' ')
              .map(_ => {
                const cell = (
                  <div
                    key={`chosen-${letterIndex}`}
                    className={
                      currentQuiz.type === 'shuffleLetters'
                        ? styles.toChooseLetterCell
                        : styles.toChooseWordCell
                    }
                  ></div>
                );
                letterIndex++;
                return cell;
              })}
          </div>
        ));

      default:
        return undefined;
    }
  }, [currentQuiz]);

  const choices = useMemo(() => {
    switch (currentQuiz.type) {
      case 'shuffleLetters':
      case 'shuffleIdiom':
        let letterIndex = 0;
        const groupList =
          currentQuiz.type === 'shuffleLetters'
            ? currentQuiz.answer.split(' ')
            : [currentQuiz.answer];

        return groupList.map((group, index) => (
          <div key={`letterGroup-${index}`} className={styles.letterGroup}>
            {group
              .split(currentQuiz.type === 'shuffleLetters' ? '' : ' ')
              .map(_ => {
                const currentIndex = letterIndex;
                const cell = (
                  <div
                    key={`letter-${letterIndex}`}
                    className={
                      currentQuiz.type === 'shuffleLetters'
                        ? styles.letterCell
                        : styles.wordCell
                    }
                    onClick={() => onChooseLetter(currentIndex)}
                    style={cellStyles[letterIndex]}
                  >
                    {splitedQuizContent[letterIndex]}
                  </div>
                );
                letterIndex++;
                return cell;
              })}
          </div>
        ));

      case 'multipleChoice':
        return currentQuiz.choices.map((choice, index) => (
          <Button
            key={`choice-${index}`}
            label={choice}
            type="choice"
            handleClick={() => onChooseChoice(choice)}
          />
        ));

      default:
        return undefined;
    }
  }, [currentQuiz, cellStyles]);

  const mergedAnswer = useMemo(() => {
    switch (currentQuiz.type) {
      case 'shuffleLetters':
        const spaceIndexList = currentQuiz.answer
          .split('')
          .reduce(
            (list, char, index) =>
              char === ' ' ? [...list, index - list.length] : list,
            [] as number[]
          );
        const stringArr = indexPositions.map((i, index) =>
          i !== undefined
            ? spaceIndexList.includes(index)
              ? ' ' + splitedQuizContent[i]
              : splitedQuizContent[i]
            : ''
        );
        return stringArr.join('');
      case 'shuffleIdiom':
        const stringIdiomArr = indexPositions.map((i, index) =>
          i !== undefined ? splitedQuizContent[i] : ''
        );
        return stringIdiomArr.join(' ');

      default:
        return '';
    }
  }, [currentQuiz, indexPositions, splitedQuizContent]);

  const isCompletedQuiz = useMemo(
    () => user.completedQuizzes[user.preferedLang].includes(currentQuiz._id),
    [currentQuiz]
  );

  const handleWrong = () => {
    setShowWrong(true);
    setTimeout(() => {
      setShowWrong(false);
    }, 1000);
  };

  const handleCorrect = () => {
    dispatch(updateGainedScore(app.gainedScore + (isCompletedQuiz ? 0 : 10)));
    if (!isCompletedQuiz) {
      dispatch(updateUserScore(user.score[user.preferedLang] + 10));
      dispatch(updateUserQuizzes([currentQuiz._id]));
    }

    trueModalRef.current?.showModal();
    setShowContent(false);
    setIsPausing(true);
  };

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
      handleCorrect();
    } else {
      handleWrong();
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
    setTimeout(() => {
      setCorrectTitle(t(correctStrings[getRandomInt(5)]).toUpperCase() + '!!!');
    }, 300);

    if (currentQuizIndex < level.quizList.length - 1) {
      setShowContent(true);
      setIsPausing(false);
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
      // complete level
      const gainedHint = (countDown > 0 ? 1 : 0) + Math.round(countDown / 10);

      dispatch(updateUserHint(user.hint[user.preferedLang] + gainedHint));
      dispatch(updateUserLevel(level.levelNumber + 1));

      dispatch(updateRemainTime(countDown));
      dispatch(updateGainedHint(gainedHint));

      setPlayState('result');
    }
  }

  const resetLevelResult = () => {
    dispatch(updateRemainTime(0));
    dispatch(updateGainedScore(0));
    dispatch(updateGainedHint(0));
  };

  // Reset level data
  useEffect(() => {
    resetLevelResult();
  }, []);

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

  // Timeout
  useEffect(() => {
    if (countDown <= 0) {
      clearInterval(intervalId);
      dispatch(updateRemainTime(0));
      dispatch(updateGainedHint(0));
      setPlayState('result');
    }
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
      ).forEach(group => {
        Array.from(group.children!).forEach(cell => {
          newCellStyles.push({
            position: 'absolute',
            top: (cell as HTMLDivElement).offsetTop,
            left: (cell as HTMLDivElement).offsetLeft,
          });
        });
      });
      setCellStyles(newCellStyles);

      const newCellPositions: any[] = [];
      Array.from(
        document.getElementsByClassName(styles.chosenChoices)[0].children!
      ).forEach(group => {
        Array.from(group.children!).forEach(cell => {
          newCellPositions.push({
            top: (cell as HTMLDivElement).offsetTop,
            left: (cell as HTMLDivElement).offsetLeft,
          });
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
          handleCorrect();
        } else if (currentQuiz.answer.length === mergedAnswer.length) {
          handleWrong();
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
      <CSSTransition
        in={showContent}
        timeout={300}
        appear
        classNames={{
          enter: styles.contentEnter,
          enterActive: styles.contentEnterActive,
          enterDone: styles.contentEnterDone,
          exit: styles.contentExit,
          exitActive: styles.contentExitActive,
        }}
      >
        <div className={styles.content}>
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
        </div>
      </CSSTransition>

      <Modal
        ref={trueModalRef}
        header={<div className={styles.headerModal}>{correctTitle}</div>}
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
            {!isCompletedQuiz && (
              <div className={styles.gainedScore}>
                <img src={brain} alt="brain-icon" />
                +10
              </div>
            )}
          </>
        }
        handleOkay={gotoNextQuiz}
        showClose={false}
      />

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
      <img
        className={styles.wrongAnswer}
        src={wrong}
        alt="wrong"
        style={{ visibility: 'hidden' }}
      />
    </div>
  );
}
