### Welcome to [Awzy](https://awzy.org)
Your awesome headless CMS

### Prerequisites
- Node version: 14.17.2
- npm version: 6.14.15
- react-router-dom: 5.1.2
or above

### Installation
- Install XAMP in your machine
- Clone Awzy repo inside "htdocs" folder
- Navigate to the cloned folder

### Now,
##### 1. Install node_modules 
- npm install --legacy-peer-deps

##### 2. Install database 
- Hope you have installed XAMP in your machine and your repo is inside "htdocs" folder
- Add your host, root & password, based on your mysql setup as shown below,
- Run Ex:  **npm run install-awzy host=localhost user=root password=12345 username=superadmin userpassword=Success@123**

##### Parameter details:
- `<host>` MySql host name
- `<user>` - MySql user name
- `<password>` - MySql password
- `<username>` - Awzy super admin user name (Remeber this.. )
- `<userpassword>` - Awzy super admin password (Remeber this.. )
- This will install awzy database w.r.t above credentials.
- Login Awzy with the remebered `<username>` and `<userpassword>`

##### 3. Open .env file, inside src folder, to configure local and production variables
- Set your **host & base_url** for local and production
- **Database** - Host name, user name, password and database name.
- **Important**: If these variables are unless configured good, you can't run awzy in local and production environment

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
- User name: "superadmin" & Password: "Success@123"
- Now login as super admin to add, edit or delete pages

### Build process:
- run "npm run build" in your root folder
- Your build folder is ready for production deployment.

#### Good Luck & Happy Coding
#### _Author_
```Bharani Palani - barani.potshot@gmail.com```


