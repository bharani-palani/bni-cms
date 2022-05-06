import React, { useState, useContext } from 'react';
import AppContext from '../../contexts/AppContext';
import { UserContext } from '../../contexts/UserContext';
import apiInstance from '../../services/apiServices';
import { withRouter } from 'react-router-dom';
import Settings from '../configuration/settings';
import LayoutDesign from './layoutDesign';
import * as ReactBootstrap from 'react-bootstrap';
import * as BuiltInComponents from './BuiltInComponents';
import * as BootstrapComponents from './BootstrapComponents';
import AjaxForm from '../../components/cms/sideMenu/AjaxForm';
export const CmsContext = React.createContext();

function Cms(props) {
  const { structure } = props;
  const [appData] = useContext(AppContext);
  const userContext = useContext(UserContext);

  const [state, setState] = useState({
    configData: appData,
    userData: userContext.userData,
    api: apiInstance,
  });

  const componentMap = {
    'app-settings': Settings,
    'app-layoutDesign': LayoutDesign,
    'app-bootstrap': ReactBootstrap,
    'app-ajaxform': AjaxForm,
    ...Object.keys(BootstrapComponents).reduce(
      (obj, item) => ({ ...obj, [item]: BootstrapComponents[item] }),
      {}
    ),
    ...Object.keys(BuiltInComponents).reduce(
      (obj, item) => ({ ...obj, [item]: BuiltInComponents[item] }),
      {}
    ),
  };

  const recursiveComponent = str => {
    if (str && str.component) {
      const element = componentMap[str.component];
      if (typeof element !== 'undefined') {
        return (
          <React.Fragment key={str.key}>
            {React.createElement(
              element,
              str.props && Object.keys(str.props).length > 0 ? str.props : {},
              str.children && str.children.length > 0
                ? str.children.map((c, i) => (
                    <React.Fragment key={c.key}>
                      {recursiveComponent(c)}
                    </React.Fragment>
                  ))
                : str.title
            )}
          </React.Fragment>
        );
      }
    }
  };

  return (
    <CmsContext.Provider
      value={{
        state,
        setState,
      }}
    >
      {recursiveComponent(structure)}
    </CmsContext.Provider>
  );
}

export default withRouter(Cms);
