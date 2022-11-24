import React, { useState, useContext } from 'react';
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
import { TableConfigContext } from './TableConfig';
import AppContext from '../../../../contexts/AppContext';

function TableList(props) {
  const [appData] = useContext(AppContext);
  const userContext = useContext(UserContext);
  const tableConfigContext = useContext(TableConfigContext);
  const axiosOptions = {
    headers: { 'Awzy-Authorization': appData.token },
  };

  const modalDefOptions = {
    show: false,
    message: '',
    table: '',
    action: '',
    past: '',
  };
  const [modalOptions, setModalOptions] = useState(modalDefOptions);

  const renameTable = (index, value) => {
    const tableList = [...tableConfigContext.tableList];
    const bTableList = tableList.map((t, i) => {
      if (i === index) {
        t.renameLabel = value;
      }
      return t;
    });
    tableConfigContext.setTableList(bTableList);
  };

  const tableValidation = e => {
    const ALLOWED_CHARS_REGEXP = /^[a-z0-9 ]$/g;
    if (!ALLOWED_CHARS_REGEXP.test(e.key) || e.key === ' ') {
      e.preventDefault();
    }
  };

  const renameAction = index => {
    const payload = [...tableConfigContext.tableList].filter(
      (_, i) => i === index
    )[0];
    const formdata = new FormData();
    formdata.append('oldLabel', payload.oldLabel);
    formdata.append('newLabel', payload.renameLabel);

    apiInstance
      .post('/renameTable', formdata, axiosOptions)
      .then(res => {
        const bool = res.data.response;
        if (bool) {
          userContext.renderToast({
            message: `Table successfully updated`,
          });
          const tableList = [...tableConfigContext.tableList];
          const bTableList = tableList.map((t, i) => {
            if (i === index) {
              t.oldLabel = t.renameLabel;
            }
            return t;
          });
          tableConfigContext.setTableList(bTableList);
        } else {
          userContext.renderToast({
            type: 'error',
            icon: 'fa fa-times-circle',
            message:
              'Oops.. Some thing wrong in your table name. Please correct them and try again.',
          });
        }
      })
      .catch(error => {
        userContext.renderToast({
          type: 'error',
          icon: 'fa fa-times-circle',
          message: 'Oops.. Some thing went wrong. Please try again.',
        });
      })
      .finally(() => document.dispatchEvent(new MouseEvent('click')));
  };

  const modalAction = () => {
    if (modalOptions.table && modalOptions.action) {
      const formdata = new FormData();
      formdata.append('table', modalOptions.table);
      formdata.append('action', modalOptions.action);

      apiInstance
        .post('/tableEmptyOrDrop', formdata, axiosOptions)
        .then(res => {
          const bool = res.data.response;
          if (bool) {
            userContext.renderToast({
              message: `Table "${modalOptions.table}" successfully ${modalOptions.past}`,
            });
            tableConfigContext.loadTables();
          }
        })
        .catch(error => {
          userContext.renderToast({
            type: 'error',
            icon: 'fa fa-times-circle',
            message: `Unable to ${modalOptions.action} table. Please try again.`,
          });
        })
        .finally(() => {
          setModalOptions(modalDefOptions);
        });
    }
  };

  return (
    <TableConfigContext.Consumer>
      {({ tableList, loading, setInfoList }) => (
        <>
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
              {tableList.length > 0 &&
                !loading &&
                tableList.map((t, i) => (
                  <ListGroup.Item
                    key={i}
                    className={`p-1 ${
                      userContext.userData.theme === 'dark'
                        ? 'bg-dark text-white'
                        : 'bg-white text-dark'
                    }`}
                  >
                    <Dropdown
                      autoClose="outside"
                      as={ButtonGroup}
                      className="d-flex justify-content-between align-items-start btn-group-sm"
                    >
                      <Button
                        onClick={() => setInfoList({ table: t.oldLabel })}
                        className="text-break"
                        variant="primary w-75"
                      >
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
                ))}
              {!tableList.length && !loading && (
                <ListGroup.Item
                  className={`py-2 text-center ${
                    userContext.userData.theme === 'dark'
                      ? 'bg-dark text-white'
                      : 'bg-white text-dark'
                  }`}
                >
                  <em>No Tables found</em>
                </ListGroup.Item>
              )}
            </ListGroup>
          </div>
        </>
      )}
    </TableConfigContext.Consumer>
  );
}

export default TableList;
