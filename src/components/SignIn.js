import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setUser,setSignedIn, setRememberMe } from '../utils/creators';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { CssBaseline, Container, Box, Typography, withStyles, Grid, TextField, Button, LinearProgress, FormControlLabel, Checkbox, Paper, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { compose } from 'redux';
import {auth, db} from '../utils/firebase'
import { FormattedMessage, injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import {isEmail} from 'validator'

const styles = (theme) => ({
    box: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: theme.spacing(3),
    },
    container:{
        marginTop:theme.spacing(1),
        marginBottom:theme.spacing(1),
    },
    paper: {
        borderRadius: theme.spacing(1),
        paddingTop:1,
        paddingBottom:1,
    },
    form: {
      width: '100%',
      marginTop:theme.spacing(1),
      marginBottom:theme.spacing(3),
    },
    grid:{
        flexGrow: 1,
    },
    gridItem:{
        marginTop: theme.spacing(2),
        marginRight: theme.spacing(3),
        marginLeft: theme.spacing(3),
    },
    button:{
        textTransform:"none",
    },
    topLinear:{
        borderRadius:theme.spacing(1),
        marginLeft:theme.spacing(0.5),
        marginRight:theme.spacing(0.5),
        height:theme.spacing(0.25),
    },
  })

class SignIn extends Component {
    initialState = {
                    countingDownNumber:3,
                    isModalOpen:false,
                    loading:false,
                    emailHelperText:'',
                    passwordHelperText:'',
                }
    constructor(props){
        super(props)
        this.state=this.initialState
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.auth !== this.props.auth){
            this.checkRememberMe()
        }
    }
    handleForgetMe=()=>{
        this.handleCloseModal()
        const docRef = db.collection('users').doc(this.props.auth.uid)
        docRef.update({rememberMe:false}).then(()=>{
            auth.signOut()
        })
    }
    handleCloseModal=()=>{
        this.setState({isModalOpen:false})
        clearTimeout(this.myTimeout)
        clearTimeout(this.myInterval)
    }
    handleOpenModal=()=>{
        this.setState({isModalOpen:true})
    }
    checkRememberMe=()=>{
        if (this.props.auth.rememberMe){
            this.setState({countingDownNumber:this.initialState.countingDownNumber})
            this.handleOpenModal()
            this.myInterval= setInterval(this.countingDownNumberCycle,1000)
            this.myTimeout = setTimeout(this.timeoutCallback,this.initialState.countingDownNumber*1000)
        }
    }
    timeoutCallback=()=>{
        clearTimeout(this.myInterval)
        this.transferToDashboard()
    }
    countingDownNumberCycle=()=>{
        if ( this.state.countingDownNumber  === 0 ){
            this.setState({countingDownNumber:this.initialState.countingDownNumber})
        }
        this.setState((prevState)=>({countingDownNumber: (prevState.countingDownNumber-1)}))
    }
    componentDidMount() {
        this.checkRememberMe()
    }
    handleChange=(e)=>{
        if (this.state.errorMessage){
            this.setState({errorMessage:''})
        }
        if (e.target.name==='email' && (isEmail(e.target.value) || e.target.value==='')){
            this.setState({emailHelperText:''})
        }
        if (e.target.name==='password' && e.target.value.length>0 && this.state.passwordHelperText===this.props.intl.formatMessage({id:'Common.passwordEmpty'})){
            this.setState({passwordHelperText:''})
        }
        if (e.target.name==='password' && !(e.target.value.length<6) && this.state.passwordHelperText===this.props.intl.formatMessage({id:'Common.passwordLessThanSixCharacter'})){
            this.setState({passwordHelperText:''})
        }
    }
    handleSubmit=e=>{
        e.preventDefault()
        const form = new FormData(e.target)
        const email = form.get('email')
        const password = form.get('password')
        const rememberMe = form.get('rememberMe')==null?false:true

        if (!isEmail(email)){
            this.setState({emailHelperText:this.props.intl.formatMessage({id:'SignIn.emailHelperText'})})
            return
        }
        if (password.length===0){
            this.setState({passwordHelperText:this.props.intl.formatMessage({id:'Common.passwordEmpty'})})
            return
        }
        if (password.length<6){
            this.setState({passwordHelperText:this.props.intl.formatMessage({id:'Common.passwordLessThanSixCharacter'})})
            return
        }
        this.setState({loading:true})
        auth.signInWithEmailAndPassword(email,password).then(uc=>{
            this.props.setSignedIn()
            if ( rememberMe) {
                this.rememberMe(uc.user.uid)
            } else {
                this.finishTriger()
            }
        }).catch(reason=>{
            this.setState({errorMessage:reason.code})
            this.stopSpinner()
        })
    }
    stopSpinner(){
        this.setState({loading:false})
    }
    rememberMe=(uid)=>{
        const docRef = db.collection('users').doc(uid)
        const data = {rememberMe:true}
        db.collection('users').doc(uid).get()
        .then(doc =>{
            if (doc.exists){
                return docRef.update(data)
            }
            else {
                return docRef.set(data)
            }
        })
        .then((doc)=>{
            this.props.setRememberMe()
            this.finishTriger()
        })
        .catch(reason=>{
            this.setState({errorMessage:reason.code})
            this.stopSpinner()
        })
    }
    finishTriger=()=>{
        this.setState({loading:false})
        this.transferToDashboard()
    }
    transferToDashboard=()=>{
        this.props.history.push('/dashboard')
    }
    render() { 
        const {classes} = this.props
        const {formatMessage} = this.props.intl
        return (
            <>
            <CssBaseline />
            <Container maxWidth="sm" className={classes.container}>
            <Dialog
                    open={this.state.isModalOpen}
                    onClose={this.handleCloseModal}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        <FormattedMessage id="SignIn.alert-dialog-title" />
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <FormattedMessage id="SignIn.alert-dialog-description" values={{value:this.state.countingDownNumber}}/>
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button className={classes.button} onClick={this.handleForgetMe} color="primary">
                        <FormattedMessage id="SignIn.alert-dialog-forgetMe" />
                    </Button>
                    <Button className={classes.button} onClick={this.handleCloseModal} color="secondary">
                        <FormattedMessage id="SignIn.alert-dialog-cancel"/>
                    </Button>
                    </DialogActions>
                </Dialog>
                <Paper className={classes.paper}>
                { this.state.loading && <LinearProgress className={classes.topLinear}/> }
                
                <Box className={classes.box} style={{marginTop:(this.state.loading?`${this.props.theme.spacing(2.75)}px`:`${this.props.theme.spacing(3)}px`)}}>
                    <AccountCircleIcon className={classes.icon} fontSize="large" color="primary" />
                    <Typography component="h1" variant="h5">
                        <FormattedMessage id="SignIn.header"/>
                    </Typography>
                </Box>
                <form noValidate autoComplete="off" className={classes.form} onSubmit={this.handleSubmit}>
                    <Grid container className={classes.grid} justify="center">
                        
                        <Grid item xs={12} className={classes.gridItem}>
                            <TextField id="email"
                            error={this.state.emailHelperText?true:false}
                            helperText={this.state.emailHelperText}
                            name="email"
                            label={formatMessage({id:"SignIn.email_label"})}
                            placeholder={formatMessage({id:"SignIn.email_placeholder"})}
                            onChange={this.handleChange}
                            style={{width:'18rem'}}
                            />
                        </Grid>
                        <Grid item xs={12} className={classes.gridItem}>
                            <TextField id="password"
                            error={this.state.passwordHelperText?true:false}
                            helperText={this.state.passwordHelperText}
                            name="password"
                            label={formatMessage({id:"SignIn.password_label"})}
                            type="password"
                            onChange={this.handleChange}
                            style={{width:'8rem'}}
                            />
                        </Grid>
                        <Grid item xs={12} className={classes.gridItem}>
                            <FormControlLabel
                            control={<Checkbox onChange={this.handleChange} name="rememberMe" color="primary"/>}
                            label={formatMessage({id:"SignIn.rememberMe"})}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography component="h6" variant="body1" className={classes.gridItem} color="error">
                                {this.state.errorMessage && this.props.intl.formatMessage({id:this.state.errorMessage})}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} className={classes.gridItemEnd}>
                            <Box justifyContent="center" display="flex" mt={3}>
                                <Button type="submit" variant="contained" color="primary" className={classes.button}>
                                    <FormattedMessage
                                    id="SignIn.submit"
                                    />
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
                </Paper>
            </Container>
            </>
        );
    }
}

const mapStateToProps = state =>({
    auth:state.auth
})

const mapDispatchToProps = dispatch=>({
    setRememberMe:()=>dispatch(setRememberMe()),
    setUser:(uid,displayName)=>dispatch(setUser(uid,displayName)),
    setSignedIn:()=>dispatch(setSignedIn())
})

export default compose(
    connect(mapStateToProps,mapDispatchToProps),
    withStyles(styles,{withTheme:true}),
    injectIntl,
    withRouter
    )(SignIn)