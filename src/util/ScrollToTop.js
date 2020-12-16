/*
 * This file exports a 'ScrollToTop' React component by default for resetting
 * the page's scroll position to the top after a route change in React Router's
 * 'BrowserRouter'.
 *
 * Reference: https://stackoverflow.com/a/55112259
 */

import { PureComponent } from "react";
import { withRouter } from "react-router-dom";

class ScrollToTop extends PureComponent {
    componentDidMount = () => window.scrollTo(0, 0);

    componentDidUpdate = prevProps => {
        if (this.props.location !== prevProps.location) window.scrollTo(0, 0);
    };

    render = () => this.props.children;
}

export default withRouter(ScrollToTop);
