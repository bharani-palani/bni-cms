import React, { useContext, useState } from 'react';
import { UserContext } from '../../../../contexts/UserContext';
import { TableConfigContext } from './TableConfig';
import ConfirmationModal from '../../../configuration/Gallery/ConfirmationModal';
import apiInstance from '../../../../services/apiServices';
import { Button, Modal } from 'react-bootstrap';
import InlineForm from './InlineForm';

function TableInfo(props) {
  const tableConfigContext = useContext(TableConfigContext);
  const userContext = useContext(UserContext);
  const modalDefOptions = {
    show: false,
    field: '',
    table: '',
  };
  const [modalOptions, setModalOptions] = useState(modalDefOptions);

  const modalAction = () => {
    const formdata = new FormData();
    formdata.append('table', modalOptions.table);
    formdata.append('field', modalOptions.field);

    apiInstance
      .post('/dropTableColumn', formdata)
      .then(res => {
        const bool = res.data.response;
        if (bool) {
          userContext.renderToast({
            message: `Column "${modalOptions.field}" from table "${modalOptions.table}" successfully dropped`,
          });
          tableConfigContext.setInfoList({ table: modalOptions.table });
        } else {
          userContext.renderToast({
            type: 'error',
            icon: 'fa fa-times-circle',
            message: 'Oops.. Unable to drop column. Please try again.',
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
      .finally(() => setModalOptions(modalDefOptions));
  };

  return (
    <TableConfigContext.Consumer>
      {({
        infoList,
        setFormType,
        defaultOptions,
        setTableName,
        editModalShow,
        setEditModalShow,
        createColumnModalShow,
        setCreateColumnModalShow,
      }) => (
        <div>
          <ConfirmationModal
            show={modalOptions.show}
            confirmationstring={`Are you sure? Drop column ${modalOptions.field} from table ${modalOptions.table}`}
            handleHide={() => {
              setModalOptions(modalDefOptions);
            }}
            handleYes={() => modalAction()}
            size="md"
          />
          <Modal
            show={editModalShow}
            backdrop="static"
            centered
            size="lg"
            keyboard={false}
            onHide={() => {
              setModalOptions(modalDefOptions);
              setEditModalShow(false);
              setFormType(defaultOptions);
              setTableName('');
            }}
            className={
              userContext.userData.theme === 'dark' ? 'bg-dark' : 'bg-light'
            }
            style={{
              zIndex: 9999,
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title as="div">
                Table &quot;{infoList.table}&quot;
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Edit column</p>
              <InlineForm mode="edit" />
            </Modal.Body>
          </Modal>
          <Modal
            show={createColumnModalShow}
            backdrop="static"
            centered
            size="lg"
            keyboard={false}
            onHide={() => {
              setModalOptions(modalDefOptions);
              setCreateColumnModalShow(false);
              setFormType(defaultOptions);
              setTableName('');
            }}
            className={
              userContext.userData.theme === 'dark' ? 'bg-dark' : 'bg-light'
            }
            style={{
              zIndex: 9999,
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title as="div">
                Table &quot;{infoList.table}&quot;
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Add column</p>
              <InlineForm mode="add" />
            </Modal.Body>
          </Modal>
          <div className="py-2">
            <h4 className="">{infoList.table}</h4>
            <span className="badge bg-success">
              {infoList.records} record(s)
            </span>
          </div>
          <div className="table-responsive">
            <table
              className={`table table-sm table-striped ${
                userContext.userData.theme === 'dark'
                  ? 'table-dark'
                  : 'table-light'
              }`}
              style={{ minWidth: '768px' }}
            >
              <thead>
                <tr>
                  <th>
                    <i className="fa fa-cog" />
                  </th>
                  {Object.keys(infoList.data[0]).map((h, i) => (
                    <th key={i}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {infoList.data.map((h, i) => (
                  <tr key={i}>
                    <td>
                      <div className="pt-1 d-flex justify-content-between align-items-center">
                        <i
                          className="fa fa-times-circle cursor-pointer text-danger me-1"
                          onClick={() =>
                            setModalOptions({
                              show: true,
                              field: h.Field,
                              table: infoList.table,
                            })
                          }
                        />
                        <i
                          className="fa fa-pencil cursor-pointer text-success"
                          onClick={() => {
                            setEditModalShow(true);
                            setFormType(prevState => ({
                              ...prevState,
                              oldField: h.Field,
                              field: h.Field,
                            }));
                            setTableName(infoList.table);
                          }}
                        />
                      </div>
                    </td>
                    {Object.keys(h).map((r, j) => (
                      <td key={j}>{h[r]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button
            size="sm"
            className="my-2"
            onClick={() => setCreateColumnModalShow(true)}
          >
            Add Column
          </Button>
        </div>
      )}
    </TableConfigContext.Consumer>
  );
}

export default TableInfo;
