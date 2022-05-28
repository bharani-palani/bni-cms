import React from 'react';
import * as ReactBootstrap from 'react-bootstrap';

const BootstrapAlert = ({ children, ...rest }) => {
  return <ReactBootstrap.Alert {...rest}>{children}</ReactBootstrap.Alert>;
};

const BootstrapAlertLink = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.Alert.Link {...rest}>{children}</ReactBootstrap.Alert.Link>
  );
};

const BootstrapAlertHeading = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.Alert.Heading {...rest}>
      {children}
    </ReactBootstrap.Alert.Heading>
  );
};

const BootstrapAccordion = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.Accordion {...rest}>{children}</ReactBootstrap.Accordion>
  );
};

const BootstrapAccordionItem = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.Accordion.Item {...rest}>
      {children}
    </ReactBootstrap.Accordion.Item>
  );
};

const BootstrapAccordionHeader = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.Accordion.Header {...rest}>
      {children}
    </ReactBootstrap.Accordion.Header>
  );
};

const BootstrapAccordionBody = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.Accordion.Body {...rest}>
      {children}
    </ReactBootstrap.Accordion.Body>
  );
};

const BootstrapAccordionCustomButton = ({ children, eventKey, ...rest }) => {
  const decoratedOnClick = ReactBootstrap.useAccordionButton(eventKey);

  return (
    <ReactBootstrap.Button onClick={decoratedOnClick} {...rest}>
      {children}
    </ReactBootstrap.Button>
  );
};

const BootstrapBadge = ({ children, ...rest }) => {
  return <ReactBootstrap.Badge {...rest}>{children}</ReactBootstrap.Badge>;
};

const BootstrapBreadCrumb = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.Breadcrumb {...rest}>{children}</ReactBootstrap.Breadcrumb>
  );
};

const BootstrapBreadCrumbItem = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.Breadcrumb.Item {...rest}>
      {children}
    </ReactBootstrap.Breadcrumb.Item>
  );
};

const BootstrapButton = ({ children, ...rest }) => {
  return <ReactBootstrap.Button {...rest}>{children}</ReactBootstrap.Button>;
};

const BootstrapToggleCheckboxButtonGroup = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.ToggleButtonGroup {...rest} type="checkbox">
      {children}
    </ReactBootstrap.ToggleButtonGroup>
  );
};

const BootstrapToggleRadioButtonGroup = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.ToggleButtonGroup {...rest} type="radio" name="appRadio">
      {children}
    </ReactBootstrap.ToggleButtonGroup>
  );
};

const BootstrapToggleButton = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.ToggleButton {...rest}>
      {children}
    </ReactBootstrap.ToggleButton>
  );
};

const BootstrapButtonToolbar = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.ButtonToolbar {...rest}>
      {children}
    </ReactBootstrap.ButtonToolbar>
  );
};

const BootstrapButtonGroup = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.ButtonGroup {...rest}>
      {children}
    </ReactBootstrap.ButtonGroup>
  );
};

const BootstrapCard = ({ children, ...rest }) => {
  return <ReactBootstrap.Card {...rest}>{children}</ReactBootstrap.Card>;
};

const BootstrapCardGroup = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.CardGroup {...rest}>{children}</ReactBootstrap.CardGroup>
  );
};

const BootstrapCardImg = ({ children, ...rest }) => {
  return <ReactBootstrap.Card.Img {...rest} />;
};

const BootstrapCardImgOverlay = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.Card.ImgOverlay {...rest}>
      {children}
    </ReactBootstrap.Card.ImgOverlay>
  );
};

const BootstrapCardHeader = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.Card.Header {...rest}>
      {children}
    </ReactBootstrap.Card.Header>
  );
};

const BootstrapCardFooter = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.Card.Footer {...rest}>
      {children}
    </ReactBootstrap.Card.Footer>
  );
};

const BootstrapCardTitle = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.Card.Title {...rest}>{children}</ReactBootstrap.Card.Title>
  );
};

const BootstrapCardLink = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.Card.Link {...rest}>{children}</ReactBootstrap.Card.Link>
  );
};

const BootstrapCardbody = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.Card.Body {...rest}>{children}</ReactBootstrap.Card.Body>
  );
};

const BootstrapCardText = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.Card.Text {...rest}>{children}</ReactBootstrap.Card.Text>
  );
};

const BootstrapListGroup = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.ListGroup {...rest}>{children}</ReactBootstrap.ListGroup>
  );
};

const BootstrapListGroupItem = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.ListGroupItem {...rest}>
      {children}
    </ReactBootstrap.ListGroupItem>
  );
};

import { Carousel } from 'react-bootstrap';

const BootstrapCarousel = props => {
  return (
    <>
      {props.children && props.children.length > 0 && (
        <Carousel {...props}>
          {props.children.map((c, i) => {
            return (
              <Carousel.Item key={i} {...c.props}>
                {c.props.children.props.children.props.children}
              </Carousel.Item>
            );
          })}
        </Carousel>
      )}
    </>
  );
};

const BootstrapCarouselItem = props => {
  return <Carousel.Item {...props} />;
};

const BootstrapCarouselCaption = props => {
  return <Carousel.Caption {...props} />;
};

const BootstrapRow = ({ children, ...rest }) => {
  return <ReactBootstrap.Row {...rest}>{children}</ReactBootstrap.Row>;
};

const BootstrapCol = ({ children, ...rest }) => {
  return <ReactBootstrap.Col {...rest}>{children}</ReactBootstrap.Col>;
};

const BootstrapSplitButton = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.SplitButton {...rest}>
      {children}
    </ReactBootstrap.SplitButton>
  );
};

const BootstrapFigure = ({ children, ...rest }) => {
  return <ReactBootstrap.Figure {...rest}>{children}</ReactBootstrap.Figure>;
};

const BootstrapFigureImage = ({ children, ...rest }) => {
  return <ReactBootstrap.Figure.Image {...rest} />;
};

const BootstrapFigureCaption = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.Figure.Caption {...rest}>
      {children}
    </ReactBootstrap.Figure.Caption>
  );
};

const BootstrapImage = ({ children, ...rest }) => {
  return <ReactBootstrap.Image {...rest} />;
};

const BootstrapNav = ({ children, ...rest }) => {
  return <ReactBootstrap.Nav {...rest}>{children}</ReactBootstrap.Nav>;
};

const BootstrapNavItem = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.Nav.Item {...rest}>{children}</ReactBootstrap.Nav.Item>
  );
};

const BootstrapNavLink = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.Nav.Link {...rest}>{children}</ReactBootstrap.Nav.Link>
  );
};

const BootstrapNavDropdown = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.NavDropdown {...rest}>
      {children}
    </ReactBootstrap.NavDropdown>
  );
};

const BootstrapNavDropdownItem = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.NavDropdown.Item {...rest}>
      {children}
    </ReactBootstrap.NavDropdown.Item>
  );
};

const BootstrapContainer = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.Container {...rest}>{children}</ReactBootstrap.Container>
  );
};

const BootstrapNavbar = ({ children, ...rest }) => {
  return <ReactBootstrap.Navbar {...rest}>{children}</ReactBootstrap.Navbar>;
};

const BootstrapNavbarBrand = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.Navbar.Brand {...rest}>
      {children}
    </ReactBootstrap.Navbar.Brand>
  );
};

const BootstrapNavbarText = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.Navbar.Text {...rest}>
      {children}
    </ReactBootstrap.Navbar.Text>
  );
};

const BootstrapNavbarToggle = ({ children, ...rest }) => {
  return <ReactBootstrap.Navbar.Toggle {...rest} />;
};

const BootstrapNavbarCollapse = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.Navbar.Collapse {...rest}>
      {children}
    </ReactBootstrap.Navbar.Collapse>
  );
};

const BootstrapNavbarOffcanvas = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.Navbar.Offcanvas {...rest}>
      {children}
    </ReactBootstrap.Navbar.Offcanvas>
  );
};

const BootstrapTable = ({ children, ...rest }) => {
  return <ReactBootstrap.Table {...rest}>{children}</ReactBootstrap.Table>;
};

const BootstrapTabContent = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.Tab.Content {...rest}>
      {children}
    </ReactBootstrap.Tab.Content>
  );
};

const BootstrapTabContainer = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.Tab.Container defaultActiveKey={1} id={1} {...rest}>
      {children}
    </ReactBootstrap.Tab.Container>
  );
};

const BootstrapTabPane = ({ children, ...rest }) => {
  return (
    <ReactBootstrap.Tab.Pane eventKey={1} {...rest}>
      {children}
    </ReactBootstrap.Tab.Pane>
  );
};

const BootstrapTooltip = ({ children, ...rest }) => {
  return <ReactBootstrap.Tooltip {...rest}>{children}</ReactBootstrap.Tooltip>;
};

export {
  Carousel,
  BootstrapAlert,
  BootstrapAlertLink,
  BootstrapAlertHeading,
  BootstrapAccordion,
  BootstrapAccordionItem,
  BootstrapAccordionHeader,
  BootstrapAccordionBody,
  BootstrapAccordionCustomButton,
  BootstrapBadge,
  BootstrapBreadCrumb,
  BootstrapBreadCrumbItem,
  BootstrapButton,
  BootstrapToggleCheckboxButtonGroup,
  BootstrapToggleRadioButtonGroup,
  BootstrapToggleButton,
  BootstrapButtonToolbar,
  BootstrapButtonGroup,
  BootstrapCardGroup,
  BootstrapCard,
  BootstrapCardImg,
  BootstrapCardImgOverlay,
  BootstrapCardHeader,
  BootstrapCardFooter,
  BootstrapCardTitle,
  BootstrapCardLink,
  BootstrapCardbody,
  BootstrapCardText,
  BootstrapListGroup,
  BootstrapListGroupItem,
  BootstrapCarousel,
  BootstrapCarouselItem,
  BootstrapCarouselCaption,
  BootstrapRow,
  BootstrapCol,
  BootstrapSplitButton,
  BootstrapFigure,
  BootstrapFigureImage,
  BootstrapFigureCaption,
  BootstrapImage,
  BootstrapNav,
  BootstrapNavLink,
  BootstrapNavItem,
  BootstrapNavDropdown,
  BootstrapNavDropdownItem,
  BootstrapContainer,
  BootstrapNavbar,
  BootstrapNavbarBrand,
  BootstrapNavbarText,
  BootstrapNavbarToggle,
  BootstrapNavbarCollapse,
  BootstrapNavbarOffcanvas,
  BootstrapTable,
  BootstrapTabContainer,
  BootstrapTabContent,
  BootstrapTabPane,
  BootstrapTooltip,
};
