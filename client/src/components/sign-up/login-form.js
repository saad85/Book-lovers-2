import { useMutation, useQuery } from "@apollo/client";
import React, { useState, useEffect, useContext } from "react";
import { LOGIN_USER, GET_USER } from "../../gql-helper/queries";
import "./login-form.css";
import cookie from "js-cookie";
import { FilterContext } from "../../context-helper/context-helper";

export default function Login(props) {
  const { closeModal, redirectSignUpModal } = props,
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [emailReq, setEmailReq] = useState(false),
    [passwordReq, setPasswordReq] = useState(false),
    [emailPasswordMismatched, setEmailPasswordMismatched] = useState(false);

  const [loginUser, { data }] = useMutation(LOGIN_USER);

  const { addReviewBtn, showAddReview } = useContext(FilterContext);
  const { addReviewBtnClicked } = addReviewBtn || {};
  const { setShowAddReviewModal } = showAddReview || {};
  const isFormValidated = () => {
    if (!email) {
      setEmailReq(true);
      return false;
    }
    if (!password) {
      setPasswordReq(true);
      return false;
    }

    return true;
  };

  const validateAndLogin = async () => {
    if (isFormValidated()) {
      await loginUser({
        variables: {
          email: email,
          password: password,
        },
      });
    }
  };

  const closeParentModal = () => (closeModal ? closeModal() : false);

  const redirectModal = () => {
    closeParentModal();
    if (redirectSignUpModal) redirectSignUpModal(true, "signUp");
  };

  useEffect(() => {
    if (data && data.loginUser) {
      let isValidAuth = data.loginUser._id ? true : false;

      if (isValidAuth) {
        if (data.loginUser.token) {
          cookie.set("token", data.loginUser.token, { expires: 20 });

          if (addReviewBtnClicked) setShowAddReviewModal(true);
        }

        closeParentModal();
      } else setEmailPasswordMismatched(true);
    }
  }, [data]);

  return (
    <div id="login-box">
      <div className="left">
        {emailPasswordMismatched ? (
          <span className="mismatch-error-class">
            *Email or Password mismatched
          </span>
        ) : null}
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          className="signupInput"
          onChange={(e) => {
            setEmailReq(false);
            setEmail(e.target.value);
          }}
        />
        {emailReq ? (
          <span className="error-class">*Email required.</span>
        ) : null}
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="signupInput"
          onChange={(e) => {
            setPasswordReq(false);
            setPassword(e.target.value);
          }}
        />
        {passwordReq ? (
          <span className="error-class">*Password required.</span>
        ) : null}

        <div className="redirect-to-log-in">
          <span className="first-text">Dont have an account? </span>{" "}
          <span className="second-text" onClick={(e) => redirectModal()}>
            {" "}
            Sign up
          </span>
        </div>

        <input
          type="submit"
          name="signup_submit"
          value="Log in"
          onClick={(e) => validateAndLogin()}
        />
      </div>
    </div>
  );
}
