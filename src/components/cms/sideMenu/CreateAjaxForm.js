import React, { useState, useEffect, useContext } from 'react';
import { LayoutContext } from '../layoutDesign';
import { UserContext } from '../../../contexts/UserContext';
import {
  InputGroup,
  FormControl,
  Button,
  Dropdown,
  Form,
} from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';

function CreateAjaxForm(props) {
  const userContext = useContext(UserContext);
  const layoutContext = useContext(LayoutContext);
  const [config, setConfig] = useState({
    table: '',
    parentClassName: '',
    submitBtnLabel: 'Submit',
    submitBtnClassName: 'btn btn-success',
    successMessage: 'Form successfully posted',
  });
  const configAssoc = {
    table: { label: 'POST Table' },
    parentClassName: { label: 'Wrapper class' },
    submitBtnLabel: { label: 'Submit label' },
    submitBtnClassName: { label: 'Submit class' },
    successMessage: { label: 'Success message' },
  };
  const [listForm, setListForm] = useState({
    id: '',
    label: '',
    value: '',
  });
  const compList = [
    {
      component: 'Text Box',
      show: false,
      props: {
        id: '',
        index: '',
        label: 'Text box',
        elementType: 'text',
        value: '',
        placeHolder: 'Text box',
        className: '',
        options: {
          required: true,
          validation: '/$/',
          errorMsg: '',
        },
      },
    },
    {
      component: 'Text Area',
      show: false,
      props: {
        id: '',
        index: '',
        label: 'Text area',
        elementType: 'textArea',
        value: '',
        placeHolder: 'Text area',
        className: '',
        options: {
          required: true,
          rowLength: '100',
          validation: '/$/',
          errorMsg: '',
        },
      },
    },
    {
      component: 'Number',
      show: false,
      props: {
        id: '',
        index: '',
        label: 'Number',
        elementType: 'number',
        value: '',
        placeHolder: 'Number',
        className: '',
        options: {
          required: true,
          validation: '/$/',
          errorMsg: '',
        },
      },
    },
    {
      component: 'Drop down',
      show: false,
      props: {
        id: '',
        index: '',
        label: 'Drop down',
        elementType: 'dropDown',
        value: '',
        placeHolder: 'Select',
        className: '',
        list: [],
        options: {
          required: true,
          validation: '/$/',
          errorMsg: '',
        },
      },
    },
    {
      component: 'Checkbox',
      show: false,
      props: {
        id: '',
        index: '',
        label: 'Checkbox',
        elementType: 'checkBox',
        value: [],
        className: '',
        list: [],
        options: {
          required: true,
          isInline: true,
          validation: '/$/',
          errorMsg: '',
        },
      },
    },
    {
      component: 'Radio',
      show: false,
      props: {
        id: '',
        index: '',
        label: 'Radio',
        elementType: 'radio',
        value: [],
        className: '',
        list: [],
        options: {
          required: true,
          isInline: true,
          validation: '/$/',
          errorMsg: '',
        },
      },
    },
  ];
  const [selectedComponents, setSelectedComponents] = useState([]);

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
    if (
      layoutContext.state.pageDetails &&
      layoutContext.state.selectedNodeId &&
      layoutContext.state.selectedComponent === 'az-ajaxform'
    ) {
      const details = layoutContext.state.pageDetails.pageObject;
      const nodeId = layoutContext.state.selectedNodeId;
      const selectedProps = findAndGetComponentProps(nodeId, { ...details });

      setConfig({});
      setSelectedComponents([]);

      setTimeout(() => {
        setConfig(prevState => ({
          ...prevState,
          table: selectedProps.config ? selectedProps.config.table : '',
          parentClassName: selectedProps.config
            ? selectedProps.config.parentClassName
            : '',
          submitBtnLabel: selectedProps.config
            ? selectedProps.config.submitBtnLabel
            : 'Submit',
          submitBtnClassName: selectedProps.config
            ? selectedProps.config.submitBtnClassName
            : 'btn btn-success',
          successMessage: selectedProps.config
            ? selectedProps.config.successMessage
            : 'Form successfully posted',
        }));
        setSelectedComponents(selectedProps.structure);
      }, 10);
    } else {
      setConfig({});
      setTimeout(() => {
        setConfig({
          table: '',
          parentClassName: '',
          submitBtnLabel: 'Submit',
          submitBtnClassName: 'btn btn-success',
          successMessage: 'Form successfully posted',
        });
        setSelectedComponents([]);
      }, 10);
    }
  }, [layoutContext.state.pageDetails, layoutContext.state.selectedNodeId]);

  const togglePanel = id => {
    const toggled = [...selectedComponents].map((object, ii) => {
      if (id === ii) {
        return {
          ...object,
          show: !object.show,
        };
      } else return object;
    });
    setSelectedComponents(toggled);
  };

  const removePanel = id => {
    setSelectedComponents(
      [...selectedComponents].filter((object, ii) => ii !== id)
    );
  };

  const changeParent = (id, key, value) => {
    const toggled = [...selectedComponents].map((object, ii) => {
      if (id === ii) {
        return {
          ...object,
          props: {
            ...object.props,
            [key]: value,
          },
        };
      } else return object;
    });
    setSelectedComponents(toggled);
  };

  const changeOptions = (id, key, value) => {
    const toggled = [...selectedComponents].map((object, ii) => {
      if (id === ii) {
        return {
          ...object,
          props: {
            ...object.props,
            options: {
              ...object.props.options,
              [key]: value,
            },
          },
        };
      } else return object;
    });
    setSelectedComponents(toggled);
  };

  const saveProps = () => {
    if (layoutContext.state.selectedComponent !== 'az-ajaxform') {
      save();
    } else {
      const details = [{ ...layoutContext.state.pageDetails.pageObject }];
      const nodeId = layoutContext.state.selectedNodeId;
      const newObject = findAndUpdateProps(details, nodeId, {
        config,
        structure: selectedComponents,
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
        config,
        structure: selectedComponents,
      },
      children: [],
      title: 'AjaxForm',
      component: `az-ajaxform`,
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

  const addList = id => {
    const listAdded = [...selectedComponents].map((object, ii) => {
      if (id === ii) {
        return {
          ...object,
          props: {
            ...object.props,
            list: [...object.props.list, listForm],
          },
        };
      } else return object;
    });
    setSelectedComponents(listAdded);
    setListForm({
      label: '',
      value: '',
      id: '',
    });
  };

  const deleteListItem = (id, index) => {
    const deletedList = [...selectedComponents].map((object, ii) => {
      if (id === ii) {
        return {
          ...object,
          props: {
            ...object.props,
            list: object.props.list.filter((_, i) => i !== index),
          },
        };
      } else return object;
    });
    setSelectedComponents(deletedList);
  };

  const updateListItem = (id, index, value, type) => {
    const updatedList = [...selectedComponents].map((object, ii) => {
      if (id === ii) {
        return {
          ...object,
          props: {
            ...object.props,
            list: object.props.list.map((all, i) => {
              if (i === index) {
                all[type] = value;
              }
              return all;
            }),
          },
        };
      } else return object;
    });
    setSelectedComponents(updatedList);
  };

  const addElement = comp => {
    const newComp = {
      ...comp,
      props: {
        ...comp.props,
        id: selectedComponents.length + 1,
        index: selectedComponents.length + 1,
      },
    };
    setSelectedComponents([...selectedComponents, newComp]);
  };

  return (
    <LayoutContext.Consumer>
      {layoutDetails =>
        layoutDetails.state.selectedNodeId ? (
          <div>
            {Object.keys(config).length > 0 &&
              Object.keys(config).map((conf, i) => (
                <InputGroup key={i} size="sm" className="mb-1">
                  <InputGroup.Text>
                    <Form.Label htmlFor={conf} className="mb-0">
                      {configAssoc[conf].label}
                    </Form.Label>
                  </InputGroup.Text>
                  <FormControl
                    id={conf}
                    defaultValue={config[conf]}
                    onChange={e =>
                      setConfig(prevState => ({
                        ...prevState,
                        [conf]: e.target.value,
                      }))
                    }
                  />
                </InputGroup>
              ))}
            <div className="d-grid">
              <Dropdown>
                <Dropdown.Toggle
                  size="sm"
                  variant={
                    userContext.userData.theme === 'dark' ? 'dark' : 'light'
                  }
                  className="ps-1"
                >
                  Add Form Elements
                </Dropdown.Toggle>
                <Dropdown.Menu
                  variant={
                    userContext.userData.theme === 'dark' ? 'dark' : 'light'
                  }
                >
                  {compList &&
                    compList.length > 0 &&
                    compList.map((comp, i) => (
                      <Dropdown.Item onClick={() => addElement(comp)} key={i}>
                        {comp.component}
                      </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            {selectedComponents && selectedComponents.length > 0 && (
              <div className="mt-2">
                <ul className="list-group mb-2">
                  {selectedComponents.map((sel, i) => (
                    <React.Fragment key={i}>
                      <li
                        className={`list-group-item p-1 small d-flex justify-content-between align-items-center ${
                          userContext.userData.theme === 'dark'
                            ? 'bg-dark text-light'
                            : 'bg-light text-dark'
                        }`}
                      >
                        <span
                          className="cursor-pointer user-select-none"
                          onClick={() => togglePanel(i)}
                        >
                          {sel.component}
                        </span>
                        <i
                          className="fa fa-times-circle text-danger cursor-pointer"
                          onClick={() => removePanel(i)}
                        />
                      </li>
                      {sel.show && (
                        <li
                          className={`list-group-item p-1 small ${
                            userContext.userData.theme === 'dark'
                              ? 'bg-dark text-light'
                              : 'bg-light text-dark'
                          }`}
                        >
                          <div className="list-group">
                            {Object.entries(sel.props)
                              .filter(
                                f => !['elementType', 'value'].includes(f[0])
                              )
                              .map((p, j) => (
                                <React.Fragment key={j}>
                                  <div className="pb-1 small">
                                    {typeof p[1] !== 'object' ? (
                                      <InputGroup size="sm" className="">
                                        <InputGroup.Text>
                                          <Form.Label
                                            htmlFor={`${p[0]}-${i}-${j}`}
                                            className="mb-0"
                                          >
                                            {p[0]}
                                          </Form.Label>
                                        </InputGroup.Text>
                                        <FormControl
                                          id={`${p[0]}-${i}-${j}`}
                                          defaultValue={p[1]}
                                          onChange={e =>
                                            changeParent(
                                              i,
                                              p[0],
                                              e.target.value
                                            )
                                          }
                                        />
                                      </InputGroup>
                                    ) : (
                                      <>
                                        <label className="fst-italic">
                                          {p[0].toUpperCase()}
                                        </label>
                                        {Array.isArray(p[1]) && (
                                          <InputGroup
                                            size="sm"
                                            className="mt-1"
                                          >
                                            <FormControl
                                              placeholder="Option ID"
                                              value={listForm.id}
                                              onChange={e =>
                                                setListForm(prevState => ({
                                                  ...prevState,
                                                  id: e.target.value,
                                                }))
                                              }
                                            />
                                            <FormControl
                                              placeholder="Option label"
                                              value={listForm.label}
                                              onChange={e =>
                                                setListForm(prevState => ({
                                                  ...prevState,
                                                  label: e.target.value,
                                                }))
                                              }
                                            />
                                            <FormControl
                                              placeholder="Option value"
                                              value={listForm.value}
                                              onChange={e =>
                                                setListForm(prevState => ({
                                                  ...prevState,
                                                  value: e.target.value,
                                                }))
                                              }
                                            />
                                            <Button
                                              variant="primary"
                                              disabled={
                                                !(
                                                  listForm.id &&
                                                  listForm.label &&
                                                  listForm.value
                                                )
                                              }
                                              onClick={() => addList(i, p[0])}
                                            >
                                              <i className="fa fa-plus" />
                                            </Button>
                                          </InputGroup>
                                        )}
                                      </>
                                    )}
                                  </div>
                                  {typeof p[1] === 'object' &&
                                    Object.entries(p[1]).length > 0 &&
                                    Object.entries(p[1]).map((o, k) => (
                                      <div key={k} className="pb-1 small">
                                        {typeof o[0] === 'string' &&
                                          typeof o[1] !== 'object' && (
                                            <InputGroup size="sm" className="">
                                              <InputGroup.Text>
                                                <Form.Label
                                                  htmlFor={`${o[0]}-${i}-${j}-${k}`}
                                                  className="mb-0"
                                                >
                                                  {o[0]}
                                                </Form.Label>
                                              </InputGroup.Text>
                                              {typeof o[1] === 'string' && (
                                                <FormControl
                                                  id={`${o[0]}-${i}-${j}-${k}`}
                                                  defaultValue={o[1]}
                                                  onChange={e =>
                                                    changeOptions(
                                                      i,
                                                      o[0],
                                                      e.target.value
                                                    )
                                                  }
                                                />
                                              )}
                                              {typeof o[1] === 'boolean' && (
                                                <InputGroup.Checkbox
                                                  size="sm"
                                                  defaultChecked={o[1]}
                                                  onChange={e =>
                                                    changeOptions(
                                                      i,
                                                      o[0],
                                                      e.target.checked
                                                    )
                                                  }
                                                />
                                              )}
                                            </InputGroup>
                                          )}
                                        {typeof o[0] === 'string' &&
                                          typeof o[1] === 'object' && (
                                            <InputGroup size="sm" className="">
                                              <FormControl
                                                placeholder="Option ID"
                                                value={o[1].id}
                                                onChange={e =>
                                                  updateListItem(
                                                    i,
                                                    k,
                                                    e.target.value,
                                                    'id'
                                                  )
                                                }
                                              />
                                              <FormControl
                                                placeholder="Option label"
                                                value={o[1].label}
                                                onChange={e =>
                                                  updateListItem(
                                                    i,
                                                    k,
                                                    e.target.value,
                                                    'label'
                                                  )
                                                }
                                              />
                                              <FormControl
                                                placeholder="Option value"
                                                value={o[1].value}
                                                onChange={e =>
                                                  updateListItem(
                                                    i,
                                                    k,
                                                    e.target.value,
                                                    'value'
                                                  )
                                                }
                                              />
                                              <Button
                                                variant="danger"
                                                onClick={() =>
                                                  deleteListItem(i, k)
                                                }
                                              >
                                                <i className="fa fa-times" />
                                              </Button>
                                            </InputGroup>
                                          )}
                                      </div>
                                    ))}
                                </React.Fragment>
                              ))}
                          </div>
                        </li>
                      )}
                    </React.Fragment>
                  ))}
                </ul>
              </div>
            )}

            <div className="d-grid mb-1">
              <Button
                size="sm"
                disabled={!selectedComponents || !selectedComponents.length > 0}
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

export default CreateAjaxForm;
