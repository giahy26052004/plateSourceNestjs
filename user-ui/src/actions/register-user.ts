"use server";
import prisma from "@/prisma/prismaClient";
import * as bcrypt from "bcrypt";
//generateRamdomPassword
const generateRamdomPassword = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = 8;
  const uniqueCharacter = [...Array.from(new Set(characters))];
  let password = "";
  for (let i = 0; i < charactersLength; i++) {
    const randomIndex = Math.floor(Math.random() * uniqueCharacter.length);
    password += uniqueCharacter[randomIndex];
  }
  return password;
};

export const RegisterUser = async (userData: any) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: userData.email,
    },
  });
  if (isUserExist) {
    return isUserExist;
  }
  const password = generateRamdomPassword();
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: "User",
    },
  });
  return user;
};
