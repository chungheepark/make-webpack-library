// module.exports = require('./MyLib').default;

import $ from 'jQuery/dist/jquery';

import App from './App';
import * as Utils from './Utils';
import * as Storage from './Storage';

console.warn('MyLib depends jquery. so we append jquery to window $ object.');
console.warn('jquery:', $.fn.jquery);
window.$ = $;

export default {
  version: '1.0.0',
  App,
  Utils,
  Storage,
};
