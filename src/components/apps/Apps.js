import React, { useEffect, useState } from 'react';
import AmortizationCalculator from './AmortizationCalculator';

const Apps = () => {
  const [menu, setMenu] = useState('');

  const menuList = [
    {
      page_id: '1',
      constant: 'AMORT',
      label: 'Amortization calculator',
      description: 'Calculate EMI on your loan amount, ROI and tenure input',
      icon: 'fa fa-line-chart',
    },
  ];

  const MapComponent = () => {
    const abc = {
      AMORT: AmortizationCalculator,
    };
    const Comp = abc[menu];
    return <Comp />;
  };

  useEffect(() => {
    if (menu) {
      setMenu('');
      setMenu(menu);
    }
  }, [menu]);

  return (
    <div className="mt-3 container-fluid">
      <div className="row">
        {menuList.map(m => (
          <div key={m.page_id} className={`col-md-3 text-black mb-1`}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title text-center">{m.label}</h5>
                <div className="text-center">
                  <i className={`fa-5x p-2 ${m.icon}`} />
                </div>
                <p className="card-text">{m.description}</p>
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-success"
                    onClick={() => setMenu(m.constant)}
                  >
                    Click here
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div>{menu && <MapComponent />}</div>
    </div>
  );
};

export default Apps;
