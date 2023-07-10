import React, { useContext, useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { ProtectedRoute } from '../../security/protectedRoute';
import ErrorPage from './errorpage';
import AppContext from '../../contexts/AppContext';
import { UserContext } from '../../contexts/UserContext';
import Cms from '../cms/cms';
import apiInstance from '../../services/apiServices';
import Loader from 'react-loader-spinner';
import helpers from '../../helpers';
import { Modal } from 'react-bootstrap';

const Wrapper = props => {
  const [appData] = useContext(AppContext);
  const userContext = useContext(UserContext);
  const menu = userContext.userData.menu;
  const [structure, setStructure] = useState({});
  const [meta, setMeta] = useState({});
  const [loader, setLoader] = useState(false);
  const [sessionModal, setSessionModal] = useState(false);
  const { location } = props;
  const axiosOptions = {
    headers: { 'Awzy-Authorization': appData.token },
  };

  useEffect(() => {
    const fPages = menu.filter(m => m.href === location.pathname);
    const pageId = fPages.length > 0 ? fPages[0].page_id : null;
    if (pageId) {
      setStructure({});
      setLoader(true);
      const formdata = new FormData();
      formdata.append('pageId', pageId);
      apiInstance
        .post('/getConfigPageDetails', formdata, axiosOptions)
        .then(res => {
          const resStructure = res.data.response.pageObject;
          const resMeta = res.data.response.pageMeta;
          setMeta(resMeta);
          setStructure(resStructure);
        })
        .catch(() => {
          setStructure({});
          setSessionModal(true);
        })
        .finally(() => setLoader(false));
    }
  }, [location.pathname, JSON.stringify(appData)]);

  return (
    <>
      <Modal
        {...props}
        show={sessionModal}
        style={{ zIndex: 9999 }}
        backdrop="static"
        centered
        keyboard={false}
      >
        <Modal.Dialog className="m-0">
          <Modal.Header className={`d-block`}>
            <Modal.Title as="div">
              <div className="d-flex align-items-center justify-content-center">
                <i className="fa fa-warning fa-2x text-warning pe-2" />
                <div className="fs-3">Session expired</div>
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className={`text-center`}>
            <a href="/" className="btn btn-danger w-100">
              Reload
            </a>
          </Modal.Body>
        </Modal.Dialog>
      </Modal>
      <Switch>
        {menu.map((menu, i) => {
          return (
            <ProtectedRoute
              accessGiven={menu.hasAccessTo}
              key={i}
              exact
              path={menu.href}
              component={Cms}
              structure={structure}
              meta={meta}
            />
          );
        })}
        <Route path="*" component={ErrorPage} />
      </Switch>
      {loader && (
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
    </>
  );
};

export default withRouter(Wrapper);
