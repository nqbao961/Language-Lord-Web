import i18next from '../../i18n';

export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export const correctStrings = [
  i18next.t('Excellent')?.toUpperCase() + '!!!',
  i18next.t('Amazing')?.toUpperCase() + '!!!',
  i18next.t('Awesome')?.toUpperCase() + '!!!',
  i18next.t('Good')?.toUpperCase() + '!!!',
  i18next.t('Success')?.toUpperCase() + '!!!',
];
