import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import Loader from 'react-loader-spinner';
import helpers from '../../helpers';
import ButtonMenu from './ButtonMenu';
import SideMenu from './sideMenu';
import Proto from './proto';
import InfoPanel from './infoPanel';

export const LayoutContext = React.createContext();

function LayoutDesign(props) {
  const [state, setState] = useState({
    viewMode: 'tree',
    loading: false,
  });

  return (
    <div className="container-fluid layoutDesign">
      <div className="">
        <div className="text-center">
          <h5 className="p-3">
            <i className="fa fa-paint-brush" /> Layout Design
          </h5>
          <hr className="my-2" />
        </div>
      </div>
      {(!state.pageList || !state.statusList || !state.accessLevels) && (
        <div className="spinner">
          <Loader
            type={helpers.loadRandomSpinnerIcon()}
            color={document.documentElement.style.getPropertyValue(
              '--az-theme-bg-color'
            )}
            height={100}
            width={100}
          />
        </div>
      )}

      <LayoutContext.Provider
        value={{
          state,
          setState,
        }}
      >
        <Row className="pt-1">
          <Col lg={9}>
            <ButtonMenu />
            <InfoPanel />
            <Proto />
          </Col>
          <Col lg={3}>
            <SideMenu />
          </Col>
        </Row>
      </LayoutContext.Provider>
    </div>
  );
}

export default LayoutDesign;
