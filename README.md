# [Awzy](https://awzy.org)

## Prerequisites

- Node version: 14.17.2
- npm version: 6.14.15
- react-router-dom: 5.1.2

## Installation
- npm install --legacy-peer-deps

## DEV run (disable web security) (Incase nginx is not installed)
#### `Not advisable`

- in windows - win key + r run the below command
- chrome.exe --user-data-dir="C://Chrome dev session" --disable-web-security

## DEV run using nginx

### Windows 
- navigate to nginx folder and run nginx.exe
- To stop / reload server - Open task manager and delete your nginx instances and run nginx.exe
- Note: This will not impact your production build.

### MAC
- Check you have installed nginx
- nginx start (to start server)
- nginx stop (to stop server)
- nginx reload (to reload server)

## DEV run
- npm start

## Important
- Open http://localhost:5000 to run Awzy in local without CORS issue.
- Note: `Dont try http://localhost:3000` which will not work

## Build process:
- run "npm run build" in your root folder
- Your build folder is ready for producion deployment.

## _Good Luck & Happy Coding_
### Author
```Bharani Palani | barani.potshot@gmail.com```


