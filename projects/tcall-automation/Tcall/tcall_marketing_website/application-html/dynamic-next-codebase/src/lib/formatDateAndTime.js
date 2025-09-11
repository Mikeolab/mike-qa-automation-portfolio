import moment from 'moment';

export const formatSeconds = (seconds) => {
  const duration = moment.duration(seconds, 'seconds');
  const hours = Math.floor(duration.asHours());
  const minutes = duration.minutes();
  const secs = duration.seconds();

  let formattedTime = '';
  if (hours > 0) formattedTime += `${hours}h `;
  if (minutes > 0 || hours > 0) formattedTime += `${minutes}min `;
  formattedTime += `${secs}s`;

  return formattedTime.trim();
};


export const formatDateTime = (dateTimeString) => {
  const date = moment(dateTimeString);
  if (!date.isValid()) {
    return 'N/A';
  }
  return date.format('dddd, DD MMMM YYYY hh:mm A');
};
