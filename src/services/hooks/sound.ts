import { useMemo } from 'react';
import buttonSoundSrc from '../../assets/sounds/btn_sound.wav';
import button2SoundSrc from '../../assets/sounds/btn_sound2.wav';
import button3SoundSrc from '../../assets/sounds/btn_sound3.ogg';
import incorrectSoundSrc from '../../assets/sounds/incorrect.mp3';
import completedSoundSrc from '../../assets/sounds/kids_saying_yay.mp3';
import correctSoundSrc from '../../assets/sounds/success_sound.wav';
import failedSoundSrc from '../../assets/sounds/tada_sound.wav';
import themeSoundSrc from '../../assets/sounds/theme-music.mp3';
import { isEnabledSound } from '../utils';

type soundType =
  | 'button'
  | 'button2'
  | 'button3'
  | 'incorrect'
  | 'completed'
  | 'correct'
  | 'failed'
  | 'theme';

export function useSounds(soundType: soundType) {
  let soundSrc = buttonSoundSrc;
  switch (soundType) {
    case 'button':
      soundSrc = buttonSoundSrc;
      break;
    case 'button2':
      soundSrc = button2SoundSrc;
      break;
    case 'button3':
      soundSrc = button3SoundSrc;
      break;
    case 'incorrect':
      soundSrc = incorrectSoundSrc;
      break;
    case 'completed':
      soundSrc = completedSoundSrc;
      break;
    case 'correct':
      soundSrc = correctSoundSrc;
      break;
    case 'failed':
      soundSrc = failedSoundSrc;
      break;
    case 'theme':
      soundSrc = themeSoundSrc;
      break;

    default:
      soundSrc = buttonSoundSrc;
  }
  const sound = useMemo(() => new Audio(soundSrc), []);
  soundType === 'theme' && (sound.loop = true);

  const play = () => {
    isEnabledSound() && sound.play();
  };
  const pause = () => {
    sound.pause();
  };
  const stop = () => {
    sound.pause();
    sound.currentTime = 0;
  };

  return {
    sound,
    play,
    pause,
    stop,
  };
}
