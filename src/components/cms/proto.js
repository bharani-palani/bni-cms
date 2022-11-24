import React, { useContext, useState } from 'react';
import { LayoutContext } from './layoutDesign';
import Cms from './cms';
import Design from './design';
import PageTree from './PageTree';
import { Modal } from 'react-bootstrap';
import { UserContext } from '../../contexts/UserContext';

function Proto(props) {
  const userContext = useContext(UserContext);
  const layoutContext = useContext(LayoutContext);
  const [fullScreen, setFullScreen] = useState(false);

  return (
    <LayoutContext.Consumer>
      {layoutDetails => (
        <div className={`${window.innerWidth > 768 ? 'min-vh-100' : ''}`}>
          {layoutDetails.state.pageDetails &&
            Object.keys(layoutDetails.state.pageDetails).length > 0 && (
              <div className={`d-xl-grid`}>
                <div
                  style={{ zIndex: 0 }}
                  className={`btn-group btn-group-sm ${userContext.userData.theme === 'dark'
                      ? 'bg-dark text-white'
                      : 'bg-white text-dark'
                    }`}
                >
                  <button
                    className={`btn btn-primary ${layoutDetails.state.viewMode === 'tree' ? 'active' : ''
                      }`}
                    onClick={() =>
                      layoutContext.setState(prevState => ({
                        ...prevState,
                        viewMode: 'tree',
                      }))
                    }
                  >
                    Tree
                  </button>
                  <button
                    className={`btn btn-primary ${layoutDetails.state.viewMode === 'design' ? 'active' : ''
                      }`}
                    onClick={() =>
                      layoutContext.setState(prevState => ({
                        ...prevState,
                        viewMode: 'design',
                      }))
                    }
                  >
                    Structure
                  </button>
                  <button
                    className={`btn btn-primary ${layoutDetails.state.viewMode === 'preview' ? 'active' : ''
                      }`}
                    onClick={() =>
                      layoutContext.setState(prevState => ({
                        ...prevState,
                        viewMode: 'preview',
                      }))
                    }
                  >
                    Preview
                  </button>
                </div>
                {layoutDetails.state.viewMode === 'tree' && <PageTree />}
                {layoutDetails.state.viewMode === 'design' && <Design />}
                {layoutDetails.state.viewMode === 'preview' && (
                  <div className="mt-2 mb-5 position-relative">
                    <i
                      style={{ zIndex: 2 }}
                      onClick={() => setFullScreen(true)}
                      className="fa fa-arrows-alt position-absolute top-0 end-0 p-1 cursor-pointer bg-dark text-white"
                    />
                    <Modal
                      show={fullScreen}
                      fullscreen={true}
                      onHide={() => setFullScreen(false)}
                    >
                      <Modal.Body
                        className={`rounded-0 position-relative btn-group btn-group-sm ${userContext.userData.theme === 'dark'
                            ? 'bg-dark text-white'
                            : 'bg-white text-dark'
                          }`}
                      >
                        <i
                          style={{ zIndex: 2 }}
                          onClick={() => setFullScreen(false)}
                          className="fa fa-times-circle position-fixed top-0 end-0 cursor-pointer m-2 fs-2"
                        />
                        <Cms
                          structure={layoutDetails.state.pageDetails.pageObject}
                        />
                      </Modal.Body>
                    </Modal>
                    {layoutDetails.state.pageDetails &&
                      layoutDetails.state.pageDetails.pageObject && (
                        <Cms
                          structure={layoutDetails.state.pageDetails.pageObject}
                        />
                      )}
                  </div>
                )}
              </div>
            )}
        </div>
      )}
    </LayoutContext.Consumer>
  );
}

export default Proto;
