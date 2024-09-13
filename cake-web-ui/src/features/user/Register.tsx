import React, { useState } from "react";
import { Link } from "react-router-dom";
import LandingIntro from "./LandingIntro";
import ErrorText from "../../components/Typography/ErrorText";
import InputText from "../../components/Input/InputText";

interface RegisterObj {
  name: string;
  password: string;
  emailId: string;
}

const Register: React.FC = () => {
  const INITIAL_REGISTER_OBJ: RegisterObj = {
    name: "",
    password: "",
    emailId: "",
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [registerObj, setRegisterObj] = useState<RegisterObj>(INITIAL_REGISTER_OBJ);

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (registerObj.name.trim() === "")
      return setErrorMessage("Name is required! (use any value)");
    if (registerObj.emailId.trim() === "")
      return setErrorMessage("Email Id is required! (use any value)");
    if (registerObj.password.trim() === "")
      return setErrorMessage("Password is required! (use any value)");
    else {
      setLoading(true);
      // Call API to check user credentials and save token in localstorage
      localStorage.setItem("token", "DumyTokenHere");
      setLoading(false);
      window.location.href = "/app/dashboard";
    }
  };

  const updateFormValue = ({ updateType, value }: { updateType: string; value: string }) => {
    setErrorMessage("");
    setRegisterObj({ ...registerObj, [updateType]: value });
  };

  return (
      <div className="flex min-h-screen items-center bg-base-200">
        <div className="card mx-auto w-full max-w-5xl shadow-xl">
          <div className="grid grid-cols-1 rounded-xl bg-base-100 md:grid-cols-2">
            <div className="">
              <LandingIntro />
            </div>
            <div className="px-10 py-24">
              <h2 className="mb-2 text-center text-2xl font-semibold">
                Register
              </h2>
              <form onSubmit={(e) => submitForm(e)}>
                <div className="mb-4">
                  <InputText
                      defaultValue={registerObj.name}
                      updateType="name"
                      containerStyle="mt-4"
                      labelTitle="Name"
                      updateFormValue={updateFormValue}
                  />

                  <InputText
                      defaultValue={registerObj.emailId}
                      updateType="emailId"
                      containerStyle="mt-4"
                      labelTitle="Email Id"
                      updateFormValue={updateFormValue}
                  />

                  <InputText
                      defaultValue={registerObj.password}
                      type="password"
                      updateType="password"
                      containerStyle="mt-4"
                      labelTitle="Password"
                      updateFormValue={updateFormValue}
                  />
                </div>

                <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
                <button
                    type="submit"
                    className={
                        "btn btn-primary mt-2 w-full" + (loading ? " loading" : "")
                    }
                >
                  Register
                </button>

                <div className="mt-4 text-center">
                  Already have an account?{" "}
                  <Link to="/login">
                  <span className="inline-block transition duration-200 hover:cursor-pointer hover:text-primary hover:underline">
                    Login
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

export default Register;