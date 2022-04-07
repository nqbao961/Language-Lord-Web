import { useMemo } from 'react';
import { Button, Input, Select } from '../../../components';
import { useInput, useSelect } from '../../../services/hooks';
import { Quiz } from '../../../services/models';
import { shuffle } from '../../../services/utils';
import styles from './QuizCreate.module.scss';

export default function QuizCreate() {
  const { states: type, bind: bindType } = useSelect<Quiz['type'] | undefined>(
    undefined
  );
  const { states: content, bind: bindContent } = useInput();
  const { states: answer, bind: bindAnswer } = useInput();
  const { states: explaination, bind: bindExplaination } = useInput();
  const { states: info, bind: bindInfo } = useInput();
  const { states: choiceA, bind: bindChoiceA } = useInput();
  const { states: choiceB, bind: bindChoiceB } = useInput();
  const { states: choiceC, bind: bindChoiceC } = useInput();
  const { states: choiceD, bind: bindChoiceD } = useInput();

  const quizTypes = useMemo<
    {
      content: string;
      value: Quiz['type'];
    }[]
  >(
    () => [
      {
        content: 'Shuffle Letters',
        value: 'shuffleLetters',
      },
      {
        content: 'Shuffle Idiom',
        value: 'shuffleIdiom',
      },
      {
        content: 'Fill Idiom',
        value: 'fillIdiom',
      },
    ],
    []
  );

  const shuffleQuiz = () => {
    switch (type.value) {
      case 'shuffleLetters': {
        const splitted = answer.value.replace(/ /g, '').split('');
        shuffle(splitted);
        const joined = splitted.join('/');
        content.setValue(joined);
        break;
      }

      case 'shuffleIdiom': {
        const splitted = answer.value.split(' ');
        shuffle(splitted);
        const joined = splitted.join('/');
        content.setValue(joined);
        break;
      }
    }
  };

  return (
    <div>
      <h1>Create Quiz</h1>
      <div className={styles.form}>
        <Select
          topLabel="Type"
          defaultLabel="Choose type"
          optionList={quizTypes}
          {...bindType}
        />
        <div className={styles.row}>
          <Input id="content" label="Content" {...bindContent} />
          {type.value && type.value !== 'fillIdiom' && (
            <Button
              className={styles.shuffleButton}
              label={<i className="fa-solid fa-shuffle"></i>}
              handleClick={shuffleQuiz}
            />
          )}
        </div>
        <Input id="answer" label="Answer" {...bindAnswer} />
        {type.value && type.value === 'fillIdiom' && (
          <>
            <Input id="choiceA" label="Choice A" {...bindChoiceA} />
            <Input id="choiceB" label="Choice B" {...bindChoiceB} />
            <Input id="choiceC" label="Choice C" {...bindChoiceC} />
            <Input id="choiceD" label="Choice D" {...bindChoiceD} />
          </>
        )}
        <Input
          id="explaination"
          type="textarea"
          label="Explaination"
          {...bindExplaination}
        />
        <Input id="info" label="Information" {...bindInfo} />
        <div className={styles.buttonWrapper}>
          <Button label="Cancel" type="transparent" />
          <Button label="Create" type="danger" />
        </div>
      </div>
    </div>
  );
}
