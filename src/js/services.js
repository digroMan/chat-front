import {
  SSE, SUBSCRIPTION, WS,
} from './constants';
import {
  createMessage, createNewSubscriber, insertInChat, removeSubscriber, removeMessage,
} from './creatingElements';
import { deleteCompanion, setCompanion } from './store';

export const launchSSE = () => {
  SSE.addEventListener('open', (e) => {
    console.log(e);

    SUBSCRIPTION.getSubscribers().then((result) => {
      result
        .map((item) => item.name)
        .forEach((name) => {
          setCompanion(name);
          createNewSubscriber(name);
        });
    });

    // async function getMessage() {
    //   const request = await fetch(`${SERVER_URL}last-messages/`, {
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   });

    //   const result = await request;

    //   if (!result.ok) {
    //     throw new Error('Ошибка!');
    //   }

    //   const json = await result.json();
    //   console.log(json);

    //   const { status } = json;

    //   return status;
    // }

    // getMessage().then((response) => {
    //   console.log(response);
    // });

    console.log('sse open');
  });

  SSE.addEventListener('error', (e) => {
    console.log(e);

    console.log('sse error');
  });

  SSE.addEventListener('message', (e) => {
    const { name, deleteClient, add } = JSON.parse(e.data);

    if (add) {
      setCompanion(name);
      createNewSubscriber(name);
    }

    if (deleteClient) {
      deleteCompanion(name);
      removeSubscriber(name);
    }
  });
};

export const launchWS = () => {
  WS.addEventListener('open', (e) => {
    console.log(e);

    console.log('ws open');
  });

  WS.addEventListener('close', (e) => {
    console.log(e);

    console.log('ws close');
  });

  WS.addEventListener('error', (e) => {
    console.log(e);

    console.log('ws error');
  });

  WS.addEventListener('message', (e) => {
    const eventSocket = JSON.parse(e.data);
    let element;
    switch (eventSocket.type) {
      case 'first-load':
        Object.entries(eventSocket.data).forEach(([id, data]) => {
          const {
            message, client, date, deleted,
          } = data;
          element = createMessage({
            date,
            id,
            message,
            client,
            deleted,
          });

          insertInChat({ element });
        });
        break;
      case 'add':
        Object.entries(eventSocket.data).forEach(([id, data]) => {
          const {
            message, client, date, deleted,
          } = data;
          element = createMessage({
            date,
            id,
            message,
            client,
            deleted,
          });
          insertInChat({ element });
        });
        break;
      case 'delete':
        removeMessage(eventSocket.data);
        break;
      default:
        break;
    }
  });
};
