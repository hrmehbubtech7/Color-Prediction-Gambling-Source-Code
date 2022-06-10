# luckcolor
1. Change .Env file Info
2. Change logo files
3. apt install nginx
4. cd /var

5. git clone https://github.com/hrmehbubtech7/Royal.git
6. cd Royal

7. apt install npm
8. npm install pm2 -g
9. pm2 start server.js
10. sudo nano etc/nginx/sites-available/default
11. change domain
12. sudo ufw allow 'Nginx Full'
13. apt install mongodb
14. npm run build


Mongoose COnfig
1.  mongo
2.  show dbs
3. use db
4. show collections
5. db.users.find().pretty()
6. db.users.updateOne({phone : "7002469058"},{$set : {admin : true}})
7. db.users.updateOne({phone : "7002469058"},{$set : {SuperAdmin : true}})


Port 80 forward to port 7777




sudo iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 7777

