import React, { useContext, useEffect, useState } from 'react';
import { LayoutContext } from './layoutDesign';
import {
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
  InputGroup,
  FormControl,
  Form,
  Accordion,
  Card,
  useAccordionButton,
} from 'react-bootstrap';
import moment from 'moment';
import { UserContext } from '../../contexts/UserContext';
import Select from 'react-select';
import { statusInfo } from './ButtonMenu';
import OffCanvas from '../shared/OffCanvas';

function InfoPanel(props) {
  const layoutContext = useContext(LayoutContext);
  const userContext = useContext(UserContext);
  const [accessorList, setAccessorList] = useState([]);
  const [formDefaults, setFormDefaults] = useState({});

  useEffect(() => {
    if (
      layoutContext.state.pageDetails &&
      layoutContext.state.accessLevels &&
      Object.keys(layoutContext.state.accessLevels).length &&
      Object.keys(layoutContext.state.pageDetails).length
    ) {
      const preDefined = layoutContext.state.pageDetails.hasAccessTo;
      const getSuperAdminId = layoutContext.state.accessLevels.filter(
        f => f.accessValue === 'superAdmin'
      )[0].accessId;

      const accessList = layoutContext.state.accessLevels.map(access => ({
        value: access.accessId,
        label: access.accessLabel,
        isSelected: preDefined.includes(access.accessId),
        isFixed: access.accessId === getSuperAdminId,
      }));
      setAccessorList(accessList);
      setFormDefaults({
        pageLabel: layoutContext.state.pageDetails.pageLabel,
        pageRoute: layoutContext.state.pageDetails.pageRoute,
      });
    }
  }, [layoutContext.state.pageDetails, layoutContext.state.accessLevels]);

  const onSetPageLabel = (key, value) => {
    layoutContext.setState(prevState => ({
      ...prevState,
      pageDetails: {
        ...prevState.pageDetails,
        [key]: value,
      },
    }));
  };

  const onSetPageRoute = value => {
    layoutContext.setState(prevState => ({
      ...prevState,
      pageDetails: {
        ...prevState.pageDetails,
        pageRoute: value.substr(0, 1) === '/' ? value : `/${value}`,
      },
    }));
  };

  const onAccessSelection = data => {
    const list = data.map(d => d.value);
    layoutContext.setState(prevState => ({
      ...prevState,
      pageDetails: {
        ...prevState.pageDetails,
        hasAccessTo: list,
      },
    }));
  };

  const infoHelp = [
    '<b>Header buttons</b> - There are Save, Publish, Inactive and Delete buttons of your choice.',
    'Save - Saves the page content to database.',
    'Publish - Publishes the page, so only the page can be accessible to end user',
    'In Activate - Inactivates the page temporarily. Later then it can be published when required. Note: This page cant be viewable to end user.',
    'Delete - Deletes all the page content from database. This action cant be undone once deleted.',
    '<b>Note</b>: A page should not be Published or Inactivated unless it is saved. This is crucial.',
    '<b>Page Config:</b>',
    'This field is collapsible',
    'The page name and page link can be changed on updating the values in their text boxes. You need to click Save once you`ve updated these fields.',
    'The page access drop down denotes who has the rights to access this page.',
    'You can add or delete accessors from this list. Note: A Super Admin cant be deleted.',
    'The table down, refers page information on user, created time, last updated time and page staus.',
    '<b>View mode</b>',
    'There are Tree, Structure and Preview modes.',
    'Tree - Describes the hierarchical design of your layout. Selected nodes are marked as underlined. See to that you`ve selected your preferred node while adding a child component into it. You can copy / paste (to avoid repetitions), drag / drop (arrange your desired order) & delete (Delete key) nodes in tree level. Note: You cant add a component unless a node is selected.',
    'Structure - This view gives a structural information about your page. On clicking each node, you can see your red highlighted props information.',
    'Preview - This view is the exact UI / UX what you see in the output. Please preview often, while your components are correctly inherited, during the phase of design.',
  ];

  const CustomToggle = ({ children, eventKey }) => {
    const decoratedOnClick = useAccordionButton(eventKey);

    return (
      <div className="row p-0 m-0">
        <OffCanvas
          className={`text-center ${userContext.userData.theme === 'dark'
            ? 'bg-dark text-white-50'
            : 'bg-light text-black'
            }`}
          btnValue="<i class='fa fa-question-circle' />"
          btnClassName={`col-1 btn btn-sm ${userContext.userData.theme === 'dark' ? 'text-light' : 'text-dark'
            }`}
          placement="end"
          key={1}
          label={'Page Settings Help'}
        >
          <ul className={`list-group list-group-flush`}>
            {infoHelp.map((help, i) => (
              <li
                key={i}
                className={`list-group-item ${userContext.userData.theme === 'dark'
                  ? 'bg-dark text-white-50'
                  : 'bg-light text-black'
                  }`}
                dangerouslySetInnerHTML={{ __html: help }}
              />
            ))}
          </ul>
        </OffCanvas>
        <div className="col-10 d-grid p-0">
          <button
            type="button"
            className={`btn-sm text-start btn ${userContext.userData.theme === 'dark' ? 'btn-dark' : 'btn-white'
              }`}
            onClick={decoratedOnClick}
          >
            {children}
          </button>
        </div>
        {layoutContext.state.loading && (
          <div className="col-1 text-end">
            <div
              className="spinner-grow text-primary spinner-grow-sm"
              role="status"
            />
          </div>
        )}
      </div>
    );
  };

  const getPubClass = () => {
    const value = layoutContext.state.statusList.filter(f => {
      return f.pub_id === layoutContext.state.pageDetails.pageStatus;
    })[0].pub_value;
    return statusInfo[value].rowClass;
  };

  return (
    <LayoutContext.Consumer>
      {layoutDetails =>
        layoutDetails.state.pageDetails &&
        Object.keys(layoutDetails.state.pageDetails).length > 0 && (
          <Accordion defaultActiveKey={0} className="mt-2">
            <Card
              key={1}
              className={`mb-1 ${userContext.userData.theme === 'dark'
                ? 'bg-dark text-light'
                : 'bg-light text-dark'
                }`}
            >
              <Card.Header className="row m-0 p-0">
                <CustomToggle eventKey={0}>Page Config</CustomToggle>
              </Card.Header>
              <Accordion.Collapse eventKey={0}>
                <Card.Body className="p-2">
                  <Row className="">
                    <Col xs={12}>
                      <div>
                        <Row>
                          <Col sm={6}>
                            <InputGroup size="sm" className="mb-1">
                              <InputGroup.Text>
                                <Form.Label
                                  htmlFor="pageLabel"
                                  className="mb-0"
                                >
                                  Page Name
                                </Form.Label>
                              </InputGroup.Text>
                              <FormControl
                                id="pageLabel"
                                defaultValue={formDefaults.pageLabel}
                                onChange={e =>
                                  onSetPageLabel('pageLabel', e.target.value)
                                }
                              />
                            </InputGroup>
                          </Col>
                          <Col sm={6}>
                            <InputGroup size="sm" className="mb-1">
                              <InputGroup.Text>
                                <Form.Label
                                  htmlFor="pageRoute"
                                  className="mb-0"
                                >
                                  Page Link
                                </Form.Label>
                              </InputGroup.Text>
                              <FormControl
                                id="pageRoute"
                                defaultValue={formDefaults.pageRoute}
                                onChange={e => onSetPageRoute(e.target.value)}
                              />
                            </InputGroup>
                          </Col>
                          <Col sm={12} className="pt-2">
                            <div className="alert alert-primary py-1 px-1 small" role="alert">
                              <i className="fa fa-link fw-bold px-2" />{`<a href="${formDefaults.pageRoute}">${formDefaults.pageLabel}</a>`}
                            </div>
                          </Col>
                          <Col sm={12} className="pt-2">
                            {accessorList.length > 0 && (
                              <>
                                <label className="py-2 small">
                                  Page access for
                                </label>
                                <Select
                                  defaultValue={accessorList.filter(
                                    f => f.isSelected
                                  )}
                                  isMulti
                                  onChange={d => onAccessSelection(d)}
                                  options={accessorList}
                                  className="text-dark bg-light rounded mb-1"
                                  isClearable={false}
                                  backspaceRemovesValue={false}
                                  styles={{
                                    multiValueRemove: (base, state) => {
                                      return state.data.isFixed
                                        ? { ...base, display: 'none' }
                                        : base;
                                    },
                                  }}
                                />
                              </>
                            )}
                          </Col>
                        </Row>
                        <Row className="align-items-center">
                          <Col md={6} className="mb-1">
                            <Col xs={12}>
                              <OverlayTrigger
                                placement="top"
                                delay={{ show: 250, hide: 400 }}
                                overlay={
                                  <Tooltip {...props}>Modified By</Tooltip>
                                }
                              >
                                <i className="fa fa-user pe-2" />
                              </OverlayTrigger>
                              <small className="">
                                {layoutDetails.state.pageDetails.pageModifiedBy}
                              </small>
                            </Col>
                            <Col xs={12}>
                              <OverlayTrigger
                                placement="top"
                                delay={{ show: 250, hide: 400 }}
                                overlay={
                                  <Tooltip {...props}>Created At</Tooltip>
                                }
                              >
                                <i className="fa fa-calendar pe-2" />
                              </OverlayTrigger>
                              <small className="">
                                {moment(
                                  layoutDetails.state.pageDetails.pageCreatedAt,
                                  'YYYY/MM/DD hh:mm: A'
                                ).format('MMM Do YYYY, h:mm a')}
                              </small>
                            </Col>
                            <Col xs={12}>
                              <OverlayTrigger
                                placement="top"
                                delay={{ show: 250, hide: 400 }}
                                overlay={
                                  <Tooltip {...props}>Updated At</Tooltip>
                                }
                              >
                                <i className="fa fa-clock-o pe-2" />
                              </OverlayTrigger>
                              <small className="">
                                {moment(
                                  layoutDetails.state.pageDetails.pageUpdatedAt,
                                  'YYYY/MM/DD hh:mm: A'
                                ).format('MMM Do YYYY, h:mm a')}
                              </small>
                            </Col>
                          </Col>
                          <Col md={6} className="mb-1 text-end">
                            {layoutContext.state.pageDetails.pageStatus &&
                              layoutContext.state.statusList && (
                                <div>
                                  <small className={`me-2`}>Status</small>
                                  <span
                                    className={`badge pill ${getPubClass()}`}
                                  >
                                    {
                                      layoutContext.state.statusList.filter(
                                        f => {
                                          return (
                                            f.pub_id ===
                                            layoutContext.state.pageDetails
                                              .pageStatus
                                          );
                                        }
                                      )[0].pub_name
                                    }
                                  </span>
                                </div>
                              )}
                            {/* {layoutContext.state.selectedNodeId && (
                              <div>
                                <small>Node Id:</small>{' '}
                                <small className="">
                                  {layoutContext.state.selectedNodeId}
                                </small>
                              </div>
                            )}
                            {layoutContext.state.selectedComponent && (
                              <div>
                                <small>Component:</small>{' '}
                                <small className="">
                                  {`<${layoutContext.state.selectedComponent}>`}
                                </small>
                              </div>
                            )} */}
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        )
      }
    </LayoutContext.Consumer>
  );
}

export default InfoPanel;
