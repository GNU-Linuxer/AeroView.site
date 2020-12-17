import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { PlaneInfo } from './PlaneInfo';

import './css/account.css'

import firebase from 'firebase/app';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const uiConfig = {
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: true
    }
  ],

  credentialHelper: 'none',
  // signInFlow: 'popup' use this if adding more methods of authentication (Google)

  callbacks: {
    signInSuccessWithAuthResult: () => false
  },
};

export function AccountPage(props) {
  const [errorMessage, setErrorMessage] = useState(undefined);

  const handleSignOut = () => {
    setErrorMessage(null);
    firebase.auth().signOut();
  }

  let accountPageContent = null;

  console.log(props.currentUser);

  if (!props.currentUser) {
    accountPageContent = (
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    )
  } else {
    // Render sign out button
    accountPageContent = (
      <div>
        <button className="btn btn-warning" onClick={handleSignOut}>Log Out {props.currentUser.displayName}</button>
      </div>
    )
  }

  return (
    <div>
      <AccountModal />
      {accountPageContent}
    </div>
  )
}

export const AccountModal = () => {
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <div>
      <Button color="primary" onClick={toggle}>Account Features</Button>
      <Modal isOpen={modal} toggle={toggle} className="is-open">
        <ModalHeader toggle={toggle}>Account Features</ModalHeader>
        <ModalBody>
          By creating an account on AeroView, you'll be able to save your favorite airplanes, star ratings, private notes for each airplane, and your comparison table columns!
          To create an account, just input your email in the sign-in form below
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>Sounds Good!</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}