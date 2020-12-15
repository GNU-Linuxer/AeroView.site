import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

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

export function AccountPage() {
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [user, setUser] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authUnregisterFunction = firebase.auth().onAuthStateChanged((firebaseUser) => {

      if (firebaseUser) {
        console.log("logged in as " + firebaseUser.displayName);
        setUser(firebaseUser);
        setIsLoading(false);
      } else {
        console.log("logged out!");
        setUser(null);
        setIsLoading(false);
      }
    })

    return function cleanup() {
      authUnregisterFunction();
    }

  }, []) // only run hook on first load

  const handleSignOut = () => {
    setErrorMessage(null);
    firebase.auth().signOut();
  }

  let content = null;

  if (!user) {
    content = (
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    )
  } else {
    // Render sign out button
    content = (
      <button className="btn btn-warning" onClick={handleSignOut}>Log Out {user.displayName}</button>
    )
  }

  return (
    <div>
      <AccountModal />
      {content}
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
          By creating an account on AeroView, you'll be able to save your plane filter options, favorite airplanes and star ratings, private notes for each airplane, and your comparison table columns!
          To create an account, just input your email in the sign-in form below
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>Sounds Good!</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}