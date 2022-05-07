import React from 'react';

function ErrorCatch(props) {
  // const { error, errorInfo } = props;
  return (
    <div className="">
      <div className="p-5">
        <div className="position-relative">
          <div className="position-absolute top-50 start-50 translate-middle-x">
            <div className="text-center">
              <i className="fa fa-exclamation-triangle fa-5x text-danger" />
              <h1>Something went wrong!</h1>
              <p className="error-details">
                This could be cause of some errors in your design..
              </p>
              <div className="d-grid">
                <a className="btn btn-lg btn-success" href="/">
                  Please refresh page and redo design
                </a>
              </div>
              <p className="mt-3">Contact administrator for more details</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorCatch;
