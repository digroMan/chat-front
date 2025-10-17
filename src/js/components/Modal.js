const selectorsForModal = {
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
    this.form = null;
    this.options = null;
    this.overlay = null;
    this.isOpen = false;
  }

  open({ options }) {
    if (this.isOpen) return;
    this.isOpen = true;
    this.options = options;

    this.overlay = createElem({ tag: 'div', selectors: this.selectors.overlay });
    const modal = createElem({ tag: 'div', selectors: this.selectors.modal });
    modal.addEventListener('click', (e) => e.stopPropagation());
    this.form = this.createForm();

    document.body.append(this.overlay);
    this.overlay.append(modal);
    this.overlay.addEventListener('click', this.options.clickOverlay.bind(this));
    modal.append(this.form);
  }

  close() {
    if (!this.isOpen) return;
    this.overlay.remove();
    this.reset();
  }

  reset() {
    this.form = null;
    this.options = null;
    this.overlay = null;
    this.isOpen = false;
  }

  createForm() {
    const form = createElem({ tag: 'form', selectors: this.selectors.form });
    form.dataset.id = this.options.id;

    const fieldset = createElem({ tag: 'fieldset', selectors: this.selectors.fieldset });
    const label = document.createElement('label');
    label.classList.add(this.selectors.label);
    label.textContent = this.options.title;
    fieldset.append(label);

    const paragraph = document.createElement('p');
    paragraph.classList.add(this.selectors.text);
    paragraph.textContent = this.options.text;
    fieldset.append(paragraph);
    form.append(fieldset);

    const cancel = createElem({ tag: 'button', selectors: this.selectors.button.cancel, text: this.options.cancel.text });
    cancel.setAttribute('type', 'button');
    cancel.addEventListener('click', this.options.cancel.handler.bind(this));

    const submit = createElem({ tag: 'button', selectors: this.selectors.button.submit, text: this.options.submit.text });
    submit.setAttribute('type', 'submit');
    submit.addEventListener('click', (e) => e.stopPropagation());
    form.addEventListener('submit', this.options.submit.handler);

    form.appendChild(cancel);
    form.appendChild(submit);
    return form;
  }
}

const MODAL = new Modal(selectorsForModal);
export default MODAL;
