import React, { useState } from "react";
import { auth } from "../../config/firebase";
import { useRouter } from "next/router";

export default function SignOut() {
  const router = useRouter();

  auth
    .signOut()
    .then(() => {
      router.push("/");
    })
    .catch((error) => {
      console.log("Error when signing out");
    });

  return null;
}
