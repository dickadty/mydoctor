export const getChatTime = date => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${hours % 12 === 0 ? 12 : hours % 12}:${minutes} ${
    hours >= 12 ? 'PM' : 'AM'
  }`;
};

export const setDateChat = oldDate => {
  const year = oldDate.getFullYear();
  const month = oldDate.getMonth() + 1;
  const date = oldDate.getDate();
  return `${year}-${month}-${date}`;
};
