import Signin from './container/Signin';
import Home from './container/Home.js';

class AppController {
  constructor() {
    this.TAG = 'AppController';
    this.routerMap = {};
    this.beforeHandler = null;
  }

  addRouter(path, handler) {
    this.routerMap[path] = new handler();
  }

  prepareRouter() {
    this.addRouter('#signin', Signin);
    this.addRouter('#home', Home);
  }

  async executeRouter(path) {
    console.log(this.TAG, 'executeRouter');
    if (this.beforeHandler !== null) await this.beforeHandler.revoke();

    const handler = this.routerMap[path] || this.routerMap['#home'];
    await handler.init();
    await handler.render();
    this.beforeHandler = handler;
  }

  run() {
    console.log(this.TAG, 'run');
    this.executeRouter(window.location.hash);
  }
}

const controller = new AppController();
export default controller;
