import React from 'react';
import { Redirect, Route } from 'react-router-dom';
export const PrivateRoute=({component:Component,...rest})=>(
    <Route
        {...rest}
        render={props=>
            (localStorage.getItem('auth')) ? (
                <Component {...props} auth={JSON.parse(localStorage.getItem('auth'))} />
            ) : (
                <Redirect 
                to={{
                    pathname:"/login",
                    state:{from:props.location}
                }}
                />
            )

        }
        />  
);

