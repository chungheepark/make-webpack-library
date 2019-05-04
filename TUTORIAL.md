# Webpack js library tutorial

웹팩이 절대 설정이 간단하지 않으므로 다른 프로젝트의 설정을 참고하는게 많은 도움이 된다. create-react-app도 좋은 참고가 된다. 다만, 원하는 방향이 다르므로 오히려 react의 rollup 빌드 설정이 도움이 될 것이다.

본 설정은 [libJitsiMeet](https://github.com/jitsi/lib-jitsi-meet) 이라는 webrtc 라이브러리 에서 참고하였다.

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
