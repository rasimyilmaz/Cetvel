import React, { Component } from 'react';
import SignUp from './SignUp'
import {
    BrowserRouter,
    Switch,
    Route
} from 'react-router-dom'

import Home from './Home';
import PrivateRoute from './PrivateRoute';
import NotAuthenticated from './NotAuthenticated';
import Dashboard from './Dashboard';
import SignIn from './SignIn';
import NotFound from './NotFound';
import { connect } from 'react-redux';
class Router extends Component{
    render(){
        return (
            <BrowserRouter>
                <Switch>
                    <Route path="/" exact component={Home}/>
                    <Route path="/sign-up" component={SignUp}/>
                    <Route path="/sign-in">
                        <SignIn/>
                    </Route>
                    <PrivateRoute isAuthenticated={ this.props.isAuthenticated } path="/dashboard" component={Dashboard}/>
                    <Route path="/not-authenticated" component={NotAuthenticated}/>
                    <Route path="*" component={NotFound}/>
                </Switch>
            </BrowserRouter>
        )
    }
    componentDidMount() {
    }
}
const mapStateToProps = (state)=>({
    isAuthenticated : state.auth.signedIn || state.auth.rememberMe
})
export default  connect(mapStateToProps)(Router)