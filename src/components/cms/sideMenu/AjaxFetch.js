/* eslint-disable no-unused-vars */
import React, { useContext, useEffect } from 'react';
import { UserContext } from '../../../contexts/UserContext';
import apiInstance from '../../../services/apiServices';

function AjaxFetch(props) {
  const userContext = useContext(UserContext);
  const { query } = props;

  useEffect(() => {
    const formdata = new FormData();
    formdata.append('query', JSON.stringify(query));

    apiInstance
      .post('/ajaxFetch', formdata)
      .then(res => {
        const data = res.data.response;
        console.log('bbb', data);
      })
      .catch(error => {
        userContext.renderToast({
          type: 'error',
          icon: 'fa fa-times-circle',
          message:
            'Oops.. unable to fetch ajax data. Please check your Ajax Fetch config.',
        });
      });
  }, []);

  return <div>Hello AjaxFetch</div>;
}

export default AjaxFetch;
