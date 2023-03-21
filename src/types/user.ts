export type LoginType = {
  data: {
    accessToken: string;
    user: {
      id: string;
      name: string;
    };
  };
};
