/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { LayoutContext } from '../layoutDesign';
import {
  InputGroup,
  FormControl,
  Button,
  Dropdown,
  Form,
} from 'react-bootstrap';

function CreateAjaxFetch(props) {
  const [config, setConfig] = useState({
    fetchTable: '',
    limit: '',
    recordsPerPage: '',
    sequence: '',
    orderBy: '',
  });
  const configAssoc = {
    fetchTable: { label: 'GET Table', type: 'text' },
    limit: { label: 'Limit', type: 'number' },
    recordsPerPage: { label: 'Records per page', type: 'number' },
    sequence: {
      label: 'Sequence',
      type: 'dropDown',
      list: [
        { label: 'ASC', value: 'ASC' },
        { label: 'DESC', value: 'DESC' },
      ],
    },
    orderBy: { label: 'Order by', type: 'text' },
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
          </div>
        ) : (
          <div className="text-muted small px-1">Please select a component</div>
        )
      }
    </LayoutContext.Consumer>
  );
}

export default CreateAjaxFetch;
