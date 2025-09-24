export function formatDate(date) {
  return `
      ${date.getHours()}:${date.getMinutes()} 
      ${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}
    `;
}

export const toggleHide = ({ element, hide }) => {
  if (hide && element.classList.contains('hide')) return;
  if (!hide && element.classList.contains('hide')) element.classList.remove('hide');
  if (hide) element.classList.add('hide');
};

export const toggleClass = ({ element, className, isRemove }) => {
  if (!element.classList.contains(className) && !isRemove) element.classList.add(className);
  if (element.classList.contains(className) && isRemove) element.classList.remove(className);
};
