import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));

// Sample FontAwesome functional:
// // import React from 'react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { library } from '@fortawesome/fontawesome-svg-core'
// // import { fab } from '@fortawesome/free-brands-svg-icons'
// import { faCheckSquare, faCoffee } from '@fortawesome/free-solid-svg-icons'
//
// library.add(faCheckSquare, faCoffee)
//
// export const Beverage = () => (
//     <div>
//             <FontAwesomeIcon icon="check-square" />
//             Your <FontAwesomeIcon icon="coffee" /> is hot and ready!
//     </div>
// )
//
// ReactDOM.render(<Beverage />, document.getElementById('root'));