# 시작하기
## 필요 환경
- [Node.js](https://nodejs.org/en/download/) (버전 12 이상 권장)
- [mongoDB](https://www.mongodb.com/download-center/community)
- [yarn](https://classic.yarnpkg.com/en/docs/install/#windows-stable)



## 테스트 서버
디버그를 위해 테스트 서버를 실행하려면, 터미널 두개가 필요합니다.

### frontend
```
cd ./frontend
yarn install
yarn serve
```

### backend
```
cd ./backend
cp .env.example .env
yarn install
yarn dev
```

