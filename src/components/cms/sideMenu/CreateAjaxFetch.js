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
  const [whereCondition, setWhereCondition] = useState('');
  const [configArray, setConfigArray] = useState([
    {
      component: 'InputField',
      options: {
        id: 'fetchTable',
        label: 'GET Table',
        value: '',
        type: 'text',
      },
    },
    {
      component: 'AddListField',
      options: {
        id: 'fields',
        label: 'Fields',
        value: [],
      },
    },
    {
      component: 'MapListField',
      options: {
        id: 'where',
        label: 'Where',
        conditions: [
          { label: 'BETWEEN', value: 'Between' },
          { label: 'EQUAL TO', value: 'equalTo' },
          { label: 'NOT EQUAL TO', value: 'notEqualTo' },
          { label: 'LESSER THAN', value: 'lesserThan' },
          { label: 'GREATER THAN', value: 'greaterThan' },
          { label: 'LESSER THAN EQUAL TO', value: 'lesserThanEqualTo' },
          { label: 'GREATER THAN EQUAL TO', value: 'greaterThanEqualTo' },
          { label: 'CONTAINS', value: 'containe' },
          { label: 'STARTSWITH', value: 'startsWith' },
          { label: 'ENDSWITH', value: 'endsWith' },
          { label: 'DOES NOT CONTAIN', value: 'doesNotContain' },
          { label: 'DOES NOT STARTS WITH', value: 'doesNotStartsWith' },
          { label: 'DOES NOT ENDS WITH', value: 'doesNotEndsWith' },
          { label: 'IS NULL', value: 'isNull' },
          { label: 'IS NOT NULL', value: 'isNotNull' },
          { label: 'IN', value: 'in' },
          { label: 'NOT IN', value: 'notIn' },
        ],
        value: [],
      },
    },
    {
      component: 'InputField',
      options: {
        id: 'recordsPerPage',
        label: 'Records Per Page',
        value: 50,
        type: 'number',
      },
    },
    {
      component: 'InputField',
      options: { id: 'limit', label: 'Limit', value: 1000, type: 'number' },
    },
    {
      component: 'DropDownSelectionField',
      options: {
        id: 'orderBy',
        label: 'OrderBy',
        value: '',
      },
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
    const bb = [...configArray];
    const changed = bb.map(obj => {
      if (obj.options.id === id) {
        obj.options.value = obj.options.value.filter((_, i) => i !== index);
      }
      return obj;
    });
    setConfigArray(changed);
  };

  const isFields = () => {
    const row = configArray.filter(con => con.component === 'AddListField');
    return row[0].options.value;
  };

  const addClause = () => {};

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
                        <Form.Label htmlFor={c.options.id} className="mb-0">
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
                          <div className="py-1 small">{c.options.label}</div>
                          <InputGroup size="sm" className="mb-1">
                            <Form.Select size="sm">
                              <option value="">--COLUMN--</option>
                              {isFields().map((v, j) => (
                                <option key={j} value={v}>
                                  {v}
                                </option>
                              ))}
                            </Form.Select>
                            <Form.Select size="sm">
                              <option value="">--CLAUSE--</option>
                              {c.options.conditions.map((c, j) => (
                                <option key={j} value={c.value}>
                                  {c.label}
                                </option>
                              ))}
                            </Form.Select>
                          </InputGroup>

                          <InputGroup size="sm" className="mb-1">
                            <FormControl
                              type="text"
                              value={whereCondition}
                              onChange={e => setWhereCondition(e.target.value)}
                              placeholder="Check MySql where conditions.."
                            />
                            <Button
                              variant="primary"
                              disabled={!whereCondition}
                              onClick={() => addClause()}
                            >
                              <i className="fa fa-thumbs-o-up" />
                            </Button>
                          </InputGroup>
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
                disabled={false}
                variant="primary"
                onClick={() => null}
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
