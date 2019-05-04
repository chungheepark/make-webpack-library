import $ from 'jQuery/dist/jquery';

import App from './App';

$(() => {
  console.log('script loaded?');

  const app = new App();
  app.start();
});
