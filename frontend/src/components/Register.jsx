import "./register.css";
import RoomIcon from '@mui/icons-material/Room';
import Cancel from '@mui/icons-material/Cancel';
import React, { useState ,useRef } from 'react';
import axios from "axios";

export default function Register({setShowRegister}) {
    const [success, setsSuccess]= useState(false);
    const [error, setsError]= useState(false);
    const nameRef= useRef()
    const emailRef= useRef()
    const passwordRef= useRef()

    const handleSubmit= async (e)=>{
        e.preventDefault();
        const newUser= {
            username:nameRef.current.value,
            email:emailRef.current.value,
            password:passwordRef.current.value,
        };
    
    try{
        await axios.post("http://localhost:8800/api/users/register", newUser);
        setsError(false);
        setsSuccess(true);
    } catch(err) {
        setsError(true);
    }
    };



    return (
     <div className="registerContainer">
        <div className="logo">
            <RoomIcon/>
            TravelPin
        </div>
        <form onSubmit={handleSubmit}>
            <input type= "text" placeholder= "username" ref={nameRef}/>
            <input type= "email" placeholder= "email" ref={emailRef}/>
            <input type= "password" placeholder= "password" ref={passwordRef}/>
            <button className= "registerBtn">Register</button>
            {success &&
            <span className= "success">Successfull. You can login now!</span>
            }  {error &&
            <span className= "failure">Something went wrong!</span>
            }
        </form>
        <Cancel className="registerCancel" onClick={()=>setShowRegister(false)}/>
     </div>
    );
}