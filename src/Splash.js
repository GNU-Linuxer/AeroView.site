import React from 'react';
import { Spinner } from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

import './css/splash.css';

export default function Splash() {
    return (
        <div className="landing-splash-cotainer">
            <Spinner color="primary" className="splash-spinner" />
            <h1 className='d-none d-sm-block'>Loading Airplane Data...</h1>
            <p className='d-block d-sm-none'>Loading Airplane Data...</p>
        </div>
    );
}
