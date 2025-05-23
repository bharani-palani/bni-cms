import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import GoogleLogin from 'react-google-login';
import AppContext from '../../contexts/AppContext';
import { UserContext } from '../../contexts/UserContext';
import ConfirmationModal from '../configuration/Gallery/ConfirmationModal';
import AdminLogin from './adminLogin';
import { SignedUrl } from '../configuration/Gallery/SignedUrl';
import CryptoJS from 'crypto-js';
import { encryptSaltKey } from '../configuration/crypt';
import FacebookLogin from 'react-facebook-login';
import apiInstance from '../../services/apiServices';

const LoginUser = props => {
  const { onLogAction } = props;
  const userContext = useContext(UserContext);
  const [appData] = useContext(AppContext);
  const [animateType, setAnimateType] = useState('');
  const [openModal, setOpenModal] = useState(false); // change to false
  const [openAppLoginModal, setOpenAppLoginModal] = useState(false); // change to false
  const axiosOptions = {
    headers: { 'Awzy-Authorization': appData.token },
  };

  const handleLoginResponse = response => {
    const data = JSON.stringify(response);
    localStorage.setItem('userData', data);
    userContext.addUserData(JSON.parse(data));
    userContext.updateUserData('type', response.type);
    onLogAction(response);
    saveLog(response);
    setAnimateType('slideInRight');
  };

  const saveLog = response => {
    let spread = {};
    fetch('https://geolocation-db.com/json/')
      .then(response => {
        return response.json();
      })
      .then(res => {
        spread = {
          ...response,
          ...{ time: new Date().toString(), ip: res.IPv4 },
        };
      })
      .catch(() => {
        spread = {
          ...response,
          ...{ time: new Date().toString(), ip: '127.0.0.1' },
        };
      })
      .finally(() => {
        const formdata = new FormData();
        formdata.append('log', JSON.stringify(spread));
        apiInstance.post('/saveLog', formdata, axiosOptions);
      });
  };

  const onLogout = () => {
    userContext.removeUserData([
      'email',
      'imageUrl',
      'name',
      'rest',
      'source',
      'userId',
    ]);
    userContext.updateUserData('type', 'public');
    localStorage.removeItem('userData');
    onLogAction({});
    setOpenModal(false);
  };

  const onLogoutInit = id => {
    setOpenModal(true);
  };

  return (
    <React.Fragment>
      {openAppLoginModal && (
        <AdminLogin
          show={openAppLoginModal}
          size="sm"
          animation={false}
          style={{ zIndex: 9999 }}
          onClose={() => setOpenAppLoginModal(false)}
          onSuccess={data => {
            const res = {
              userId: data.userId,
              source: 'self',
              type: data.type,
              email: data.email,
              name: data.name,
              imageUrl: data.imageUrl,
              rest: {},
            };
            handleLoginResponse(res);
          }}
        />
      )}
      <ConfirmationModal
        show={openModal}
        confirmationstring={`Are you sure to logout this session?`}
        handleHide={() => {
          setOpenModal(false);
        }}
        handleYes={() => onLogout()}
        size="md"
        animation={false}
      />
      {userContext.userData.userId ? (
        <div
          className={`d-print-none animate__animated animate__${animateType}`}
        >
          <div className="options welcomeText">Welcome</div>
          <div className="options">
            <div className="welcomeText pb-10">{userContext.userData.name}</div>
          </div>
          <div className="options pt-3">
            {['facebook', 'google'].includes(userContext.userData.source) &&
              userContext.userData.imageUrl && (
                <img
                  className="userImage"
                  alt="userImage"
                  src={
                    userContext.userData.imageUrl ||
                    require('../../images/spinner-1.svg')
                  }
                />
              )}
            {userContext.userData.source === 'self' &&
              userContext.userData.imageUrl && (
                <SignedUrl
                  type="image"
                  appData={appData}
                  unsignedUrl={userContext.userData.imageUrl}
                  className="userImage"
                />
              )}
            <i
              onClick={onLogoutInit}
              title="Logout"
              className="fa fa-sign-out text-secondary cursor-pointer fs-5"
            />
          </div>
        </div>
      ) : (
        <div className="options">
          <div className="google">
            <GoogleLogin
              clientId={CryptoJS.AES.decrypt(
                appData.google_login_auth_token,
                appData[encryptSaltKey]
              ).toString(CryptoJS.enc.Utf8)}
              buttonText=""
              render={renderProps => (
                <i
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  className="fa fa-google text-secondary cursor-pointer fs-5"
                  title="Sign in with Google"
                />
              )}
              onSuccess={data => {
                const res = {
                  userId: data.profileObj.googleId,
                  type: 'public',
                  source: 'google',
                  email: data.profileObj.email,
                  name: data.profileObj.name,
                  imageUrl: data.profileObj.imageUrl,
                  rest: data,
                };
                handleLoginResponse(res);
              }}
              // onFailure={() => errorGoogle()}
              cookiePolicy={'single_host_origin'}
            />
            {/*
              Note: 
              Maintain the above snippet for twitter or any social login
              Plese dont change data structure. It will impact expected results.
            */}
          </div>
          <FacebookLogin
            appId={CryptoJS.AES.decrypt(
              appData.facebook_app_id,
              appData[encryptSaltKey]
            ).toString(CryptoJS.enc.Utf8)}
            fields="name,email,picture"
            isMobile={false}
            redirectUri={appData.web}
            callback={data => {
              const res = {
                userId: data.id,
                type: 'public',
                source: 'facebook',
                email: data.email,
                name: data.name,
                imageUrl: data.picture.data.url,
                rest: data,
              };
              handleLoginResponse(res);
            }}
            cssClass="facebook-container"
            icon={
              <i
                className="fa fa-facebook text-secondary cursor-pointer fs-5"
                title="Sign in with Facebook"
              />
            }
            textButton=""
          />
          <div>
            <i
              onClick={() => setOpenAppLoginModal(true)}
              className="fa fa-user text-secondary cursor-pointer fs-5"
              title="Sign in with Awzy"
            />
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

LoginUser.propTypes = {
  toggleSideBar: PropTypes.bool,
  userData: PropTypes.object,
};
LoginUser.defaultProps = {};

export default LoginUser;
