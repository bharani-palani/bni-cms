import React, { useState, useEffect, useContext } from 'react';
import helpers from '../../helpers';
import apiInstance from '../../services/apiServices';
import Loader from 'react-loader-spinner';
import { UserContext } from '../../contexts/UserContext';
import AppContext from '../../contexts/AppContext';
import { masterConfig, wizardData } from '../configuration/backendTableConfig';
import Wizard from '../configuration/Wizard';
import CryptoJS from 'crypto-js';
import Encryption from '../../helpers/clientServerEncrypt';
import { encryptKeys, encryptSaltKey, clientServerEncryptKeys } from './crypt';

function Config(props) {
  const userContext = useContext(UserContext);
  const [appData, setMaster] = useContext(AppContext);
  const [formStructure, setFormStructure] = useState(masterConfig);
  const [loader, setLoader] = useState(true);
  const encryption = new Encryption();
  const axiosOptions = {
    headers: { 'Awzy-Authorization': appData.token },
  };

  const getBackendAjax = (Table, TableRows) => {
    const formdata = new FormData();
    formdata.append('TableRows', TableRows);
    formdata.append('Table', Table);
    return apiInstance.post('/getBackend', formdata, axiosOptions);
  };

  useEffect(() => {
    setLoader(true);
    const TableRows = formStructure.map(form => form.index);

    getBackendAjax('config', TableRows)
      .then(r => {
        const responseObject = r.data.response[0];
        const responseArray = Object.keys(responseObject);
        let backupStructure = [...formStructure];
        backupStructure = backupStructure.map(backup => {
          if (responseArray.includes(backup.index)) {
            backup.value = encryptKeys.includes(backup.index)
              ? CryptoJS.AES.decrypt(
                  responseObject[backup.index],
                  appData[encryptSaltKey]
                ).toString(CryptoJS.enc.Utf8)
              : clientServerEncryptKeys.includes(backup.index)
              ? encryption.decrypt(
                  responseObject[backup.index],
                  appData[encryptSaltKey]
                )
              : responseObject[backup.index];
          }
          return backup;
        });
        setFormStructure(backupStructure);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setLoader(false);
      });
  }, [JSON.stringify(appData)]);

  const onMassagePayload = (index, value) => {
    let backupStructure = [...formStructure];
    backupStructure = backupStructure.map(backup => {
      if (backup.id === index) {
        backup.value = value;
      }
      return backup;
    });
    setFormStructure(backupStructure);
  };

  const onReactiveFormSubmit = () => {
    setLoader(true);
    const salt = [...formStructure].filter(f => f.id === encryptSaltKey)[0]
      .value;
    let payload = [...formStructure].map(f => ({
      // [f.id]: encryptKeys.includes(f.id)
      //   ? CryptoJS.AES.encrypt(f.value, salt).toString()
      //   : f.value,
      [f.id]: encryptKeys.includes(f.id)
        ? CryptoJS.AES.encrypt(f.value, salt).toString()
        : clientServerEncryptKeys.includes(f.id)
        ? encryption.encrypt(f.value, salt)
        : f.value,
    }));
    payload = Object.assign({}, ...payload);
    const newPayload = {
      Table: 'config',
      updateData: [payload],
    };
    const formdata = new FormData();
    formdata.append('postData', JSON.stringify(newPayload));

    apiInstance
      .post('/postBackend', formdata, axiosOptions)
      .then(res => {
        if (res.data.response) {
          let backupStructure = [...formStructure];
          const bPayLoad = Object.keys(payload);
          backupStructure = backupStructure.map(backup => {
            if (bPayLoad.includes(backup.index)) {
              backup.value = payload[backup.index];
            }
            return backup;
          });
          setFormStructure(backupStructure);
          userContext.renderToast({
            message: 'Configurations saved successfully',
          });
          let massageStructure = backupStructure.map(b => [b.id, b.value]);
          massageStructure = {
            ...Object.fromEntries(massageStructure),
            token: appData.token,
          };
          setMaster(massageStructure);
        }
      })
      .catch(e =>
        userContext.renderToast({
          type: 'error',
          icon: 'fa fa-times-circle',
          message: 'Oops.. Something went wrong. Please try again.',
        })
      )
      .finally(() => setLoader(false));
  };

  return (
    <div className="">
      {loader ? (
        <div className="text-center mt-100">
          <Loader
            type={helpers.loadRandomSpinnerIcon()}
            color={document.documentElement.style.getPropertyValue(
              '--az-theme-bg-color'
            )}
            height={100}
            width={100}
          />
        </div>
      ) : (
        <div className="">
          {
            <Wizard
              key={1}
              data={formStructure}
              menu={wizardData}
              onMassagePayload={onMassagePayload}
              onReactiveFormSubmit={onReactiveFormSubmit}
            />
          }
        </div>
      )}
    </div>
  );
}
export default Config;
