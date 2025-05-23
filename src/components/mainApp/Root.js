/* eslint-disable new-cap */
import React, { useState, useEffect } from 'react';
import MainApp from '../mainApp/MainApp';
import AppContext from '../../contexts/AppContext';
import UserContextProvider from '../../contexts/UserContext';
import apiInstance from '../../services/apiServices';
import GlobalHeader from '../GlobalHeader';
import { FactoryMap } from '../configuration/Gallery/FactoryMap';
import { getServiceProvider } from '../configuration/Gallery/SignedUrl';

function Root(props) {
  const [master, setMaster] = useState({});
  const [fetchStatus, setFetchStatus] = useState(true);
  const [, setLogger] = useState(
    JSON.parse(localStorage.getItem('userData')) || {}
  );

  const getData = async () => {
    setFetchStatus(false);
    await apiInstance
      .get('/')
      .then(response => {
        const data = response.data.response[0];
        setMaster(data);
        favIconSetter(data);
        document.documentElement.style.setProperty(
          '--az-theme-color',
          data.webThemeColor
        );
        document.documentElement.style.setProperty(
          '--az-theme-bg-color',
          data.webThemeBackground
        );
      })
      .catch(error => false)
      .finally(() => setFetchStatus(true));
  };

  const favIconSetter = data => {
    const ele = document.querySelector('#favIcon');
    const sp = getServiceProvider(data.favIconImg);
    FactoryMap(sp, data)
      .library.getSignedUrl(data.favIconImg)
      .then(data => {
        ele.href = data.url || '';
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {fetchStatus && (
        <AppContext.Provider value={[master, setMaster]}>
          <UserContextProvider config={master}>
            <GlobalHeader
              onLogAction={b => {
                setLogger(b);
              }}
            >
              <MainApp />
            </GlobalHeader>
          </UserContextProvider>
        </AppContext.Provider>
      )}
    </>
  );
}

export default Root;
