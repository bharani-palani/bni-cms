/* eslint-disable react/display-name */
import React from 'react';
import apiInstance from '../../../services/apiServices';

const withFetchHOC = Component => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        data: [],
        loaing: false,
      };
    }

    componentDidMount() {
      this.loadData();
    }

    componentDidUpdate(prevProps) {
      if (this.props.query !== prevProps.query) {
        this.loadData();
      }
    }

    loadData() {
      this.setState({ ...this.state, loading: true });
      const formdata = new FormData();
      formdata.append('query', JSON.stringify(this.props.query));

      apiInstance
        .post('/ajaxFetch', formdata)
        .then(res => {
          const obj = res.data.response;
          this.setState({ ...this.state, data: obj, loading: false });
        })
        .catch(error => {
          this.setState({ ...this.state, data: [], loading: false });
        });
    }

    render() {
      return (
        <Component
          loading={this.state.loading}
          data={this.state.data}
          {...this.props}
        />
      );
    }
  };
};

export default withFetchHOC;
