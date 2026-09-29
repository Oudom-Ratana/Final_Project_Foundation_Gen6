import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

const API =
  import.meta.env.VITE_CINEMA_API_BASE_URL ||
  "https://cinema-booking-api.eunglyzhia.com/api/v1";
const SECRET = import.meta.env.VITE_GOOGLE_AUTH_SECRET;

const post = async (path, body) => {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  return { ok: res.ok, data };
};

// login ជាមួយ backend បើគ្មានគណនីទើប register
export async function getBackendTokens(fbUser) {
  const email = fbUser.email;
  const password = `${SECRET}_${fbUser.uid}`;

  let result = await post("/auth/login", { email, password });

  if (!result.ok) {
    const [firstName, ...rest] = (fbUser.displayName || "Google User").split(" ");
    const reg = await post("/auth/register", {
      firstName,
      lastName: rest.join(" ") || firstName,
      username: email.split("@")[0],
      email,
      phone: fbUser.phoneNumber || "0000000000",
      password,
    });
    if (!reg.ok) throw new Error(reg.data?.message || "Register failed");

    result = await post("/auth/login", { email, password });
    if (!result.ok) throw new Error(result.data?.message || "Login failed");
  }

  return result.data; // { accessToken, refreshToken, ... }
}

export async function signInWithGoogle() {
  const { user } = await signInWithPopup(auth, googleProvider);
  return getBackendTokens(user);
}