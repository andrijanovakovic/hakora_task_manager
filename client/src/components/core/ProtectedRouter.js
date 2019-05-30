import React from 'react';
import { Switch, Route, withRouter } from "react-router-dom";

// components
import Tasks from '../Tasks';

class ProtectedRouter extends React.Component {
    render() {
        return (
			<div>
                <Switch>
                    <Route path="/tasks" component={Tasks} />
                </Switch>
			</div>
        )
    }
}

export default withRouter(ProtectedRouter);