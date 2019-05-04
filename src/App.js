import AppController from './App.controller';

export default class App {
  constructor() {
    this.TAG = 'App';

    this.controller = AppController;
  }

  start() {
    console.log(this.TAG, 'start');

    this.controller.prepareRouter();
    this.controller.run();

    window.onhashchange = () => this.controller.run();
  }
}
