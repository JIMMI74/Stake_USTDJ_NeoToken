
import React, { useState, useEffect } from "react";

import {
  NotificationManager,
  NotificationContainer,
} from "react-notifications";
import "react-notifications/lib/notifications.css";

export default function Login() {

  const [email, Setemail] = useState("");
  const [pass, Setpass] = useState("");

    async function login(event) {
        event.preventDefault();
        const response = await fetch("http://localhost:3004/login", {
            credentials: "include",
            method: "post",
            body: JSON.stringify({ email, pass }),
            headers: { "Content-Type": "application/json" },
        });
        console.log({response})
        const status = response.status
        const message = await response.text();
        console.log({ status, message });
        if (status === 200) window.location.href = '/'
        if (status === 401) NotificationManager.error(message);
    }
  return (
    <div>
      Login <br />
      <form method="post" id="formLogin">
        <input name="email" type="email" placeholder="email" value={email} onChange={(e)=>Setemail(e.target.value)} />
        <input name="pass" type="password" placeholder="pass" value={pass} onChange={(e)=>Setpass(e.target.value)} />
        <input
          type="submit"
          value="Login"
          onClick={(e) => {
            login(e);
          }}
        />
      </form>
      <NotificationContainer />
    </div>
  );
}
