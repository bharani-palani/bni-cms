/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import ReactiveForm from '../../configuration/ReactiveForm/';

function AjaxForm(props) {
  const {
    config: { apiUrl, ...restConfig },
    structure,
  } = props;
  const [formedStructure, setFormedStructure] = useState([]);

  useEffect(() => {
    const bStructure = [...structure].map(p => {
      const array = Object.entries(p.props);
      const newArray = array.map(a => {
        let opt = [];
        if (typeof a[1] === 'object' && !Array.isArray(a[1])) {
          opt = Object.entries(a[1]).map(o => {
            if (o[0] === 'validation') {
              return [o[0], regGen(o[1])];
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

  const onMassagePayload = (index, value, list) => {
    let backupStructure = [...formedStructure];
    backupStructure = backupStructure.map(backup => {
      if (backup.id === index) {
        // start here
        backup.value = value;
      }
      return backup;
    });
    setFormedStructure(backupStructure);
  };

  const onReactiveFormSubmit = () => {
    console.log('bbb', formedStructure);
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
