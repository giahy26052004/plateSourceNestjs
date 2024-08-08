"use client";

import { gql, DocumentNode } from "@apollo/client";
export const LOGIN_USER = gql`
   mutation login($email:String!,$password:String!){
    login(email:$email,password:$password){
        user{
        id
        name
        email
        password
        phone_number
        }
        accessToken
        refreshToken
        error{
        message
        }
    }
    }
`;
