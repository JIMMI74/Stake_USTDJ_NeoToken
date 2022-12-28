import { useState } from "react";
import {
  NotificationManager,
  NotificationContainer,
} from "react-notifications";
import "react-notifications/lib/notifications.css";

export default function Register() {
  const [email, Setemail] = useState("");
  const [pass, Setpass] = useState("");
  const [wallet, Setwallet] = useState("");
  async function register(event) {
    event.preventDefault();
    const response = await fetch("http://localhost:3004/register", {
      credentials: "include",
      method: "post",
      body: JSON.stringify({ email, pass, wallet }),
      headers: { "Content-Type": "application/json" },
    });
    console.log({ response });

    const { status, body } = response;
    const message = await response.text();
    console.log({ status, message });
    if (status === 200) {
      NotificationManager.success(message);
    } else if (status === 300) {
      NotificationManager.info(message);
    } else {
      NotificationManager.error(message);
    }
  }

  return (
    <>
      <form method="post" id="formLogin">
        <input
          value={email}
          onChange={(event) => {
            Setemail(event.target.value);
          }}
          name="email"
          type="email"
          placeholder="email"
        />
        <input
          value={wallet}
          onChange={(event) => {
            Setwallet(event.target.value);
          }}
          name="walllet"
          type="text"
          placeholder="Address Wallet"
        />
        <input
          value={pass}
          onChange={(event) => {
            Setpass(event.target.value);
          }}
          name="pass"
          type="password"
          placeholder="pass"
        />
        <input
          type="submit"
          value="Register"
          onClick={(event) => {
            register(event);
          }}
        />
      </form>

      <NotificationContainer />
    </>
  );
}
