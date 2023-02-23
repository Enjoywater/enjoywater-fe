export const parseQueryString = (search: string): Record<string, string> =>
  (search || '')
    .replace(/^\?/g, '')
    .split('&')
    .reduce((acc, query) => {
      const [key, value] = query.split('=');

      if (key) {
        acc[key] = decodeURIComponent(value);
      }

      return acc;
    }, {} as Record<string, string>);

export const checkUserId = (id: string) => {
  const idCheck = /^[A-Za-z0-9]{5,30}$/;
  return idCheck.test(id);
};

export const checkPassword = (password: string) => {
  const passwordCheck = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,30}/;
  return passwordCheck.test(password);
};
