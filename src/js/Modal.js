export default class Modal {
  constructor(container, onSubmitCallback) {
    this.container = container;
    this.onSubmitCallback = onSubmitCallback;

    this.onSubmit = this.onSubmit.bind(this);
  }

  init() {
    this.render();

    this.element = this.container.querySelector('.modal');
    this.form = this.element.querySelector('.modal__form');
    this.input = this.element.querySelector('.modal__input');
    this.hint = this.element.querySelector('.modal__hint');

    this.form.addEventListener('submit', this.onSubmit);
    this.input.focus();
  }

  render() {
    this.container.insertAdjacentHTML('beforeend', `
      <div class="modal">
        <form class="modal__form">
          <h2 class="modal__title">Выберите псевдоним</h2>
          <input class="modal__input" type="text" name="nickname" autocomplete="off">
          <p class="modal__hint"></p>
          <button class="modal__button" type="submit">Продолжить</button>
        </form>
      </div>
    `);
  }

  onSubmit(event) {
    event.preventDefault();

    const name = this.input.value.trim();
    if (!name) {
      this.showHint('Введите псевдоним');
      return;
    }

    this.onSubmitCallback(name);
  }

  showHint(text) {
    this.hint.textContent = text;
    this.input.focus();
  }

  clearHint() {
    this.hint.textContent = '';
  }

  hide() {
    this.form.removeEventListener('submit', this.onSubmit);
    this.element.remove();
  }
}
