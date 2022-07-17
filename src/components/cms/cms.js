import React, { useState, useContext } from 'react';
import AppContext from '../../contexts/AppContext';
import { UserContext } from '../../contexts/UserContext';
import apiInstance from '../../services/apiServices';
import { withRouter } from 'react-router-dom';
import Settings from '../configuration/settings';
import LayoutDesign from './layoutDesign';
import * as BuiltInComponents from './BuiltInComponents';
import * as BootstrapComponents from './BootstrapComponents';
import AjaxForm from '../../components/cms/sideMenu/AjaxForm';
import AjaxFetch from '../../components/cms/sideMenu/AjaxFetch';
import { Helmet } from 'react-helmet';
import moment from 'moment';
import matchAll from 'string.prototype.matchall';

export const CmsContext = React.createContext();

function Cms(props) {
  const { structure, meta } = props;
  const [appData] = useContext(AppContext);
  const userContext = useContext(UserContext);

  const [state, setState] = useState({
    configData: appData,
    userData: userContext.userData,
    api: apiInstance,
  });

  const componentMap = {
    'az-settings': Settings,
    'az-layoutDesign': LayoutDesign,
    'az-ajaxform': AjaxForm,
    'az-ajaxfetch': AjaxFetch,
    ...Object.keys(BootstrapComponents).reduce(
      (obj, item) => ({ ...obj, [item]: BootstrapComponents[item] }),
      {}
    ),
    ...Object.keys(BuiltInComponents).reduce(
      (obj, item) => ({ ...obj, [item]: BuiltInComponents[item] }),
      {}
    ),
  };

  const renderInterpolations = (title) => {
    let enhanced = title;
    const matches = matchAll(title, /\{{([^}}]+)\}}/g);
    if (matches !== undefined) {
      const check = [...matches];
      if (check && check.length > 0) {
        check.forEach(ch => {
          const mom = moment().format(ch[1]);
          enhanced = enhanced.replace(ch[0], mom)
        })
      }
    }
    return enhanced;
  }


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
                : renderInterpolations(str.title)
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
      {meta && Object.keys(meta).length > 0 && (
        <Helmet>
          <title>{meta.title}</title>
          <meta name="description" content={meta.description} />
          <meta name="keywords" content={meta.keywords} />
        </Helmet>
      )}
      {recursiveComponent(structure)}
    </CmsContext.Provider>
  );
}

export default withRouter(Cms);
