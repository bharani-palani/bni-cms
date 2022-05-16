import React, { useContext, useState } from 'react';
import { UserContext } from '../../../../contexts/UserContext';
import { TableConfigContext } from './TableConfig';
import ConfirmationModal from '../../../configuration/Gallery/ConfirmationModal';
import apiInstance from '../../../../services/apiServices';
import { Button, Modal } from 'react-bootstrap';

function TableInfo(props) {
  const tableConfigContext = useContext(TableConfigContext);
  const userContext = useContext(UserContext);
  const modalDefOptions = {
    show: false,
    field: '',
    table: '',
  };
  const [modalOptions, setModalOptions] = useState(modalDefOptions);
  const defEditModalOptions = {
    show: false,
    table: '',
    field: '',
    update: {},
  };
  const [editModalOptions, setEditModalOptions] = useState(defEditModalOptions);

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
      {({ infoList }) => (
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
            show={editModalOptions.show}
            style={{ zIndex: 9999 }}
            backdrop="static"
            centered
            size="lg"
            keyboard={false}
            onHide={() => setEditModalOptions(defEditModalOptions)}
          >
            <Modal.Header closeButton>
              <Modal.Title as="div">Edit column</Modal.Title>
            </Modal.Header>
            <Modal.Body>content</Modal.Body>
          </Modal>
          <div className="py-2">
            <span className="badge bg-primary me-1">{infoList.table}</span>
            <span className="badge bg-success ms-1">
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
                          onClick={() =>
                            setEditModalOptions({
                              show: true,
                              table: infoList.table,
                              field: h.Field,
                              update: {},
                            })
                          }
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
            <Button size="sm">Add Column</Button>
          </div>
        </div>
      )}
    </TableConfigContext.Consumer>
  );
}

export default TableInfo;
