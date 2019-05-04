import $ from 'jQuery/dist/jquery';

import { genRandomString } from '../Utils';
import { MY_ID_KEY } from '../constants';
import { setItem } from '../Storage';

export default class Signin {
  constructor() {
    this.TAG = 'Signin';
    this.root = $('#root');
  }

  async init() {
    this.template = `
      <div id="signin">
        <h1>Signin</h1>
        <form>
          <label>id</label>
          <input type="text" id="input-signin-id"></input>
          <label>password</label>
          <input type="password" id="input-signin-pass"></input>
          <input type="submit" id="input-signin-submit" value="SIGN_IN">
          <div id="error" style="color:red;"></div>
        </form>
      </div>
    `;
    this.container = $(this.template);
    this.container.on('click', '#input-signin-submit', event => {
      event.preventDefault();

      const id = $('#input-signin-id').val();
      const pass = $('#input-signin-pass').val();

      if (id !== pass) {
        $('#error').text('로그인 실패야. 돌아가.');
        return;
      }

      alert('로그인 성공!');
      const myId = genRandomString(15);
      setItem(MY_ID_KEY, myId);
      location.hash = '#';
    });
  }
  async render() {
    this.root.append(this.container);
  }
  async revoke() {
    this.container.remove();
  }
}
