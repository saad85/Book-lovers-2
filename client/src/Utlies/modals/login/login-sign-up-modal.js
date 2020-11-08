import React, { useState, useEffect } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

import SignupModal from "../../../components/sign-up/sign-in-form";
import LoginForm from '../../../components/sign-up/login-form';
import "./login-sign-up-modal.css";

export default function LoginSignUpModal(props) {
  const { className, showModal, context } = props,
    [modal, setModal] = useState(true);

  const toggle = () => setModal(!modal);

  function closeModal() {
    setModal(!modal);

    if (props.closeModal) {
      setTimeout(() => {
        props.closeModal(false,context);
      }, 100);
    }
  }

  return (
    <div>
      <Modal
        size= "sm"
        isOpen={modal}
        toggle={toggle}
        className={className}
        onClosed={() => closeModal()}
      >
        <ModalHeader toggle={toggle} className="title" >
            {context ==="signUp" ? <span>Sign up</span> : <span>Log In</span>}
        </ModalHeader>

        <ModalBody style={{ padding: "0!important" }}>
          {context==='signUp' ? <SignupModal closeModal={closeModal} context={context}/> : <LoginForm closeModal={closeModal} redirectSignUpModal={props.showModal}/>}
        </ModalBody>
      </Modal>
    </div>
  );
}
