#(update.sh)
#!/bin/bash
cd EZSET
echo "====PULL EZSET===="
#git clone -b release --single-branch https://github.com/Tekiter/EZSET.git
git pull origin release
echo "====ENV SETTING===="
sudo iptables -I INPUT -p tcp --dport 5050 -j ACCEPT
export DATABASE_URI=mongodb://localhost:27017/ezset
export PORT=5000
export SOCKET_PORT=5050
export JWT_SECRET=EZSET_SECREAT_Key
export FILE_UPLOAD_DIR=./../upload
echo " DATABASE_URI : $DATABASE_URI"
echo " PORT : $PORT"
echo " SOCKET_PORT : $SOCKET_PORT"
echo " JWT_SECRET : $JWT_SECRET"
echo " FILE_UPLOAD_DIR : $FILE_UPLOAD_DIR"
echo "====start service===="
yarn install
yarn start
echo "====================="
echo "Server will reboot every 7days"
echo "====================="
#sleep 7d
#exit()
