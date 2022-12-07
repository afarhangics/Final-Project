import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from './auth-request-api'

const AuthContext = createContext();

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    SET_LOGGED_IN: "SET_LOGGED_IN",
    SET_GUEST_IN: "SET_GUEST_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER",
    SET_AUTH_ERROR: "SET_AUTH_ERROR",
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        isGuest: false,
        authError: false,
        errorMessage: "",
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.SET_GUEST_IN: {
                return setAuth({
                    user: payload.user,
                    isGuest: payload.isGuest,
                    loggedIn: false,
                });
            }
            case AuthActionType.SET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    authError: false,
                })
            }
            case AuthActionType.SET_AUTH_ERROR: {
                return setAuth({
                    authError: payload.authError,
                    errorMessage: payload.errorMessage,
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    isGuest: false,
                })
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    authError: true,
                })
            }
            default:
                return auth;
        }
    }
    
    auth.guestLogIn = async function () {
        authReducer({
            type: AuthActionType.SET_GUEST_IN,
            payload: {
                isGuest: true,
                user: {email:'guess@usere.com', firstName: 'Guest', lastName:'User', id:"dummy"}
            }
        });
    }

    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.SET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        }
    }

    auth.registerUser = async function(firstName, lastName, email, password, passwordVerify) {
        api.registerUser(firstName, lastName, email, password, passwordVerify).then(response => {
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                history.push("/");
            }
            else {
                console.log({data: response.data});
                authReducer({
                    type: AuthActionType.SET_AUTH_ERROR,
                    payload: true,
                    payload: {
                        authError: true,
                        errorMessage: response.data.errorMessage
                    }
                })
            }
        }).catch(err => {
            authReducer({
                type: AuthActionType.SET_AUTH_ERROR,
                payload: {
                    authError: true,
                    errorMessage: err.response.data.errorMessage
                }
            });
        });
    }

    auth.loginUser = async function(email, password) {
        api.loginUser(email, password).then(response => {
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                history.push("/");
            }
            else {
                console.log({data: response.data});
                authReducer({
                    type: AuthActionType.SET_AUTH_ERROR,
                    payload: true,
                    payload: {
                        authError: true,
                        errorMessage: response.data.errorMessage
                    }
                })
            }
        }).catch(err => {
            authReducer({
                type: AuthActionType.SET_AUTH_ERROR,
                payload: {
                    authError: true,
                    errorMessage: err.response.data.errorMessage
                }
            });
        });
    }
    auth.unsetAuthError = function(){
            authReducer({
                type: AuthActionType.SET_AUTH_ERROR,
                payload: {
                    authError: false,
                    errorMessage: ""
                }
            })
    }

    auth.logoutUser = async function() {
        const response = await api.logoutUser();
        if (response.status === 200) {
            authReducer( {
                type: AuthActionType.LOGOUT_USER,
                payload: null
            })
            history.push("/");
        }
    }

    auth.getUserInitials = function() {
        let initials = "";
        if (auth.user) {
            initials += auth.user.firstName.charAt(0);
            initials += auth.user.lastName.charAt(0);
        }
        console.log("user initials: " + initials);
        return initials;
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };