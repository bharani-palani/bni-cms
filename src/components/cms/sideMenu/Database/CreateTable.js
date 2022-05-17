import React, { useContext } from 'react';
import {
  ListGroup,
  InputGroup,
  FormControl,
  Button,
  Form,
} from 'react-bootstrap';
import apiInstance from '../../../../services/apiServices';
import { TableConfigContext } from './TableConfig';
import { UserContext } from '../../../../contexts/UserContext';
import InlineForm from './InlineForm';

function CreateTable(props) {
  const tableConfigContext = useContext(TableConfigContext);
  const userContext = useContext(UserContext);

  const removeField = index => {
    const filtered = [...tableConfigContext.selectedTypes].filter(
      (_, i) => i !== index
    );
    tableConfigContext.setSelectedTypes(filtered);
  };

  const createTable = () => {
    const formdata = new FormData();
    formdata.append('table', tableConfigContext.tableName);
    formdata.append('fields', JSON.stringify(tableConfigContext.selectedTypes));

    apiInstance
      .post('/createTable', formdata)
      .then(res => {
        const bool = res.data.response;
        if (bool) {
          userContext.renderToast({
            message: `Table "${tableConfigContext.tableName}" successfully created`,
          });
          tableConfigContext.loadTables();
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
          message: 'Oops.. Some thing wrong. Please try again.',
        });
      })
      .finally(() => {
        tableConfigContext.setSelectedTypes([]);
        tableConfigContext.setTableName('');
      });
  };

  return (
    <TableConfigContext.Consumer>
      {({ selectedTypes, tableName, setTableName }) => (
        <div className="border-1 border-bottom pb-3">
          <div className="py-2">
            <div>Create Table</div>
            <em>
              <a
                className="link-primary small"
                href="https://dev.mysql.com/doc/refman/8.0/en/creating-tables.html"
                rel="noreferrer"
                target="_blank"
              >
                Read docs before creating one
              </a>
            </em>
          </div>
          <div className="mb-2">
            <div className="col-md-3">
              <small className="badge bg-danger mb-1">
                <em>
                  Note: Table name can`t not start with reserved keyword
                  &quot;az &quot;
                </em>
              </small>
              <InputGroup size="sm" className="mb-2">
                <InputGroup.Text>
                  <Form.Label htmlFor="tableName" className="mb-0">
                    Table name
                  </Form.Label>
                </InputGroup.Text>
                <FormControl
                  id="tableName"
                  value={tableName}
                  onChange={e => setTableName(e.target.value)}
                />
              </InputGroup>
            </div>
            <div className="col-lg-6">
              <InlineForm mode="create" />
            </div>
          </div>
          {selectedTypes.length > 0 && (
            <div className="mb-2 col-lg-6">
              <ListGroup>
                {selectedTypes.map((a, i) => (
                  <ListGroup.Item
                    key={i}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      {a.keys.length > 0 && (
                        <i className="fa fa-key text-danger me-2" />
                      )}
                      <span>{a.field}</span>
                      <span className="badge bg-primary ms-2">
                        {a.type} {a.constraint && `(${a.constraint})`}
                      </span>
                    </div>
                    <i
                      onClick={() => removeField(i)}
                      className="fa fa-times cursor-pointer text-danger"
                    />
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}
          <Button
            onClick={() => createTable()}
            disabled={!(selectedTypes.length > 0 && tableName)}
            size="sm"
          >
            Create
          </Button>
        </div>
      )}
    </TableConfigContext.Consumer>
  );
}

export default CreateTable;
