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
        $this->check = $this->auth->validateToken();
    }
    public function getPages()
    {
        if ($this->check['status'] === 'success') {
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
            $this->auth->response($massagedData, []);
        } else {
            $this->auth->tokenException($this->check);
        }
    }
    public function getConfigPages()
    {
        if ($this->check['status'] === 'success') {
            $data['response'] = $this->cms_model->getConfigPages();
            $this->auth->response($data, []);
        } else {
            $this->auth->tokenException($this->check);
        }
    }
    public function getConfigPageDetails()
    {
        if ($this->check['status'] === 'success') {
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
            $object->pageMeta = json_decode($result->pageMeta);
            $object->pageModifiedBy = $result->pageModifiedBy;
            $object->pageCreatedAt = $result->pageCreatedAt;
            $object->pageUpdatedAt = $result->pageUpdatedAt;
            $object->hasAccessTo = explode(',', $result->hasAccessTo);
            $data['response'] = $object;
            $this->auth->response($data);
        } else {
            $this->auth->tokenException($this->check);
        }
    }
    public function getPageStatuses()
    {
        if ($this->check['status'] === 'success') {
            $data['response'] = $this->cms_model->getPageStatuses();
            $this->auth->response($data, []);
        } else {
            $this->auth->tokenException($this->check);
        }
    }
    public function getAccessLevels()
    {
        if ($this->check['status'] === 'success') {
            $data['response'] = $this->cms_model->getAccessLevels();
            $this->auth->response($data, []);
        } else {
            $this->auth->tokenException($this->check);
        }
    }
    public function deleteAccessLevel()
    {
        if ($this->check['status'] === 'success') {
            $post = [
                'accessId' => $this->input->post('accessId'),
            ];
            $data['response'] = $this->cms_model->deleteAccessLevel($post);
            $this->auth->response($data, []);
        } else {
            $this->auth->tokenException($this->check);
        }
    }
    public function saveOrUpdateAccessLevel()
    {
        if ($this->check['status'] === 'success') {
            $post = [
                'accessId' => $this->input->post('accessId'),
                'accessLabel' => $this->input->post('accessLabel'),
                'accessValue' => $this->input->post('accessValue'),
            ];
            $data['response'] = $this->cms_model->saveOrUpdateAccessLevel(
                $post
            );
            $this->auth->response($data, []);
        } else {
            $this->auth->tokenException($this->check);
        }
    }

    public function createPage()
    {
        if ($this->check['status'] === 'success') {
            $post = [
                'postData' => $this->input->post('postData'),
            ];
            $data['response'] = $this->cms_model->createPage($post);
            $this->auth->response($data, []);
        } else {
            $this->auth->tokenException($this->check);
        }
    }

    public function updatePage()
    {
        if ($this->check['status'] === 'success') {
            $post = $this->input->post('postData');
            $data['response'] = $this->cms_model->updatePage($post);
            $this->auth->response($data, []);
        } else {
            $this->auth->tokenException($this->check);
        }
    }

    public function deletePage()
    {
        if ($this->check['status'] === 'success') {
            $post = $this->input->post('deleteData');
            $data['response'] = $this->cms_model->deletePage($post);
            $this->auth->response($data, []);
        } else {
            $this->auth->tokenException($this->check);
        }
    }

    public function getFieldData($options, $key)
    {
        $data = array_merge(...json_decode(json_encode($options), true));
        return array_key_exists($key, $data) ? $data[$key] : false;
    }

    public function createTable()
    {
        if ($this->check['status'] === 'success') {
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
            $this->auth->response($data, []);
        } else {
            $this->auth->tokenException($this->check);
        }
    }

    public function getTables()
    {
        if ($this->check['status'] === 'success') {
            $data['response'] = $this->cms_model->getTables();
            $this->auth->response($data, []);
        } else {
            $this->auth->tokenException($this->check);
        }
    }

    public function renameTable()
    {
        if ($this->check['status'] === 'success') {
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
            $this->auth->response($data, []);
        } else {
            $this->auth->tokenException($this->check);
        }
    }

    public function tableEmptyOrDrop()
    {
        if ($this->check['status'] === 'success') {
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
            $this->auth->response($data, []);
        } else {
            $this->auth->tokenException($this->check);
        }
    }

    public function getTableInfo()
    {
        if ($this->check['status'] === 'success') {
            $table = $this->input->post('table');
            $info = $this->cms_model->getTableInfo($table);
            $records = $this->cms_model->getTableRecords($table);
            $data['response'] = ['info' => $info, 'records' => $records];
            $this->auth->response($data, []);
        } else {
            $this->auth->tokenException($this->check);
        }
    }

    public function dropTableColumn()
    {
        if ($this->check['status'] === 'success') {
            $table = $this->input->post('table');
            $field = $this->input->post('field');
            if ($this->dbforge->drop_column($table, $field)) {
                $data['response'] = true;
            } else {
                $data['response'] = false;
            }
            $this->auth->response($data, []);
        } else {
            $this->auth->tokenException($this->check);
        }
    }

    public function updateTableColumn()
    {
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
                        ? $this->getFieldData($row->options, 'auto_increment')
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
        $this->auth->response($data, []);
    }

    public function addTableColumn()
    {
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
                        ? $this->getFieldData($row->options, 'auto_increment')
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
            $fieldArray[$row->field] = array_filter($fieldArray[$row->field]);
        }

        if ($this->dbforge->add_column($table, $fieldArray)) {
            $data['response'] = true;
        } else {
            $data['response'] = false;
        }
        $this->auth->response($data, []);
    }

    public function postAjaxForm()
    {
        if ($this->check['status'] === 'success') {
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
                    $this->auth->response($data, []);
                }
            }
        } else {
            $this->auth->tokenException($this->check);
        }
    }
    public function ajaxFetch()
    {
        if ($this->check['status'] === 'success') {
            $post = $this->input->post('query');
            if (isset($post)) {
                $query = json_decode($post, true);
                $data['response'] = $this->cms_model->ajaxFetch($query);
            } else {
                $data['response'] = [];
            }
            $this->auth->response($data, []);
        } else {
            $this->auth->tokenException($this->check);
        }
    }
}
