import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Input, Select } from '../../../components';
import { showModal } from '../../../services/@redux/actions';
import { createQuiz } from '../../../services/@redux/actions/quizzes';
import { useAppDispatch, useInput, useSelect } from '../../../services/hooks';
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

  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();

  const quizTypes = useMemo<
    {
      content: string;
      value: Quiz['type'];
    }[]
  >(
    () => [
      {
        content: t('Shuffle Letters'),
        value: 'shuffleLetters',
      },
      {
        content: t('Shuffle Idiom'),
        value: 'shuffleIdiom',
      },
      {
        content: t('Fill Idiom'),
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

  const wrappedUseSelectForType = (arg: any) => useSelect(arg);

  const checkRequired = (
    input:
      | ReturnType<typeof useInput>['states']
      | ReturnType<typeof wrappedUseSelectForType>['states'],
    errorText: string
  ) => {
    !input.value ? input.setError(errorText) : input.setError('');
  };

  const validateForm = () => {
    checkRequired(type, t('Please select a type'));
    checkRequired(content, t('Please enter content'));
    checkRequired(answer, t('Please enter answer'));
    type.value === 'fillIdiom' &&
      (checkRequired(choiceA, t('Please enter choice')),
      checkRequired(choiceB, t('Please enter choice')),
      checkRequired(choiceC, t('Please enter choice')),
      checkRequired(choiceD, t('Please enter choice')));

    return (
      !!type.value &&
      !!content.value &&
      !!answer.value &&
      ((type.value === 'fillIdiom' &&
        !!choiceA.value &&
        !!choiceB.value &&
        !!choiceC.value &&
        !!choiceD.value) ||
        type.value !== 'fillIdiom')
    );
  };

  const handleSubmit = () => {
    if (validateForm()) {
      dispatch(
        createQuiz({
          type: type.value!,
          content: content.value,
          answer: answer.value,
          ...(explaination.value && { explaination: explaination.value }),
          ...(info.value && { info: info.value }),
          ...(choiceA.value &&
            choiceB.value &&
            choiceC.value &&
            choiceD.value && {
              choices: [
                choiceA.value,
                choiceB.value,
                choiceC.value,
                choiceD.value,
              ],
            }),
        })
      ).then(() => {
        dispatch(
          showModal({
            header: 'header',
            body: 'Oke',
          })
        );
      });
    }
  };

  return (
    <div>
      <h1>Create Quiz</h1>
      <div className={styles.form}>
        <Select
          topLabel={t('Type')}
          defaultLabel={t('Choose type')}
          optionList={quizTypes}
          {...bindType}
        />
        <Input id="answer" label={t('Answer')} {...bindAnswer} />
        <div className={styles.row}>
          <Input id="content" label={t('Content')} {...bindContent} />
          {type.value && type.value !== 'fillIdiom' && (
            <Button
              className={styles.shuffleButton}
              label={<i className="fa-solid fa-shuffle"></i>}
              handleClick={shuffleQuiz}
            />
          )}
        </div>
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
          label={t('Explaination')}
          {...bindExplaination}
        />
        <Input id="info" label={t('Information')} {...bindInfo} />
        <div className={styles.buttonWrapper}>
          <Button label={t('Cancel')} type="transparent" />
          <Button
            label={t('Create')}
            type="danger"
            handleClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
