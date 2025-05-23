import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { SignedUrl } from '../configuration/Gallery/SignedUrl';
import { UserContext } from '../../contexts/UserContext';
import awzyIcon from '../../images/awzyLogo/awzy-icon.png';

const DesktopApp = props => {
  const { appData } = props;
  const userContext = useContext(UserContext);
  const menu = userContext.userData.menu;

  return (
    <header className={`vertical-header ${appData.webLayoutType}`}>
      <div className={`vertical-header-wrapper ${appData.webMenuType}`}>
        <nav
          className={`nav-menu ${appData.webMenuType} ${
            appData.webLayoutType
          } ${userContext.userData.theme === 'dark' ? 'bg-dark' : 'bg-white'}`}
        >
          <div className="nav-header">
            <span className="">
              {userContext.userData.type === 'public' && (
                <SignedUrl
                  type="image"
                  appData={appData}
                  unsignedUrl={appData.logoImg}
                  className="brand img-fluid"
                  optionalAttr={{ width: '40', height: '40' }}
                />
              )}
              {userContext.userData.type !== 'public' && (
                <img
                  className="brand img-fluid"
                  alt="iconImage"
                  src={awzyIcon}
                />
              )}
            </span>
          </div>
          <ul className={`header-menu ${appData.webMenuType}`}>
            {menu.map((m, i) => (
              <li key={i}>
                <Link
                  className={
                    userContext.userData.theme === 'dark'
                      ? 'text-white-50'
                      : 'text-black'
                  }
                  to={m.href}
                >
                  {m.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

DesktopApp.propTypes = {
  property: PropTypes.string,
};
DesktopApp.defaultProps = {
  property: 'String name',
};

export default DesktopApp;
