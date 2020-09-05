import React from 'react';
import {Link} from 'react-router-dom'
import { FormattedMessage } from 'react-intl';

function Home(props){
    return(
        <>
            <p>
                <FormattedMessage
                id="home.myMessage"
                defaultMessage="Bugünün tarihi {ts, date, ::yyyyMMdd}"
                values={{ts: Date.now()}}
                />
            </p>
            <Link to="sign-in">Go to Sign-In</Link>
            <br></br>
            <Link to="sign-up">Let's sign up</Link>
        </>
    )
}
export default Home