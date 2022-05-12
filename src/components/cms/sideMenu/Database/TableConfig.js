/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
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
import _ from 'lodash';

function TableConfig(props) {
  const userContext = useContext(UserContext);
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
  const defaultForm = {
    field: '',
    type: '',
    constraint: '',
    options: [
      { label: 'Auto Increment', key: 'auto_increment', value: false },
      { label: 'Unsigned', key: 'unsigned', value: false },
      { label: 'Null', key: 'null', value: false },
      { label: 'Default', key: 'default', value: '' },
    ],
    // note: focus here to set foreign keys in future
    keys: [
      { label: 'Primary key', key: 'primaryKey', value: false },
      { label: 'Index', key: 'index', value: false },
    ],
  };
  const [formType, setFormType] = useState(defaultForm);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [tableName, setTableName] = useState('');

  const addType = () => {
    const newRow = {
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
    setFormType(defaultForm);
  };

  const removeField = index => {
    const filtered = [...selectedTypes].filter((_, i) => i !== index);
    setSelectedTypes(filtered);
  };

  // useEffect(() => {
  //   console.log('bbb', selectedTypes);
  // }, [selectedTypes]);

  const createTable = () => {
    console.log('bbb', selectedTypes);
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
        <div className="py-2">
          <div>Create Table</div>
          <em>
            <a
              className="link-primary small"
              href="https://dev.mysql.com/doc/refman/8.0/en/creating-tables.html"
              rel="noreferrer"
              target="_blank"
            >
              Read docs before creating one
            </a>
          </em>
        </div>
        <div className="mb-2">
          <div className="col-md-3">
            <InputGroup size="sm" className="mb-2">
              <InputGroup.Text>Table name</InputGroup.Text>
              <FormControl
                value={tableName}
                onChange={e => setTableName(e.target.value)}
              />
            </InputGroup>
          </div>
          <div className="col-lg-6">
            <InputGroup size="sm" className="mb-2 col-md-6">
              <FormControl
                placeholder="Field name"
                value={formType.field}
                onChange={e =>
                  setFormType(prevState => ({
                    ...prevState,
                    field: e.target.value,
                  }))
                }
              />
              <Form.Select
                value={formType.type}
                onChange={e =>
                  setFormType(prevState => ({
                    ...prevState,
                    type: e.target.value,
                  }))
                }
              >
                <option value="">Select Type</option>
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
                  <div className="p-1 small">
                    {formType.options.map((o, i) => (
                      <React.Fragment key={i}>
                        {typeof o.value === 'boolean' ? (
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id={o.label}
                              name={o.key}
                              checked={o.value}
                              onChange={e => {
                                setFormType(prevState => ({
                                  ...prevState,
                                  options: prevState.options.map(obj =>
                                    obj.key === o.key
                                      ? Object.assign(obj, {
                                          value: e.target.checked,
                                        })
                                      : obj
                                  ),
                                }));
                              }}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={o.label}
                            >
                              {o.label}
                            </label>
                          </div>
                        ) : (
                          <FormControl
                            placeholder={o.label}
                            size="sm"
                            value={o.value}
                            onChange={e =>
                              setFormType(prevState => ({
                                ...prevState,
                                options: prevState.options.map(obj =>
                                  obj.key === o.key
                                    ? Object.assign(obj, {
                                        value: e.target.value,
                                      })
                                    : obj
                                ),
                              }))
                            }
                          />
                        )}
                      </React.Fragment>
                    ))}
                    <div className="p-1 fw-bold">Keys</div>
                    {formType.keys.map((k, j) => (
                      <Form.Check
                        key={j}
                        name="key"
                        type={'radio'}
                        label={k.label}
                        id={k.key}
                        checked={k.value}
                        onChange={e =>
                          setFormType(prevState => ({
                            ...prevState,
                            keys: prevState.keys.map(obj =>
                              obj.key === k.key
                                ? Object.assign(obj, {
                                    value: e.target.checked,
                                  })
                                : obj
                            ),
                          }))
                        }
                      />
                    ))}
                  </div>
                </Dropdown.Menu>
              </Dropdown>
              <Button
                disabled={!(formType.field && formType.type)}
                onClick={() => addType()}
              >
                <i className="fa fa-plus" />
              </Button>
            </InputGroup>
          </div>
        </div>
        {selectedTypes.length > 0 && (
          <div className="mb-2 col-lg-6">
            <ListGroup>
              {selectedTypes.map((a, i) => (
                <ListGroup.Item
                  key={i}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>
                    {a.keys.length > 0 && (
                      <i className="fa fa-key text-danger me-2" />
                    )}
                    <span>{a.field}</span>
                    <span className="badge bg-primary ms-2">
                      {a.type} {a.constraint && `(${a.constraint})`}
                    </span>
                  </div>
                  <i
                    onClick={() => removeField(i)}
                    className="fa fa-times cursor-pointer text-danger"
                  />
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}
        <Button
          onClick={() => createTable()}
          disabled={!selectedTypes.length > 0}
          size="sm"
        >
          Create
        </Button>
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
