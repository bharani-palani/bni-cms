/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react';
import {
  Row,
  Col,
  ListGroup,
  InputGroup,
  FormControl,
  Button,
  Form,
  SplitButton,
  Dropdown,
} from 'react-bootstrap';
import { UserContext } from '../../../../contexts/UserContext';

function TableConfig(props) {
  const userContext = useContext(UserContext);
  const [formType, setFormType] = useState({
    unsigned: false,
    null: false,
    auto_increment: false,
    default: '',
  });
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [tableName, setTableName] = useState('');
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
  const options = [
    { label: 'Unsigned', key: 'unsigned', value: false },
    { label: 'Null', key: 'null', value: false },
    { label: 'Auto Increment', key: 'auto_increment', value: false },
    { label: 'Default', key: 'default', value: '' },
  ];
  const addType = () => {
    console.log('bbb', formType);
  };

  return (
    <Row>
      <Col md={2} className="p-0">
        <div className="py-2 ps-3">Tables</div>
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
                <i className="fa fa-ellipsis-v cursor-pointer" />
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </Col>
      <Col md={10}>
        <div className="py-2">Create Table</div>
        <div className="col-lg-4 mb-2">
          <InputGroup size="sm" className="mb-2">
            <InputGroup.Text>Table name</InputGroup.Text>
            <FormControl
              value={tableName}
              onChange={e => setTableName(e.target.value)}
            />
          </InputGroup>

          <InputGroup size="sm">
            <InputGroup.Text>Add field</InputGroup.Text>
            <Form.Select
              value={formType.type}
              onChange={e =>
                setFormType(prevState => ({
                  ...prevState,
                  type: e.target.value,
                }))
              }
            >
              <option>Select Type</option>
              {inputTypeList.map((l, i) => (
                <option value={l.value} key={i}>
                  {l.label}
                </option>
              ))}
            </Form.Select>
            <FormControl
              placeholder="Constraint"
              type="number"
              value={formType.constraint}
              onChange={e =>
                setFormType(prevState => ({
                  ...prevState,
                  constraint: e.target.value,
                }))
              }
            />
            <Dropdown autoClose="outside">
              <Dropdown.Toggle id="dropdown-autoclose-true" />
              <Dropdown.Menu variant="primary">
                {options.map((o, i) => (
                  <React.Fragment key={i}>
                    <li className="p-1">
                      {typeof o.value === 'boolean' ? (
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={o.label}
                            value={o.value}
                            onChange={e =>
                              setFormType(prevState => ({
                                ...prevState,
                                [o.key]: e.target.checked,
                              }))
                            }
                          />
                          <label className="form-check-label" htmlFor={o.label}>
                            {o.label}
                          </label>
                        </div>
                      ) : (
                        <FormControl
                          placeholder={o.label}
                          size="sm"
                          defaultValue={o.value}
                          onChange={e =>
                            setFormType(prevState => ({
                              ...prevState,
                              [o.key]: e.target.value,
                            }))
                          }
                        />
                      )}
                    </li>
                  </React.Fragment>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <Button onClick={() => addType()}>
              <i className="fa fa-plus" />
            </Button>
          </InputGroup>
        </div>
        <Button size="sm">Create</Button>
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
