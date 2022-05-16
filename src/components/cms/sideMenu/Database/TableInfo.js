import React, { useContext } from 'react';
import { UserContext } from '../../../../contexts/UserContext';
import { TableConfigContext } from './TableConfig';

function TableInfo(props) {
  const userContext = useContext(UserContext);

  return (
    <TableConfigContext.Consumer>
      {({ infoList }) => (
        <div>
          <div className="py-2">
            <span className="badge bg-primary me-1">{infoList.table}</span>
            <span className="badge bg-success ms-1">
              {infoList.records} record(s)
            </span>
          </div>
          <div className="table-responsive">
            <table
              className={`table table-sm table-striped ${
                userContext.userData.theme === 'dark'
                  ? 'table-dark'
                  : 'table-light'
              }`}
              style={{ minWidth: '768px' }}
            >
              <thead>
                <tr>
                  {Object.keys(infoList.data[0]).map((h, i) => (
                    <th key={i}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {infoList.data.map((h, i) => (
                  <tr key={i}>
                    {Object.keys(h).map((r, j) => (
                      <td key={j}>{h[r]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </TableConfigContext.Consumer>
  );
}

export default TableInfo;
