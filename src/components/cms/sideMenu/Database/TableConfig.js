import React, { useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import { UserContext } from '../../../../contexts/UserContext';
import CreateTable from './CreateTable';
import TableList from './TableList';

function TableConfig(props) {
  const userContext = useContext(UserContext);

  return (
    <Row>
      <Col md={2} className="p-0">
        <TableList />
      </Col>
      <Col md={10}>
        <CreateTable />
        <div className="table-responsive">
          <table
            className={`table ${
              userContext.userData.theme === 'dark'
                ? 'table-dark'
                : 'table-light'
            }`}
          >
            <thead>
              <tr>
                <th>Field</th>
                <th>Type</th>
                <th>Null</th>
                <th>Key</th>
                <th>Default</th>
                <th>Extra</th>
              </tr>
            </thead>
            <tbody>
              {new Array(15).fill(1).map((_, i) => (
                <tr key={i}>
                  <td>Field {i}</td>
                  <td>Type {i}</td>
                  <td>Null {i}</td>
                  <td>Key {i}</td>
                  <td>Default {i}</td>
                  <td>Extra {i}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Col>
    </Row>
  );
}

export default TableConfig;
