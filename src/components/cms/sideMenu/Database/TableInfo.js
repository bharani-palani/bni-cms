import React, { useContext } from 'react';
import { UserContext } from '../../../../contexts/UserContext';

function TableInfo(props) {
  const userContext = useContext(UserContext);

  return (
    <div className="table-responsive">
      <table
        className={`table table-sm table-striped ${
          userContext.userData.theme === 'dark' ? 'table-dark' : 'table-light'
        }`}
        style={{ minWidth: '768px' }}
      >
        <thead>
          <tr>
            <th>Field</th>
            <th>Type</th>
            <th>Null</th>
            <th>Key</th>
            <th>Default</th>
            <th>Extra</th>
          </tr>
        </thead>
        <tbody>
          {new Array(5).fill(1).map((_, i) => (
            <tr key={i}>
              <td>Field {i}</td>
              <td>Type {i}</td>
              <td>Null {i}</td>
              <td>Key {i}</td>
              <td>Default {i}</td>
              <td>Extra {i}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableInfo;
