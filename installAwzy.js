const showBanner = require('node-banner');
const mysql = require('mysql');

const DB = 'awzy';
const TITLE = 'AWZY';
const TITLECOLOR = 'green';
const SUBTITLE = 'Welcome to simplified headless CMS';
const SUBTITLECOLOR = 'red';
const CLPREFIX = '> ';
const ENCNIL = 'U2FsdGVkX1+YToNGHBREr5YPCY+XjeiGuxMTeYWEeXg=';

const config = process.argv.slice(2);
console.log(config);

let params = config.map(c => {
  const pieces = c.split('=');
  return {
    [pieces[0]]: pieces[1],
  };
});
params = Object.assign({}, ...params);

// Banner
(async () => {
  await showBanner(TITLE, SUBTITLE.toUpperCase(), TITLECOLOR, SUBTITLECOLOR);
  const connection = mysql.createConnection({
    multipleStatements: true,
    ...params,
  });

  // check connection
  await connection.connect(err => {
    if (err) {
      console.log(
        CLPREFIX +
          'Error in establishing mysql connection.. Please check your application is inside the www or htdocs directory..'
      );
      throw err;
    }
    console.log(' ----------------------------------');
    console.log(CLPREFIX + 'Mysql connection successfully established...');
  });

  // 1. create database
  const createDbSql = `DROP DATABASE IF EXISTS ${DB}; CREATE DATABASE ${DB}`;
  await connection.query(createDbSql, (err, res) => {
    if (err) {
      throw err;
    }
    console.log(CLPREFIX + 'Database created..');
  });
  connection.query(`USE ${DB}`);

  // 2. create access level table
  const createAccessLevelTablesql =
    'CREATE TABLE az_access_levels (' +
    'access_id int(11) NOT NULL AUTO_INCREMENT,' +
    'access_value varchar(100) NOT NULL,' +
    'access_label varchar(25) NOT NULL,' +
    'PRIMARY KEY (access_id)' +
    ') ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8';
  await connection.query(createAccessLevelTablesql, (err, res) => {
    if (err) {
      throw err;
    }
    console.log(CLPREFIX + 'Creating access level table..');
  });

  const addAccessLevelsql = [
    ['1001', 'public', 'Public'],
    ['1002', 'superAdmin', 'Super Admin'],
    ['1003', 'admin', 'Admin'],
  ];

  await connection.query(
    'INSERT INTO az_access_levels (access_id,access_value,access_label) values ?',
    [addAccessLevelsql],
    (err, res) => {
      if (err) {
        throw err;
      }
      console.log(CLPREFIX + 'Adding access config data..');
    }
  );

  // 3. create config table
  const createConfigTablesql =
    'CREATE TABLE az_config (' +
    'config_id int(11) NOT NULL AUTO_INCREMENT,' +
    'web varchar(100) NOT NULL,' +
    'email varchar(50) NOT NULL,' +
    'google_map_api_key text NOT NULL,' +
    'google_login_auth_token text NOT NULL,' +
    'bgSong text NOT NULL,' +
    'bgVideo text NOT NULL,' +
    'bgSongDefaultPlay tinyint(1) NOT NULL,' +
    'bgVideoDefaultPlay tinyint(1) NOT NULL,' +
    'switchSongFeatureRequired char(1) NOT NULL,' +
    'switchVideoFeatureRequired char(1) NOT NULL,' +
    'switchThemeFeatureRequired char(1) NOT NULL,' +
    'logoImg text NOT NULL,' +
    'bannerImg text NOT NULL,' +
    'favIconImg text NOT NULL,' +
    'webLayoutType varchar(50) NOT NULL,' +
    'webMenuType varchar(50) NOT NULL,' +
    'webTheme varchar(15) NOT NULL,' +
    'webThemeColor varchar(15) NOT NULL,' +
    'webThemeBackground varchar(15) NOT NULL,' +
    'aws_s3_access_key_id text NOT NULL,' +
    'aws_s3_secret_access_key text NOT NULL,' +
    'aws_s3_bucket varchar(100) NOT NULL,' +
    'aws_s3_region text NOT NULL,' +
    'social_media_facebook text NOT NULL,' +
    'social_media_twitter text NOT NULL,' +
    'social_media_linkedIn text NOT NULL,' +
    'social_media_instagram text NOT NULL,' +
    'switchSocialMediaFeatureRequired char(1) NOT NULL,' +
    'PRIMARY KEY (config_id)' +
    ') ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8';
  await connection.query(createConfigTablesql, (err, res) => {
    if (err) {
      throw err;
    }
    console.log(CLPREFIX + 'Creating application configuration table..');
  });

  // 4. Add config data
  const addConfigsql = {
    config_id: '',
    web: 'yourdomain.com',
    email: 'support@yourdomain.com',
    google_map_api_key: ENCNIL,
    google_login_auth_token: ENCNIL,
    bgSong: 'aws/s3/root/audio/yoursong.mp3',
    bgVideo: 'aws/s3/root/videos/yourvideo.mp4',
    bgSongDefaultPlay: '0',
    bgVideoDefaultPlay: '1',
    switchSongFeatureRequired: '1',
    switchVideoFeatureRequired: '1',
    switchThemeFeatureRequired: '1',
    logoImg: 'aws/s3/root/images/samplelogo.png',
    bannerImg: 'aws/s3/root/images/samplebrand.png',
    favIconImg: 'aws/s3/root/images/FAV-ICON/64X64.png',
    webLayoutType: 'classic',
    webMenuType: 'topMenu',
    webTheme: 'dark',
    webThemeColor: '#000000',
    webThemeBackground: '#c2d82e',
    aws_s3_access_key_id: ENCNIL,
    aws_s3_secret_access_key: ENCNIL,
    aws_s3_bucket: 'awsS3BucketName',
    aws_s3_region: ENCNIL,
    social_media_facebook: 'https://www.facebook.com/your.id',
    social_media_twitter: 'https://twitter.com/your.id/',
    social_media_linkedIn: 'https://www.linkedin.com/in/your.id/',
    social_media_instagram: 'https://www.instagram.com/your.id/',
    switchSocialMediaFeatureRequired: '1',
  };
  await connection.query(
    'INSERT INTO az_config SET ?',
    addConfigsql,
    (err, res) => {
      if (err) {
        throw err;
      }
      console.log(CLPREFIX + 'Adding configuration data..');
    }
  );

  // 5. create users table
  const createUsersTablesql =
    'CREATE TABLE az_users (' +
    'user_id int(11) NOT NULL AUTO_INCREMENT,' +
    'user_name varchar(50) NOT NULL,' +
    'user_display_name varchar(25) NOT NULL,' +
    'user_profile_name varchar(50) NOT NULL,' +
    'user_password char(40) NOT NULL,' +
    'user_email varchar(100) NOT NULL,' +
    'user_mobile varchar(10) NOT NULL,' +
    'user_image_url varchar(100) NOT NULL,' +
    'user_type int(11) NOT NULL,' +
    'user_is_founder tinyint(1) NOT NULL,' +
    'user_last_login datetime NOT NULL,' +
    'user_current_login datetime NOT NULL,' +
    'user_otp char(6) NOT NULL,' +
    'user_otp_expiry int(11) NOT NULL,' +
    'PRIMARY KEY (user_id),' +
    'KEY userKey (user_type),' +
    'CONSTRAINT userKey FOREIGN KEY (user_type) REFERENCES az_access_levels (access_id) ON UPDATE CASCADE' +
    ') ENGINE=InnoDB AUTO_INCREMENT=100000 DEFAULT CHARSET=utf8';
  await connection.query(createUsersTablesql, (err, res) => {
    if (err) {
      throw err;
    }
    console.log(CLPREFIX + 'Creating users table..');
  });

  const addUserssql = [
    [
      '100000',
      'superadmin',
      'Display Name',
      'Profile Name',
      'f7876f0bc281ac72a2e4931438657287', // Success@123
      'youremail@mailbox.com',
      '9000012345',
      'aws/s3/images/yourAvatar.png',
      '1002',
      '1',
      '',
      '',
      '000000',
      '0',
    ],
  ];

  await connection.query(
    'INSERT INTO az_users (user_id,user_name,user_display_name,user_profile_name,user_password,user_email,user_mobile,user_image_url,user_type,user_is_founder,user_last_login,user_current_login,user_otp,user_otp_expiry) values ?',
    [addUserssql],
    (err, res) => {
      if (err) {
        throw err;
      }
      console.log(CLPREFIX + 'Adding a super admin as user..');
    }
  );

  // 6. create pages publication table
  const createPagesPublicationTablesql =
    'CREATE TABLE az_pages_publication_status (' +
    'pub_id int(11) NOT NULL AUTO_INCREMENT,' +
    'pub_name varchar(15) NOT NULL,' +
    'pub_value varchar(15) NOT NULL,' +
    'pub_verb varchar(15) NOT NULL,' +
    'PRIMARY KEY (pub_id)' +
    ') ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8';
  await connection.query(createPagesPublicationTablesql, (err, res) => {
    if (err) {
      throw err;
    }
    console.log(CLPREFIX + 'Creating pages publication table..');
  });

  const addPublicationStatusql = [
    ['10000', 'Saved', 'saved', 'Save'],
    ['10001', 'Published', 'published', 'Publish'],
    ['10002', 'Deleted', 'deleted', 'Delete'],
    ['10003', 'In-Active', 'inactive', 'In Activate'],
  ];

  await connection.query(
    'INSERT INTO az_pages_publication_status (pub_id, pub_name, pub_value, pub_verb) values ?',
    [addPublicationStatusql],
    (err, res) => {
      if (err) {
        throw err;
      }
      console.log(CLPREFIX + 'Adding publication config data..');
    }
  );

  // 6. create pages table
  const createPagesTablesql =
    'CREATE TABLE az_pages (' +
    'page_id int(11) NOT NULL AUTO_INCREMENT,' +
    'page_label varchar(25) NOT NULL,' +
    'page_route text NOT NULL,' +
    'page_object longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(page_object)),' +
    'page_meta longtext NOT NULL,' +
    'page_modified_by int(11) NOT NULL,' +
    'page_created_at datetime NOT NULL,' +
    'page_updated_at datetime NOT NULL,' +
    'page_status int(11) NOT NULL,' +
    'page_is_freezed char(1) NOT NULL,' +
    'PRIMARY KEY (page_id),' +
    'KEY pub_key (page_status),' +
    'KEY user_key (page_modified_by),' +
    'CONSTRAINT pub_key FOREIGN KEY (page_status) REFERENCES az_pages_publication_status (pub_id) ON UPDATE CASCADE,' +
    'CONSTRAINT user_key FOREIGN KEY (page_modified_by) REFERENCES az_users (user_id) ON UPDATE CASCADE' +
    ') ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8';
  await connection.query(createPagesTablesql, (err, res) => {
    if (err) {
      throw err;
    }
    console.log(CLPREFIX + 'Creating pages table..');
  });

  const addPageData = [
    [
      '10000',
      'Settings',
      '/settings',
      '{"key": "f297e017-8777-4883-a396-b28766613888", "props": {}, "title": "Hello Settings", "children": [], "component": "az-settings"}',
      '{"title": "Settings", "description": "", "keywords":""}',
      '100000',
      '',
      '',
      '10001',
      '1',
    ],
    [
      '10001',
      'Layout Design',
      '/layoutDesign',
      '{"key": "f297e017-8777-4883-a396-b28766613888", "props": {}, "title": "Hello Layout", "children": [], "component": "az-layoutDesign"}',
      '{"title": "Layout Design", "description": "", "keywords":""}',
      '100000',
      '',
      '',
      '10001',
      '1',
    ],
    [
      '10002',
      'Welcome',
      '/',
      '{"key": "f297e017-8777-4883-a396-b28766613888", "props": {"className":"mt-5 p-5 bg-danger text-center"}, "title": "Welcome to Awzy CMS", "children": [], "component": "H2"}',
      '{"title": "Awzy welcome page", "description": "This is the first entry point to configure awzy pages", "keywords":"awzy,awzy.org"}',
      '100000',
      '',
      '',
      '10001',
      '0',
    ],
  ];

  await connection.query(
    'INSERT INTO az_pages (page_id,page_label,page_route,page_object,page_meta,page_modified_by,page_created_at,page_updated_at,page_status,page_is_freezed) values ?',
    [addPageData],
    (err, res) => {
      if (err) {
        throw err;
      }
      console.log(CLPREFIX + 'Adding settings & layout design page..');
    }
  );

  // 7. create page access table
  const createPageAccessTablesql =
    'CREATE TABLE az_page_access (' +
    'page_access_index int(11) NOT NULL AUTO_INCREMENT,' +
    'access_id int(11) NOT NULL,' +
    'page_id int(11) NOT NULL,' +
    'PRIMARY KEY (page_access_index),' +
    'KEY accessKey (access_id),' +
    'KEY pageKey (page_id),' +
    'CONSTRAINT accessKey FOREIGN KEY (access_id) REFERENCES az_access_levels (access_id) ON UPDATE CASCADE,' +
    'CONSTRAINT pageKey FOREIGN KEY (page_id) REFERENCES az_pages (page_id) ON DELETE CASCADE ON UPDATE CASCADE' +
    ') ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8';
  await connection.query(createPageAccessTablesql, (err, res) => {
    if (err) {
      throw err;
    }
    console.log(CLPREFIX + 'Creating page access table..');
  });

  const addPageAccessData = [
    ['1000', '1002', '10000'],
    ['1001', '1002', '10001'],
    ['1002', '1001', '10002'],
    ['1003', '1002', '10002'],
  ];

  await connection.query(
    'INSERT INTO az_page_access (page_access_index,access_id,page_id) values ?',
    [addPageAccessData],
    (err, res) => {
      if (err) {
        throw err;
      }
      console.log(CLPREFIX + 'Adding page access rights..');
      console.log(' ----------------------------------');
      console.log(
        CLPREFIX + 'You have successfully installed awzy database setup, Now'
      );
      console.log('');
      console.log(
        CLPREFIX +
          '1. Start nginx (Windows: Double click ./nginx/nginx.exe) | Mac: Run "nginx start" in ./nginx directory on your terminal'
      );
      console.log(CLPREFIX + '2. Run "npm run start" in your terminal');
      console.log(
        CLPREFIX +
          '3. Open "http://localhost:5000" in your browser to run AWZY CMS.'
      );
      console.log(
        CLPREFIX +
          '4. Once application is read, click the top right grid icon to login as super admin to add, edit or delete pages.'
      );
      console.log(
        CLPREFIX + '5. User name: "superadmin" & Password: "Success@123"'
      );
      console.log(
        CLPREFIX + 'For more information, see the readme.md file. Happy CMS...'
      );
    }
  );

  connection.end();
})();
