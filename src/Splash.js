import React from 'react';
import { Spinner } from "reactstrap";

import './css/splash.css';

export default function Splash() {
    return (
        <div className="splash">
            <Spinner color="primary" className="splash-spinner" />
        </div>
    );
}
