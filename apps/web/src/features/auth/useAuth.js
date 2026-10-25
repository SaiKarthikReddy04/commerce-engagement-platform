import { useDispatch, useSelector } from "react-redux";
import { apiRequest } from "../../lib/apiClient.js";
import { clearCredentials, setCredentials } from "./store/authSlice.js";

export function useAuth() {
  const dispatch = useDispatch();
  const { user, accessToken } = useSelector((state) => state.auth);

  async function authenticate(path, credentials) {
    const result = await apiRequest(path, {
      method: "POST",
      body: credentials,
    });

    const { user: signedInUser, accessToken: token } = result.data;

    localStorage.setItem("accessToken", token);
    localStorage.setItem("authUser", JSON.stringify(signedInUser));

    dispatch(setCredentials({ user: signedInUser, accessToken: token }));

    return signedInUser;
  }

  function login(credentials) {
    return authenticate("/auth/login", credentials);
  }

  function register(details) {
    return authenticate("/auth/register", details);
  }

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authUser");
    dispatch(clearCredentials());
  }

  return {
    user,
    isAuthenticated: Boolean(user && accessToken),
    login,
    register,
    logout,
  };
}
