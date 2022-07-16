# Welcome to [Awzy](https://awzy.org)
Your awesome headless CMS

### Prerequisites
- Node version: 14.17.2
- npm version: 6.14.15
- react-router-dom: 5.1.2
or above

### Installation
- Install XAMP or MAMP on your preferred OS
- Clone Awzy repo inside "htdocs" folder
- Go to cloned folder in your terminal & run the following commands,

### Now,
##### 1. Install node_modules 
- npm install --legacy-peer-deps

##### 2. Install database 
- Hope you have installed XAMP and your repo is inside "htdocs" folder
- Add your host, root & password, etc.., based on your mysql setup as shown below,
- Ex:  Run **npm run install-awzy host=localhost user=root password=12345 username=superadmin userpassword=Success@123** in your terminal

##### Parameter help:
- `<host>` MySql host name
- `<user>` - MySql user name
- `<password>` - MySql password
- `<username>` - Awzy super admin user name (Remeber this.. It cannot be revoked)
- `<userpassword>` - Awzy super admin password (Remeber this.. It cannot be revoked)
- This will install awzy database w.r.t above credentials.
- Login Awzy with the remebered `<username>` and `<userpassword>`

##### 3. Create .env file, inside src folder, to configure local and production variables. Here is a sample,

- REACT_APP_LOCALHOST='localhost:8080'
- REACT_APP_LOCALHOST_BASE_URL='http://localhost:5000/awzy-cms/services' (port 5000 as you configured in proxy)
- REACT_APP_LOCALHOST_DB_HOST_NAME='localhost'
- REACT_APP_LOCALHOST_DB_USER_NAME='root'
- REACT_APP_LOCALHOST_DB_PASSWORD='12345'
- REACT_APP_LOCALHOST_DB_NAME='awzy'

- REACT_APP_PRODUCTION_HOST='yourdomain.com'
- REACT_APP_PRODUCTION_BASE_URL='https://yourdomain.com/services'
- REACT_APP_PRODUCTION_DB_HOST_NAME='192.168.0.1'
- REACT_APP_PRODUCTION_DB_USER_NAME='dbusername'
- REACT_APP_PRODUCTION_DB_PASSWORD='dbpassword'
- REACT_APP_PRODUCTION_DB_NAME='dbname'

##### Important: 
- .env variable file is crucial for DB connection
- This file should not be committed
- Unless the above variables are configured good, you cant run awzy in local or production environment 
- **npm run start** is required after .env changes

##### 4. Configure nginx (Not for production)
**Proxy server setup for api in localhost**

##### Windows 
- Open **/awzy-cms/nginx/conf/nginx.conf** to change proxy_pass settings in line 25 based on apache listen port
- Open nginx folder and run nginx.exe
- To stop / reload server - Open task manager and delete your nginx instances and run nginx.exe

##### MAC
- Check you have installed nginx (Homebrew)
- Open **/usr/local/etc/nginx/nginx.conf** file
- Copy **/awzy-cms/nginx/conf/nginx.conf** content and paste it in **/usr/local/etc/nginx/nginx.conf**
In terminal run,
- **sudo brew services start nginx** (Start nginx)
- **sudo brew services restart nginx** (Restart nginx)
- **sudo brew services stop nginx** (Stop nginx)

##### If port 5000 is blocked, follow below, else skip this step
- Update package.json - Change **proxy: http://localhost:5001**
- Update .env file - Change REACT_APP_LOCALHOST_BASE_URL to **http://localhost:5001/awzy-cms/services**
- In line 11 Change listen 5000 to 5001
- Restart nginx
- Browse awzy in **http://localhost:5001**, as you have changed the port settings to **5001**

##### 5. DEV run
- npm run start

<!---
## 2. DEV run (disable web security) (Incase nginx is not installed)
#### `Not advisable`

- in windows - win key + r run the below command
- chrome.exe --user-data-dir="C://Chrome dev session" --disable-web-security
- Browse in http://localhost:3000
-->

##### Browse
- Open http://localhost:5000 to run Awzy CMS in local
- Click the top right grid icon to login as admin or super admin with.
- User name: `<username>` & Password: `<userpassword>` what you should have remebered during database setup
- The password is common for admin and superAdmin. You can login and change them later.
- Now login,
- As super admin to maintain global settings, AWS S3 space & add/edit/delete pages in layout design with full access permissions
- Or as an admin who has limited access, only to layout design

##### Build:
- run "npm run build" in your root folder
- Your "build" folder is ready for production deployment which includes bundles and API setup.

##### Good Luck & Happy Coding
##### _Author_
```Bharani Palani - barani.potshot@gmail.com```