export default class ChatAPI {
  constructor(baseUrl) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  get wsUrl() {
    return this.baseUrl.replace(/^http/, 'ws');
  }

  async register(name) {
    const response = await fetch(`${this.baseUrl}/new-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    // Сервер отвечает JSON и при успехе (200, status: "ok"),
    // и при занятом псевдониме (409, status: "error")
    return response.json();
  }
}
