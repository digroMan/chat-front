export default class SubscriptionApi {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
  }

  async add({ user }) {
    const request = await fetch(`${this.apiUrl}subscriptions/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: user }),
    });

    const result = await request;

    if (!result.ok) {
      throw new Error('Ошибка!');
    }

    const json = await result.json();

    const { status } = json;

    return status;
  }

  async getSubscribers() {
    const request = await fetch(`${this.apiUrl}subscriptions/full`, {
      method: 'GET',
    });

    const result = await request;

    if (!result.ok) {
      console.error('Ошибка!');
    }

    const json = await result.json();

    return json;
  }

  async remove(user) {
    const query = `subscriptions/${encodeURIComponent(user)}`;

    const request = await fetch(this.apiUrl + query, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await request;

    if (!result.ok) {
      console.error('Ошибка!');

      return;
    }

    const json = await result.json();

    const { status } = json;

    console.log(status);
  }
}
