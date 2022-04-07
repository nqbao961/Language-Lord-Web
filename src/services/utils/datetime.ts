import moment from 'moment';

export function formatISOString(date: string, formatType: string) {
  return moment(date).format(formatType);
}

export function getHoursDiff(from: string, to: string) {
  return moment(to).diff(moment(from), 'hour', true);
}

export function isSameOrBefore(
  thisDate: string | Date,
  thatDate: string | Date,
  granularity?: moment.unitOfTime.StartOf | undefined
) {
  return moment(thisDate).isSameOrBefore(thatDate, granularity);
}

export function isSameOrAfter(
  thisDate: string | Date,
  thatDate: string | Date,
  granularity?: moment.unitOfTime.StartOf | undefined
) {
  return moment(thisDate).isSameOrAfter(thatDate, granularity);
}
