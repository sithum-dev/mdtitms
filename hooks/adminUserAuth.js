import { parseCookies } from "nookies";
export const userAuth = () => {
  const uToken = parseCookies();

  if (!uToken) {
    return {
      auth: false,
    };
  } else {
    return {
      auth: true,
    };
  }
};
