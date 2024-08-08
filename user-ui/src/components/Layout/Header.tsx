import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/react";
import React from "react";
import NavItems from "./NavItems";
import styles from "@/src/utils/styles";
import ProfileDropdown from "../ProfileDropdown";

const Header = () => {
  return (
    <header className="text-white w-full  bg-[#0f1524] ">
      <div className="w-[90%] h-[80px] font-Poppins m-auto flex items-center justify-between">
        <h1 className={`${styles.logo} text-lg`}>Hycon Delivery</h1>
        <NavItems />
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Header;
