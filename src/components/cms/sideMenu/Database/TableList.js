import React, { useState, useEffect, useContext } from 'react';
import {
  ListGroup,
  InputGroup,
  FormControl,
  Button,
  Form,
  Dropdown,
  ButtonGroup,
} from 'react-bootstrap';
import apiInstance from '../../../../services/apiServices';
import { UserContext } from '../../../../contexts/UserContext';
import ConfirmationModal from '../../../configuration/Gallery/ConfirmationModal';

function TableList(props) {
  const userContext = useContext(UserContext);
  const [tableList, setTableList] = useState([]);
  const modalDefOptions = {
    show: false,
    message: '',
    table: '',
    action: '',
    past: '',
  };
  const [modalOptions, setModalOptions] = useState(modalDefOptions);

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = () => {
    apiInstance
      .get('/getTables')
      .then(res => {
        const data = res.data.response
          .map(e => Object.entries(e))
          .map(f => ({ oldLabel: f[0][1], renameLabel: f[0][1] }));
        setTableList(data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const renameTable = (index, value) => {
    const bTableList = [...tableList].map((t, i) => {
      if (i === index) {
        t.renameLabel = value;
      }
      return t;
    });
    setTableList(bTableList);
  };

  const tableValidation = e => {
    const ALLOWED_CHARS_REGEXP = /^[a-zA-Z0-9 ]$/g;
    if (!ALLOWED_CHARS_REGEXP.test(e.key) || e.key === ' ') {
      e.preventDefault();
    }
  };

  const renameAction = index => {
    const payload = [...tableList].filter((_, i) => i === index)[0];
    const formdata = new FormData();
    formdata.append('oldLabel', payload.oldLabel);
    formdata.append('newLabel', payload.renameLabel);

    apiInstance
      .post('/renameTable', formdata)
      .then(res => {
        const bool = res.data.response;
        if (bool) {
          userContext.renderToast({
            message: `Table successfully updated`,
          });
          const bTableList = [...tableList].map((t, i) => {
            if (i === index) {
              t.oldLabel = t.renameLabel;
            }
            return t;
          });
          setTableList(bTableList);
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
          message: 'Unable to update table. Please try again.',
        });
      });
  };

  const modalAction = () => {
    if (modalOptions.table && modalOptions.action) {
      const formdata = new FormData();
      formdata.append('table', modalOptions.table);
      formdata.append('action', modalOptions.action);

      apiInstance
        .post('/tableEmptyOrDrop', formdata)
        .then(res => {
          const bool = res.data.response;
          if (bool) {
            userContext.renderToast({
              message: `${modalOptions.table} table successfully ${modalOptions.past}`,
            });
            loadTables();
          }
        })
        .catch(error => {
          userContext.renderToast({
            type: 'error',
            icon: 'fa fa-times-circle',
            message: `Unable to ${modalOptions.action} table. Please try again.`,
          });
        })
        .finally(() => setModalOptions(modalDefOptions));
    }
  };

  return (
    <div>
      <ConfirmationModal
        show={modalOptions.show}
        confirmationstring={modalOptions.message}
        handleHide={() => {
          setModalOptions(modalDefOptions);
        }}
        handleYes={() => modalAction()}
        size="md"
      />

      <div className="py-2 ps-3">Tables</div>
      <div>
        <ListGroup variant="flush">
          {tableList.length > 0 ? (
            tableList.map((t, i) => (
              <ListGroup.Item
                key={i}
                className={`p-1 ${
                  userContext.userData.theme === 'dark'
                    ? 'bg-dark text-light'
                    : 'bg-white text-dark'
                }`}
              >
                <Dropdown
                  autoClose="outside"
                  as={ButtonGroup}
                  className="d-flex justify-content-between align-items-start btn-group-sm"
                >
                  <Button className="text-break" variant="primary w-75">
                    {t.renameLabel}
                  </Button>
                  <Dropdown.Toggle split variant="outline-primary w-25" />
                  <Dropdown.Menu className="p-1">
                    <Dropdown.Item as="div" className="p-1">
                      <Form.Label htmlFor={`renameTable-${i}`}>
                        <small>
                          <b>Rename</b>
                        </small>
                      </Form.Label>
                      <InputGroup size="sm">
                        <FormControl
                          id={`renameTable-${i}`}
                          placeholder="Rename table"
                          value={t.renameLabel}
                          maxLength={32}
                          onChange={e => renameTable(i, e.target.value)}
                          onKeyPress={e => tableValidation(e)}
                        />
                        <Button
                          variant="primary"
                          disabled={!t.renameLabel}
                          onClick={() => renameAction(i)}
                        >
                          <i className="fa fa-thumbs-o-up" />
                        </Button>
                      </InputGroup>
                    </Dropdown.Item>
                    <Dropdown.Item as="div" className="p-1">
                      <button
                        className="btn btn-sm btn-danger w-100"
                        onClick={() =>
                          setModalOptions({
                            show: true,
                            message: `Are you sure to empty table ${t.oldLabel}`,
                            table: t.oldLabel,
                            action: 'empty',
                            past: 'emptied',
                          })
                        }
                      >
                        Empty Table
                      </button>
                    </Dropdown.Item>
                    <Dropdown.Item as="div" className="p-1">
                      <button
                        className="btn btn-sm btn-danger w-100"
                        onClick={() =>
                          setModalOptions({
                            show: true,
                            message: `Are you sure to drop table ${t.oldLabel}`,
                            table: t.oldLabel,
                            action: 'drop',
                            past: 'dropped',
                          })
                        }
                      >
                        Drop Table
                      </button>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </ListGroup.Item>
            ))
          ) : (
            <ListGroup.Item
              className={`py-2 text-center ${
                userContext.userData.theme === 'dark'
                  ? 'bg-dark text-light'
                  : 'bg-white text-dark'
              }`}
            >
              No Tables found
            </ListGroup.Item>
          )}
        </ListGroup>
      </div>
    </div>
  );
}

export default TableList;
