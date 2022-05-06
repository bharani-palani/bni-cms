/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext, useRef } from 'react';
import { LayoutContext } from '../layoutDesign';
import { UserContext } from '../../../contexts/UserContext';
import {
  InputGroup,
  FormControl,
  Button,
  Dropdown,
  ButtonGroup,
  DropdownButton,
  Form,
} from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';

function CreateAjaxForm(props) {
  const userContext = useContext(UserContext);
  const layoutContext = useContext(LayoutContext);
  const [apiUrl, setApiUrl] = useState('');
  const [compList, setCompList] = useState([
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
  ]);
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
      layoutContext.state.selectedComponent === 'app-ajaxform'
    ) {
      const details = layoutContext.state.pageDetails.pageObject;
      const nodeId = layoutContext.state.selectedNodeId;
      const selectedProps = findAndGetComponentProps(nodeId, { ...details });
      const { apiUrl, structure } = selectedProps;
      setApiUrl(apiUrl);
      setSelectedComponents(structure);
    } else {
      setApiUrl('');
      setSelectedComponents([]);
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
    if (layoutContext.state.selectedComponent !== 'app-ajaxform') {
      save();
    } else {
      const details = [{ ...layoutContext.state.pageDetails.pageObject }];
      const nodeId = layoutContext.state.selectedNodeId;
      const newObject = findAndUpdateProps(details, nodeId, {
        apiUrl,
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
        apiUrl,
        structure: selectedComponents,
      },
      children: [],
      title: 'AjaxForm',
      component: `app-ajaxform`,
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
            <InputGroup size="sm" className="mb-1">
              <InputGroup.Text>
                <Form.Label htmlFor="apiUrl" className="mb-0">
                  AJAX URL
                </Form.Label>
              </InputGroup.Text>
              <FormControl
                id="apiUrl"
                // {...(layoutDetails.state.selectedComponent !== 'app-ajaxform' && { defaultValue: apiUrl })}
                defaultValue={apiUrl}
                onChange={e => setApiUrl(e.target.value)}
              />
            </InputGroup>
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
                  {compList.length > 0 &&
                    compList.map((comp, i) => (
                      <Dropdown.Item
                        onClick={() => {
                          setSelectedComponents([...selectedComponents, comp]);
                        }}
                        key={i}
                      >
                        {comp.component}
                      </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            {selectedComponents.length > 0 && (
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
                              .filter(f => f[0] !== 'elementType')
                              .map((p, j) => (
                                <React.Fragment key={j}>
                                  <div className="p-1 small">
                                    {typeof p[1] !== 'object' ? (
                                      <InputGroup size="sm" className="mb-1">
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
                                      <b>{p[0].toUpperCase()}</b>
                                    )}
                                  </div>
                                  {typeof p[1] === 'object' &&
                                    Object.entries(p[1]).map((o, k) => (
                                      <div key={k} className="p-1 small">
                                        {typeof o[1] !== 'object' && (
                                          <InputGroup
                                            size="sm"
                                            className="mb-1"
                                          >
                                            <InputGroup.Text>
                                              <Form.Label
                                                htmlFor={`${o[0]}-${i}-${j}-${k}`}
                                                className="mb-0"
                                              >
                                                {o[0]}
                                              </Form.Label>
                                            </InputGroup.Text>
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
                <div className="d-grid mb-1">
                  <Button
                    size="sm"
                    variant="primary"
                    disabled={!apiUrl && selectedComponents.length}
                    onClick={() => saveProps()}
                  >
                    <i className="fa fa-thumbs-o-up" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-muted small px-1">Please select a component</div>
        )
      }
    </LayoutContext.Consumer>
  );
}

export default CreateAjaxForm;
