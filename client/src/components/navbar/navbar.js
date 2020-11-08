import React, { useState, useContext } from "react";
import CustomPopover from "../../Utlies/popover/popover";
import AccountPopoverOptions from "../../components/navbar/account-option-popover/account-option-popover";
import SignUpModal from "../../Utlies/modals/login/login-sign-up-modal";
import { FilterContext } from "../../context-helper/context-helper";
import { GET_USER } from "../../gql-helper/queries";
import { useQuery } from "@apollo/client";
import "./navbar.css";

export default function () {
  const { popover } = useContext(FilterContext),
    { showPopover, setShowPopover } = popover,
    { loginModal, userId, email } = useContext(FilterContext),
    { showLoginModal, setShowLoginModal } = loginModal,
    [showSignupModal, setShowSignupModal] = useState(false);

  const showModal = (value, modalType) => {
    
    if (modalType === "signUp") setShowSignupModal(value);
    else setShowLoginModal(value);

  };

  console.log("userId",userId);

  const { data } = useQuery(GET_USER,{
    variables: { email: email, calledBy:"navbar" },
  });
  //user data
  console.log("data",data);

  let users =data && data.users ? data.users : {},
  userInfo = users && users[0] ? users[0] : {},
  name = userInfo && userInfo.name ? userInfo.name.split(' ')[0] : '';
  
//  let {users} = data ,
//   userInfo = users ? users[0] : {},  //user name
//   {name} = userInfo || {};  //user name

  console.log("name",name);

 
  return (
    <>
      <div className="container" >
        <ul className="horizontal">
          <div className="">
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
              <div>
                <a href="#home" className="logo" style={{textDecoration:"none"}}>
                  BookLovers
                </a>
              </div>
            </div>
            <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" style={{paddingRight:"0px"}}>
              <li className="custom-nav" style={{marginRight:"-25px"}} onClick={(e) => setShowPopover(true)}>
                <a href="#news" style={{textDecoration:"none"}} id="account-option-popover">
                <span>{name}
                  <i className="fas fa-caret-down drop-icon"></i>
                 </span>  
                </a>

                
              </li>

              {!userId ? (
                <li className="custom-nav">
                  <div
                    className="join-btn"
                    onClick={(e) => showModal(true, "signUp")}
                  >
                    <a>Join</a>
                  </div>
                </li>
              ) : null}

              <li className="custom-nav">
                <a href="#home">
                  <i className="fas fa-home"></i>
                </a>
              </li>

              <CustomPopover
                targetId="account-option-popover"
                title="Account"
                body={AccountPopoverOptions()}
              />
              {showSignupModal ? (
                <SignUpModal closeModal={showModal} context="signUp" />
              ) : null}

              {showLoginModal ? (
                <SignUpModal closeModal={showModal} context="logIn" showModal={showModal} />
              ) : null}
            </div>
          </div>
        </ul>
      </div>
    </>
  );
}
