import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { NextRequest } from "next/server";
import UserModel from "@/lib/models/UserModel";

export const POST = async (request: NextRequest) => {
  const { name, email, password } = await request.json();
  await dbConnect();
  const hashedPassword = await bcrypt.hash(password, 5);
  const newUser = new UserModel({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    return Response.json(
      { message: "New User has been Created." },
      { status: 201 }
    );
  } catch (error: any) {
    return Response.json({ message: error.message }, { status: 500 });
  }
};
