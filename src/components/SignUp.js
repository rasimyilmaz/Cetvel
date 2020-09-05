import React, { Component } from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { CssBaseline, Container, Box, Typography, withStyles, Grid, TextField, Button } from '@material-ui/core';
import { compose } from 'redux';
import { FormattedMessage, injectIntl } from 'react-intl';

const styles = (theme) => ({
    paper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(3),
    },
    grid:{
        flexGrow: 1,
    },
    gridItem:{
        marginTop: theme.spacing(2),
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
    },
    button:{
        textTransform:"none",
    }
  })

class SignUp extends Component {
    state = { 
        isLogged:false
     }
    componentDidMount() {
        
    }
    componentWillUnmount(){
    }
    render() { 
        const {classes} = this.props
        const {formatMessage} = this.props.intl
        return (
            <>
            <CssBaseline />
            <Container maxWidth="sm">
                <Box className={classes.paper} mt={8}>
                    <AccountCircleIcon className={classes.icon} fontSize="large" color="primary" />
                <Typography component="h1" variant="h5">
                    <FormattedMessage id="SignUp.header"/>
                </Typography>
                <form noValidate autoComplete="off" className={classes.form}>
                    <Grid container className={classes.grid} justify="center">
                        <Grid item xs={12} sm={6} className={classes.gridItem}>
                            <TextField id="firstName"
                            label={formatMessage({id:'SignUp.firstName_label'})}
                            placeholder={formatMessage({id:'SignUp.firstName_placeholder'})}
                            fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} className={classes.gridItem}>
                            <TextField id="lastName"
                            label={formatMessage({id:'SignUp.lastName_label'})}
                            placeholder={formatMessage({id:'SignUp.lastName_placeholder'})}
                            fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} className={classes.gridItem}>
                            <TextField id="email"
                            label={formatMessage({id:"SignUp.email_label"})}
                            placeholder={formatMessage({id:"SignUp.email_placeholder"})}
                            fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} className={classes.gridItem}>
                            <TextField id="password"
                            label={formatMessage({id:"SignUp.password_label"})}
                            type="password"
                            fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} className={classes.gridItem}>
                            <TextField id="passwordConfirm"
                            label={formatMessage({id:"SignUp.passwordConfirm_label"})}
                            type="password"
                            fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box justifyContent="center" display="flex" mt={3} >
                                <Button variant="contained" color="primary" className={classes.button}>
                                    <FormattedMessage
                                    id="SignUp.submit"
                                    />
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
                </Box>
            </Container>
            </>
        );
    }
}

export default compose(
    withStyles(styles),
    injectIntl
    )(SignUp)