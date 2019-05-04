# Webpack js library tutorial

웹팩이 절대 설정이 간단하지 않으므로 다른 프로젝트의 설정을 참고하는게 많은 도움이 된다. create-react-app도 좋은 참고가 된다. 다만, 원하는 방향이 다르므로 오히려 react의 rollup 빌드 설정이 도움이 될 것이다.

본 설정은 [libJitsiMeet](https://github.com/jitsi/lib-jitsi-meet) 이라는 webrtc 라이브러리 에서 참고하였다.

- jQuery 의존성을 가지고 있는 라이브러리를 개발해 본다.
- 브라우저에서 동작할 수 있는 라이브러리를 개발해 본다.

## 0. 의존성

```json
// package.json
{
  "name": "webpack-test",
  "version": "1.0.15",
  "description": "",
  "main": "./index.js",
  "dependencies": {
    "@babel/polyfill": "^7.4.3", // 이게 있어야 syntax 관련 에러가 안난다.
    "jquery": "^3.4.1"
  },
  "devDependencies": {
    // 개발시에만 사용되는 의존성
    "@babel/core": "^7.4.3",
    "@babel/plugin-proposal-class-properties": "^7.4.0",
    "@babel/plugin-proposal-export-default-from": "^7.2.0",
    "@babel/plugin-proposal-export-namespace-from": "7.0.0",
    "@babel/preset-env": "7.1.0",
    "babel-loader": "^8.0.5",
    "webpack": "4.26.1",
    "webpack-cli": "3.1.2"
  },
  "scripts": {
    "build": "webpack -p"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

## 1. base webpack 설정

```js
const process = require('process');

module.exports = {
  devtool: 'source-map', // 소스맵을 통해 디버깅이 가능하게 해준다.
  mode: 'production', // 배포 모드로 번들링을 하니까, 미니파이 된다.
  entry: { lib: './src/index.js' }, // lib라는 이름의 js 번들링 파일을 생성.
  module: {},
  plugins: [],
  optimization: {
    concatenateModules: true, // 성능 최적화
  },
  output: {
    path: process.cwd(), // js library가 떨어지는 현재 절대 경로
    library: 'MyLib', // library 이름
    libraryTarget: 'umd', // library module 형식 : AMD, CommonJS2 둘 다 지원
    umdNamedDefine: true, // 이 값이 설정 되어야 AMD 모듈의 이름이 지정된다.
    filename: '[name].min.js',
    sourceMapFilename: '[name].min.map',
  },
};
```

이정도 하면 아래 해당 기능은 수행할 수 있다.

- es6의 모듈기능을 사용할 수 있다: `import` / `export` 를 사용하여 파일을 스플리팅 해서 개발할 수 있다!
- lib.min.js라는 미니파이 된 하나의 파일을 import 하면 된다.
- MyLib라는 네임스페이스? 변수?를 통해 사용할 수 있다.

문제점:

- es6 최신 기능은 아직 사용할 수 없다.
- 기본 default export 된 모듈은 module.default로 접근해야 한다
  - -> MyLib.default.App

## 2. babel 설정

```js
babel 설정 중 module에 아래 내용 추가

{
  loader: 'babel-loader',
  test: /\.js$/,
  exclude: [new RegExp(`${__dirname}/node_modules`)], // node_modules는 빌드 안한다. 코드에서 import 할 때 minify 된 버전을 사용해야 한다.
  options: {
    presets: [
      [
        '@babel/preset-env',  // 바벨 문법 지원 -> 최신
        {
          modules: false, // 트리 쉐이킹 관련 최적화 옵션
          debug: true,  // 디버깅 옵션 켜서 바벨 관련 경고를 확인한다.
          useBuiltIns: 'usage', // babel-polyfill 이 자동으로 포함된다.
        },
      ],
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-export-default-from',
      '@babel/plugin-proposal-export-namespace-from',
    ],
  },
},
```

바벨 플러그인 설명

```js
// @babel/plugin-proposal-class-properties
// https://babeljs.io/docs/en/babel-plugin-proposal-class-properties
class Bork {
  //Property initializer syntax
  instanceProperty = 'bork';
  boundFunction = () => {
    return this.instanceProperty;
  };

  //Static class properties
  static staticProperty = 'babelIsCool';
  static staticFunction = function() {
    return Bork.staticProperty;
  };
}
```

```js
// @babel/plugin-proposal-export-default-from
// https://babeljs.io/docs/en/babel-plugin-proposal-export-default-from
export v from 'mod';
```

```js
// @babel/plugin-proposal-export-namespace-from
// https://babeljs.io/docs/en/next/babel-plugin-proposal-export-namespace-from.html
export * as ns from 'mod';
```

## 3. default 설정 바꿔보기

브라우저에서 `MyLib`이라고 써봤다. 근데, `default export` 된 녀석들을 `MyLib`이라는 이름으로 바로 사용할 수 없다. `MyLib.default.App` 이런식으로 사용해야 한다. 어떻게 해결을 할 수 있을까?

lib-jitsi-meet이라는 라이브러리는 window.JitsiMeetJS 라는 객체에다가 할당해서 window에서 사용할 수 있도록 한다.

우리도 MyLib.js라는 녀석을 추가해서 한번 해결해 보자.

```js
// MyLib.js
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
```

```js
// index.js
module.exports = require('./MyLib').default;
```

이제 브라우저에서도 접근할 수 있고, 모듈로 import 해서 사용할 수 도 있다.

## 4. 빌드 및 실행

make build; npx serve .

## 5. TODO:

- webpack-devserver 사용해보기
