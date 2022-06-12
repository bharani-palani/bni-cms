import React, { useEffect, useState, useContext } from 'react';
import ReactiveForm from '../../configuration/ReactiveForm/';
import apiInstance from '../../../services/apiServices';
import { UserContext } from '../../../contexts/UserContext';
import AppContext from '../../../contexts/AppContext';

function AjaxForm(props) {
  const [appData] = useContext(AppContext);
  const userContext = useContext(UserContext);
  const {
    config: { table, successMessage, ...restConfig },
    structure,
  } = props;
  const [formedStructure, setFormedStructure] = useState([]);
  const axiosOptions = {
    headers: { 'Awzy-Authorization': appData.token },
  };

  useEffect(() => {
    const bStructure = [...structure].map(p => {
      const array = Object.entries(p.props);
      const newArray = array.map(a => {
        let opt = [];
        if (typeof a[1] === 'object' && !Array.isArray(a[1])) {
          opt = Object.entries(a[1]).map(o => {
            if (o[0] === 'validation') {
              return [o[0], regGen(o[1])];
            } else if (o[0] === 'isInline') {
              return [o[0], Boolean(o[1])];
            } else if (o[0] === 'required') {
              return [o[0], Boolean(o[1])];
            } else if (o[0] === 'list') {
              return [o[1]];
            } else {
              return [o[0], o[1]];
            }
          });
          opt = Object.fromEntries(opt);
        } else if (typeof a[1] === 'object' && Array.isArray(a[1])) {
          opt = a[1];
        } else {
          opt = a[1];
        }
        return [a[0], opt];
      });
      return Object.fromEntries(newArray);
    });
    setFormedStructure([]);
    setTimeout(() => {
      setFormedStructure(bStructure);
    }, 10);
  }, [structure]);

  const regGen = uInput => {
    if (typeof uInput === 'string') {
      const regExpParser = new RegExp('^/(.*)/(.*)|(.*)');
      const match = uInput.match(regExpParser);
      return new RegExp(match[1] || match[3], match[2]);
    } else {
      return uInput;
    }
  };

  const onMassagePayload = (index, value, list = {}) => {
    let backupStructure = [...formedStructure];
    backupStructure = backupStructure.map(backup => {
      if (backup.id === index) {
        !value &&
          Object.keys(list).length > 0 &&
          backup.list &&
          backup.list.length > 0 &&
          backup.list.map(l => {
            if (String(l.id) === String(list.id)) {
              l.checked = list.checked;
            }
            return l;
          });
        const newValue =
          !value && list && Object.keys(list).length > 0
            ? backup.list.filter(f => f.checked).map(c => c.value)
            : value;
        backup.value = newValue;
      }
      return backup;
    });
    setFormedStructure(backupStructure);
  };

  const resetForm = () => {
    let backupStructure = [...formedStructure];
    backupStructure = backupStructure.map(backup => {
      backup.value = Array.isArray(backup.value) ? [] : '';
      return backup;
    });
    setFormedStructure([]);
    setTimeout(() => {
      setFormedStructure(backupStructure);
    }, 10);
  };

  const onReactiveFormSubmit = () => {
    const fields = formedStructure.map(form => ({
      field: form.index,
      value: Array.isArray(form.value) ? form.value.join(',') : form.value,
    }));

    const formdata = new FormData();
    formdata.append('table', table);
    formdata.append('fields', JSON.stringify(fields));

    apiInstance
      .post('/postAjaxForm', formdata, axiosOptions)
      .then(res => {
        const bool = res.data.response;
        if (bool) {
          userContext.renderToast({
            message: successMessage,
          });
        } else {
          userContext.renderToast({
            type: 'error',
            icon: 'fa fa-times-circle',
            message:
              'Oops.. Some thing wrong in your form. Please correct them and try again.',
          });
        }
      })
      .catch(error => {
        userContext.renderToast({
          type: 'error',
          icon: 'fa fa-times-circle',
          message: 'Oops.. Some thing went wrong. Please try again.',
        });
      })
      .finally(() => resetForm());
  };

  return (
    <>
      {formedStructure.length > 0 && (
        <ReactiveForm
          structure={formedStructure}
          onChange={(index, value, list) =>
            onMassagePayload(index, value, list)
          }
          onSubmit={() => onReactiveFormSubmit()}
          {...restConfig}
        />
      )}
    </>
  );
}

export default AjaxForm;
