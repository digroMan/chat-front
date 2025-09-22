import SubscriptionApi from '../components/SubscriptionAPI';
import createElementLI, { creatingMessageElement } from './createElement';

document.addEventListener('DOMContentLoaded', () => {
  let user;
  const serverUrl = 'http://localhost:7070/';
  const communicationWindow = document.querySelector('.chat');
  communicationWindow.style.opacity = '0.1';

  const wrapperNicknameForm = document.querySelector(
    '.modal',
  );
  wrapperNicknameForm.style.opacity = '1';

  const formValidator = wrapperNicknameForm.querySelector(
    '.__js-nickname-validator',
  );
  const nicknameForm = document.querySelector('.__js-nickname');
  const nicknameInput = nicknameForm.querySelector('.form__input')
  const windowSubscribers = document.querySelector('.subscription__list');

  nicknameForm.addEventListener('submit', (e) => {
    e.preventDefault();

    user = nicknameInput.value;

    api.add({ user }).then(
      () => {
        const niknameItem = Array.from(windowSubscribers.children).find(
          (item) => item.textContent === user,
        );
        niknameItem.textContent = 'You';
        niknameItem.style.color = '#ffd300';
        nicknameInput.value = '';
        communicationWindow.style.opacity = '1';
        wrapperNicknameForm.classList.add('hide');
      },
      () => {
        formValidator.textContent = `Никнейм ${user} уже занят, введите другой`;
      },
    );
  });

  const eventSource = new EventSource('http://localhost:7070/sse');

  eventSource.addEventListener('open', (e) => {
    console.log(e);

    api.getSubscribers().then((result) => result.forEach((item) => {
      createElementLI(item.name);
    }));

    console.log('sse open');
  });

  eventSource.addEventListener('error', (e) => {
    console.log(e);

    console.log('sse error');
  });

  eventSource.addEventListener('message', (e) => {
    const { name } = JSON.parse(e.data);

    createElementLI(name);
  });

  const ws = new WebSocket('ws://localhost:7070/ws');

  const chatForm = document.querySelector('.__js-create-message');
  const chatMessage = chatForm.querySelector('.form__input');

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatMessage.value;

    if (!text) return;

    const date = new Date();

    const msg = {
      client: user,
      message: text,
      date: date.getTime(),
    };

    ws.send(JSON.stringify(msg));

    chatMessage.value = '';
  });

  ws.addEventListener('open', (e) => {
    console.log(e);

    console.log('ws open');
  });

  ws.addEventListener('close', (e) => {
    console.log(e);

    console.log('ws close');
  });

  ws.addEventListener('error', (e) => {
    console.log(e);

    console.log('ws error');
  });

  ws.addEventListener('message', (e) => {
    const data = JSON.parse(e.data);

    const { chat: messages } = data;

    const messagesItem = messages[0];

    creatingMessageElement(
      messagesItem.message,
      messagesItem.client,
      messagesItem.date,
      user,
    );
  });

  window.api = new SubscriptionApi(serverUrl);

  window.addEventListener('beforeunload', () => {
    api.remove(user);
  });
});
