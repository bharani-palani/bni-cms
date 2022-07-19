import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import LoginForm from './loginForm';
import ResetForm from './resetForm';
import ChangePassword from './changePassword';

function AdminLogin(props) {
  const { onClose, onSuccess } = props;
  const [view, setView] = useState('Awzy login');

  return (
    <Modal {...props} className="" size={'sm'} centered>
      <Modal.Dialog className="m-0">
        <Modal.Header
          className={`rounded-0`}
        >
          <Modal.Title as="div">
            {view !== 'Awzy login' && (
              <button
                onClick={() => setView('Awzy login')}
                className="btn btn-sm btn-default me-2"
              >
                <i className="fa fa-chevron-left" />
              </button>
            )}
            <span className="pl-5">{view}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          className={`rounded-0`}
        >
          <div className="text-dark">
            {view === 'Awzy login' && (
              <LoginForm
                onToggle={val => setView(val)}
                onClose={onClose}
                onSuccess={onSuccess}
              />
            )}
            {view === 'Reset password' && <ResetForm onClose={onClose} />}
            {view === 'Change password' && <ChangePassword onClose={onClose} />}
          </div>
        </Modal.Body>
      </Modal.Dialog>
    </Modal>
  );
}

export default AdminLogin;
