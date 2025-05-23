import React, { useContext } from 'react';
import { LayoutContext } from '../layoutDesign';
import * as BootstrapComponents from '../BootstrapComponents';
import { v4 as uuidv4 } from 'uuid';
import { Accordion, Card, useAccordionButton, Button } from 'react-bootstrap';
import { UserContext } from '../../../contexts/UserContext';

function BootstrapList(props) {
  const layoutContext = useContext(LayoutContext);
  const userContext = useContext(UserContext);
  const bootstrapList = Object.keys(BootstrapComponents);

  const segregatedList = [
    {
      label: 'Alert',
      condition: [
        'BootstrapAlert',
        'BootstrapAlertLink',
        'BootstrapAlertHeading',
      ],
    },
    {
      label: 'Accordion',
      condition: [
        'BootstrapAccordion',
        'BootstrapAccordionItem',
        'BootstrapAccordionHeader',
        'BootstrapAccordionBody',
        'BootstrapAccordionCustomButton',
      ],
    },
    { label: 'Badge', condition: ['BootstrapBadge'] },
    {
      label: 'Breadcrumb',
      condition: ['BootstrapBreadCrumb', 'BootstrapBreadCrumbItem'],
    },
    {
      label: 'Card',
      condition: [
        'BootstrapCardGroup',
        'BootstrapCard',
        'BootstrapCardImg',
        'BootstrapCardImgOverlay',
        'BootstrapCardHeader',
        'BootstrapCardFooter',
        'BootstrapCardTitle',
        'BootstrapCardLink',
        'BootstrapCardbody',
        'BootstrapCardText',
      ],
    },
    {
      label: 'Carousel',
      condition: [
        'BootstrapCarousel',
        'BootstrapCarouselItem',
        'BootstrapCarouselCaption',
      ],
    },
    {
      label: 'Figure',
      condition: [
        'BootstrapFigure',
        'BootstrapFigureImage',
        'BootstrapFigureCaption',
        'BootstrapImage',
      ],
    },
    {
      label: 'Grid',
      condition: ['BootstrapRow', 'BootstrapCol', 'BootstrapContainer'],
    },
    {
      label: 'List group',
      condition: ['BootstrapListGroup', 'BootstrapListGroupItem'],
    },
    { label: 'Table', condition: ['BootstrapTable'] },
    {
      label: 'Nav',
      condition: [
        'BootstrapNav',
        'BootstrapNavLink',
        'BootstrapNavItem',
        'BootstrapNavDropdown',
        'BootstrapNavDropdownItem',
      ],
    },
    {
      label: 'Tabs',
      condition: [
        'BootstrapTabContainer',
        'BootstrapTabContent',
        'BootstrapTabPane',
      ],
    },
    {
      label: 'Navbar',
      condition: [
        'BootstrapNavbar',
        'BootstrapNavbarBrand',
        'BootstrapNavbarText',
        'BootstrapNavbarToggle',
        'BootstrapNavbarCollapse',
        'BootstrapNavbarOffcanvas',
      ],
    },
    { label: 'Tooltip', condition: ['BootstrapTooltip'] },
  ]
    .sort((a, b) => (a.label > b.label ? 1 : -1))
    .map((obj, i) => {
      const filter = obj.condition
        ? bootstrapList.filter(f => obj.condition.includes(f))
        : [];
      return { id: i, label: obj.label, list: filter };
    });

  const addElementToNode = (key, details, element) => {
    const sample = {
      key: uuidv4(),
      props: {},
      children: [],
      component: element,
      title: `${element.replace('Bootstrap', '')}`,
    };

    const newObject = findAndAddComponent(key, { ...details }, sample);
    layoutContext.setState(prevState => ({
      ...prevState,
      selectedNodeId: sample.key,
      selectedComponent: sample.component,
      pageDetails: {
        ...prevState.pageDetails,
        pageObject: newObject,
      },
    }));
  };

  const findAndAddComponent = (key, node, insertObj) => {
    if (node.key === key) {
      node.children &&
        Array.isArray(node.children) &&
        node.children.push(insertObj);
    }
    node.children.forEach(ch => {
      findAndAddComponent(key, ch, insertObj);
    });
    return node;
  };

  const CustomToggle = ({ children, eventKey, object }) => {
    const decoratedOnClick = useAccordionButton(eventKey, () => null);

    return (
      <button
        type="button"
        className={`btn-sm text-start btn ${userContext.userData.theme === 'dark' ? 'btn-dark' : 'btn-white'
          }`}
        onClick={decoratedOnClick}
      >
        {children}
      </button>
    );
  };

  return (
    <LayoutContext.Consumer>
      {layoutDetails => (
        <Accordion defaultActiveKey={-1} alwaysOpen>
          {segregatedList.length > 0 &&
            segregatedList.map((s, i) => (
              <Card
                key={s.id}
                className={`mb-1 ${userContext.userData.theme === 'dark'
                    ? 'bg-dark text-white'
                    : 'bg-white text-dark'
                  }`}
              >
                <Card.Header className="row m-0 p-0">
                  <CustomToggle eventKey={s.id} object={s}>
                    {s.label}
                  </CustomToggle>
                </Card.Header>
                <Accordion.Collapse eventKey={s.id}>
                  <Card.Body>
                    {s.list.length &&
                      s.list.map((list, j) => (
                        <Button
                          key={j}
                          disabled={!layoutDetails.state.selectedNodeId}
                          size="sm"
                          className="badge bg-secondary border-0 me-1"
                          onClick={() =>
                            addElementToNode(
                              layoutDetails.state.selectedNodeId,
                              layoutDetails.state.pageDetails.pageObject,
                              list
                            )
                          }
                        >
                          {list.replace('Bootstrap', '')}
                        </Button>
                      ))}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            ))}
        </Accordion>
      )}
    </LayoutContext.Consumer>
  );
}

export default BootstrapList;
