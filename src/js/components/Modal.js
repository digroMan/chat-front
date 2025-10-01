const createElem = ({ tag, selectors, text = false }) => {
  const element = document.createElement(tag);
  if (typeof selectors === 'string') element.classList.add(selectors);
  if (Array.isArray(selectors)) selectors.forEach((item) => element.classList.add(item));
  if (text) element.textContent = text;
  return element;
};

class Modal {
  constructor(selectors) {
    this.selectors = selectors;
    this.overlay = null;
    this.isOpen = false;
  }

  open({ options }) {
    if (this.isOpen) return;
    this.isOpen = true;

    this.overlay = createElem({ tag: 'div', selectors: this.selectors.overlay });
    const modal = createElem({ tag: 'div', selectors: this.selectors.modal });
    const form = this.createForm({ options });

    document.body.append(this.overlay);
    this.overlay.append(modal);
    modal.append(form);
    console.log(form);
  }

  close() {
    debugger;
    if (!this.isOpen) return;
    this.overlay.remove();
  }

  createForm({ options }) {
    const form = createElem({ tag: 'form', selectors: this.selectors.form });

    const fieldset = createElem({ tag: 'fieldset', selectors: this.selectors.fieldset });
    const label = document.createElement('label');
    label.classList.add(this.selectors.label);
    label.textContent = options.title;
    fieldset.append(label);

    const paragraph = document.createElement('p');
    paragraph.classList.add(this.selectors.text);
    paragraph.textContent = options.text;
    fieldset.append(paragraph);
    form.append(fieldset);

    const cancel = createElem({ tag: 'button', selectors: this.selectors.button.cancel, text: options.cancel.text });
    cancel.setAttribute('type', 'reset');
    cancel.addEventListener('reset', options.cancel.handler);
    const submit = createElem({ tag: 'button', selectors: this.selectors.button.submit, text: options.submit.text });
    submit.setAttribute('type', 'submit');
    submit.addEventListener('submit', options.submit.handler);

    form.appendChild(cancel);
    form.appendChild(submit);
    return form;
  }
}

const selectors = {
  overlay: ['modal', 'modal_overlay'],
  modal: 'modal__content',
  form: ['form', 'form_flex', 'form_del-message'],
  fieldset: ['form__fieldset', 'form__fieldset_mr-bottom-none'],
  label: 'form__label',
  text: 'form__text',
  button: {
    submit: ['form__button', 'form__button_submit'],
    cancel: ['form__button', 'form__button_cancel'],
  },
};

const MODAL = new Modal(selectors);
export default MODAL;
