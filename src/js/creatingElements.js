import { handleRemoveMessage } from './handlers';
import { formatDate } from './helpers';
import { GLOBAL_STATE } from './store';

export function createNewSubscriber(name) {
  const subscriptions = document.querySelector('.subscription__list');
  const subscriber = document.createElement('li');

  subscriber.classList.add('subscription__item');
  subscriber.textContent = name;

  subscriptions.appendChild(subscriber);
}

const createRemoveButton = ({ parent, id }) => {
  const remove = document.createElement('button');
  remove.setAttribute('type', 'button');
  remove.classList.add('chat__message-remove');
  remove.dataset.id = id;
  remove.textContent = 'Удалить';
  remove.addEventListener('click', handleRemoveMessage);
  parent.appendChild(remove);
};

const createMessageText = ({
  deleted, message, id, parent, client,
}) => {
  const paragraph = document.createElement('p');
  paragraph.classList.add('chat__message');

  if (deleted) {
    paragraph.classList.add('chat__message_italic');
    paragraph.textContent = 'Сообщение удалено';
    return paragraph;
  }

  if (client === GLOBAL_STATE.userName) createRemoveButton({ parent, id });
  paragraph.textContent = message;

  return paragraph;
};

export const createMessage = ({
  id,
  message,
  client,
  date,
  deleted,
}) => {
  const itemMessage = document.createElement('li');
  const nickname = document.createElement('h3');

  nickname.classList.add('chat__message-nickname');
  itemMessage.classList.add('chat__message-item');
  itemMessage.dataset.id = id;

  if (client !== GLOBAL_STATE.userName) nickname.textContent = client;
  if (client === GLOBAL_STATE.userName) {
    itemMessage.classList.add('chat__message-item_user');
    nickname.textContent = 'You';
  }

  const time = document.createElement('time');
  time.classList.add('chat__message-time');
  const timeSendingMessage = new Date(parseInt(date, 10));
  time.textContent = ` ${formatDate(timeSendingMessage)}`;
  nickname.appendChild(time);

  const text = createMessageText({
    deleted, message, id, parent: nickname, client,
  });

  itemMessage.appendChild(nickname);
  itemMessage.appendChild(text);
  return itemMessage;
};

export const removeMessage = (message) => {
  const [id, messageData] = Object.entries(message)[0];
  const newMessage = createMessage({ id, ...messageData });
  const messages = document.querySelectorAll('.chat__message-item');
  const deletedMessage = [...messages].find((item) => item.dataset.id === id);
  deletedMessage.replaceWith(newMessage);
};

export const insertInChat = ({ element }) => {
  const chat = document.querySelector('.chat__messages');
  const container = document.querySelector('.chat__container');
  chat.appendChild(element);
  container.scrollTop = container.scrollHeight;
};

export const changeNickname = ({ userName }) => {
  if (GLOBAL_STATE.allUsers.every((i) => i !== userName)) throw new Error('юзера с данным именем нет в общем списке юзеров');

  const subscribers = document.querySelectorAll('.subscription__item');
  const currentUser = [...subscribers].find(
    (item) => item.textContent === userName,
  );

  currentUser.textContent = 'You';
  currentUser.classList.add('subscription__item_user');
};

export const removeSubscriber = (name) => {
  const subscribers = document.querySelectorAll('.subscription__item');
  const delSubscriber = [...subscribers].find((item) => item.textContent === name);
  if (!delSubscriber) return;
  delSubscriber.remove();
};
