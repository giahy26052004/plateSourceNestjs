import React, { useState } from "react";

import Verification from "../Auth/Verification";
import Login from "../Auth/Login";
import Signup from "../Auth/Signup";
import ForgotPassword from "../Auth/ForgotPassword";

const AuthScreen = ({ setOpen }: { setOpen: (e: boolean) => void }) => {
  const [activeState, setActiveState] = useState("login");
  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLDivElement && e.target.id === "screen") {
      setOpen(false);
    }
  };
  return (
    <div
      onClick={handleClose}
      id="screen"
      className="w-full  h-screen bg-[#00003236] text-black fixed top-0 left-0 z-50  flex items-center justify-center"
    >
      <div className="w-[30%] p-2 rounded shadow-sm bg-slate-900">
        {activeState === "login" && (
          <Login setActiveState={setActiveState} setOpen={setOpen} />
        )}
        {activeState === "signup" && <Signup setActiveState={setActiveState} />}
        {activeState === "verification" && (
          <Verification setActiveState={setActiveState} />
        )}{" "}
        {activeState === "forgotPassword" && (
          <ForgotPassword setActiveState={setActiveState} />
        )}
      </div>
    </div>
  );
};

export default AuthScreen;
