"use client";

import React, { useEffect, useState } from "react";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { CgProfile } from "react-icons/cg";
import AuthScreen from "../screen/AuthScreen";
import useUser from "../hooks/useUser";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { signOut, useSession } from "next-auth/react";
import { RegisterUser } from "../actions/register-user";

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const { user, loading } = useUser();
  const { data } = useSession();
  ///toggle dropdown state
  useEffect(() => {
    if (!loading) {
      setSignedIn(!!user);
    }
    if (data?.user) {
      setSignedIn(true);
      RegisterUser(data?.user);
    }
    return;
  }, [loading, data, user, open]);
  const handleLogout = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    signOut();
    toast.success("Logout successfully");
    // logout logic here
    window.location.reload();
  };
  //adduser
  const addUser = async (user: any) => {
    await RegisterUser(user);
  };

  return (
    <div className="flex items-center gap-4">
      {signedIn ? (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              as="button"
              className="transition-transform "
              src={user?.avatar || data?.user?.image}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2 ">
              <p className="font-semibold ">Signed in as</p>
              <p className="font-semibold">
                {user?.email || data?.user?.email}
              </p>
            </DropdownItem>
            <DropdownItem key="settings">My Profile</DropdownItem>
            <DropdownItem key="all_orders">All Orders</DropdownItem>
            <DropdownItem key="team_setting">
              Apply for seller account
            </DropdownItem>
            <DropdownItem key="logout" onClick={() => handleLogout()}>
              Logout
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      ) : (
        <div className="text-2xl cursor-pointer" onClick={() => setOpen(!open)}>
          <CgProfile />
        </div>
      )}
      {open && <AuthScreen setOpen={setOpen} />}
    </div>
  );
};

export default ProfileDropdown;
