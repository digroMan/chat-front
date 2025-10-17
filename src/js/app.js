import { changeNickname } from './creatingElements';
import { GLOBAL_STATE, setUserName } from './store';
import { toggleClass, toggleHide } from './helpers';
import { launchSSE, launchWS } from './services';
import { SUBSCRIPTION, WS } from './constants';
import MODAL from './components/Modal';

document.addEventListener('DOMContentLoaded', () => {
  // TODO: Переместить все handlers в отдельные файлы???
  const submitNickname = (e) => {
    e.preventDefault();
    const modal = document.querySelector('.modal');
    const input = e.target.querySelector('.form__input');
    const validator = e.target.querySelector('.form__validator');
    const userName = input.value;

    if (!userName) {
      toggleClass({
        element: input,
        className: 'form__input_error',
        isRemove: false,
      });
      toggleHide({ element: validator, hide: false });
      validator.textContent = 'Введите никнейм';
      return;
    }

    // TODO: добавить DOMPurify??

    SUBSCRIPTION.add({ user: userName }).then(
      () => {
        toggleHide({ element: validator, hide: true });
        setUserName({ userName });
        changeNickname({ userName: GLOBAL_STATE.userName });
        e.target.reset();
        toggleHide({ element: modal, hide: true });
      },
      () => {
        toggleHide({ element: validator, hide: false });
        toggleClass({
          element: input,
          className: 'form__input_error',
          isRemove: false,
        });
        validator.textContent = `Никнейм ${userName} уже занят, введите другой`;
        e.target.reset();
      },
    );
  };

  const submitMessage = (e) => {
    e.preventDefault();
    const input = e.target.querySelector('.form__input');
    const validatorContainer = e.target.querySelector(
      '.form__validator-container',
    );
    const validator = e.target.querySelector('.form__validator');
    const message = input.value;

    if (!message) {
      toggleClass({
        element: input,
        className: 'form__input_error',
        isRemove: false,
      });
      toggleHide({ element: validatorContainer, hide: false });
      validator.textContent = 'Нужно ввести сообщение';
      return;
    }

    const data = {
      message,
      client: GLOBAL_STATE.userName,
      date: new Date().getTime(),
    };
    WS.send(JSON.stringify({
      type: 'add',
      data,
    }));

    e.target.reset();
  };

  const handleSetNickname = () => {
    const form = document.forms.nickname;
    const input = form.querySelector('.form__input');
    const validator = form.querySelector('.form__validator');

    const hideError = () => {
      toggleHide({
        element: validator,
        hide: true,
      });
      toggleClass({
        element: input,
        className: 'form__input_error',
        isRemove: true,
      });
    };

    form.addEventListener('submit', submitNickname);
    input.addEventListener('click', hideError);
  };

  // const handlerSubmitModal = (e) => {
  //   e.preventDefault();
  //   // handleRemoveMessage(e);
  //   MODAL.close();
  // };

  // const options = {
  //   id,
  //   title: '',
  //   text: 'Cообщение не восстановить.',
  //   submit: {
  //     text: 'Да',
  //     handler: handlerSubmitModal,
  //   },
  //   cancel: {
  //     text: 'Нет',
  //     handler: MODAL.close,
  //   },
  //   clickOverlay: MODAL.close,
  // };

  // const handlerOpeningModal = () => MODAL.open({ options });

  const handleCreateMessage = () => {
    const form = document.forms['create-message'];
    const input = form.querySelector('.form__input');
    const errorContainer = form.querySelector('.form__validator-container');

    const hideError = () => {
      toggleHide({ element: errorContainer, hide: true });
      toggleClass({
        element: input,
        className: 'form__input_error',
        isRemove: true,
      });
    };

    form.addEventListener('submit', submitMessage);
    input.addEventListener('click', hideError);
  };

  try {
    if (document.forms.length === 0) throw new Error('отсутствуют формы на странице');
    // handleSetNickname();
    handleCreateMessage();
  } catch (error) {
    console.warn(`Ошибка в инициализации форм: ${error.message}`);
  }

  try {
    launchSSE();
    launchWS();
  } catch (error) {
    console.warn('Ошибка в работе WS/SSE');
  }

  window.addEventListener('beforeunload', () => {
    if (!GLOBAL_STATE.userName) return;
    SUBSCRIPTION.remove(GLOBAL_STATE.userName);
  });
});
