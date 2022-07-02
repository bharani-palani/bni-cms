import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SignedUrl from '../configuration/Gallery/SignedUrl';
import { UserContext } from '../../contexts/UserContext';
import AwsFactory from '../configuration/Gallery/AwsFactory';
import awzyIcon from '../../images/awzyLogo/awzy-icon.svg';

const DesktopApp = props => {
  const { appData } = props;
  const userContext = useContext(UserContext);
  const menu = userContext.userData.menu;
  const [iconStatus, setIconStatus] = useState({
    status: false,
    validated: false,
  });

  useEffect(() => {
    if (Object.keys(appData).length > 0) {
      new AwsFactory(appData)
        .isValidImage(appData.bannerImg)
        .then(d =>
          setIconStatus({
            status: true,
            validated: true,
          })
        )
        .catch(e =>
          setIconStatus({
            status: true,
            validated: false,
          })
        );
    }
  }, [appData]);

  return (
    <header className={`vertical-header ${appData.webLayoutType}`}>
      <div className={`vertical-header-wrapper ${appData.webMenuType}`}>
        <nav
          className={`nav-menu ${appData.webMenuType} ${
            appData.webLayoutType
          } ${userContext.userData.theme === 'dark' ? 'bg-dark' : 'bg-light'}`}
        >
          <div className="nav-header">
            <span className="">
              {iconStatus.status && iconStatus.validated && (
                <SignedUrl
                  type="image"
                  appData={appData}
                  unsignedUrl={appData.logoImg}
                  className="brand img-fluid"
                  optionalAttr={{ width: '40', height: '40' }}
                />
              )}
              {iconStatus.status && !iconStatus.validated && (
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
