/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import CreateTable from './CreateTable';
import TableList from './TableList';
import TableInfo from './TableInfo';
import apiInstance from '../../../../services/apiServices';

export const TableConfigContext = React.createContext();

function TableConfig(props) {
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
