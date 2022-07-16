const copyfiles = require('copyfiles');
const { setConnection } = require('./preStart.js')

copyfiles(
  ['./services/**/*', './services/**/.*', './build'],
  '-a -F -u 1',
  () => {
    console.log('Setting up your production build...');
    copyfiles(['./.htaccess', './build'], () => {
      setConnection(() => {
        console.log(`✋ Preparing your connection file`);
        console.log('👍 Awzy Production build is ready');
      });
    });
  }
);


