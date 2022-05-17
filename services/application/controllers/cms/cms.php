<?php
defined('BASEPATH') or exit('No direct script access allowed');
class cms extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->dbforge();
        $this->load->model('cms_model');
        $this->load->library('../controllers/auth');
    }
    public function getPages()
    {
        $validate = $this->auth->validateAll();
        if ($validate === 2) {
            $this->auth->invalidTokenResponse();
        }
        if ($validate === 3) {
            $this->auth->invalidDomainResponse();
        }
        if ($validate === 1) {
            $data = $this->cms_model->getPages();
            $newData = [];
            for ($i = 0; $i < count($data); $i++) {
                for ($j = 0; $j < count($data[$i]); $j++) {
                    $newData[$i]['page_id'] = $data[$i]['page_id'];
                    $newData[$i]['label'] = $data[$i]['label'];
                    $newData[$i]['href'] = $data[$i]['href'];
                    $newData[$i]['hasAccessTo'] = json_decode(
                        json_encode(explode(',', $data[$i]['hasAccessTo']))
                    );
                }
            }
            $massagedData['response'] = $newData;
            $this->auth->response($massagedData, [], 200);
        }
    }
    public function getConfigPages()
    {
        $validate = $this->auth->validateAll();
        if ($validate === 2) {
            $this->auth->invalidTokenResponse();
        }
        if ($validate === 3) {
            $this->auth->invalidDomainResponse();
        }
        if ($validate === 1) {
            $data['response'] = $this->cms_model->getConfigPages();
            $this->auth->response($data, [], 200);
        }
    }
    public function getConfigPageDetails()
    {
        $validate = $this->auth->validateAll();
        if ($validate === 2) {
            $this->auth->invalidTokenResponse();
        }
        if ($validate === 3) {
            $this->auth->invalidDomainResponse();
        }
        if ($validate === 1) {
            $post = [
                'pageId' => $this->input->post('pageId'),
            ];
            $result = $this->cms_model->getConfigPageDetails($post);
            $object = new stdClass();
            $object->pageId = $result->pageId;
            $object->pageRoute = $result->pageRoute;
            $object->pageLabel = $result->pageLabel;
            $object->pageStatus = $result->pageStatus;
            $object->pageObject = json_decode($result->pageObject);
            $object->pageModifiedBy = $result->pageModifiedBy;
            $object->pageCreatedAt = $result->pageCreatedAt;
            $object->pageUpdatedAt = $result->pageUpdatedAt;
            $object->hasAccessTo = explode(',', $result->hasAccessTo);
            $data['response'] = $object;
            $this->auth->response($data, [], 200);
        }
    }
    public function getPageStatuses()
    {
        $validate = $this->auth->validateAll();
        if ($validate === 2) {
            $this->auth->invalidTokenResponse();
        }
        if ($validate === 3) {
            $this->auth->invalidDomainResponse();
        }
        if ($validate === 1) {
            $data['response'] = $this->cms_model->getPageStatuses();
            $this->auth->response($data, [], 200);
        }
    }
    public function getAccessLevels()
    {
        $validate = $this->auth->validateAll();
        if ($validate === 2) {
            $this->auth->invalidTokenResponse();
        }
        if ($validate === 3) {
            $this->auth->invalidDomainResponse();
        }
        if ($validate === 1) {
            $data['response'] = $this->cms_model->getAccessLevels();
            $this->auth->response($data, [], 200);
        }
    }
    public function deleteAccessLevel()
    {
        $validate = $this->auth->validateAll();
        if ($validate === 2) {
            $this->auth->invalidTokenResponse();
        }
        if ($validate === 3) {
            $this->auth->invalidDomainResponse();
        }
        if ($validate === 1) {
            $post = [
                'accessId' => $this->input->post('accessId'),
            ];
            $data['response'] = $this->cms_model->deleteAccessLevel($post);
            $this->auth->response($data, [], 200);
        }
    }
    public function saveOrUpdateAccessLevel()
    {
        $validate = $this->auth->validateAll();
        if ($validate === 2) {
            $this->auth->invalidTokenResponse();
        }
        if ($validate === 3) {
            $this->auth->invalidDomainResponse();
        }
        if ($validate === 1) {
            $post = [
                'accessId' => $this->input->post('accessId'),
                'accessLabel' => $this->input->post('accessLabel'),
                'accessValue' => $this->input->post('accessValue'),
            ];
            $data['response'] = $this->cms_model->saveOrUpdateAccessLevel(
                $post
            );
            $this->auth->response($data, [], 200);
        }
    }

    public function createPage()
    {
        $validate = $this->auth->validateAll();
        if ($validate === 2) {
            $this->auth->invalidTokenResponse();
        }
        if ($validate === 3) {
            $this->auth->invalidDomainResponse();
        }
        if ($validate === 1) {
            $post = [
                'postData' => $this->input->post('postData'),
            ];
            $data['response'] = $this->cms_model->createPage($post);
            $this->auth->response($data, [], 200);
        }
    }
    public function updatePage()
    {
        $validate = $this->auth->validateAll();
        if ($validate === 2) {
            $this->auth->invalidTokenResponse();
        }
        if ($validate === 3) {
            $this->auth->invalidDomainResponse();
        }
        if ($validate === 1) {
            $post = $this->input->post('postData');
            $data['response'] = $this->cms_model->updatePage($post);
            $this->auth->response($data, [], 200);
        }
    }
    public function deletePage()
    {
        $validate = $this->auth->validateAll();
        if ($validate === 2) {
            $this->auth->invalidTokenResponse();
        }
        if ($validate === 3) {
            $this->auth->invalidDomainResponse();
        }
        if ($validate === 1) {
            $post = $this->input->post('deleteData');
            $data['response'] = $this->cms_model->deletePage($post);
            $this->auth->response($data, [], 200);
        }
    }

    public function getFieldData($options, $key)
    {
        $data = array_merge(...json_decode(json_encode($options), true));
        return array_key_exists($key, $data) ? $data[$key] : false;
    }

    public function createTable()
    {
        $validate = $this->auth->validateAll();
        if ($validate === 2) {
            $this->auth->invalidTokenResponse();
        }
        if ($validate === 3) {
            $this->auth->invalidDomainResponse();
        }
        if ($validate === 1) {
            $table = $this->input->post('table');
            $fields = json_decode($this->input->post('fields'));

            $fieldArray = [];
            foreach ($fields as $row) {
                $fieldArray[$row->field] = [
                    'type' => $row->type,
                    'constraint' => !empty($row->constraint)
                        ? $row->constraint
                        : false,
                    'auto_increment' =>
                        count($row->options) > 0
                            ? $this->getFieldData(
                                $row->options,
                                'auto_increment'
                            )
                            : false,
                    'unsigned' =>
                        count($row->options) > 0
                            ? $this->getFieldData($row->options, 'unsigned')
                            : false,
                    'default' =>
                        count($row->options) > 0
                            ? $this->getFieldData($row->options, 'default')
                            : false,
                    'null' =>
                        count($row->options) > 0
                            ? $this->getFieldData($row->options, 'null')
                            : false,
                ];
                $fieldArray[$row->field] = array_filter(
                    $fieldArray[$row->field]
                );
            }

            $keys = [];
            foreach ($fields as $row) {
                $keys[$row->field] =
                    count($row->keys) > 0 ? $row->keys[0] : false;
            }
            $filteredKeys = array_filter($keys);

            $this->dbforge->add_field($fieldArray);
            foreach ($filteredKeys as $k => $v) {
                $this->dbforge->add_key($k, $v === 'primaryKey' ? true : false);
            }

            if ($this->dbforge->create_table($table, true)) {
                $data['response'] = true;
            } else {
                $data['response'] = false;
            }
            $this->auth->response($data, [], 200);
        }
    }

    public function getTables()
    {
        $validate = $this->auth->validateAll();
        if ($validate === 2) {
            $this->auth->invalidTokenResponse();
        }
        if ($validate === 3) {
            $this->auth->invalidDomainResponse();
        }
        if ($validate === 1) {
            $data['response'] = $this->cms_model->getTables();
            $this->auth->response($data, [], 200);
        }
    }

    public function renameTable()
    {
        $validate = $this->auth->validateAll();
        if ($validate === 2) {
            $this->auth->invalidTokenResponse();
        }
        if ($validate === 3) {
            $this->auth->invalidDomainResponse();
        }
        if ($validate === 1) {
            $oldLabel = $this->input->post('oldLabel');
            $newLabel = $this->input->post('newLabel');
            if (isset($oldLabel) && isset($newLabel)) {
                if ($this->dbforge->rename_table($oldLabel, $newLabel)) {
                    $data['response'] = true;
                } else {
                    $data['response'] = false;
                }
            } else {
                $data['response'] = false;
            }
            $this->auth->response($data, [], 200);
        }
    }

    public function tableEmptyOrDrop()
    {
        $validate = $this->auth->validateAll();
        if ($validate === 2) {
            $this->auth->invalidTokenResponse();
        }
        if ($validate === 3) {
            $this->auth->invalidDomainResponse();
        }
        if ($validate === 1) {
            $action = $this->input->post('action');
            $table = $this->input->post('table');
            if ($action === 'drop') {
                if ($this->dbforge->drop_table($table)) {
                    $data['response'] = true;
                } else {
                    $data['response'] = false;
                }
            }
            if ($action === 'empty') {
                $data['response'] = $this->cms_model->truncateTable($table);
            }
            $this->auth->response($data, [], 200);
        }
    }

    public function getTableInfo()
    {
        $validate = $this->auth->validateAll();
        if ($validate === 2) {
            $this->auth->invalidTokenResponse();
        }
        if ($validate === 3) {
            $this->auth->invalidDomainResponse();
        }
        if ($validate === 1) {
            $table = $this->input->post('table');
            $info = $this->cms_model->getTableInfo($table);
            $records = $this->cms_model->getTableRecords($table);
            $data['response'] = ['info' => $info, 'records' => $records];
            $this->auth->response($data, [], 200);
        }
    }

    public function dropTableColumn()
    {
        $validate = $this->auth->validateAll();
        if ($validate === 2) {
            $this->auth->invalidTokenResponse();
        }
        if ($validate === 3) {
            $this->auth->invalidDomainResponse();
        }
        if ($validate === 1) {
            $table = $this->input->post('table');
            $field = $this->input->post('field');
            if ($this->dbforge->drop_column($table, $field)) {
                $data['response'] = true;
            } else {
                $data['response'] = false;
            }
            $this->auth->response($data, [], 200);
        }
    }

    public function updateTableColumn()
    {
        $validate = $this->auth->validateAll();
        if ($validate === 2) {
            $this->auth->invalidTokenResponse();
        }
        if ($validate === 3) {
            $this->auth->invalidDomainResponse();
        }
        if ($validate === 1) {
            $table = $this->input->post('table');
            $fields = json_decode($this->input->post('fields'));

            $fieldArray = [];
            foreach ($fields as $row) {
                $fieldArray[$row->oldField] = [
                    'type' => $row->type,
                    'name' => $row->field,
                    'constraint' => !empty($row->constraint)
                        ? $row->constraint
                        : false,
                    'auto_increment' =>
                        count($row->options) > 0
                            ? $this->getFieldData(
                                $row->options,
                                'auto_increment'
                            )
                            : false,
                    'unsigned' =>
                        count($row->options) > 0
                            ? $this->getFieldData($row->options, 'unsigned')
                            : false,
                    'default' =>
                        count($row->options) > 0
                            ? $this->getFieldData($row->options, 'default')
                            : false,
                    'null' =>
                        count($row->options) > 0
                            ? $this->getFieldData($row->options, 'null')
                            : false,
                ];
                $fieldArray[$row->oldField] = array_filter(
                    $fieldArray[$row->oldField]
                );
            }

            if ($this->dbforge->modify_column($table, $fieldArray)) {
                $data['response'] = true;
            } else {
                $data['response'] = false;
            }
            $this->auth->response($data, [], 200);
        }
    }

    public function addTableColumn()
    {
        $validate = $this->auth->validateAll();
        if ($validate === 2) {
            $this->auth->invalidTokenResponse();
        }
        if ($validate === 3) {
            $this->auth->invalidDomainResponse();
        }
        if ($validate === 1) {
            $table = $this->input->post('table');
            $fields = json_decode($this->input->post('fields'));

            $fieldArray = [];
            foreach ($fields as $row) {
                $fieldArray[$row->field] = [
                    'type' => $row->type,
                    'constraint' => !empty($row->constraint)
                        ? $row->constraint
                        : false,
                    'auto_increment' =>
                        count($row->options) > 0
                            ? $this->getFieldData(
                                $row->options,
                                'auto_increment'
                            )
                            : false,
                    'unsigned' =>
                        count($row->options) > 0
                            ? $this->getFieldData($row->options, 'unsigned')
                            : false,
                    'default' =>
                        count($row->options) > 0
                            ? $this->getFieldData($row->options, 'default')
                            : false,
                    'null' =>
                        count($row->options) > 0
                            ? $this->getFieldData($row->options, 'null')
                            : false,
                ];
                $fieldArray[$row->field] = array_filter(
                    $fieldArray[$row->field]
                );
            }

            if ($this->dbforge->add_column($table, $fieldArray)) {
                $data['response'] = true;
            } else {
                $data['response'] = false;
            }
            $this->auth->response($data, [], 200);
        }
    }

    public function postAjaxForm()
    {
        $validate = $this->auth->validateAll();
        if ($validate === 2) {
            $this->auth->invalidTokenResponse();
        }
        if ($validate === 3) {
            $this->auth->invalidDomainResponse();
        }
        if ($validate === 1) {
            $table = $this->input->post('table');
            $fields = $this->input->post('fields');
            if (isset($fields) && isset($table)) {
                $arr = json_decode($fields, true);
                if (is_array($arr)) {
                    $fieldArray = [];
                    foreach ($arr as $row) {
                        $fieldArray[$row['field']] = $row['value'];
                    }
                    $data['response'] = $this->cms_model->postAjaxForm(
                        $table,
                        $fieldArray
                    );
                    $this->auth->response($data, [], 200);
                }
            }
        }
    }
}
