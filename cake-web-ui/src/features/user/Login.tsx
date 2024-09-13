import React, { useState } from "react";
import { Link } from "react-router-dom";
import LandingIntro from "./LandingIntro";
import ErrorText from "../../components/Typography/ErrorText";
import InputText from "../../components/Input/InputText";
import { login, LoginData } from "../../client";

function Login() {
  const INITIAL_LOGIN_OBJ = {
    password: "",
    email: "",
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);

  const submitForm = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (loginObj.email.trim() === "") {
      return setErrorMessage("Email address is required! (use any value)");
    }
    if (loginObj.password.trim() === "") {
      return setErrorMessage("Password is required! (use any value)");
    } else {
      setLoading(true);
      // Call API to check user credentials and save token in localstorage

      const res = await login({
        requestBody: {
          email: loginObj.email,
          password: loginObj.password,
        },
      } as LoginData);

      localStorage.setItem("access_token", res.token);
      setLoading(false);
      window.location.href = "/app/dashboard";
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setLoginObj({ ...loginObj, [updateType]: value });
  };

  return (
    <div className="flex min-h-screen items-center bg-base-200">
      <div className="card mx-auto w-full max-w-5xl shadow-xl">
        <div className="grid grid-cols-1 rounded-xl bg-base-100 md:grid-cols-2">
          <div className="">
            <LandingIntro />
          </div>
          <div className="px-10 py-24">
            <h2 className="mb-2 text-center text-2xl font-semibold">Login</h2>
            <form onSubmit={(e) => submitForm(e)}>
              <div className="mb-4">
                <InputText
                  type="email"
                  defaultValue={loginObj.email}
                  updateType="email"
                  containerStyle="mt-4"
                  labelTitle="Email Address"
                  updateFormValue={updateFormValue}
                />
                <InputText
                  defaultValue={loginObj.password}
                  type="password"
                  updateType="password"
                  containerStyle="mt-4"
                  labelTitle="Password"
                  updateFormValue={updateFormValue}
                />
              </div>

              <div className="text-right text-primary">
                <Link to="/forgot-password">
                  <span className="inline-block text-sm transition duration-200 hover:cursor-pointer hover:text-primary hover:underline">
                    Forgot Password?
                  </span>
                </Link>
              </div>

              <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
              <button
                type="submit"
                className={
                  "btn btn-primary mt-2 w-full" + (loading ? " loading" : "")
                }
              >
                Login
              </button>

              <div className="mt-4 text-center">
                Don't have an account yet?{" "}
                <Link to="/register">
                  <span className="inline-block transition duration-200 hover:cursor-pointer hover:text-primary hover:underline">
                    Register
                  </span>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
