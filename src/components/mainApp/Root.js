/* eslint-disable new-cap */
import React, { useState, useEffect } from 'react';
import AppContext from '../../contexts/AppContext';
import apiInstance from '../../services/apiServices';
import { FactoryMap } from '../configuration/Gallery/FactoryMap';
import { getServiceProvider } from '../configuration/Gallery/SignedUrl';

function Root(props) {
  const [master, setMaster] = useState({});
  const [fetchStatus, setFetchStatus] = useState(true);

  const getData = async () => {
    setFetchStatus(false);
    // Note: Token validation shud`nt be set here
    await apiInstance
      .get('/')
      .then(response => {
        const data = response.data.response[0];
        setMaster(data);
        setFetchStatus(true);
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
      .catch(error => setFetchStatus(false))
      .finally(error => false);
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
          <h1>Hello world</h1>
          {/* <UserContextProvider config={master}>
            <GlobalHeader
              onLogAction={b => {
                setLogger(b);
              }}
            >
              <MainApp />
            </GlobalHeader>
          </UserContextProvider> */}
        </AppContext.Provider>
      )}
    </>
  );
}

export default Root;
