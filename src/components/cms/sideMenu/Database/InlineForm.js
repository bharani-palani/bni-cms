import React from 'react';
import {
  InputGroup,
  FormControl,
  Button,
  Form,
  Dropdown,
} from 'react-bootstrap';
import { TableConfigContext } from './TableConfig';

function InlineForm(props) {
  const { mode } = props;
  return (
    <TableConfigContext.Consumer>
      {({
        inputTypeList,
        addType,
        formType,
        setFormType,
        editInlineForm,
        addColumnInlineForm,
      }) => (
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
          {mode === 'create' && (
            <Dropdown autoClose="outside">
              <Dropdown.Toggle split />
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
          )}
          {mode === 'create' && (
            <Button
              disabled={!(formType.field && formType.type)}
              onClick={() => addType()}
            >
              <i className="fa fa-plus" />
            </Button>
          )}
          {mode === 'edit' && (
            <Button
              disabled={!(formType.field && formType.type)}
              onClick={() => editInlineForm()}
            >
              <i className="fa fa-pencil" />
            </Button>
          )}
          {mode === 'add' && (
            <Button
              disabled={!(formType.field && formType.type)}
              onClick={() => addColumnInlineForm()}
            >
              <i className="fa fa-level-up" />
            </Button>
          )}
        </InputGroup>
      )}
    </TableConfigContext.Consumer>
  );
}

export default InlineForm;
