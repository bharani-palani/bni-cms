/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import ReactiveForm from '../../configuration/ReactiveForm/';

function AjaxForm(props) {
  const { apiUrl, structure } = props;
  const [formedStructure, setFormedStructure] = useState([]);

  useEffect(() => {
    let bStructure = [...structure].map(p => p.props);
    bStructure = bStructure.map(s => {
      s.options.validation = regGen(s.options.validation);
      return s;
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

  const onMassagePayload = (index, value) => {};
  const onReactiveFormSubmit = data => {
    console.log('bbb', data);
  };
  return (
    <>
      {formedStructure.length > 0 && (
        <ReactiveForm
          parentClassName="reactive-form text-dark"
          structure={formedStructure}
          onChange={(index, value) => onMassagePayload(index, value)}
          onSubmit={data => onReactiveFormSubmit(data)}
          submitBtnLabel={'Save'}
          submitBtnClassName="btn btn-az pull-right"
        />
      )}
    </>
  );
}

export default AjaxForm;
