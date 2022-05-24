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
import { UserContext } from '../../../contexts/UserContext';
import { v4 as uuidv4 } from 'uuid';
import apiInstance from '../../../services/apiServices';

function CreateAjaxFetch(props) {
  const layoutContext = useContext(LayoutContext);
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
  const [groupByCondition, setGroupByCondition] = useState('');
  const [fieldName, setFieldName] = useState('');

  const whereClauses = [
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
  ];

  const orderClauses = ['ASC', 'DESC'];

  const config = [
    {
      component: 'AddListField',
      options: {
        id: 'fields',
        label: 'Fields',
        placeholder: 'Column name',
        value: [],
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
      component: 'DropDownField',
      options: {
        id: 'fetchTable',
        label: 'From',
        placeholder: 'Table name',
        value: '',
      },
    },
    {
      component: 'MapListField',
      options: {
        id: 'where',
        label: 'Where',
        value: [],
      },
    },
    {
      component: 'OrderByListField',
      options: {
        id: 'orderBy',
        label: 'Order By',
        value: [],
      },
    },
    {
      component: 'GroupByListField',
      options: {
        id: 'groupBy',
        label: 'Group By',
        value: [],
      },
    },
    {
      component: 'InputField',
      options: { id: 'limit', label: 'Limit', value: 1000, type: 'number' },
    },
  ];
  const [configArray, setConfigArray] = useState(config);
  const fieldConfig = {
    fields: [],
    select: [],
    fetchTable: '',
    where: [],
    orderBy: [],
    limit: '1000',
  };
  const [selectedFields, setSelectedFields] = useState(fieldConfig);
  const [dbTables, setDbTables] = useState([]);

  const loadTables = () => {
    apiInstance
      .get('/getTables')
      .then(res => {
        const data = res.data.response
          .map(e => Object.entries(e))
          .map(f => ({ label: f[0][1], value: f[0][1] }));
        setDbTables(data);
      })
      .catch(error => {
        console.error(error);
        setDbTables([]);
      });
  };

  let r = {};
  const findAndGetComponentProps = (key, node) => {
    if (node.key === key) {
      r = node.props;
    }
    Array.isArray(node.children) &&
      node.children.forEach(ch => {
        findAndGetComponentProps(key, ch);
      });
    return r;
  };

  useEffect(() => {
    loadTables();
  }, []);

  useEffect(() => {
    if (
      layoutContext.state.pageDetails &&
      layoutContext.state.selectedNodeId &&
      layoutContext.state.selectedComponent === 'az-ajaxfetch'
    ) {
      const details = layoutContext.state.pageDetails.pageObject;
      const nodeId = layoutContext.state.selectedNodeId;
      const selectedProps = findAndGetComponentProps(nodeId, { ...details });

      setConfigArray([]);
      setSelectedFields({});

      setTimeout(() => {
        setConfigArray([
          {
            component: 'AddListField',
            options: {
              id: 'fields',
              label: 'Fields',
              placeholder: 'Column name',
              value:
                selectedProps.query && selectedProps.query.fields
                  ? selectedProps.query.fields
                  : [],
            },
          },
          {
            component: 'SelectListField',
            options: {
              id: 'select',
              label: 'Select',
              value:
                selectedProps.query && selectedProps.query.select
                  ? selectedProps.query.select
                  : [],
            },
          },
          {
            component: 'DropDownField',
            options: {
              id: 'fetchTable',
              label: 'From',
              value:
                selectedProps.query && selectedProps.query.fetchTable
                  ? selectedProps.query.fetchTable
                  : '',
            },
          },
          {
            component: 'MapListField',
            options: {
              id: 'where',
              label: 'Where',
              value:
                selectedProps.query && selectedProps.query.where
                  ? selectedProps.query.where
                  : [],
            },
          },
          {
            component: 'OrderByListField',
            options: {
              id: 'orderBy',
              label: 'Order By',
              value:
                selectedProps.query && selectedProps.query.orderBy
                  ? selectedProps.query.orderBy
                  : [],
            },
          },
          {
            component: 'GroupByListField',
            options: {
              id: 'groupBy',
              label: 'Group By',
              value:
                selectedProps.query && selectedProps.query.groupBy
                  ? selectedProps.query.groupBy
                  : [],
            },
          },
          {
            component: 'InputField',
            options: {
              id: 'limit',
              label: 'Limit',
              value:
                selectedProps.query && selectedProps.query.limit
                  ? selectedProps.query.limit
                  : 1000,
              type: 'number',
            },
          },
        ]);
        setSelectedFields(selectedProps.query);
      }, 10);
    } else {
      setConfigArray([]);
      setSelectedFields({});
      setTimeout(() => {
        setConfigArray(config);
        setSelectedFields({});
      }, 10);
    }
  }, [layoutContext.state.pageDetails, layoutContext.state.selectedNodeId]);

  const onInputChange = (id, value) => {
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
    setSelectedFields(prevState => ({
      ...prevState,
      [id]: value,
    }));
    setConfigArray(changed);
  };

  const addRow = row => {
    const bb = [...configArray];
    const changed = bb.map(obj => {
      if (
        ['select', 'fields'].includes(obj.options.id) &&
        !obj.options.value.includes(row)
      ) {
        obj.options.value = [...obj.options.value, row];
        setSelectedFields(prevState => ({
          ...prevState,
          select: obj.options.value,
          fields: obj.options.value,
        }));
      }
      return obj;
    });
    setConfigArray(changed);
    setFieldName('');
  };

  //   useEffect(() => {
  //   }, [configArray]);

  const removeSelectRow = (id, value) => {
    const deletedArray = [...configArray].map(obj => {
      if (obj.options.id === id) {
        obj.options.value = obj.options.value.filter(
          v => String(v) !== String(value)
        );
        setSelectedFields(prevState => ({
          ...prevState,
          [id]: obj.options.value,
        }));
      }
      return obj;
    });
    setConfigArray(deletedArray);
  };

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
        obj.options.value = !existingFields.length
          ? [] // reset if fields is empty
          : obj.options.value.filter(f => f);
      }
      if (obj.component === 'OrderByListField') {
        obj.options.value = obj.options.value.filter(f =>
          existingFields.includes(f.column)
        );
      }
      if (obj.component === 'GroupByListField') {
        obj.options.value = obj.options.value.filter(f =>
          existingFields.includes(f)
        );
      }

      setSelectedFields(prevState => ({
        ...prevState,
        [obj.options.id]: obj.options.value,
      }));
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
        setSelectedFields(prevState => ({
          ...prevState,
          where: obj.options.value,
        }));
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

  const selectOnTextChange = (value, index) => {
    const changed = [...configArray].map(obj => {
      if (obj.component === 'SelectListField') {
        obj.options.value = obj.options.value.map((v, j) => {
          if (j === index) {
            v = value;
          }
          return v;
        });
        setSelectedFields(prevState => ({
          ...prevState,
          select: obj.options.value,
        }));
      }
      return obj;
    });
    setConfigArray(changed);
  };

  const saveButtonStatus = () => {
    const selectRows =
      configArray.length > 0
        ? configArray.filter(con => con.component === 'SelectListField')[0]
            .options.value.length
        : false;

    const table =
      configArray.length > 0
        ? configArray.filter(
            con =>
              con.component === 'DropDownField' &&
              con.options.id === 'fetchTable'
          )[0].options.value
        : '';

    return selectRows && table;
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
        setSelectedFields(prevState => ({
          ...prevState,
          orderBy: obj.options.value,
        }));
      }
      return obj;
    });
    setConfigArray(changed);
    setOrderByCondition({
      column: '',
      clause: '',
    });
  };

  const addGroupByClause = () => {
    const changed = [...configArray].map(obj => {
      if (
        obj.component === 'GroupByListField' &&
        !obj.options.value.filter(f => f === groupByCondition).length
      ) {
        obj.options.value = [...obj.options.value, groupByCondition];
        setSelectedFields(prevState => ({
          ...prevState,
          groupBy: obj.options.value,
        }));
      }
      return obj;
    });
    setConfigArray(changed);
    setGroupByCondition('');
  };

  const saveProps = () => {
    if (layoutContext.state.selectedComponent !== 'az-ajaxfetch') {
      save();
    } else {
      const details = [{ ...layoutContext.state.pageDetails.pageObject }];
      const nodeId = layoutContext.state.selectedNodeId;
      const newObject = findAndUpdateProps(details, nodeId, {
        query: selectedFields,
      })[0];

      layoutContext.setState(prevState => ({
        ...prevState,
        pageDetails: {
          ...prevState.pageDetails,
          pageObject: newObject,
        },
      }));
    }
  };

  const findAndUpdateProps = (arr, selectedKey, updatedFormList) => {
    return arr.map(item => {
      if (item.key === selectedKey) {
        item.props = updatedFormList;
      }
      item.children = findAndUpdateProps(
        item.children,
        selectedKey,
        updatedFormList
      );
      return item;
    });
  };

  const save = () => {
    const sample = {
      key: uuidv4(),
      props: {
        query: selectedFields,
      },
      children: [],
      title: 'AjaxFetch',
      component: `az-ajaxfetch`,
    };

    const newObject = findAndAddComponent(
      layoutContext.state.selectedNodeId,
      { ...layoutContext.state.pageDetails.pageObject },
      sample
    );

    layoutContext.setState(prevState => ({
      ...prevState,
      selectedNodeId: sample.key,
      selectedComponent: sample.component,
      pageDetails: {
        ...prevState.pageDetails,
        pageObject: newObject,
      },
    }));
  };

  const findAndAddComponent = (key, node, insertObj) => {
    if (node.key === key) {
      node.children &&
        Array.isArray(node.children) &&
        node.children.push(insertObj);
    }
    node.children &&
      node.children.length > 0 &&
      node.children.forEach(ch => {
        findAndAddComponent(key, ch, insertObj);
      });
    return node;
  };
  return (
    <LayoutContext.Consumer>
      {layoutDetails =>
        layoutDetails.state.selectedNodeId ? (
          <div>
            {configArray.length > 0 &&
              configArray.map((c, i) => {
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
                          placeholder={c.options.placeholder}
                          onChange={e =>
                            onInputChange(c.options.id, e.target.value)
                          }
                        />
                      </InputGroup>
                    );
                  case 'DropDownField':
                    return (
                      <>
                        <div className="py-1 text-primary">
                          {c.options.label}
                        </div>

                        <InputGroup key={i} size="sm" className="mb-1">
                          <Form.Select
                            id={c.options.id}
                            value={c.options.value}
                            onChange={e =>
                              onInputChange(c.options.id, e.target.value)
                            }
                          >
                            <option value="">--TABLE--</option>
                            {dbTables.length > 0 &&
                              dbTables.map((t, j) => (
                                <option key={j} value={t.value}>
                                  {t.label}
                                </option>
                              ))}
                          </Form.Select>
                        </InputGroup>
                      </>
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
                            placeholder={c.options.placeholder}
                            onChange={e => setFieldName(e.target.value)}
                          />
                          <Button
                            variant="primary"
                            disabled={!fieldName}
                            onClick={() => addRow(fieldName)}
                          >
                            <i className="fa fa-plus" />
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
                                {whereClauses.map((c, j) => (
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
                                placeholder="Your condition ??"
                              />
                              <Button
                                variant="primary"
                                disabled={
                                  !(
                                    whereCondition.column &&
                                    whereCondition.clause
                                  )
                                }
                                onClick={() => addClause()}
                              >
                                <i className="fa fa-plus" />
                              </Button>
                            </InputGroup>
                            {c.options.value && c.options.value.length > 0 && (
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
                                        onClick={() =>
                                          removeRow(c.options.id, j)
                                        }
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
                            {c.options.value.map((v, j) => (
                              <InputGroup key={j} size="sm" className="mb-1">
                                <FormControl
                                  title={`Set alias or aggregate fn() for column ${v}`}
                                  placeholder={`Alias / fn()`}
                                  value={v}
                                  onChange={e =>
                                    selectOnTextChange(e.target.value, j)
                                  }
                                />
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() =>
                                    removeSelectRow(
                                      c.options.id,
                                      c.options.value[j]
                                    )
                                  }
                                >
                                  <i className="fa fa-times-circle" />
                                </Button>
                              </InputGroup>
                            ))}
                          </>
                        )}
                      </div>
                    );
                  case 'OrderByListField':
                    return (
                      <div key={i}>
                        {isFields() && isFields().length > 0 && (
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
                                {isFields().length > 0 &&
                                  isFields().map((v, j) => (
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
                                <option value="">--ORDER--</option>
                                {orderClauses.map((c, j) => (
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
                                <i className="fa fa-plus" />
                              </Button>
                            </InputGroup>
                            {c.options.value && c.options.value.length > 0 && (
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
                                        onClick={() =>
                                          removeRow(c.options.id, j)
                                        }
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
                  case 'GroupByListField':
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
                                  setGroupByCondition(e.target.value)
                                }
                                value={groupByCondition}
                              >
                                <option value="">--COLUMN--</option>
                                {isFields().length > 0 &&
                                  isFields().map((v, j) => (
                                    <option key={j} value={v}>
                                      {v}
                                    </option>
                                  ))}
                              </Form.Select>
                              <Button
                                variant="primary"
                                disabled={!groupByCondition}
                                onClick={() => addGroupByClause()}
                              >
                                <i className="fa fa-plus" />
                              </Button>
                            </InputGroup>
                            {c.options.value && c.options.value.length > 0 && (
                              <ul className="list-group mb-2">
                                {c.options.value.map((v, k) => (
                                  <li
                                    key={k}
                                    className={`list-group-item p-1 small d-flex justify-content-between align-items-center ${
                                      userContext.userData.theme === 'dark'
                                        ? 'bg-dark text-light'
                                        : 'bg-light text-dark'
                                    }`}
                                  >
                                    <div className="user-select-none overflow-auto">
                                      <div className="small">
                                        <span>{v}</span>
                                        <span className="ms-1 small badge bg-success">
                                          <i className="fa fa-arrows-v" />
                                        </span>
                                      </div>
                                    </div>
                                    <div>
                                      <i
                                        className="fa fa-times-circle text-danger cursor-pointer"
                                        onClick={() =>
                                          removeRow(c.options.id, k)
                                        }
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
