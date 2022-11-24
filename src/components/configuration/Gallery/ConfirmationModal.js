import React, { useContext } from 'react';
import { Modal } from 'react-bootstrap';
import { UserContext } from '../../../contexts/UserContext';

function ConfirmationModal(props) {
  const userContext = useContext(UserContext);
  const { confirmationstring, handleHide, handleYes, ...rest } = props;

  return (
    <Modal {...rest} style={{ zIndex: 9999 }}>
      <Modal.Header
        className={`${
          userContext.userData.theme === 'dark'
            ? 'bg-dark text-white'
            : 'bg-white text-dark'
        }`}
      >
        <Modal.Title as="p">{confirmationstring}</Modal.Title>
      </Modal.Header>
      <Modal.Body
        className={`rounded-bottom border-0 ${
          userContext.userData.theme === 'dark'
            ? 'bg-dark text-white'
            : 'bg-white text-dark'
        }`}
      >
        <p className="text-center">This action cannot be undone!</p>
        <div className="row">
          <div className="col-6 text-center d-grid">
            <button onClick={() => handleYes()} className="btn btn-az">
              <i className="fa fa-thumbs-o-up" />
            </button>
          </div>
          <div className="col-6 text-center d-grid">
            <button onClick={() => handleHide()} className="btn btn-az dark">
              <i className="fa fa-thumbs-o-down" />
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ConfirmationModal;
