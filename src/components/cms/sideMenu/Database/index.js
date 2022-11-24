import React, { useState, useContext } from 'react';
import { Modal } from 'react-bootstrap';
import TableConfig from './TableConfig';
import { UserContext } from '../../../../contexts/UserContext';
import { LayoutContext } from '../../layoutDesign';

function Database(props) {
  const layoutContext = useContext(LayoutContext);
  const userContext = useContext(UserContext);
  const [show, setShow] = useState(false); // change to false

  return (
    <div className="d-grid">
      <Modal
        style={{ zIndex: 9999 }}
        backdrop="static"
        fullscreen={true}
        show={show}
        onHide={() => {
          setShow(false);
          layoutContext.setState(prevState => ({
            ...prevState,
            selectedNodeId: '',
            selectedComponent: '',
          }));
        }}
      >
        <Modal.Header
          closeButton
          className={`rounded-0 ${userContext.userData.theme === 'dark'
            ? 'bg-dark text-white'
            : 'bg-white text-dark'
            }`}
        >
          <Modal.Title as="p">Database - Table config</Modal.Title>
        </Modal.Header>
        <Modal.Body
          className={`pt-0 pb-0 ${userContext.userData.theme === 'dark'
            ? 'bg-dark text-white'
            : 'bg-white text-dark'
            }`}
        >
          <TableConfig />
        </Modal.Body>
      </Modal>
      <button
        onClick={() => setShow(true)}
        className="btn btn-primary btn-sm mb-1"
      >
        Config
      </button>
    </div>
  );
}

export default Database;
