import React from 'react';
import { Redirect, Route } from 'react-router-dom';
export const AdminPrivateRoute=({component:Component,...rest})=>(
    <Route
        {...rest}
        render={props=>
            (localStorage.getItem('auth')) ? (
                JSON.parse(localStorage.getItem('auth')).user.admin ? (
                    <Component {...props} />
                ) : (
                    <Redirect 
                    to={{
                        pathname:"/login",
                    }}
                    />
                )
                            
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

