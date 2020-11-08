import { useMutation, useQuery } from "@apollo/client";
import React, { useState, useEffect, useContext } from "react";
import { FilterContext } from "../../context-helper/context-helper";
import { ADD_USER, GET_USER } from "../../gql-helper/queries";
import "./sign-up-form.css";

export default function SignUp(props) {
  const { closeModal } = props,
    [username, setUsername] = useState(""),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [retypedPassword, setRetypedPassword] = useState(""),
    [userNameReq, setUserNameReq] = useState(false),
    [emailReq, setEmailReq] = useState(false),
    [passwordReq, setPasswordReq] = useState(false),
    [retypedPasswordReq, setRetypedPasswordReq] = useState(false),
    [userAlreadyExists, setUserAlreadyExists] = useState(false),
    [passwordMismatched, setPasswordMismatched] = useState(false);

    const { loginModal } = useContext(FilterContext),
     { setShowLoginModal } = loginModal;

  const [addUser,returnedData] = useMutation(ADD_USER),
    { data, refetch } = useQuery(GET_USER, {
      variables: { email: email },
    });

  const isFormValidated = () => {
    if (!username) {
      setUserNameReq(true);
      return false;
    }
    if (!email) {
      setEmailReq(true);
      return false;
    }
    if (!password) {
      setPasswordReq(true);
      return false;
    }
    if (!retypedPassword) {
      setRetypedPasswordReq(true);
      return false;
    }

    if (password !== retypedPassword) {
      setPasswordMismatched(true);
      return false;
    }

    return true;
  };

  const validateAndRegister = async()=>{

    if(isFormValidated()){
      await addUser({
        variables: {
          name: username,
          email: email,
          password: password,
        }
      });
      closeParentModal();
    }
  }

  const closeParentModal = () => (closeModal ? closeModal() : false);

  useEffect(() => {
    refetch({ email });

    if (data && data.users && data.users.length > 0) setUserAlreadyExists(true);
    else setUserAlreadyExists(false);

   if(returnedData && returnedData.data && setShowLoginModal) setShowLoginModal(true);

    return () => {};
  }, [email, data, returnedData]);

  return (
    <div id="sign-up-box">
      <div className="left">
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="signupInput"
          onChange={(e) => {
            setUserNameReq(false);
            setUsername(e.target.value);
          }}
        />
        {userNameReq ? (
          <span className="error-class">*User name required.</span>
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
        {userAlreadyExists ? (
          <span className="error-class">
            User already exists by this email.
          </span>
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

        <input
          type="password"
          name="password2"
          placeholder="Retype password"
          className="signupInput"
          onChange={(e) => {
            setRetypedPasswordReq(false);
            setPasswordMismatched(false);
            setRetypedPassword(e.target.value);
          }}
        />
        {retypedPasswordReq ? (
          <span className="error-class">*Retype password.</span>
        ) : null}
        {passwordMismatched ? (
          <span className="error-class">*Password mismatched.</span>
        ) : null}

        <input
          type="submit"
          name="signup_submit"
          value="Sign me up"
          onClick={(e) =>validateAndRegister()}
        />
      </div>

      {/* <div className="right">
      <span className="loginwith">Sign in with<br />social network</span>
      
      <button className="social-signin facebook">Log in with facebook</button>
      <button className="social-signin twitter">Log in with Twitter</button>
      <button className="social-signin google">Log in with Google+</button>
    </div> */}
      {/* <div className="or">OR</div> */}
    </div>
  );
}
