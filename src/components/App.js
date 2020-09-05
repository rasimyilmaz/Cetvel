import React,{Component} from 'react';
import Router from './Router';
import { Provider } from 'react-redux';
import {rootReducer} from '../utils/reducers'
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { auth, db } from '../utils/firebase';
import * as creators from '../utils/creators'
import {IntlProvider } from 'react-intl'
import messages_en from '../translations/en.json'
import messages_tr from '../translations/tr.json'
import {isEmptyObject} from '../library/isEmptyObject'
const messages = {
    'en':messages_en,
    'tr':messages_tr
}
const language = navigator.language.split(/[-_]/)[0];
const locale = (language==="tr")?"tr":"en"
const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(thunk),
  // other store enhancers if any
);

const store=createStore(rootReducer,enhancer)
class App extends Component {
    componentDidMount() {
        
        this.listener = auth.onAuthStateChanged(
            user=>{
                if ( user ){
                    console.log(`user ${user.uid} logged in`)
                    store.dispatch(creators.setUser(user.uid,user.displayName))
                    db.collection('users').doc(user.uid).get().then((doc)=>{
                        const config = doc.data()
                        store.dispatch(creators.setUserConfig(config))
                    }).catch(reason=>{
                        console.log(`Getting user doc failed : ${reason}`)
                    })
                } else {
                    const auth = store.getState().auth
                    if(!isEmptyObject(auth)){
                        console.log(`user logout`)
                        store.dispatch(creators.signOut())
                    }
                }
            }
        )
    }
    componentWillUnmount() {
        this.listener && this.listener()
    }
    render() { 
        return (
            <Provider store={store}>
                <IntlProvider messages={messages[locale]} locale={locale} defaultLocale="tr">
                    <Router/>
                </IntlProvider>
            </Provider>
        );
    }
}
 
export default App;