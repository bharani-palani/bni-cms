const baseUrl = () => {
  const dev = process.env.REACT_APP_LOCALHOST_BASE_URL;
  const prod = process.env.REACT_APP_PRODUCTION_BASE_URL;
  return process.env.NODE_ENV === 'development' ? dev : prod;
};
const rapidApiKey = 'ab41d118d1msh03b94fd2a0f7b61p10edcdjsn2d55dd5a2c32';

export { baseUrl, rapidApiKey };
