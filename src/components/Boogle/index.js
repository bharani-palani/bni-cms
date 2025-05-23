import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { rapidApiKey } from '../../environment';

const Boogle = props => {
  const [q, setQ] = useState('');
  const [result, setResult] = useState({});
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    q && handleSearch();
  }, []);

  const onQueryChange = (value, cb) => {
    const query = encodeURIComponent(value);
    setResult({});
    setQ(query);
    typeof cb === 'function' && cb();
  };
  const handleSearch = () => {
    setResult({});
    setLoader(true);
    const url = `https://seo-api.p.rapidapi.com/v1/search/q=${q}`;
    const options = {
      headers: {
        'X-User-Agent': 'desktop',
        'X-Proxy-Location': 'IN',
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'seo-api.p.rapidapi.com',
      },
    };
    axios
      .get(url, options)
      .then(res => {
        setResult(res.data);
      })
      .finally(() => setLoader(false));
  };

  const onRelevantSearch = query => {
    onQueryChange(query, () => {
      handleSearch();
    });
  };

  return (
    <div className="mt-3 container-fluid">
      <div className="text-center my-2" style={{ fontSize: '4rem' }}>
        <span className="text-primary">B</span>
        <span className="text-danger">o</span>
        <span className="text-danger">o</span>
        <span className="text-danger">o</span>
        <span className="text-danger">o</span>
        <span className="text-danger">o</span>
        <span className="text-success">g</span>
        <span className="text-info">l</span>
        <span className="text-warning">e</span>
      </div>
      <div className="row">
        <div className="col-sm-6 offset-sm-3">
          <div className="input-group input-group-md mb-2">
            <input
              type="text"
              spellCheck="false"
              value={decodeURIComponent(q)}
              onKeyPress={e => e.key === 'Enter' && handleSearch()}
              onChange={e => onQueryChange(e.target.value)}
              className="form-control"
              placeholder={`Search here`}
              aria-label="Search here"
              aria-describedby="boogle-sizing-lg"
              id="boogle-sizing-lg"
            />
            <button
              disabled={loader}
              onClick={() => handleSearch()}
              className="btn btn-primary"
              type="button"
            >
              {loader ? (
                <i className="fa fa-circle-o-notch fa-spin" />
              ) : (
                <i className="fa fa-search" />
              )}
            </button>
          </div>
          {result.results && q && (
            <div className="text-muted my-2 small">
              About{' '}
              {
                result.results.filter(f => f.link && f.description && f.title)
                  .length
              }{' '}
              results for {decodeURIComponent(q)}
            </div>
          )}
        </div>
      </div>
      {result.results && result.results.length > 0 && (
        <div className="resultGrid mt-3">
          {result.results
            .filter(f => f.link && f.description && f.title)
            .map((res, i) => (
              <div key={i} className="mb-3 row">
                <div className="col-sm-12">
                  <a
                    className="link-primary h5 d-block"
                    href={res.link}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {res.title}
                  </a>
                  <p dangerouslySetInnerHTML={{ __html: res.description }} />
                  {/* <div><span className="badge bg-secondary"><i className='fa fa-clock-o' /> {moment(res.published_at).format('Do MMM YYYY hh:mm A')}</span></div> */}
                </div>
              </div>
            ))}
          {result.answers && result.answers.length > 0 && (
            <div>
              <h5>
                <em className="badge bg-primary rounded-pill">
                  Relevant search
                </em>
              </h5>
              <ul className="" style={{ listStyle: 'none', paddingLeft: 0 }}>
                {result.answers.map((res, i) => (
                  <li key={i} className="py-1">
                    <a
                      href
                      onClick={() => onRelevantSearch(res)}
                      className="link-primary cursor-pointer"
                    >
                      {res}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Boogle;
