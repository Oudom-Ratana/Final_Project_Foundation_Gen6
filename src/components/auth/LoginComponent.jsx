import React, { useState } from "react";
import { Link } from "react-router";
import heroImage from "../../assets/others/cinema.png";

const LoginComponent = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in with:", formData);
  };

  return (
    <div className="flex min-h-screen w-full ">
      {/* Left Hero Section */}
      <div className="relative hidden w-1/2 md:block">
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent " />
        <div className="relative flex h-full flex-col justify-start px-12 pt-6 pb-12">
          <h2 className="text-h3 font-family: 'google-sans', leading-tight text-white">
            Your next
            <br />
            movie experience
            <br />
            <span className="font-family: 'google-sans', relative inline-block">
              starts here.
              <span className="absolute -bottom-2 left-0 h-1 w-24 bg-primary-red" />
            </span>
          </h2>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex w-full items-center justify-center px-6 md:w-1/2">
        <div className="w-full max-w-md py-12">
          {/* Tabs */}
          <div className="mb-8 flex items-center gap-3">
            <span className="text-xl font-bold text-neutral-900 dark:text-white">
              Log In
            </span>
            <span className="h-6 w-px bg-primary-red" />
            <Link
              to="/signup"
              className="text-xl font-medium text-neutral-400 transition-colors hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              Sign Up
            </Link>
          </div>

          <h1 className="text-h3 font-family: 'google-sans', text-dark:color:white">
            Welcome back!
          </h1>
          <p className="mt-2 text-neutral-500">
            Sign in to book your next movie.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block font-family: 'google-sans', text-dark:color:white"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-full border border-neutral-200 bg-white px-5 py-3.5 text-neutral-900 placeholder:text-neutral-400 focus:border-primary-red focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block font-family: 'google-sans', text-dark:color:white"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-full border border-neutral-200 bg-white px-5 py-3.5 pr-12 text-neutral-900 placeholder:text-neutral-400 focus:border-primary-red focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                </button>
              </div>

              <div className="mt-3 text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm font-family: 'google-sans', text-primary-red hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-primary-red py-3.5 font-bold text-white transition-colors hover:brightness-110 active:scale-95"
            >
              Login
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-neutral-200" />
            <span className="text-sm text-primary-red">Or</span>
            <span className="h-px flex-1 bg-neutral-200" />
          </div>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-neutral-100 py-3.5 font-family: 'google-sans', text-neutral-900 transition-colors hover:bg-neutral-200"
          >
            <Link to="google">Login with Google</Link>
            <GoogleIcon />
          </button>

          <p className="mt-6 text-center text-sm text-neutral-500">
            Don&apos;t have any account?{" "}
            <Link
              to="/signup"
              className="font-family: 'google-sans', text-primary-red underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const GoogleIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19.6 10.23c0-.68-.06-1.36-.18-2.02H10v3.83h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.98-4.33 2.98-7.33Z"
      fill="#4285F4"
    />
    <path
      d="M10 20c2.7 0 4.96-.9 6.62-2.44l-3.24-2.5c-.9.6-2.06.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H1.06v2.58A10 10 0 0 0 10 20Z"
      fill="#34A853"
    />
    <path
      d="M4.41 11.9a6 6 0 0 1 0-3.8V5.52H1.06a10 10 0 0 0 0 8.96l3.35-2.58Z"
      fill="#FBBC05"
    />
    <path
      d="M10 3.98c1.47 0 2.79.5 3.83 1.5l2.87-2.87A9.96 9.96 0 0 0 10 0 10 10 0 0 0 1.06 5.52L4.41 8.1C5.2 5.74 7.4 3.98 10 3.98Z"
      fill="#EA4335"
    />
  </svg>
);

const EyeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 4c-4.5 0-8.3 3-9.6 6 1.3 3 5.1 6 9.6 6s8.3-3 9.6-6c-1.3-3-5.1-6-9.6-6Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.5 2.5l15 15M8.3 8.5a2.5 2.5 0 0 0 3.4 3.4M6.2 6.3C3.9 7.4 2.1 9.2 1 10c1.3 3 5.1 6 9.6 6 1.4 0 2.7-.3 3.9-.8M15.6 15.7C17.5 14.4 18.9 12.6 19.6 10c-1.1-2.6-4.1-5.2-8-5.9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export default LoginComponent;
