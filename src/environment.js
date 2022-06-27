const baseUrl = () => {
  const dev = process.env.REACT_APP_LOCALHOST_BASE_URL;
  const prod = process.env.REACT_APP_PRODUCTION_BASE_URL;
  return process.env.NODE_ENV === 'development' ? dev : prod;
};

export { baseUrl };
