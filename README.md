# Чат (WebSocket)

[![Build status](https://github.com/devlop12x-crypto/ahj-chat/actions/workflows/web.yml/badge.svg)](https://github.com/devlop12x-crypto/ahj-chat/actions/workflows/web.yml)

🔗 [GitHub Pages](https://devlop12x-crypto.github.io/ahj-chat/)

Домашнее задание к занятию «8. EventSource, Websockets» — задача «Чат».

Серверная часть: [ahj-chat-backend](https://github.com/devlop12x-crypto/ahj-chat-backend), развёрнута на [Render](https://render.com/).

## Функциональность

- При загрузке страницы открывается модальное окно выбора псевдонима. Регистрация выполняется запросом `POST /new-user` (Fetch). Если псевдоним занят (сервер отвечает `409`, `status: "error"`), пользователю показывается подсказка, и он может ввести другое имя.
- После успешной регистрации открывается окно чата и устанавливается WebSocket-соединение.
- Список участников в левой части обновляется в реальном времени: сервер рассылает актуальный массив пользователей при каждом подключении и отключении. Текущий пользователь отображается как `You` (красным).
- Сообщения отправляются через WebSocket в формате `{ type: "send", message, user }` и отрисовываются по факту рассылки сервером: чужие — слева, свои — справа с подписью `You`.
- При закрытии вкладки (`beforeunload`) клиент отправляет `{ type: "exit", user }`, и пользователь удаляется из списка участников у всех остальных.

## Скрипты

```bash
yarn          # установка зависимостей
yarn start    # dev-сервер
yarn lint     # проверка ESLint (airbnb-base)
yarn build    # production-сборка в dist/
```

Деплой на GitHub Pages выполняется автоматически через GitHub Actions при пуше в `main`.
