import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import LoginForm from './loginForm';
import ResetForm from '../configuration/resetForm';
import ChangePassword from './changePassword';

function AdminLogin(props) {
	const { onClose, onSuccess } = props;
	const [ view, setView ] = useState("Admin login");

	return (
		<Modal {...props} className="" size={'sm'}>
			<Modal.Header>
				<Modal.Title>
						{view !== "Admin login" && (
							<button onClick={() => setView("Admin login")} className="btn btn-sm btn-default me-2">
								<i className="fa fa-chevron-left" />
							</button>
						)}
					<span className="pl-5">{view}</span>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body className="bg-dark rounded-bottom">
				{view === "Admin login" && <LoginForm onToggle={(val) => setView(val)} onClose={onClose} onSuccess={onSuccess} />}
				{view === 'Reset password' && <ResetForm onClose={onClose} />}
				{view === 'Change password' && <ChangePassword onClose={onClose} />}
			</Modal.Body>
		</Modal>
	);
}

export default AdminLogin;