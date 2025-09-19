import SubscriptionApi from '../components/SubscriptionAPI';
import createElementLI, { creatingMessageElement } from './createElement';

document.addEventListener('DOMContentLoaded', () => {
  let user;
  const serverUrl = 'http://localhost:7070/';
  const communicationWindow = document.querySelector('.communication-window');
  communicationWindow.style.opacity = '0.1';

  const wrapperNicknameForm = document.querySelector(
    '.wrapper-nickname-entry-form',
  );
  wrapperNicknameForm.style.opacity = '1';

  const formValidator = wrapperNicknameForm.querySelector(
    '.nickname-form-validator',
  );
  const nickname = document.querySelector('.nickname-input-field');
  const nicknameSendingButton = document.querySelector(
    '.nickname-entry-form-button',
  );
  const windowSubscribers = document.querySelector('.subscriptions');

  nicknameSendingButton.addEventListener('click', (e) => {
    e.preventDefault();

    user = nickname.value;

    api.add({ user }).then(
      () => {
        const niknameItem = Array.from(windowSubscribers.children).find(
          (item) => item.textContent === user,
        );
        niknameItem.textContent = 'You';
        niknameItem.style.color = '#ffd300';
        nickname.value = '';
        communicationWindow.style.opacity = '1';
        wrapperNicknameForm.classList.add('display-hide');
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

  const chatMessage = document.querySelector('.chat-message');
  const chatSend = document.querySelector('.chat-send');

  chatSend.addEventListener('click', () => {
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
