import { Metadata } from "next";
import SignInForm from "./SignInForm";

export const metadata: Metadata = {
   title: "Sign in"
}

export default async function Signin() {
   return <SignInForm />
}