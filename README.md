# build js library using Webpack

- JS 라이브러리 빌드시스템을 만들고 싶은데.. 삽질을 많이해서 기록으로 남긴다.

## requirement

- JS를 모듈별로 관리하고 싶다.
- 개발할 때는 모듈별로, 배포할 때는 한 파일로 배포 하고 싶다.
- 최신 es8 기능 쓰고싶다.

## how to?

- webpack 으로 빌드한다.
- babel transpile 한다.

## Not yet solved

- babel로 transpile 하면 polyfill이 bundling된 script에 import 되야 한다. 라이브러리에 babel-polyfill이 사용되고, app에서도 babel-polyfill이 포함되면 중복으로 포함되는 것 아닌가?
-
