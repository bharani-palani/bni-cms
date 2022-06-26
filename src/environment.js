const baseUrl = () => {
  console.log('bbb', process.env);
  const dev = process.env.React_App_LOCALHOST_BASE_URL;
  const prod = process.env.React_App_PRODUCTION_BASE_URL;
  return process.env.NODE_ENV === 'development' ? dev : prod;
};

export { baseUrl };
