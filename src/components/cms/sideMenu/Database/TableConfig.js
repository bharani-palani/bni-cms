/* eslint-disable no-unused-vars */
import React, { useContext } from 'react';
import { Row, Col, ListGroup } from 'react-bootstrap';
import { UserContext } from '../../../../contexts/UserContext';

function TableConfig(props) {
  const userContext = useContext(UserContext);

  return (
    <Row>
      <Col md={2} className="p-0">
        <div className="py-2 ps-3 border-bottom border-secondary">Tables</div>
        <div>
          <ListGroup variant="flush">
            {new Array(15).fill(1).map((_, i) => (
              <ListGroup.Item
                key={i}
                className={`py-2 d-flex justify-content-between align-items-start ${
                  userContext.userData.theme === 'dark'
                    ? 'bg-dark text-light'
                    : 'bg-white text-dark'
                }`}
              >
                <div className="fst-italic">Cras justo odio</div>
                <i className="fa fa-ellipsis-v" />
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </Col>
      <Col md={10}>
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
