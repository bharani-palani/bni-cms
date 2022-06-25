const baseUrl = () => {
  const dev = process.env.React_App_HOST_LOCAL;
  const prod = process.env.React_App_HOST_REMOTE;
  return process.env.NODE_ENV === 'development' ? dev : prod;
};

export { baseUrl };
