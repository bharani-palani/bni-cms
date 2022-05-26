/* eslint-disable no-unused-vars */
import React, { useContext } from 'react';
import withFetchHOC from './withFetchHOC';
import { UserContext } from '../../../contexts/UserContext';

function AjaxFetch(props) {
  const { data, loading } = props;
  const userContext = useContext(UserContext);

  return (
    <div>
      {!loading && data.length > 0 && (
        <div className="table-responsive">
          <table
            className={`table table-striped table-hover table-sm table-borderless ${
              userContext.userData.theme === 'dark'
                ? 'table-dark'
                : 'table-light'
            }`}
          >
            <thead>
              <tr>
                {Object.keys(data[0]).map((head, i) => (
                  <th key={i}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  {Object.entries(row).map((cell, j) => (
                    <td key={j}>{cell[1]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!loading && !data.length && (
        <div className="p-5 bg-danger text-center rounded">
          No data found or Ajax config mismatch
        </div>
      )}
    </div>
  );
}

export default withFetchHOC(AjaxFetch);
