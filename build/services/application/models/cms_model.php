<?php
if (!defined('BASEPATH')) {
    exit('No direct script access allowed');
}
class cms_model extends CI_Model
{
    public function __construct()
    {
        parent::__construct();
        $this->db = $this->load->database('default', true);
        $this->db->_protect_identifiers = false;
    }

    public function getPages()
    {
        $this->db
            ->select(
                [
                    'a.page_id as page_id',
                    'a.page_label as label',
                    'a.page_route as href',
                    'GROUP_CONCAT(d.access_value SEPARATOR ",") as hasAccessTo',
                ],
                false
            )
            ->from('az_pages as a')
            ->join(
                'az_pages_publication_status as b',
                'a.page_status = b.pub_id'
            )
            ->join('az_page_access as c', 'c.page_id = a.page_id')
            ->join('az_access_levels as d', 'd.access_id = c.access_id')
            ->where('b.pub_value', 'published')
            ->group_by(['a.page_id']);
        $query = $this->db->get();
        return get_all_rows($query);
    }
    public function getConfigPages()
    {
        $this->db
            ->select(
                ['a.page_id as pageId', 'a.page_label as pageLabel'],
                false
            )
            ->from('az_pages as a')
            ->join(
                'az_pages_publication_status as c',
                'a.page_status = c.pub_id'
            )
            ->where('a.page_is_freezed', '0')
            ->where_in('c.pub_value', ['published', 'saved', 'inactive'])
            ->order_by('a.page_created_at', 'asc');
        $query = $this->db->get();
        return get_all_rows($query);
    }
    public function getConfigPageDetails($post)
    {
        $this->db
            ->select(
                [
                    'a.page_id as pageId',
                    'a.page_route as pageRoute',
                    'a.page_label as pageLabel',
                    'a.page_object as pageObject',
                    'a.page_meta as pageMeta',
                    'a.page_status as pageStatus',
                    'b.user_display_name as pageModifiedBy',
                    'a.page_created_at as pageCreatedAt',
                    'a.page_updated_at as pageUpdatedAt',
                    'GROUP_CONCAT(d.access_id SEPARATOR ",") as hasAccessTo',
                ],
                false
            )
            ->from('az_pages as a')
            ->join('az_users as b', 'a.page_modified_by = b.user_id')
            ->join('az_page_access as c', 'c.page_id = a.page_id')
            ->join('az_access_levels as d', 'd.access_id = c.access_id')
            ->join(
                'az_pages_publication_status as e',
                'a.page_status = e.pub_id'
            )
            // ->where('a.page_is_freezed', '0')
            ->where('a.page_id', $post['pageId'])
            ->where_in('e.pub_value', ['published', 'saved', 'inactive']);
        $query = $this->db->get();
        return $query->row();
    }
    public function getPageStatuses()
    {
        $query = $this->db->get('az_pages_publication_status');
        return get_all_rows($query);
    }
    public function getAccessLevels()
    {
        $this->db->select([
            'access_id as accessId',
            'access_value as accessValue',
            'access_label as accessLabel',
        ]);
        $query = $this->db->get('az_access_levels');
        return get_all_rows($query);
    }
    public function deleteAccessLevel($post)
    {
        if (
            $this->db->delete('az_access_levels', [
                'access_id' => $post['accessId'],
            ])
        ) {
            return true;
        } else {
            return false;
        }
    }
    public function saveOrUpdateAccessLevel($post)
    {
        if (
            isset($post['accessId']) &&
            isset($post['accessValue']) &&
            isset($post['accessLabel'])
        ) {
            if ($post['accessId'] === '') {
                $this->db->insert('az_access_levels', [
                    'access_id ' => NULL,
                    'access_value ' => $post['accessValue'],
                    'access_label ' => $post['accessLabel'],
                ]);
            } else {
                $this->db->where('access_id', $post['accessId']);
                $this->db->update('az_access_levels', [
                    'access_value ' => $post['accessValue'],
                    'access_label ' => $post['accessLabel'],
                ]);
            }
            return $this->db->affected_rows() > 0;
        }
    }
    public function getPagedataFromId($pageId)
    {
        $data = $this->getConfigPageDetails(['pageId' => $pageId]);
        return $data->pageObject;
    }
    public function createPage($post)
    {
        $post = json_decode($post['postData']);
        $this->db->trans_start();
        // Note: This isset is very important for checking. Dont remove this. Else, api will throw CORS exception
        if (isset($post->pageLabel)) {
            $this->db->insert('az_pages', [
                'page_id' => NULL,
                'page_label' => $post->pageLabel,
                'page_route' => $post->pageRoute,
                'page_object' => empty($post->cloneId)
                    ? json_encode($post->pageObject)
                    : $this->getPagedataFromId($post->cloneId),
                'page_meta' => json_encode($post->pageMeta),
                'page_modified_by' => $post->modifiedBy,
                'page_created_at' => $post->pageCreatedAt,
                'page_updated_at' => $post->pageUpatedAt,
                'page_status' => $post->pageStatus,
                'page_is_freezed' => '0',
            ]);
            $pageId = $this->db->insert_id();
            foreach ($post->pageAccess as $i => $value) {
                $array[$i] = [
                    'page_access_index' => NULL,
                    'access_id' => $value,
                    'page_id' => $pageId,
                ];
            }
            $this->db->insert_batch('az_page_access', $array);
        }
        $this->db->trans_complete();
        return $this->db->trans_status() === false ? false : true;
    }
    public function updatePage($post)
    {
        $post = json_decode($post);
        if ($post->pageId) {
            $this->db->trans_start();
            // update page
            $data = array_filter([
                'page_label' => isset($post->pageLabel)
                    ? $post->pageLabel
                    : false,
                'page_route' => isset($post->pageRoute)
                    ? $post->pageRoute
                    : false,
                'page_object' => isset($post->pageObject)
                    ? json_encode($post->pageObject)
                    : false,
                'page_meta' => isset($post->pageMeta)
                    ? json_encode($post->pageMeta)
                    : false,
                'page_modified_by' => isset($post->pageModifiedBy)
                    ? $post->pageModifiedBy
                    : false,
                'page_updated_at' => isset($post->pageUpdatedAt)
                    ? $post->pageUpdatedAt
                    : false,
                'page_status' => isset($post->pageStatus)
                    ? $post->pageStatus
                    : false,
                'page_is_freezed' => isset($post->pageIsFreezed)
                    ? $post->pageIsFreezed
                    : false,
            ]);
            $this->db->where('page_id', $post->pageId);
            $this->db->update('az_pages', $data);

            if (isset($post->pageObject)) {
                // delete existing page access
                $this->db->where('page_id', $post->pageId);
                $this->db->delete('az_page_access');
                // insert list of new accessors
                foreach ($post->hasAccessTo as $i => $value) {
                    $array[$i] = [
                        'page_access_index' => NULL,
                        'access_id' => $value,
                        'page_id' => $post->pageId,
                    ];
                }
                $this->db->insert_batch('az_page_access', $array);
            }

            $this->db->trans_complete();
            return $this->db->trans_status() === false ? false : true;
        }
        return false;
    }
    public function deletePage($post)
    {
        $post = json_decode($post);
        if (isset($post->pageId)) {
            $this->db->trans_start();
            $this->db->where('page_id', $post->pageId);
            $this->db->delete(['az_page_access', 'az_pages']);
            $this->db->trans_complete();
            return $this->db->trans_status() === false ? false : true;
        }
        return false;
    }

    public function getTables()
    {
        $query = $this->db->query(
            'SHOW TABLES WHERE `Tables_in_' .
                $this->db->database .
                '` NOT LIKE "az_%"'
        );
        return get_all_rows($query);
    }

    public function truncateTable($table)
    {
        if (isset($table)) {
            if ($this->db->truncate($table)) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    public function getTableInfo($table)
    {
        if (isset($table)) {
            // $fields = $this->db->field_data($table);
            // return $fields;
            $query = $this->db->query('DESCRIBE ' . $table);
            return get_all_rows($query);
        } else {
            return [];
        }
    }

    public function getTableRecords($table)
    {
        if (isset($table)) {
            $records = $this->db->count_all($table);
            return $records;
        } else {
            return 0;
        }
    }

    public function postAjaxForm($table, $fieldArray)
    {
        if ($this->db->insert($table, $fieldArray)) {
            return true;
        } else {
            return false;
        }
    }

    public function addWhereClause($array)
    {
        if (isset($array) && count($array) > 0) {
            foreach ($array as $row) {
                switch ($row['clause']) {
                    case 'BETWEEN':
                        list($a, $b) = explode(',', $row['condition']);
                        return $row['column'] .
                            ' BETWEEN "' .
                            $a .
                            '" AND "' .
                            $b .
                            '"';
                        break;
                    case 'EQUAL TO':
                        return [$row['column'] => $row['condition']];
                        break;
                    case 'NOT EQUAL TO':
                        return [$row['column'] . ' !=' => $row['condition']];
                        break;
                    case 'LESSER THAN':
                        return [$row['column'] . ' <' => $row['condition']];
                        break;
                    case 'GREATER THAN':
                        return [$row['column'] . ' >' => $row['condition']];
                        break;
                    case 'LESSER THAN EQUAL TO':
                        return [$row['column'] . ' <=' => $row['condition']];
                        break;
                    case 'GREATER THAN EQUAL TO':
                        return [$row['column'] . ' >=' => $row['condition']];
                        break;
                    case 'IS NULL':
                        return $row['column'] . ' IS NULL';
                        break;
                    case 'IS NOT NULL':
                        return $row['column'] . ' IS NOT NULL';
                        break;
                    default:
                        return [];
                }
            }
        }
        return [];
    }

    public function addLikeClause($array)
    {
        if (isset($array) && count($array) > 0) {
            foreach ($array as $row) {
                switch ($row['clause']) {
                    case 'CONTAINS':
                        return [$row['column'], $row['condition'], 'both'];
                        break;
                    case 'STARTS WITH':
                        return [$row['column'], $row['condition'], 'after'];
                        break;
                    case 'ENDS WITH':
                        return [$row['column'], $row['condition'], 'before'];
                        break;
                    default:
                        return [];
                }
            }
        }
        return [];
    }

    public function addNotLikeClause($array)
    {
        if (isset($array) && count($array) > 0) {
            foreach ($array as $row) {
                switch ($row['clause']) {
                    case 'DOES NOT CONTAIN':
                        return [$row['column'], $row['condition'], 'both'];
                        break;
                    case 'DOES NOT STARTS WITH':
                        return [$row['column'], $row['condition'], 'after'];
                        break;
                    case 'DOES NOT ENDS WITH':
                        return [$row['column'], $row['condition'], 'before'];
                        break;
                    default:
                        return [];
                }
            }
        }
        return [];
    }

    public function addWhereInClause($array)
    {
        if (isset($array) && count($array) > 0) {
            foreach ($array as $row) {
                switch ($row['clause']) {
                    case 'IN':
                        return [
                            $row['column'],
                            explode(',', $row['condition']),
                        ];
                        break;
                    default:
                        return [];
                }
            }
        }
        return [];
    }

    public function ajaxFetch($query)
    {
        if (isset($query)) {
            $this->db
                ->select($query['select'])
                ->from($query['fetchTable'])
                ->where(
                    isset($query['where'])
                        ? $this->addWhereClause($query['where'])
                        : []
                );
            if (
                isset($query['where']) &&
                count($this->addWhereInClause($query['where'])) > 0
            ) {
                $this->db->where_in(
                    ...$this->addWhereInClause($query['where'])
                );
            }
            if (
                isset($query['where']) &&
                count($this->addLikeClause($query['where'])) > 0
            ) {
                $this->db->like(...$this->addLikeClause($query['where']));
            }
            if (
                isset($query['where']) &&
                count($this->addNotLikeClause($query['where'])) > 0
            ) {
                $this->db->not_like(
                    ...$this->addNotLikeClause($query['where'])
                );
            }
            if (isset($query['limit'])) {
                $this->db->limit($query['limit']);
            }
            $q = $this->db->get();
            return get_all_rows($q);
        }
    }
}
