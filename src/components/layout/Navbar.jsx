import { useLocation, Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "../ui/button";
import Search from "../ui/search";

export const GetStartedButton = () => (
  <Link
    to="/dashboard"
    className="inline-flex items-center justify-center bg-amber-700 hover:bg-amber-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200"
  >
    Get Started
  </Link>
);

const Logo = () => {
  return (
    <Link
      to="/"
      className="flex items-center gap-2.5 text-white no-underline"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        <circle cx="16" cy="16" r="15" fill="#1c1917" stroke="#b45309" strokeWidth="1" />
        <circle cx="16" cy="16" r="11.5" fill="none" stroke="#b45309" strokeWidth="0.5" opacity="0.4" />
        <circle cx="16" cy="16" r="8" fill="none" stroke="#b45309" strokeWidth="0.5" opacity="0.25" />
        <circle cx="16" cy="16" r="4.5" fill="#b45309" />
        <circle cx="16" cy="16" r="1.5" fill="#1c1917" />
      </svg>
      <span className="font-bold text-xl tracking-tight text-white">
        TuneTribe
      </span>
    </Link>
  );
};

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  const handleBackClick = () => {
    if (path.startsWith("/player/")) {
      navigate("/dashboard");
    } else if (path === "/dashboard") {
      navigate("/");
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="flex flex-col px-4 sm:px-6 md:px-20 lg:px-32 py-6">
      <div className="sm:hidden w-full space-y-4">
        <div className="flex justify-between items-center w-full">
          <Logo />
          {path !== "/" ? (
            <Button
              onClick={handleBackClick}
              className="rounded-full h-8 px-3 flex items-center gap-1 bg-white text-black"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          ) : (
            <GetStartedButton />
          )}
        </div>
        {path !== "/" && (
          <div className="w-full">
            <Search />
          </div>
        )}
      </div>

      <div className="hidden sm:flex items-center justify-between w-full gap-4">
        <Logo />
        <div className="flex items-center gap-3 w-full max-w-md justify-end">
          {path !== "/" ? (
            <>
              <Search />
              <Button
                onClick={handleBackClick}
                className="h-10 px-3 whitespace-nowrap flex items-center gap-1 bg-white text-black cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
            </>
          ) : (
            <GetStartedButton />
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
