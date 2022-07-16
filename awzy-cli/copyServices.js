const copyfiles = require('copyfiles');

copyfiles(
  ['./services/**/*', './services/**/.*', './build'],
  '-a -F -u 1',
  () => {
    console.log('Awzy API service directory,');
    copyfiles(['./.htaccess', './build'], () => {
      console.log(
        'htaccess for public_html / www folder,'
      );
      copyfiles(['./.env', './build/services/application/config'], () => {
        console.log('Environment variable is ready for production..');
      });
    });
  }
);


