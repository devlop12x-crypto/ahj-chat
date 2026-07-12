import Modal from './Modal';

export default class Chat {
  constructor(container, api) {
    this.container = container;
    this.api = api;
    this.websocket = null;
    this.user = null;
    this.modal = null;

    this.onRegister = this.onRegister.bind(this);
    this.onSendMessage = this.onSendMessage.bind(this);
    this.onWsMessage = this.onWsMessage.bind(this);
    this.onWindowUnload = this.onWindowUnload.bind(this);
  }

  init() {
    this.render();

    this.modal = new Modal(this.container, this.onRegister);
    this.modal.init();
  }

  render() {
    this.container.insertAdjacentHTML('beforeend', `
      <div class="chat chat_hidden">
        <ul class="chat__userlist"></ul>
        <div class="chat__main">
          <div class="chat__messages"></div>
          <form class="chat__form">
            <input class="chat__input" type="text" placeholder="Type your message here" autocomplete="off">
          </form>
        </div>
      </div>
    `);

    this.element = this.container.querySelector('.chat');
    this.userList = this.element.querySelector('.chat__userlist');
    this.messagesList = this.element.querySelector('.chat__messages');
    this.form = this.element.querySelector('.chat__form');
    this.input = this.element.querySelector('.chat__input');

    this.form.addEventListener('submit', this.onSendMessage);
  }

  async onRegister(name) {
    this.modal.clearHint();

    let result;
    try {
      result = await this.api.register(name);
    } catch (error) {
      this.modal.showHint('Сервер недоступен, попробуйте ещё раз чуть позже');
      return;
    }

    if (result.status !== 'ok') {
      this.modal.showHint('Этот псевдоним уже занят, выберите другой');
      return;
    }

    this.user = result.user;
    this.modal.hide();
    this.element.classList.remove('chat_hidden');
    this.input.focus();
    this.connect();
  }

  connect() {
    this.websocket = new WebSocket(this.api.wsUrl);
    this.websocket.addEventListener('message', this.onWsMessage);
    window.addEventListener('beforeunload', this.onWindowUnload);
  }

  onWsMessage(event) {
    const data = JSON.parse(event.data);

    // Сервер присылает либо список пользователей (массив),
    // либо сообщение чата (объект с type: "send")
    if (Array.isArray(data)) {
      this.renderUserList(data);
      return;
    }

    if (data.type === 'send') {
      this.renderMessage(data);
    }
  }

  onSendMessage(event) {
    event.preventDefault();

    const message = this.input.value.trim();
    if (!message || !this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
      return;
    }

    // Своё сообщение не отрисовываем сразу:
    // сервер разошлёт его всем, включая отправителя
    this.websocket.send(JSON.stringify({
      type: 'send',
      message,
      user: this.user,
    }));

    this.input.value = '';
  }

  onWindowUnload() {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify({
        type: 'exit',
        user: this.user,
      }));
      this.websocket.close();
    }
  }

  renderUserList(users) {
    this.userList.innerHTML = '';

    users.forEach((user) => {
      const isYou = this.user && user.id === this.user.id;

      const item = document.createElement('li');
      item.classList.add('chat__user');
      if (isYou) {
        item.classList.add('chat__user_you');
      }

      const avatar = document.createElement('span');
      avatar.classList.add('chat__user-avatar');

      const name = document.createElement('span');
      name.classList.add('chat__user-name');
      name.textContent = isYou ? 'You' : user.name;

      item.append(avatar, name);
      this.userList.append(item);
    });
  }

  renderMessage({ user, message }) {
    const isYou = this.user && user.id === this.user.id;

    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    if (isYou) {
      messageElement.classList.add('message_yours');
    }

    const header = document.createElement('div');
    header.classList.add('message__header');
    header.textContent = `${isYou ? 'You' : user.name}, ${Chat.formatDate(new Date())}`;

    const body = document.createElement('div');
    body.classList.add('message__body');
    body.textContent = message;

    messageElement.append(header, body);
    this.messagesList.append(messageElement);
    this.messagesList.scrollTop = this.messagesList.scrollHeight;
  }

  static formatDate(date) {
    const pad = (value) => String(value).padStart(2, '0');
    const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    const day = `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
    return `${time} ${day}`;
  }
}
