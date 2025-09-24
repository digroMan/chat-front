import {
  SSE, SUBSCRIPTION, WS,
} from './constants';
import { createMessage, createNewSubscriber, removeSubscriber } from './creatingElements';
import { deleteCompanion, GLOBAL_STATE, setCompanion } from './store';

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

    console.log(name, deleteClient, add);

    if (add) {
      setCompanion(name);
      createNewSubscriber(name);
    }

    if (deleteClient) {
      deleteCompanion(name);
      console.log(GLOBAL_STATE.allUsers);
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
    const data = JSON.parse(e.data);
    console.log(data.chat);

    data.chat.forEach((item) => {
      const { message, client, date } = item;

      createMessage({
        message,
        client,
        date,
      });
    });
  });
};
