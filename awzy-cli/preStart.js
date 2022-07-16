'use strict';
const fs = require('fs');

const srcFile = './.env';
const destFile = 'connection.ini';
const dest = './services/application/config/';

const setConnection = (callBack) => fs.copyFile(srcFile, dest + destFile, (err) => {
    if (err) throw err;
    typeof callBack === 'function' && callBack();
});

setConnection();

module.exports.setConnection = setConnection;