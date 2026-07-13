import Chat from './Chat';
import ChatAPI from './api/ChatAPI';

// URL серверной части, развёрнутой на Render.
// После деплоя бэкенда замените на адрес своего сервиса.
const SERVER_URL = 'https://ahj-chat-backend-0cc2.onrender.com';

const api = new ChatAPI(SERVER_URL);
const chat = new Chat(document.querySelector('#root'), api);
chat.init();
