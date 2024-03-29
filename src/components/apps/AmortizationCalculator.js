import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  Row,
  Col,
  Form,
  Table,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import helpers from '../../helpers';
import CsvDownloader from 'react-csv-downloader';
import { UserContext } from '../../contexts/UserContext';
import DonutChart from 'react-donut-chart';
import LineChart from 'react-linechart';

const AmortizationCalculator = props => {
  const chartRef = useRef();
  const userContext = useContext(UserContext);
  const now = helpers.getNow();
  const { ...rest } = props;
  const [green, red] = ['#8cc751', '#dc3545'];
  const allLoc = [{ INR: 'en-in', USD: 'en-us' }];

  const columns = [
    { displayName: 'Month', id: 'index' },
    { displayName: 'EMI', id: 'emi' },
    { displayName: 'Diminishing', id: 'bal' },
    { displayName: 'Interest', id: 'int' },
    { displayName: 'Principle', id: 'princ' },
  ];
  const [loanState, setLoanState] = useState({
    decimalPoint: 0,
    currency: 'INR',
    minAmount: 100000,
    maxAmount: 10000000,
    amount: 1000000,
    minTenure: 0,
    maxTenure: 30,
    tenure: 1,
    minRoi: 1,
    maxRoi: 100,
    roi: 8.6,
  });
  const [chartData, setChartData] = useState([]);

  const point =
    loanState.decimalPoint > -1 && loanState.decimalPoint < 5
      ? loanState.decimalPoint
      : 0;
  const [payment, setPayment] = useState(0);
  const [table, setTable] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [exportData, setExportData] = useState([]);

  useEffect(() => {
    const roi = loanState.roi / 100 / 12;
    const tenure = Math.ceil(loanState.tenure * 12);
    const amt = loanState.amount;
    const pay = Number(pmt(roi, tenure, amt).toFixed(point));
    setPayment(pay);
  }, [loanState]);

  const onChangeLoanState = (key, value) => {
    let fValue = value;
    if (['tenure'].includes(key)) {
      fValue =
        parseFloat(value) >= loanState.minTenure &&
        parseFloat(value) <= loanState.maxTenure
          ? Number(value).toFixed(3)
          : 1;
    }
    if (['roi'].includes(key)) {
      fValue = value >= 1 && value <= 100 ? value : 1;
    }
    if (['decimalPoint'].includes(key)) {
      fValue = value > 0 && value < 5 ? value : 0;
    }
    setLoanState(ev => ({
      ...ev,
      [key]: fValue,
    }));
  };

  useEffect(() => {
    const roi = loanState.roi / 100 / 12;
    const tenure =
      Number(loanState.tenure) > 0 ? Math.ceil(loanState.tenure * 12) : 1;
    const amt = loanState.amount;
    const emi = Number(Math.abs(pmt(roi, tenure, amt)).toFixed(point));

    let [princ, int, bal] = [0, 0, amt];
    const tbl = new Array(tenure).fill(1).map((_, i) => {
      bal = Number(i === 0 ? bal : bal - princ);
      int = Number((bal * (loanState.roi / 100)) / 12);
      princ = Number(emi - int);
      return {
        index: i + 1,
        emi,
        int,
        princ,
        bal,
      };
    });
    setTable(tbl);
    setExportData(
      tbl.map(t => {
        t.int = t.int.toFixed(point);
        t.bal = t.bal.toFixed(point);
        t.princ = t.princ.toFixed(point);
        t.emi = t.emi.toFixed(point);
        return t;
      })
    );
    const gData = [
      {
        label: 'Principal',
        value:
          (tbl.reduce((a, b) => Number(a) + Number(b.princ), 0) /
            tbl.reduce((a, b) => Number(a) + Number(b.emi), 0)) *
          100,
        isEmpty: false,
      },
      {
        label: 'Interest',
        value:
          (tbl.reduce((a, b) => Number(a) + Number(b.int), 0) /
            tbl.reduce((a, b) => Number(a) + Number(b.emi), 0)) *
          100,
      },
    ];
    setGraphData(gData);
    const cData = [
      {
        color: green,
        points: tbl.map(t => ({
          x: t.index,
          y: Number(t.princ),
        })),
      },
      {
        color: red,
        points: tbl.map(t => ({
          x: t.index,
          y: Number(t.int),
        })),
      },
    ];
    setChartData(cData);
  }, [loanState]);

  const pmt = (ir, np, pv, fv, type) => {
    /*
     * ir   - interest rate per month
     * np   - number of periods (months)
     * pv   - present value
     * fv   - future value
     * type - when the payments are due:
     *        0: end of the period, e.g. end of month (default)
     *        1: beginning of period
     */
    let [pmt, pvif] = [0, 0];

    fv || (fv = 0);
    type || (type = 0);

    if (ir === 0) return -(pv + fv) / np;

    pvif = Math.pow(1 + ir, np);
    pmt = (-ir * (pv * pvif + fv)) / (pvif - 1);

    if (type === 1) pmt /= 1 + ir;

    return pmt;
  };

  const getTotal = key => {
    let val = table.reduce((a, b) => Number(a) + Number(b[key]), 0);
    val = helpers.countryCurrencyLacSeperator(
      allLoc[loanState.currency],
      loanState.currency,
      val,
      point
    );
    return val;
  };

  const renderCloneTooltip = (props, content) => (
    <Tooltip id="button-tooltip-1" className="in show" {...rest}>
      {content}
    </Tooltip>
  );

  return (
    <div className="mx-2 mt-2">
      <Row className="bg-white rounded">
        <Col
          md={2}
          className={`p-3 accountPlanner ${
            userContext.userData.theme === 'dark' ? 'dark' : 'light'
          }`}
        >
          {exportData.length > 0 && (
            <div className="py-2 pe-1 d-inline-block">
              <CsvDownloader
                datas={helpers.stripCommasInCSV(exportData)}
                filename={`Amortization-table-${now}.csv`}
                columns={columns}
              >
                <OverlayTrigger
                  placement="top"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderCloneTooltip(props, 'Export to CSV')}
                  triggerType="hover"
                >
                  <i className="fa fa-file-excel-o roundedButton" />
                </OverlayTrigger>
              </CsvDownloader>
            </div>
          )}
          {graphData.length > 0 && (
            <div className="text-center">
              <DonutChart
                innerRadius={1}
                outerRadius={0.85}
                strokeColor={`${
                  userContext.userData.theme === 'dark' ? '#555555' : '#ffffff'
                }`}
                colors={[green, red]}
                height={150}
                width={150}
                legend={false}
                data={graphData}
              />
            </div>
          )}
        </Col>
        <Col
          md={10}
          className={`accountPlanner pb-3 ${userContext.userData.theme}`}
          ref={chartRef}
        >
          {chartRef?.current?.clientWidth && chartData.length > 0 && (
            <LineChart
              data={chartData}
              id="amortization-chart"
              margins={{ top: 20, right: 50, bottom: 0, left: 100 }}
              width={chartRef.current.clientWidth}
              height={250}
              xLabel={false}
              yLabel={false}
              onPointHover={d =>
                helpers.countryCurrencyLacSeperator('en-in', 'INR', d.y, 2)
              }
              tooltipClass={`line-chart-tooltip`}
              pointRadius={2}
              yMin={0}
              hideXAxis={true}
            />
          )}
        </Col>
      </Row>
      <Row>
        <Col md={5}>
          <Row className="align-items-center">
            <Col md="2" className="p-3">
              Loan amount
            </Col>
            <Col md="6">
              <Slider
                value={loanState.amount}
                step={loanState.minAmount}
                min={loanState.minAmount}
                max={loanState.maxAmount}
                onChange={value => onChangeLoanState('amount', value)}
                tooltip={false}
              />
            </Col>
            <Col md="4">
              <Form.Control
                type="number"
                className="form-control-sm"
                value={loanState.amount}
                onChange={o =>
                  onChangeLoanState('amount', Number(o.target.value))
                }
                placeholder={'Loan amount'}
              />
            </Col>
            <Col md="2" className="p-3">
              Tenure
            </Col>
            <Col md="6">
              <Slider
                value={Number(loanState.tenure)}
                min={loanState.minTenure}
                max={loanState.maxTenure}
                onChange={value => onChangeLoanState('tenure', value)}
                tooltip={false}
              />
            </Col>
            <Col md="4">
              <input
                type="number"
                className="form-control form-control-sm"
                min="0"
                max="100"
                defaultValue={loanState.tenure}
                onBlur={o =>
                  onChangeLoanState('tenure', '' + Number(o.target.value))
                }
                placeholder={'Tenure'}
              />
            </Col>
            <Col md="2" className="p-3">
              Interest
            </Col>
            <Col md="6">
              <Slider
                value={Number(loanState.roi)}
                min={loanState.minRoi}
                max={loanState.maxRoi}
                onChange={value => onChangeLoanState('roi', value)}
                tooltip={false}
              />
            </Col>
            <Col md="4">
              <Form.Control
                type="number"
                className="form-control-sm"
                value={loanState.roi}
                onChange={o => onChangeLoanState('roi', Number(o.target.value))}
                placeholder={'Interest'}
              />
            </Col>
            <Col md="2" className="p-3">
              Decimals
            </Col>
            <Col md="6">
              <Slider
                value={Number(loanState.decimalPoint)}
                min={0}
                max={4}
                onChange={value => onChangeLoanState('decimalPoint', value)}
                tooltip={false}
              />
            </Col>
            <Col md="4">
              <Form.Control
                type="number"
                className="form-control-sm"
                value={loanState.decimalPoint}
                onChange={o =>
                  onChangeLoanState('decimalPoint', Number(o.target.value))
                }
                placeholder={'Decimals'}
              />
            </Col>
            {/* <Col md="2" className="p-3">
              Currency
            </Col>
            <Col md="10">
              {localeList.map((l, i) => (
                <Form.Check
                  key={i}
                  inline
                  name="currency"
                  type={`radio`}
                  id={`default-${i}`}
                  label={l}
                  checked={l === loanState.currency}
                  onChange={o => onChangeLoanState('currency', l)}
                />
              ))}
            </Col> */}
          </Row>
        </Col>
        <Col md={7}>
          {table.length > 0 && (
            <Table
              striped
              bordered
              variant={`${
                userContext.userData.theme === 'dark' ? 'dark' : 'light'
              }`}
            >
              <thead>
                <tr>
                  <th>Installments</th>
                  <th>Interest</th>
                  <th>Principal amount</th>
                  <th>Diminishing</th>
                </tr>
                <tr className="border-bottom">
                  <th>
                    Total <span className="pull-right">{getTotal('emi')}</span>
                  </th>
                  <th className="text-danger">{getTotal('int')}</th>
                  <th colSpan={2} className="text-success">
                    {getTotal('princ')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {table.length > 0 &&
                  table.map((t, i) => (
                    <tr key={i}>
                      <td>
                        {i + 1}.{' '}
                        <span className="pull-right">
                          {Math.abs(payment).toLocaleString(
                            allLoc[loanState.currency]
                          )}
                        </span>
                      </td>
                      <td>
                        {parseFloat(
                          Number(t.int).toFixed(point)
                        ).toLocaleString(allLoc[loanState.currency])}
                      </td>
                      <td>
                        {parseFloat(
                          Number(t.princ).toFixed(point)
                        ).toLocaleString(allLoc[loanState.currency])}
                      </td>
                      <td>
                        {parseFloat(
                          Number(t.bal).toFixed(point)
                        ).toLocaleString(allLoc[loanState.currency])}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default AmortizationCalculator;
