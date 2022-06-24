### [Awzy](https://awzy.org)

### Prerequisites
- Node version: 14.17.2
- npm version: 6.14.15
- react-router-dom: 5.1.2
or above

### Installation
- Install XAMP in your machine
- Clone Awzy code inside "htdocs" 
- Navigate to the cloned folder

### Now,
##### 1. Install node_modules 
- npm install --legacy-peer-deps

##### 2. Install database
- npm run install-awzy host=localhost user=root password=12345
(Change host, root & password based on your mysql setup)

### Run nginx 
##### Proxy server for api

#### Windows 
- navigate to nginx folder and run nginx.exe
- To stop / reload server - Open task manager and delete your nginx instances and run nginx.exe

#### MAC
- Check you have installed nginx
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

### Important
- Open http://localhost:5000 to run Awzy CMS in local
- Click the top right grid icon to login as super admin.
- User name: "superadmin" & Password: "Success@123"
- Now login as super admin to add, edit or delete pages

### Build process:
- run "npm run build" in your root folder
- Your build folder is ready for producion deployment.

#### _Good Luck & Happy Coding_
#### Author
```Bharani Palani - barani.potshot@gmail.com```


