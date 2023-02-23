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

export const setSession = (key: string, value: any, expirationInMin: number) => {
  const expirationDate = new Date(new Date().getTime() + 60000 * expirationInMin);
  const newValue = {
    value,
    expirationDate: expirationDate.toISOString(),
  };
  window.sessionStorage.setItem(key, JSON.stringify(newValue));
};

export const getSession = (key: string) => {
  const stringValue = window.sessionStorage.getItem(key);
  if (stringValue !== null) {
    const value = JSON.parse(stringValue);
    const expirationDate = new Date(value.expirationDate);
    if (expirationDate > new Date()) {
      return value.value;
    }
    window.sessionStorage.removeItem(key);
  }
  return null;
};
