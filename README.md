### Welcome to [Awzy](https://awzy.org)
Your awesome headless CMS

### Prerequisites
- Node version: 14.17.2
- npm version: 6.14.15
- react-router-dom: 5.1.2
or above

### Installation
- Install XAMP
- Clone Awzy repo inside "htdocs" folder
- Navigate to the cloned folder in your terminal

### Now,
##### 1. Install node_modules 
- npm install --legacy-peer-deps

##### 2. Install database 
- Hope you have installed XAMP in your machine and your repo is inside "htdocs" folder
- Add your host, root & password, etc.., based on your mysql setup as shown below,
- Ex:  Run **npm run install-awzy host=localhost user=root password=12345 username=superadmin userpassword=Success@123** in your terminal

##### Parameter help:
- `<host>` MySql host name
- `<user>` - MySql user name
- `<password>` - MySql password
- `<username>` - Awzy super admin user name (Remeber this.. )
- `<userpassword>` - Awzy super admin password (Remeber this.. )
- This will install awzy database w.r.t above credentials.
- Login Awzy with the remebered `<username>` and `<userpassword>`

##### 3. Open .env file, inside src folder, to configure local and production variables

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
- .env variable file is crucial for DB connection.  Unless these variables are configured good, you can't run awzy in local or production environment 
- **npm run start** is required after .env changes

### Run nginx 
**Proxy server for api**

#### Windows 
- navigate to nginx folder and run nginx.exe
- To stop / reload server - Open task manager and delete your nginx instances and run nginx.exe

#### MAC
- Check you have installed nginx (Homebrew)
- nginx start (to start server)
- nginx stop (to stop server)
- nginx reload (to reload server)

#### DEV run
- npm start

<!---
## 2. DEV run (disable web security) (Incase nginx is not installed)
#### `Not advisable`

- in windows - win key + r run the below command
- chrome.exe --user-data-dir="C://Chrome dev session" --disable-web-security
- Browse in http://localhost:3000
-->

### Browse
- Open http://localhost:5000 to run Awzy CMS in local
- Click the top right grid icon to login as super admin.
- User name: `<username>` & Password: `<userpassword>` which you should have remebered during database setup
- Now login as super admin to add, edit or delete pages

### Build process:
- run "npm run build" in your root folder
- Your "build" folder is ready for production deployment which includes env variables and API setup.

#### Good Luck & Happy Coding
##### _Author_
```Bharani Palani - barani.potshot@gmail.com```


