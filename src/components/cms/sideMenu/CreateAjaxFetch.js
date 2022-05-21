/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from 'react';
import { LayoutContext } from '../layoutDesign';
import {
  InputGroup,
  FormControl,
  Button,
  Dropdown,
  Form,
} from 'react-bootstrap';
import _ from 'lodash';
import { UserContext } from '../../../contexts/UserContext';

function CreateAjaxFetch(props) {
  const userContext = useContext(UserContext);
  const [whereCondition, setWhereCondition] = useState({
    column: '',
    clause: '',
    condition: '',
  });
  const [orderByCondition, setOrderByCondition] = useState({
    column: '',
    clause: '',
  });

  const [configArray, setConfigArray] = useState([
    {
      component: 'AddListField',
      options: {
        id: 'fields',
        label: 'Fields',
        value: [],
      },
    },
    {
      component: 'InputField',
      options: {
        id: 'fetchTable',
        label: 'GET Table',
        type: 'text',
        value: '',
      },
    },
    {
      component: 'SelectListField',
      options: {
        id: 'select',
        label: 'Select',
        value: [],
      },
    },
    {
      component: 'MapListField',
      options: {
        id: 'where',
        label: 'Where',
        conditions: [
          'BETWEEN',
          'EQUAL TO',
          'NOT EQUAL TO',
          'LESSER THAN',
          'GREATER THAN',
          'LESSER THAN EQUAL TO',
          'GREATER THAN EQUAL TO',
          'CONTAINS',
          'STARTS WITH',
          'ENDS WITH',
          'DOES NOT CONTAIN',
          'DOES NOT STARTS WITH',
          'DOES NOT ENDS WITH',
          'IS NULL',
          'IS NOT NULL',
          'IN',
          'NOT IN',
        ],
        value: [],
      },
    },
    {
      component: 'OrderByListField',
      options: {
        id: 'orderBy',
        label: 'Order By',
        conditions: ['ASC', 'DESC'],
        value: [],
      },
    },
    {
      component: 'InputField',
      options: { id: 'limit', label: 'Limit', value: 1000, type: 'number' },
    },
  ]);

  const onElementChange = (id, value) => {
    const bb = [...configArray];
    const changed = bb.map(obj => {
      return obj.options.id === id
        ? Object.assign(obj, {
            options: {
              ...obj.options,
              value,
            },
          })
        : obj;
    });
    setConfigArray(changed);
  };

  const [fieldName, setFieldName] = useState('');

  const addRow = (id, row) => {
    const bb = [...configArray];
    const changed = bb.map(obj => {
      if (obj.options.id === id) {
        obj.options.value = [...obj.options.value, row];
      }
      return obj;
    });
    setConfigArray(changed);
    setFieldName('');
  };

  //   useEffect(() => {
  //   }, [configArray]);

  const removeRow = (id, index) => {
    const deletedArray = [...configArray].map(obj => {
      if (obj.options.id === id) {
        obj.options.value = obj.options.value.filter((_, i) => i !== index);
      }
      return obj;
    });

    const existingFields = deletedArray.filter(
      con => con.component === 'AddListField'
    )[0].options.value;

    const newArray = deletedArray.map(obj => {
      if (obj.component === 'MapListField') {
        obj.options.value = obj.options.value.filter(f =>
          existingFields.includes(f.column)
        );
      }
      if (obj.component === 'SelectListField') {
        obj.options.value = obj.options.value.filter(f =>
          existingFields.includes(f)
        );
      }
      if (obj.component === 'OrderByListField') {
        obj.options.value = obj.options.value.filter(f =>
          existingFields.includes(f.column)
        );
      }
      return obj;
    });

    setConfigArray(newArray);
  };

  const isFields = () => {
    const row = configArray.filter(con => con.component === 'AddListField');
    return row[0].options.value;
  };

  const addClause = () => {
    const changed = [...configArray].map(obj => {
      if (obj.component === 'MapListField') {
        obj.options.value = [
          ...obj.options.value,
          {
            column: whereCondition.column,
            clause: whereCondition.clause,
            condition: whereCondition.condition,
          },
        ];
      }
      return obj;
    });
    setConfigArray(changed);
    setWhereCondition({
      column: '',
      clause: '',
      condition: '',
    });
  };

  const selectOnChange = (e, label) => {
    const changed = [...configArray].map(obj => {
      if (obj.component === 'SelectListField') {
        obj.options.value = e.target.checked
          ? [...obj.options.value, label]
          : obj.options.value.filter(f => f !== label);
      }
      return obj;
    });
    setConfigArray(changed);
  };

  const saveProps = () => {
    console.log('bbb', configArray);
  };

  const saveButtonStatus = () => {
    const row = configArray.filter(
      con => con.component === 'SelectListField'
    )[0].options.value;
    return row.length;
  };

  const addOrderByClause = () => {
    const changed = [...configArray].map(obj => {
      if (
        obj.component === 'OrderByListField' &&
        !obj.options.value.filter(f => f.column === orderByCondition.column)
          .length
      ) {
        obj.options.value = [
          ...obj.options.value,
          {
            column: orderByCondition.column,
            clause: orderByCondition.clause,
          },
        ];
      }
      return obj;
    });
    setConfigArray(changed);
    setOrderByCondition({
      column: '',
      clause: '',
    });
  };

  return (
    <LayoutContext.Consumer>
      {layoutDetails =>
        layoutDetails.state.selectedNodeId ? (
          <div>
            {configArray.map((c, i) => {
              switch (c.component) {
                case 'InputField':
                  return (
                    <InputGroup key={i} size="sm" className="mb-1">
                      <InputGroup.Text>
                        <Form.Label
                          htmlFor={c.options.id}
                          className="mb-0 text-primary"
                        >
                          {c.options.label}
                        </Form.Label>
                      </InputGroup.Text>
                      <FormControl
                        type={c.options.type}
                        id={c.options.id}
                        defaultValue={c.options.value}
                        onChange={e =>
                          onElementChange(c.options.id, e.target.value)
                        }
                      />
                    </InputGroup>
                  );
                case 'AddListField':
                  return (
                    <div key={i}>
                      <InputGroup size="sm" className="mb-1">
                        <InputGroup.Text>
                          <Form.Label htmlFor="fieldNames" className="mb-0">
                            Add {c.options.label}
                          </Form.Label>
                        </InputGroup.Text>
                        <FormControl
                          type="text"
                          id="fieldNames"
                          value={fieldName}
                          maxLength={64}
                          onChange={e => setFieldName(e.target.value)}
                        />
                        <Button
                          variant="primary"
                          disabled={!fieldName}
                          onClick={() => addRow(c.options.id, fieldName)}
                        >
                          <i className="fa fa-thumbs-o-up" />
                        </Button>
                      </InputGroup>
                      {c.options.value.length > 0 && (
                        <ul className="list-group mb-2">
                          {c.options.value.map((v, j) => (
                            <li
                              key={j}
                              className={`list-group-item p-1 small d-flex justify-content-between align-items-center ${
                                userContext.userData.theme === 'dark'
                                  ? 'bg-dark text-light'
                                  : 'bg-light text-dark'
                              }`}
                            >
                              <div className="user-select-none overflow-auto">
                                {v}
                              </div>
                              <div>
                                <i
                                  className="fa fa-times-circle text-danger cursor-pointer"
                                  onClick={() => removeRow(c.options.id, j)}
                                />
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                case 'MapListField':
                  return (
                    <div key={i}>
                      {isFields().length > 0 && (
                        <>
                          <div className="py-1 text-primary">
                            {c.options.label}
                          </div>
                          <InputGroup size="sm" className="mb-1">
                            <Form.Select
                              size="sm"
                              onChange={e =>
                                setWhereCondition(prevState => ({
                                  ...prevState,
                                  column: e.target.value,
                                }))
                              }
                              value={whereCondition.column}
                            >
                              <option value="">--COLUMN--</option>
                              {isFields().map((v, j) => (
                                <option key={j} value={v}>
                                  {v}
                                </option>
                              ))}
                            </Form.Select>
                            <Form.Select
                              size="sm"
                              onChange={e =>
                                setWhereCondition(prevState => ({
                                  ...prevState,
                                  clause: e.target.value,
                                }))
                              }
                              value={whereCondition.clause}
                            >
                              <option value="">--CLAUSE--</option>
                              {c.options.conditions.map((c, j) => (
                                <option key={j} value={c}>
                                  {c}
                                </option>
                              ))}
                            </Form.Select>
                          </InputGroup>
                          <InputGroup size="sm" className="mb-1">
                            <FormControl
                              type="text"
                              value={whereCondition.condition}
                              onChange={e =>
                                setWhereCondition(prevState => ({
                                  ...prevState,
                                  condition: e.target.value,
                                }))
                              }
                              placeholder="Your clause ??"
                            />
                            <Button
                              variant="primary"
                              disabled={
                                !(
                                  whereCondition.column && whereCondition.clause
                                )
                              }
                              onClick={() => addClause()}
                            >
                              <i className="fa fa-thumbs-o-up" />
                            </Button>
                          </InputGroup>
                          {c.options.value.length > 0 && (
                            <ul className="list-group mb-2">
                              {c.options.value.map((v, j) => (
                                <li
                                  key={j}
                                  className={`list-group-item p-1 small d-flex justify-content-between align-items-center ${
                                    userContext.userData.theme === 'dark'
                                      ? 'bg-dark text-light'
                                      : 'bg-light text-dark'
                                  }`}
                                >
                                  <div className="user-select-none overflow-auto">
                                    <div className="small">{v.column}</div>
                                    <div className="small badge bg-success">
                                      {v.clause}
                                    </div>
                                    <div className="small">{v.condition}</div>
                                  </div>
                                  <div>
                                    <i
                                      className="fa fa-times-circle text-danger cursor-pointer"
                                      onClick={() => removeRow(c.options.id, j)}
                                    />
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </>
                      )}
                    </div>
                  );
                case 'SelectListField':
                  return (
                    <div key={i}>
                      {isFields().length > 0 && (
                        <>
                          <div className="py-1 text-primary">
                            {c.options.label}
                          </div>
                          {[...configArray]
                            .filter(con => con.component === 'AddListField')[0]
                            .options.value.map((v, j) => (
                              <Form.Check
                                key={j}
                                type="checkbox"
                                id={`check-${v}`}
                                label={v}
                                onChange={e => selectOnChange(e, v)}
                              />
                            ))}
                        </>
                      )}
                    </div>
                  );
                case 'OrderByListField':
                  return (
                    <div key={i}>
                      {isFields().length > 0 && (
                        <>
                          <div className="py-1 text-primary">
                            {c.options.label}
                          </div>
                          <InputGroup size="sm" className="mb-1">
                            <Form.Select
                              size="sm"
                              onChange={e =>
                                setOrderByCondition(prevState => ({
                                  ...prevState,
                                  column: e.target.value,
                                }))
                              }
                              value={orderByCondition.column}
                            >
                              <option value="">--COLUMN--</option>
                              {isFields().map((v, j) => (
                                <option key={j} value={v}>
                                  {v}
                                </option>
                              ))}
                            </Form.Select>
                            <Form.Select
                              size="sm"
                              onChange={e =>
                                setOrderByCondition(prevState => ({
                                  ...prevState,
                                  clause: e.target.value,
                                }))
                              }
                              value={orderByCondition.clause}
                            >
                              <option value="">--CLAUSE--</option>
                              {c.options.conditions.map((c, j) => (
                                <option key={j} value={c}>
                                  {c}
                                </option>
                              ))}
                            </Form.Select>
                            <Button
                              variant="primary"
                              disabled={
                                !(
                                  orderByCondition.column &&
                                  orderByCondition.clause
                                )
                              }
                              onClick={() => addOrderByClause()}
                            >
                              <i className="fa fa-thumbs-o-up" />
                            </Button>
                          </InputGroup>
                          {c.options.value.length > 0 && (
                            <ul className="list-group mb-2">
                              {c.options.value.map((v, j) => (
                                <li
                                  key={j}
                                  className={`list-group-item p-1 small d-flex justify-content-between align-items-center ${
                                    userContext.userData.theme === 'dark'
                                      ? 'bg-dark text-light'
                                      : 'bg-light text-dark'
                                  }`}
                                >
                                  <div className="user-select-none overflow-auto">
                                    <div className="small">
                                      <span>{v.column}</span>
                                      <span className="ms-1 badge bg-success">
                                        {v.clause}
                                      </span>
                                    </div>
                                  </div>
                                  <div>
                                    <i
                                      className="fa fa-times-circle text-danger cursor-pointer"
                                      onClick={() => removeRow(c.options.id, j)}
                                    />
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </>
                      )}
                    </div>
                  );
                default:
                  return null;
              }
            })}
            <div className="d-grid mb-1">
              <Button
                size="sm"
                disabled={!saveButtonStatus()}
                variant="primary"
                onClick={() => saveProps()}
              >
                <i className="fa fa-thumbs-o-up" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-muted small px-1">Please select a component</div>
        )
      }
    </LayoutContext.Consumer>
  );
}

export default CreateAjaxFetch;
