/* eslint-disable react/display-name */
import React from 'react';
import apiInstance from '../../../services/apiServices';

const withFetchHOC = (Component, query) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: [],
      };
    }

    componentDidMount() {
      const formdata = new FormData();
      formdata.append('query', JSON.stringify(query));

      apiInstance
        .post('/ajaxFetch', formdata)
        .then(res => {
          const obj = res.data.response;
          console.log('bbb', obj);
          this.setState({ data: obj });
        })
        .catch(error => {
          this.setState({ data: [] });
        });
    }

    render() {
      return <Component data={this.state.data} {...this.props} />;
    }
  };
};

export default withFetchHOC;
