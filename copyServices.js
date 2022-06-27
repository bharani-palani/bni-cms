const copyfiles = require('copyfiles');

copyfiles(['./services/**/*', './build'], '-a -u 1', () => {
  console.log('Awzy API service directory is ready for production..');
});

copyfiles(['./.htaccess', './build'], () => {
  console.log(
    'htaccess for public_html / www folder is ready for production..'
  );
});

copyfiles(['./.env', './build'], () => {
  console.log('Environment variable is ready for production..');
});
