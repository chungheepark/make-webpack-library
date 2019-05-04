import $ from 'jQuery/dist/jquery';

import App from './App';
import * as Utils from './Utils';
import * as Storage from './Storage';

const _mergeNamespaceAndModule = module => {
  console.warn('MyLib depends jquery. so we append jquery to window $ object.');
  console.warn('jquery:', $.fn.jquery);
  window.$ = $;

  return typeof window.MyLib === 'object'
    ? Object.assign({}, window.MyLib, module)
    : module;
};

export default _mergeNamespaceAndModule({
  version: '1.0.0',
  App,
  Utils,
  Storage,
});
