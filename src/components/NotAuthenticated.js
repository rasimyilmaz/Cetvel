import React, { Fragment , useEffect} from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

function NotAuthenticated(props){
    function forward(){
        if (props.isAuthenticated){
            props.history.push(props.location.state.from.pathname)
        }
        if (props.isAuthenticated===undefined){
            props.history.push('/')
        }
    }
    useEffect(forward,[props.isAuthenticated])
    return (
        <Fragment>
            <p>You are not logged in.</p>
            <Link to="/sign-in">Sign in</Link>
        </Fragment>
    )
}

const mapStateToProps =(state)=>({
    isAuthenticated:state.auth.isAuthenticated||state.auth.rememberMe
})
export default connect(mapStateToProps)(NotAuthenticated)