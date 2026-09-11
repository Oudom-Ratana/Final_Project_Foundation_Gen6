import React, { useState } from 'react';
import { Link } from 'react-router';
import heroImage from '../../assets/image.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sending reset link to:', email);
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Hero Section */}
      <div className="relative hidden w-1/2 md:block">
        <img
          src={heroImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="relative flex h-full flex-col justify-start px-12 pt-6 pb-12">
          <h2 className="text-h3 font-family: 'google-sans', leading-tight text-white">
            Your next
            <br />
            movie experience
            <br />
            <span className="relative inline-block">
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
            <Link
               to="/login"
              className="text-h4 font-family: 'google-sans', text-neutral-400 transition-colors hover:text-neutral-600"
            >
              Log In
            </Link>
            <span className="h-6 w-px bg-primary-red" />
            <span >
              <Link className="text-h4 font-family: 'google-sans', text-dark:color:white transition-colors hover:text-neutral-600">
                Forgot Password
              </Link>
            </span>
          </div>

          <h1 className="text-h3 font-family: 'google-sans', text-neutral-900">
            Reset Your Password
          </h1>
          <p className="mt-2 text-neutral-500">
            Enter your email address and we'll send you a link to reset your
            password!
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block font-family: 'google-sans', text-neutral-900"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-full border border-neutral-200 bg-white px-5 py-3.5 text-neutral-900 placeholder:text-neutral-400 focus:border-primary-red focus:outline-none"
              />
            </div>

            <Link type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-primary-red py-3.5 font-family: 'google-sans', text-white transition-colors hover:bg-primary-dark"
            >

               <span aria-hidden="true">&larr;</span> Send Reset Link
            
            </Link>
        
          </form>

          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-neutral-200" />
            <span className="text-sm text-neutral-400">Or</span>
            <span className="h-px flex-1 bg-neutral-200" />
          </div>

          <Link
            to="/login"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white py-3.5 font-family: 'google-sans', text-primary-red transition-colors hover:bg-neutral-50"
          >
            <span aria-hidden="true">&larr;</span> Back To Login
          </Link>

          <p className="mt-6 text-center text-sm text-neutral-500">
            Remember your password?{' '}
            <Link to="/login" className="font-semibold text-primary-red underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;