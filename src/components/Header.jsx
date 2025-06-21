import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { BriefcaseBusiness, Heart, PenBox } from "lucide-react";

const Header = () => {
  const { user } = useUser();
  const [userSignIn, setUserSignIn] = useState(false);
  const [search, setSearch] = useSearchParams();

  useEffect(() => {
    if (search.get("sign-in")) setUserSignIn(true);
  }, [search]);

  const handleOverlayclick = (e) => {
    if (e.target === e.currentTarget) {
      setUserSignIn(false);
    }
    setSearch({});
  };

  return (
    <>
      <nav className="p-4 flex justify-between items-center">
        <Link to="/">
          <img
            className="h-20 w-20"
            src="https://imgs.search.brave.com/T1cxh318WZnY-lYttQU86yXXIqfyRnxDNmEbrX3m7KM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuc2Vla2xvZ28u/Y29tL2xvZ28tcG5n/LzQ1LzIvbWRsLXRh/bGVudC1odWItbWRs/LWxvZ28tcG5nX3Nl/ZWtsb2dvLTQ1MzU0/NC5wbmc"
            alt=""
          />
        </Link>

        <div className="flex gap-8">
          <SignedOut>
            <Button variant={"outline"} onClick={() => setUserSignIn(true)}>
              Login
            </Button>
          </SignedOut>

          <SignedIn>
            {/* // add a condition that this button is only shown to the rectruiter */}
            {user?.unsafeMetadata?.role === "recruiter" && (
              <Link to="/post-job">
                <Button
                  className={
                    "bg-[#ef476f] hover:bg-[#d93a5d] text-amber-50 rounded-full"
                  }
                >
                  <PenBox className="mr-0" />
                  Post Job
                </Button>
              </Link>
            )}

            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Jobs"
                  labelIcon={<BriefcaseBusiness size={15} />}
                  href="/my-job"
                />
                <UserButton.Link
                  label="Saved Jobs"
                  labelIcon={<Heart size={15} />}
                  href="/saved-job"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>

      {userSignIn && (
        <div
          className="fixed inset-0 flex items-center justify-center z-2 bg-white/10 backdrop-blur-md"
          onClick={handleOverlayclick}
        >
          <SignIn
            signUpForceRedirectUrl="/onboarding"
            fallbackRedirectUrl="/onboarding"
          />
        </div>
      )}
    </>
  );
};

export default Header;
