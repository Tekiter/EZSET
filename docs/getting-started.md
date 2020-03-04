# 시작하기

---

## 로컬에서 시작하기

### 필요 환경

- [Node.js](https://nodejs.org/en/download/) (버전 12 이상 권장)
- [mongoDB](https://www.mongodb.com/download-center/community)
- [yarn](https://classic.yarnpkg.com/en/docs/install/#windows-stable)

### 빌드

빌드 결과물은 `./backend/dist` 폴더에 생성됩니다.

##### Windows (cmd)

```sh
cd tools
build.bat
```

### 테스트 서버

디버그를 위해 테스트 서버를 실행하려면, 터미널 두개가 필요합니다.

#### frontend

```sh
cd ./frontend
yarn install
yarn serve
```

#### backend

```sh
cd ./backend
cp .env.example .env
yarn install
yarn dev
```

---

## AWS EC2 로 시작하기

- [AWS ec2로 배포하기](https://hschoi1104.github.io/2020/02/27/EZSET-AWS-ec2%EB%A1%9C-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0.html) 에서 자세한 과정을 확인하실 수 있습니다.

### 설치 목록

- Node.js (버전 12이상)
- MongoDB
- Nginx
- UFW(Firewall)
- pm2
- yarn

#### 설치준비

```sh
sudo apt-get update
sudo apt-get install -y build-essential
sudo apt-get install curl
```

#### Node.js 설치하기

```sh
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### MongoDB 설치하기

```sh
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Nginix 설치하기

```sh
sudo apt-get install -y nginx
```

#### UFW(FIREWALL) 설치하기

```sh
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

#### Yarn 설치하기

```sh
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update
sudo apt install -y yarn
```

#### PM2 설치하기

```sh
npm install -g pm2
```

### Nginx 설정하기

```sh
sudo rm /etc/nginx/sites-available/default
sudo vim /etc/nginx/sites-available/default
```

- 아래와 같은 내용으로 작성해줍니다.

```sh
# /etc/nginx/sites-available/default
server {
  listen 80 default_server;
  server_name _;

  # node api reverse proxy
  location / {
    proxy_pass http://127.0.0.1:5000/;
  }
}
```

- nginx 서비스 재시작

```sh
sudo systemctl restart nginx
```

### 실행하기

```sh
git clone https://github.com/Tekiter/EZSET.git

cd ./EZSET/tools
sudo chmod a+x update.sh

pm2 start --name EZSET update.sh
```

