<?php
if (!defined('BASEPATH')) {
    exit('No direct script access allowed');
}
/*
| -------------------------------------------------------------------------
| URI ROUTING
| -------------------------------------------------------------------------
| This file lets you re-map URI requests to specific controller functions.
|
| Typically there is a one-to-one relationship between a URL string
| and its corresponding controller class/method. The segments in a
| URL normally follow this pattern:
|
|	example.com/class/method/id/
|
| In some instances, however, you may want to remap this relationship
| so that a different class/function is called than the one
| corresponding to the URL.
|
| Please see the user guide for complete details:
|
|	http://codeigniter.com/user_guide/general/routing.html
|
| -------------------------------------------------------------------------
| RESERVED ROUTES
| -------------------------------------------------------------------------
|
| There area two reserved routes:
|
|	$route['default_controller'] = 'welcome';
|
| This route indicates which controller class should be loaded if the
| URI contains no data. In the above example, the "welcome" class
| would be loaded.
|
|	$route['404_override'] = 'errors/page_missing';
|
| This route will tell the Router what URI segments to use if those provided
| in the URL cannot be matched to a valid route.
|
*/

$route['default_controller'] = 'home';
$route['404_override'] = '';
// cms
$route['getPages'] = 'cms/cms/getPages';
$route['getConfigPages'] = 'cms/cms/getConfigPages';
$route['getPageStatuses'] = 'cms/cms/getPageStatuses';
$route['getConfigPageDetails'] = 'cms/cms/getConfigPageDetails';
$route['createPage'] = 'cms/cms/createPage';
$route['updatePage'] = 'cms/cms/updatePage';
$route['deletePage'] = 'cms/cms/deletePage';
$route['getAccessLevels'] = 'cms/cms/getAccessLevels';
$route['deleteAccessLevel'] = 'cms/cms/deleteAccessLevel';
$route['saveOrUpdateAccessLevel'] = 'cms/cms/saveOrUpdateAccessLevel';
$route['createTable'] = 'cms/cms/createTable';
$route['getTables'] = 'cms/cms/getTables';
$route['renameTable'] = 'cms/cms/renameTable';
$route['tableEmptyOrDrop'] = 'cms/cms/tableEmptyOrDrop';
$route['getTableInfo'] = 'cms/cms/getTableInfo';
$route['dropTableColumn'] = 'cms/cms/dropTableColumn';

// users and config
$route['postBackend'] = 'home/postBackend';
$route['fetchAccessLevels'] = 'home/fetchAccessLevels';
$route['fetchUsers'] = 'home/fetchUsers';
$route['validateUser'] = 'home/validateUser';
$route['checkUserExists'] = 'home/checkUserExists';
$route['changePassword'] = 'home/changePassword';
$route['resetPassword'] = 'home/resetPassword';
$route['sendOtp'] = 'home/sendOtp';
$route['getBackend'] = 'home/getBackend';
$route['sendUserInfo'] = 'home/sendUserInfo';

/* End of file routes.php */
/* Location: ./application/config/routes.php */
