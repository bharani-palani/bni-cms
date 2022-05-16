import React, { useState, useContext } from 'react';
import {
  ListGroup,
  InputGroup,
  FormControl,
  Button,
  Form,
  Dropdown,
} from 'react-bootstrap';
import apiInstance from '../../../../services/apiServices';
import { TableConfigContext } from './TableConfig';
import { UserContext } from '../../../../contexts/UserContext';

function CreateTable(props) {
  const tableConfigContext = useContext(TableConfigContext);
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
    keys: [
      { label: 'Primary key', key: 'primaryKey', value: false },
      { label: 'Index', key: 'index', value: false },
    ],
    // note: focus to start here to set foreign keys in future
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

  const createTable = () => {
    const formdata = new FormData();
    formdata.append('table', tableName);
    formdata.append('fields', JSON.stringify(selectedTypes));

    apiInstance
      .post('/createTable', formdata)
      .then(res => {
        const bool = res.data.response;
        if (bool) {
          userContext.renderToast({
            message: `Table "${tableName}" successfully created`,
          });
          tableConfigContext.loadTables();
        } else {
          userContext.renderToast({
            type: 'error',
            icon: 'fa fa-times-circle',
            message:
              'Oops.. Some thing wrong in your schema. Please correct them and try again.',
          });
        }
      })
      .catch(error => {
        userContext.renderToast({
          type: 'error',
          icon: 'fa fa-times-circle',
          message: 'Oops.. Some thing wrong. Please try again.',
        });
      })
      .finally(() => setSelectedTypes([]));
  };

  return (
    <div>
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
          <small className="badge bg-danger mb-1">
            <em>
              Note: Table name must not start with reserved keyword &quot;az
              &quot;
            </em>
          </small>
          <InputGroup size="sm" className="mb-2">
            <InputGroup.Text>
              <Form.Label htmlFor="tableName" className="mb-0">
                Table name
              </Form.Label>
            </InputGroup.Text>
            <FormControl
              id="tableName"
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
                          <label className="form-check-label" htmlFor={o.label}>
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
        disabled={!(selectedTypes.length > 0 && tableName)}
        size="sm"
      >
        Create
      </Button>
    </div>
  );
}

export default CreateTable;
