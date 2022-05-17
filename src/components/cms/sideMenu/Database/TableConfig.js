import React, { useState, useEffect, useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import CreateTable from './CreateTable';
import TableList from './TableList';
import TableInfo from './TableInfo';
import apiInstance from '../../../../services/apiServices';
import { UserContext } from '../../../../contexts/UserContext';

export const TableConfigContext = React.createContext();

function TableConfig(props) {
  const userContext = useContext(UserContext);
  const [tableList, setTableList] = useState([]);
  const [infoList, setInfoList] = useState({
    table: '',
    data: [],
  });
  const [loading, setLoading] = useState(false);
  const inputTypeList = [
    { value: 'INT', label: 'INT' },
    { value: 'TINYINT', label: 'TINYINT' },
    { value: 'SMALLINT', label: 'SMALLINT' },
    { value: 'MEDIUMINT', label: 'MEDIUMINT' },
    { value: 'BIGINT', label: 'BIGINT' },
    { value: 'CHAR', label: 'CHAR' },
    { value: 'VARCHAR', label: 'VARCHAR' },
    { value: 'TEXT', label: 'TEXT' },
    { value: 'TINYTEXT', label: 'TINYTEXT' },
    { value: 'MEDIUMTEXT', label: 'MEDIUMTEXT' },
    { value: 'LONGTEXT', label: 'LONGTEXT' },
    { value: 'BLOB', label: 'BLOB' },
    { value: 'MEDIUMBLOB', label: 'MEDIUMBLOB' },
    { value: 'LONGBLOB', label: 'LONGBLOB' },
    { value: 'FLOAT', label: 'FLOAT' },
    { value: 'DOUBLE', label: 'DOUBLE' },
    { value: 'DECIMAL', label: 'DECIMAL' },
    { value: 'DATE', label: 'DATE' },
    { value: 'DATETIME', label: 'DATETIME' },
    { value: 'TIMESTAMP', label: 'TIMESTAMP' },
    { value: 'TIME', label: 'TIME' },
    { value: 'ENUM', label: 'ENUM' },
    { value: 'SET', label: 'SET' },
    { value: 'BOOLEAN', label: 'BOOLEAN' },
  ];

  const defaultOptions = {
    oldField: '',
    field: '',
    type: '',
    constraint: '',
    options: [
      { label: 'Auto Increment', key: 'auto_increment', value: false },
      { label: 'Unsigned', key: 'unsigned', value: false },
      { label: 'Null', key: 'null', value: false },
      { label: 'Default', key: 'default', value: '' },
    ],
    keys: [
      { label: 'Primary key', key: 'primaryKey', value: false },
      { label: 'Index', key: 'index', value: false },
    ],
    // note: focus to start here to set foreign keys in future
  };
  const [formType, setFormType] = useState(defaultOptions);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [tableName, setTableName] = useState('');
  const [editModalShow, setEditModalShow] = useState(false);
  const [createColumnModalShow, setCreateColumnModalShow] = useState(false);

  useEffect(() => {
    loadTables();
  }, []);

  useEffect(() => {
    if (infoList.table) {
      const formdata = new FormData();
      formdata.append('table', infoList.table);

      apiInstance
        .post('/getTableInfo', formdata)
        .then(res => {
          setInfoList({
            table: infoList.table,
            data: res.data.response.info,
            records: res.data.response.records,
          });
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [JSON.stringify(infoList)]);

  const loadTables = () => {
    setLoading(true);
    apiInstance
      .get('/getTables')
      .then(res => {
        const data = res.data.response
          .map(e => Object.entries(e))
          .map(f => ({ oldLabel: f[0][1], renameLabel: f[0][1] }));
        setTableList(data);
        if (data.length > 0) {
          setInfoList({ table: '' });
          setTimeout(() => {
            setInfoList({ table: data[0].oldLabel });
          }, 10);
        } else {
          setInfoList({ table: '', data: [] });
        }
      })
      .catch(error => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  };

  const addType = () => {
    const newRow = {
      oldField: formType.field,
      field: formType.field,
      type: formType.type,
      constraint: formType.constraint,
      options: formType.options
        .filter(o => o.value)
        .map(item => ({ [item.key]: item.value })),
      keys: formType.keys.filter(f => f.value).map(item => item.key),
    };
    const bSelectedTypes = [...selectedTypes, newRow];
    setSelectedTypes(bSelectedTypes);
    setFormType(defaultOptions);
  };

  const editInlineForm = () => {
    const formdata = new FormData();
    formdata.append('table', tableName);
    formdata.append('fields', JSON.stringify([formType]));

    apiInstance
      .post('/updateTableColumn', formdata)
      .then(res => {
        const bool = res.data.response;
        if (bool) {
          userContext.renderToast({
            message: `Column "${formType.field}" successfully updated.`,
          });
          setInfoList({ table: tableName });
        } else {
          userContext.renderToast({
            type: 'error',
            icon: 'fa fa-times-circle',
            message:
              'Oops.. Some thing wrong in your column schema. Please correct them and try again.',
          });
        }
      })
      .catch(error => {
        userContext.renderToast({
          type: 'error',
          icon: 'fa fa-times-circle',
          message: 'Oops.. Some thing went wrong. Please try again.',
        });
      })
      .finally(() => {
        setTableName('');
        setEditModalShow(false);
        setFormType(defaultOptions);
      });
  };

  const addColumnInlineForm = () => {
    const formdata = new FormData();
    formdata.append('table', infoList.table);
    formdata.append('fields', JSON.stringify([formType]));

    apiInstance
      .post('/addTableColumn', formdata)
      .then(res => {
        const bool = res.data.response;
        if (bool) {
          userContext.renderToast({
            message: `Column "${formType.field}" successfully added.`,
          });
          setInfoList({ table: infoList.table });
        } else {
          userContext.renderToast({
            type: 'error',
            icon: 'fa fa-times-circle',
            message:
              'Oops.. Some thing wrong in your column schema. Please correct them and try again.',
          });
        }
      })
      .catch(error => {
        userContext.renderToast({
          type: 'error',
          icon: 'fa fa-times-circle',
          message: 'Oops.. Some thing went wrong. Please try again.',
        });
      })
      .finally(() => {
        setTableName('');
        setCreateColumnModalShow(false);
        setFormType(defaultOptions);
      });
  };

  return (
    <TableConfigContext.Provider
      value={{
        loading,
        tableList,
        setTableList,
        loadTables,
        infoList,
        setInfoList,
        inputTypeList,
        defaultOptions,
        addType,
        formType,
        setFormType,
        selectedTypes,
        setSelectedTypes,
        tableName,
        setTableName,
        editInlineForm,
        editModalShow,
        setEditModalShow,
        createColumnModalShow,
        setCreateColumnModalShow,
        addColumnInlineForm,
      }}
    >
      <Row>
        <Col lg={2} className="p-0">
          <TableList />
        </Col>
        <Col lg={10}>
          <CreateTable />
          {infoList.data && infoList.data.length > 0 && <TableInfo />}
        </Col>
      </Row>
    </TableConfigContext.Provider>
  );
}

export default TableConfig;
