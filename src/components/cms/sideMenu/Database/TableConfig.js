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
