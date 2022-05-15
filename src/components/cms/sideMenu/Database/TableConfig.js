import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import CreateTable from './CreateTable';
import TableList from './TableList';
import TableInfo from './TableInfo';
export const TableConfigContext = React.createContext();

function TableConfig(props) {
  const [state, setState] = useState({});

  return (
    <TableConfigContext.Provider
      value={{
        state,
        setState,
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
