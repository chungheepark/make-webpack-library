import $ from 'jQuery/dist/jquery';

import { MY_ID_KEY } from '../constants';
import { getItem } from '../storage';

export default class Home {
  constructor() {
    this.TAG = 'Home';
    this.root = $('#root');
  }

  async init() {
    this.template = `
      <div id="home">
        <h1>Home</h1>
      </div>
    `;
    this.container = $(this.template);
    this.container.on('click', '#btn-go-to-signin', () => {
      location.hash = '#signin';
    });
  }
  async render() {
    const myId = getItem(MY_ID_KEY);
    if (myId === null) {
      location.hash = '#signin';
      return;
    }

    this.container.append(`<p>hello ${myId}</p>`);
    this.root.append(this.container);
  }
  async revoke() {
    this.container.remove();
  }
}
