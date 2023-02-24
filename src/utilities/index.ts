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
  const passwordCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,30}$/;
  return passwordCheck.test(password);
};

export const formatPageArray = (
  totalCount: number,
  pageGroupCount: number,
  productCount: number = 10
) => {
  const pageNumbers = [];
  const totalPage = Math.ceil(totalCount / productCount);

  for (let i = 1; i <= totalPage; i += pageGroupCount) {
    const pageGroup = [];

    for (let j = i; j < i + pageGroupCount && j <= totalPage; j++) {
      pageGroup.push(j);
    }

    pageNumbers.push(pageGroup);
  }

  return pageNumbers;
};
