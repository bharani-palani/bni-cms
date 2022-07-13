const showBanner = require('node-banner');
const mysql = require('mysql');
const md5 = require('md5');
const moment = require('moment');

const DB = 'awzy';
const TITLE = 'AWZY';
const TITLECOLOR = 'green';
const SUBTITLE = 'Welcome to simplified headless CMS';
const SUBTITLECOLOR = 'red';
const CLPREFIX = '> ';
const ENCNIL = 'U2FsdGVkX1+YToNGHBREr5YPCY+XjeiGuxMTeYWEeXg=';
const NOW = moment(new Date(), 'YYYY/MMM/DD').format('YYYY-MM-DD:HH:mm:ss');
const WEBTHEMECOLOR = '#000000';
const WEBTHEMEBACKGROUND = '#AAAAAA';

const config = process.argv.slice(2);

let params = config.map(c => {
  const pieces = c.split('=');
  return {
    [pieces[0]]: pieces[1],
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
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
        'Error in establishing mysql connection.. Please check your repo is inside the htdocs directory..'
      );
      throw err;
    }
    console.log(' ----------------------------------');
    console.log(CLPREFIX + 'Mysql connection successfully established');
  });

  // 1. create database
  const createDbSql = `DROP DATABASE IF EXISTS ${DB}; CREATE DATABASE ${DB}`;
  await connection.query(createDbSql, (err, res) => {
    if (err) {
      throw err;
    }
    console.log(CLPREFIX + 'Database created');
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
    console.log(CLPREFIX + 'Creating access level table');
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
      console.log(CLPREFIX + 'Adding access config data');
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
    'facebook_app_id text NOT NULL,' +
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
    console.log(CLPREFIX + 'Creating application configuration table');
  });

  // 4. Add config data
  const addConfigsql = {
    config_id: 1,
    web: 'yourdomain.com',
    email: 'support@yourdomain.com',
    google_map_api_key: ENCNIL,
    google_login_auth_token: ENCNIL,
    facebook_app_id: ENCNIL,
    bgSong: 'aws/s3/root/audio/yoursong.mp3',
    bgVideo: 'aws/s3/root/videos/yourvideo.mp4',
    bgSongDefaultPlay: '0',
    bgVideoDefaultPlay: '0',
    switchSongFeatureRequired: '1',
    switchVideoFeatureRequired: '1',
    switchThemeFeatureRequired: '1',
    logoImg: 'aws/s3/root/images/samplelogo.png',
    bannerImg: 'aws/s3/root/images/samplebrand.png',
    favIconImg: 'aws/s3/root/images/FAV-ICON/64X64.png',
    webLayoutType: 'classic',
    webMenuType: 'topMenu',
    webTheme: 'dark',
    webThemeColor: WEBTHEMECOLOR,
    webThemeBackground: WEBTHEMEBACKGROUND,
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
      console.log(CLPREFIX + 'Adding configuration data');
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
    'user_is_founder tinyint(1) NOT NULL DEFAULT 0,' +
    'user_last_login datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,' +
    'user_current_login datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,' +
    'user_otp char(6) NOT NULL DEFAULT "000000",' +
    'user_otp_expiry int(11) NOT NULL DEFAULT 0,' +
    'PRIMARY KEY (user_id),' +
    'KEY userKey (user_type),' +
    'CONSTRAINT userKey FOREIGN KEY (user_type) REFERENCES az_access_levels (access_id) ON UPDATE CASCADE' +
    ') ENGINE=InnoDB AUTO_INCREMENT=100000 DEFAULT CHARSET=utf8';
  await connection.query(createUsersTablesql, (err, res) => {
    if (err) {
      throw err;
    }
    console.log(CLPREFIX + 'Creating users table');
  });

  const addUserssql = [
    [
      '100000',
      params.username,
      params.username.toUpperCase(),
      'Super Admin Profile Name',
      md5(params.userpassword),
      'superAdminEmail@mailbox.com',
      '9000012345',
      'aws/s3/images/superAdminAvatar.png',
      '1002',
      '1',
      NOW,
      NOW,
      '000000',
      '0',
    ],
    [
      '100001',
      'admin',
      'ADMIN',
      'Admin Profile Name',
      md5(params.userpassword),
      'adminEmail@mailbox.com',
      '9000056789',
      'aws/s3/images/adminAvatar.png',
      '1003',
      '0',
      NOW,
      NOW,
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
      console.log(CLPREFIX + 'Adding a super admin and admin as users');
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
    console.log(CLPREFIX + 'Creating pages publication table');
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
      console.log(CLPREFIX + 'Adding publication config data');
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
    console.log(CLPREFIX + 'Creating pages table');
  });

  const welcomeKit =
    '{"key":"f297e017-8777-4883-a396-b28766613888","props":{"className":"mt-5 p-2 w-100 border-1","style":{}},"title":"div","children":[{"key":"9e236640-0648-4397-b158-6bdf0b2ac978","props":{"className":"p-3 text-center animated-border"},"children":[],"component":"H3","title":"Welcome to Awzy CMS"},{"key":"27e27c64-771d-40ec-85d5-a2120d26ed3f","props":{"className":"text-center"},"children":[],"component":"P","title":"Your first sample page"},{"key":"c11f0739-ee2e-496b-84c2-e22a7e173eec","props":{"as":"ol","numbered":"true"},"children":[{"key":"29d4a6f7-b37d-472d-bc03-2f8c02e55901","props":{"as":"li"},"children":[],"component":"BootstrapListGroupItem","title":"Start adding pages on selecting the +Add Page option from Pages drop down.."},{"key":"70ab83fe-8b58-4d5d-a1f0-e9af9bdc6ffc","props":{"as":"li"},"children":[],"component":"BootstrapListGroupItem","title":"Click the ? help icon (right pane) for documentation, to handle components in your page."},{"key":"57f14e98-9bf8-4cb4-a5ae-556de26e436d","props":{"as":"li"},"children":[],"component":"BootstrapListGroupItem","title":"Use the Preview & Tree tabs to view changes on the fly."},{"key":"7d129205-e122-4159-945e-68407e51b82e","props":{"as":"li"},"children":[],"component":"BootstrapListGroupItem","title":"Once components added, don`t forget to Save & Publish your page. Create n number of pages as you wish."},{"key":"ed7707aa-b197-42c2-8e1e-97f517d683f7","props":{"as":"li"},"children":[],"component":"BootstrapListGroupItem","title":"Happy CMS.."}],"component":"BootstrapListGroup","title":"ListGroup"},{"key":"172760c2-6bc5-4991-861e-f78b1390f647","props":{"className":"text-end py-2"},"children":[{"key":"97ae9274-f039-438b-82ab-3e67585e4fa9","props":{"href":"https://awzy.org/documentation","target":"_blank","className":"link-info","style":{"fontSize":"12px"}},"children":[],"component":"A","title":"https://awzy.org/documentation"}],"component":"Div","title":"Div"}],"component":"Div"}';
  const addPageData = [
    [
      '10000',
      'Settings',
      '/settings',
      '{"key": "f297e017-8777-4883-a396-b28766613888", "props": {}, "title": "Hello Settings", "children": [], "component": "az-settings"}',
      '{"title": "Settings", "description": "", "keywords":""}',
      '100000',
      NOW,
      NOW,
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
      NOW,
      NOW,
      '10001',
      '1',
    ],
    [
      '10002',
      'Welcome',
      '/',
      welcomeKit,
      '{"title": "Awzy welcome page", "description": "This is the first entry point to configure awzy pages", "keywords":"awzy,awzy.org"}',
      '100000',
      NOW,
      NOW,
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
      console.log(CLPREFIX + 'Adding settings & layout design page');
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
    console.log(CLPREFIX + 'Creating page access table');
  });

  const addPageAccessData = [
    ['100', '1002', '10000'], // super admin settings
    ['101', '1002', '10001'], // super admin layout
    ['102', '1003', '10001'], // admin layout
    ['103', '1001', '10002'], // Welcome public
    ['104', '1002', '10002'], // Welcome super admin
    ['105', '1003', '10002'], // Welcome admin
  ];

  await connection.query(
    'INSERT INTO az_page_access (page_access_index,access_id,page_id) values ?',
    [addPageAccessData],
    (err, res) => {
      if (err) {
        throw err;
      }
      console.log(CLPREFIX + 'Adding page access rights');
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
        CLPREFIX + 'For more information, see the readme.md file. Happy awzy CMS...'
      );
    }
  );

  connection.end();
})();
