import React from "react";
import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

const Header = () => {
  return (
    <>
      <nav className="p-4 flex justify-between items-center">
        <Link>
          <img
            className="h-20 w-20"
            src="https://imgs.search.brave.com/T1cxh318WZnY-lYttQU86yXXIqfyRnxDNmEbrX3m7KM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuc2Vla2xvZ28u/Y29tL2xvZ28tcG5n/LzQ1LzIvbWRsLXRh/bGVudC1odWItbWRs/LWxvZ28tcG5nX3Nl/ZWtsb2dvLTQ1MzU0/NC5wbmc"
            alt=""
          />
        </Link>

        <div>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>
    </>
  );
};

export default Header;
