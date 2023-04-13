import React, { useRef, useState } from "react";
import Input from "../UI/Input";
import "./LoginDialog.css";

const LoginDialog = (props) => {
  const userNameInputRef = useRef();
  const passwordInputRef = useRef();
  const otpInputRef = useRef();

  const [otpRecieved, setOtpRecieved] = useState(false);
  const [invalidCredentails, setInvalidCredentails] = useState(false);

  const loginClickHandler = (event) => {
    const requestOptions = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify({  username: userNameInputRef.current.value,
            password: passwordInputRef.current.value,
            otp: otpInputRef.current.value})
    };
    fetch('http://localhost:3030/login', requestOptions)
        .then(response => response.json())
        .then(userData => {
            if (userData.authenticated) {
                props.loginHandler(userData);
            } else {
                userNameInputRef.current.value = "";
                passwordInputRef.current.value = "";
                otpInputRef.current.value = "";
                setOtpRecieved(false);
                setInvalidCredentails(true);
            }
        })
        .catch(err =>  {
            console.log(err);
        })
    event.preventDefault();
  };

  const submitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <section className="login-container">
      <form className="login-form" onSubmit={submitHandler}>
        <Input
          ref={userNameInputRef}
          label="User Name"
          input={{
            type: "text",
            id: "username",
          }}
        />
        <Input
          ref={passwordInputRef}
          label="Password"
          input={{
            type: "password",
            id: "username",
          }}
          />
          <div className="login-otp">
            <Input
            ref={otpInputRef}
            label="OTP"
            input={{
                type: "text",
                id: "username",
                disabled: !otpRecieved
            }}
            />
            <button className="otp-button" onClick={() => {setOtpRecieved(true);}} disabled={otpRecieved}> Get OTP</button>
          </div>
          {invalidCredentails && <p className="invalid-text" >Invalid credentials!!</p>}
        <button onClick={loginClickHandler}>Login</button>
      </form>
    </section>
  );
};

export default LoginDialog;
