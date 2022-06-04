const baseUrl = () => {
  const dev = 'http://localhost:5000/bniReactWeb/services';
  const prod = 'https://bharani.tech/services';
  return process.env.NODE_ENV === 'development' ? dev : prod;
};

export { baseUrl };
