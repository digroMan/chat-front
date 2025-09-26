import { formatDate } from './helpers';
import { GLOBAL_STATE } from './store';

export function createNewSubscriber(name) {
  const subscriptions = document.querySelector('.subscription__list');
  const subscriber = document.createElement('li');

  subscriber.classList.add('subscription__item');
  subscriber.textContent = name;

  subscriptions.appendChild(subscriber);
}

export function createMessage({ message, date, client }) {
  const chat = document.querySelector('.chat__messages');
  const container = document.querySelector('.chat__container');

  const itemMessage = document.createElement('li');
  const nickname = document.createElement('h3');

  nickname.classList.add('chat__message-nickname');
  itemMessage.classList.add('chat__message-item');

  if (client !== GLOBAL_STATE.userName) nickname.textContent = client;
  if (client === GLOBAL_STATE.userName) {
    itemMessage.classList.add('chat__message-item_user');
    nickname.textContent = 'You';
  }

  const time = document.createElement('time');
  time.classList.add('chat__message-time');
  const timeSendingMessage = new Date(date);
  time.textContent = ` ${formatDate(timeSendingMessage)}`;
  nickname.appendChild(time);

  const text = document.createElement('p');
  text.classList.add('chat__message');
  text.textContent = message;

  itemMessage.appendChild(nickname);
  itemMessage.appendChild(text);

  chat.appendChild(itemMessage);
  container.scrollTop = container.scrollHeight;
}

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
