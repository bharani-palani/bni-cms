import React from 'react';

const OrderedList = ({ apiUrl, ...rest }) => {
  return (
    <ol {...rest}>
      {[1,2,3].map((d, i) => <li key={i}>{d}</li>)}
      {/* <li>test</li> */}
    </ol>
  );
};

const UnOrderedList = ({ apiUrl, ...rest }) => {
  return (
    <ul {...rest}>
      {/* {data.length > 0 && data.map((d, i) => <li key={i}>{d}</li>)} */}
      <li>test</li>
    </ul>
  );
};

export { OrderedList, UnOrderedList };
