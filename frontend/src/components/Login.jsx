import "./login.css";
import RoomIcon from '@mui/icons-material/Room';
import Cancel from '@mui/icons-material/Cancel';
import React, { useState ,useRef } from 'react';
import axios from "axios";

export default function Login({setShowLogin, myStorage, setCurrentUser}) {
    const [error, setsError]= useState(false);
    const nameRef= useRef()
    const passwordRef= useRef()

    const handleSubmit= async (e)=>{
        e.preventDefault();
        const user= {
            username:nameRef.current.value,
            password:passwordRef.current.value,
        };

        console.log(user); // Log the input values for verification
    
    try{
        const res= await axios.post("http://localhost:8800/api/users/login", user);
        myStorage.setItem("user", res.data.username)
        setCurrentUser(res.data.username)
        setShowLogin(false);
        setsError(false);
    } catch(err) {
        setsError(true);
        console.error(err); // Log the error for better visibility
    }
    };



    return (
     <div className="loginContainer">
        <div className="logo">
            <RoomIcon/>
            TravelPin
        </div>
        <form onSubmit={handleSubmit}>
            <input type= "text" placeholder= "username" ref={nameRef}/>
            <input type= "password" placeholder= "password" ref={passwordRef}/>
            <button className= "loginBtn">Login</button>
            {error &&
            <span className= "failure">Something went wrong!</span>
            }
        </form>
        <Cancel className="loginCancel" onClick={()=>setShowLogin(false)}/>
     </div>
    );
}