import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import CreateTable from './CreateTable';
import TableList from './TableList';
import TableInfo from './TableInfo';
import apiInstance from '../../../../services/apiServices';

export const TableConfigContext = React.createContext();

function TableConfig(props) {
  const [tableList, setTableList] = useState([]);

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = () => {
    apiInstance
      .get('/getTables')
      .then(res => {
        const data = res.data.response
          .map(e => Object.entries(e))
          .map(f => ({ oldLabel: f[0][1], renameLabel: f[0][1] }));
        setTableList(data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <TableConfigContext.Provider
      value={{
        tableList,
        setTableList,
        loadTables,
      }}
    >
      <Row>
        <Col lg={2} className="p-0">
          <TableList />
        </Col>
        <Col lg={10}>
          <CreateTable />
          <TableInfo />
        </Col>
      </Row>
    </TableConfigContext.Provider>
  );
}

export default TableConfig;
