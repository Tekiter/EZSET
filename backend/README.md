# EZSET

#### 환경변수 설정

###### windows

```sh
set PORT=5000
set SOCKET_PORT=5050
set DATABASE_URI=mongodb://localhost:27017/ezset
set FILE_UPLOAD_DIR=./upload
set JWT_SECRET=반드시_다른_Secret으로_바꿔야합니다
```

###### linux

```sh
export PORT=5000
export SOCKET_PORT=5050
export DATABASE_URI='mongodb://localhost:27017/ezset'
export FILE_UPLOAD_DIR='./upload'
export JWT_SECRET='반드시_다른_Secret으로_바꿔야합니다'
```

#### 서버 실행

```sh
yarn install
yarn start
```

[메인 브랜치](https://github.com/Tekiter/EZSET/tree/master)
