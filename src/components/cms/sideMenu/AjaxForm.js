/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from 'react';
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
import { Div } from '../BuiltInComponents';

function AjaxForm(props) {
  const userContext = useContext(UserContext);
  const layoutContext = useContext(LayoutContext);
  const [compList, setCompList] = useState([
    {
      component: 'Text Box',
      show: false,
      props: {
        id: '',
        index: '',
        label: '',
        elementType: 'text',
        value: '',
        placeHolder: '',
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
        label: '',
        elementType: 'number',
        value: '',
        placeHolder: '',
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
    console.log('bbb', selectedComponents);
  };

  return (
    <LayoutContext.Consumer>
      {layoutDetails =>
        layoutDetails.state.selectedNodeId ? (
          <div>
            <div className="d-grid">
              <Dropdown>
                <Dropdown.Toggle
                  size="sm"
                  variant={
                    userContext.userData.theme === 'dark' ? 'dark' : 'light'
                  }
                  className="ps-1"
                >
                  Add a Form Element
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
                            {Object.entries(sel.props).map((p, j) => (
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
                                        readOnly={p[0] === 'elementType'}
                                        onChange={e =>
                                          changeParent(i, p[0], e.target.value)
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
                                        <InputGroup size="sm" className="mb-1">
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

export default AjaxForm;
