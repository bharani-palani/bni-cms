import React, { useState, useContext, useEffect, useRef } from 'react';
import { Accordion, Card, useAccordionButton } from 'react-bootstrap';
import { UserContext } from '../../../contexts/UserContext';
import BuiltInList from './BuiltInList';
import BootstrapList from './BootstrapList';
import PropsList from './PropsList';
import StyleList from './StyleList';
import Title from './Title';
import CreateAjaxForm from './CreateAjaxForm';
import CreateAjaxFetch from './CreateAjaxFetch';
import Database from './Database/';
import { LayoutContext } from '../layoutDesign';
import AppContext from '../../../contexts/AppContext';

function SideMenu(props) {
  const userContext = useContext(UserContext);
  const [appData] = useContext(AppContext);
  const layoutContext = useContext(LayoutContext);
  const [scrollPosition, setScrollPosition] = useState(0);
  const ref = useRef(null);
  const [sideMenu] = useState([
    {
      id: 0,
      label: 'Components',
      children: [
        { id: 0.1, label: 'Built in', body: <BuiltInList /> },
        { id: 0.2, label: 'Bootstrap', body: <BootstrapList /> },
      ],
    },
    {
      id: 1,
      label: 'Arguments',
      children: [
        { id: 1.1, label: 'Props', body: <PropsList /> },
        { id: 1.2, label: 'Style', body: <StyleList /> },
        { id: 1.3, label: 'Title', body: <Title /> },
      ],
    },
    { id: 2, label: 'Ajax Form', body: <CreateAjaxForm /> },
    { id: 3, label: 'Ajax Fetch', body: <CreateAjaxFetch /> },
    {
      id: 4,
      label: 'Database',
      body: <Database />,
    },
  ]);

  useEffect(() => {
    window.addEventListener('scroll', listenToScroll);
  }, []);

  const listenToScroll = () => {
    const height = window.pageYOffset;
    setScrollPosition(height);
  };

  const CustomToggle = ({ children, eventKey, object }) => {
    const decoratedOnClick = useAccordionButton(eventKey, () => null);

    return (
      <button
        type="button"
        className={`btn-sm text-start btn ${
          userContext.userData.theme === 'dark' ? 'btn-dark' : 'btn-white'
        }`}
        onClick={decoratedOnClick}
      >
        {children}
      </button>
    );
  };

  return (
    <div ref={ref}>
      {layoutContext.state.pageDetails &&
        Object.keys(layoutContext.state.pageDetails).length > 0 && (
          <div
            className={`pt-2 pb-5 ${
              userContext.userData.theme === 'light' ? 'bg-light' : 'bg-dark'
            }`}
            style={{
              ...(scrollPosition > 100 &&
                window.innerWidth > 820 && {
                  position: 'fixed',
                  top: appData.webMenuType === 'topMenu' ? '100px' : '50px',
                  width: `${ref.current.offsetWidth}px`,
                }),
            }}
          >
            <div
              style={{
                ...(scrollPosition > 100 &&
                  window.innerWidth > 768 && {
                    overflowY: 'auto',
                    height:
                      appData.webMenuType === 'topMenu'
                        ? 'calc(100vh - 150px)'
                        : 'calc(100vh - 100px)',
                  }),
              }}
            >
              <Accordion defaultActiveKey={3} alwaysOpen>
                {sideMenu.map((side, i) => (
                  <Card
                    key={side.id}
                    className={`mb-1 ${
                      userContext.userData.theme === 'dark'
                        ? 'bg-dark text-light'
                        : 'bg-light text-dark'
                    }`}
                  >
                    <Card.Header className="row m-0 p-0">
                      <CustomToggle eventKey={side.id} object={side}>
                        {side.label}
                      </CustomToggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey={side.id}>
                      <Card.Body className="p-1">
                        {side.body && side.body}
                        {side.children &&
                          side.children.length > 0 &&
                          side.children.map((ch, j) => (
                            <Accordion
                              key={ch.id}
                              defaultActiveKey={[]}
                              alwaysOpen
                            >
                              {' '}
                              {/* defaultActiveKey={[0.2]} alwaysOpen */}
                              <Card
                                key={ch.id}
                                className={`mb-1 ${
                                  userContext.userData.theme === 'dark'
                                    ? 'bg-dark text-light'
                                    : 'bg-light text-dark'
                                }`}
                              >
                                <Card.Header className="row m-0 p-0">
                                  <CustomToggle eventKey={ch.id} object={side}>
                                    {ch.label}
                                  </CustomToggle>
                                </Card.Header>
                                <Accordion.Collapse eventKey={ch.id}>
                                  <Card.Body className="p-1">
                                    {ch.body}
                                  </Card.Body>
                                </Accordion.Collapse>
                              </Card>
                            </Accordion>
                          ))}
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                ))}
              </Accordion>
            </div>
          </div>
        )}
    </div>
  );
}

export default SideMenu;
