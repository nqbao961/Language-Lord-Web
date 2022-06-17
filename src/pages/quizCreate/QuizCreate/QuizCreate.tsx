import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Input, Select, Modal } from '../../../components';
import { ModalImperativeType } from '../../../components/Modal/Modal';
import { createQuiz } from '../../../services/@redux/actions/quizzes';
import {
  useAppDispatch,
  useAppSelector,
  useInput,
  useSelect,
} from '../../../services/hooks';
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
  const submitedModalRef = useRef<ModalImperativeType>(null);

  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);
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
        content: t('Multiple Choice'),
        value: 'multipleChoice',
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
    type.value === 'multipleChoice' &&
      (checkRequired(choiceA, t('Please enter choice')),
      checkRequired(choiceB, t('Please enter choice')),
      checkRequired(choiceC, t('Please enter choice')),
      checkRequired(choiceD, t('Please enter choice')));

    return (
      !!type.value &&
      !!content.value &&
      !!answer.value &&
      ((type.value === 'multipleChoice' &&
        !!choiceA.value &&
        !!choiceB.value &&
        !!choiceC.value &&
        !!choiceD.value) ||
        type.value !== 'multipleChoice')
    );
  };

  const resetForm = () => {
    type.setValue(undefined);
    content.setValue('');
    answer.setValue('');
    explaination.setValue('');
    info.setValue('');
    choiceA.setValue('');
    choiceB.setValue('');
    choiceC.setValue('');
    choiceD.setValue('');
  };

  const handleSubmit = () => {
    if (validateForm()) {
      dispatch(
        createQuiz({
          type: type.value!,
          content: content.value,
          answer: answer.value,
          language: user.preferedLang,
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
        submitedModalRef.current!.showModal();
        resetForm();
      });
    }
  };

  return (
    <div>
      <h1>{t('Create Quiz')}</h1>
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
          {type.value && type.value !== 'multipleChoice' && (
            <Button
              className={styles.shuffleButton}
              label={<i className="fa-solid fa-shuffle"></i>}
              handleClick={shuffleQuiz}
            />
          )}
        </div>
        {type.value && type.value === 'multipleChoice' && (
          <>
            <Input
              id="choiceA"
              label={t('Choice', { char: 'A' })}
              {...bindChoiceA}
            />
            <Input
              id="choiceB"
              label={t('Choice', { char: 'B' })}
              {...bindChoiceB}
            />
            <Input
              id="choiceC"
              label={t('Choice', { char: 'C' })}
              {...bindChoiceC}
            />
            <Input
              id="choiceD"
              label={t('Choice', { char: 'D' })}
              {...bindChoiceD}
            />
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
      <Modal ref={submitedModalRef} body={'Oke'} />
    </div>
  );
}
