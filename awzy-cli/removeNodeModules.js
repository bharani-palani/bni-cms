const fs = require('fs');

// directory path
const dir = 'node_modules';

// delete directory recursively
if (fs.existsSync(dir)) {
    try {
        fs.rm(dir, { recursive: true });
        console.log(`${dir} is deleted!`);
    } catch (err) {
        console.error(`Error while deleting ${dir}.`);
    }
} else {
    console.log(`${dir} not found.`);
}