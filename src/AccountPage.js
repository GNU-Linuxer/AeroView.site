import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import './css/account.css'

import firebase from 'firebase/app';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const UI_CONFIG = {
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
  const handleSignOut = () => {
    firebase.auth().signOut();
  }

  let accountPageContent;

  if (!props.currentUser) {
    // Render sign in/sign up tool
    accountPageContent = <StyledFirebaseAuth className="firebase-container"
                                             uiConfig={UI_CONFIG}
                                             firebaseAuth={firebase.auth()} />;
  } else {
    // Render sign out button
    accountPageContent = (
      <div className="acct-page-button-container">
        <button className="btn btn-warning acct-page-button"
                onClick={handleSignOut}>
          Log Out {props.currentUser.displayName}
        </button>
      </div>
    );
  }

  return (
    <div className="acct-page-container">
      <AccountModal />
      {accountPageContent}
      <p className='acct-page-button-container'> Once signed-in or signed-out, please <strong> refresh the page </strong> to load user content. Happy browsing!</p>
    </div>
  )
}

export const AccountModal = () => {
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <div className="acct-page-button-container">
      <Button color="primary" onClick={toggle}>Account Benefits</Button>
      <Modal isOpen={modal} toggle={toggle} className="is-open">
        <ModalHeader toggle={toggle}>Account Benefits</ModalHeader>
        <ModalBody>
          By creating an account on AeroView, you'll be able to save your favorite airplanes, star ratings, and private notes for each airplane!
          To create an account, just input your email in the sign-in form on this page.
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>Sounds Good!</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
