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
- Ex: Run "**npm run install-awzy host=localhost user=root password=12345 username=superadmin userpassword=Success@123**" in your terminal

##### Parameter help:

- `<host>` MySql host name
- `<user>` - MySql user name
- `<password>` - MySql password
- `<username>` - Awzy super admin user name (Remeber this.. It cannot be revoked)
- `<userpassword>` - Awzy super admin password (Remeber this.. It cannot be revoked)
- This will install awzy database w.r.t above credentials.
- Login Awzy with the remebered `<username>` and `<userpassword>`

##### 3. Create .env file, inside src folder, to configure local and production variables. Here is a sample,

- SKIP_PREFLIGHT_CHECK=true
- FAST_REFRESH=false
- REACT_APP_LOCALHOST='localhost:8888'
- REACT_APP_LOCALHOST_BASE_URL='http://localhost:1234/awzy-cms/services'
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

- Use the above snippet for .env variables.
- .env variable file is crucial for DB connection.
- This file should not be committed.
- Unless the above variables are configured good, you cant run awzy in local or production environment
- **npm run start** or **npm run build** is required after .env changes

##### 4. Configure nginx (Not for production)

**Proxy server setup for api in localhost**

Open **/awzy-cms/nginx/conf/nginx.conf** to change proxy_pass settings in line 11, 21 & 25 for port and endpoint setup

##### Windows

- complete the setup in nginx.conf file
- Open nginx folder and run nginx.exe
- To stop / reload server - Open task manager to delete your nginx instance and run nginx.exe to restart

##### MAC

- Check you have installed nginx (Homebrew)
- Run "**vim /usr/local/etc/nginx/nginx.conf**" in terminal
- Copy **/awzy-cms/nginx/conf/nginx.conf** content with neccessary setup and paste it in "**/usr/local/etc/nginx/nginx.conf**"
  In terminal run,
- **sudo brew services start nginx** (Start nginx)
- **sudo brew services restart nginx** (Restart nginx)
- **sudo brew services stop nginx** (Stop nginx)

##### If port 1234 is blocked, follow below, else skip this step

- Update package.json - Change **proxy: http://localhost:1235**
- Update .env file - Change REACT_APP_LOCALHOST_BASE_URL to **http://localhost:1235/awzy-cms/services**
- In line 11 Change listen 1234 to 1235
- Restart nginx
- Browse awzy in **http://localhost:1235**, as you have changed the port settings to **1235**

##### 5. DEV run

- npm run start

-

## 2. DEV run (disable web security) (Incase nginx is not installed)

#### `Not advisable`

#### MAC

- In terminal run the below command
- open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security

#### windows

- win key + r run the below command
- chrome.exe --user-data-dir="C://Chrome dev session" --disable-web-security
- Browse in http://localhost:3000

##### Browse

- Open http://localhost:1234 to run Awzy CMS in local
- Click the top right grid icon to awzy login as admin or super admin with
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

`Bharani Palani - tp.bharani@gmail.com`
