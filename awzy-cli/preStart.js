'use strict';
const fs = require('fs');

const srcFile = './.env';
const destFile = 'connection.ini';
const dest = './services/application/config/';

fs.copyFile(srcFile, dest + destFile, (err) => {
    if (err) throw err;
    console.log(`DB connection file(${destFile}), cloned from ${srcFile} file..`);
});