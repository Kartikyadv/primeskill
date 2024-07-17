import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../redux/userSlice";
import { navbaroptions } from "../config/data";
import LOGO from "../images/LOGO1.png"
import logoutimg from "../images/logout.png"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const userid = useSelector((store) => store.user.user.userid);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    dispatch(logout());
    setIsOpen(!isOpen);
  };

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="fixed left-0 top-0 z-50 w-full backdrop-blur-3xl bg-white/30 p-4 ">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="">
            <img className="h-10" src={LOGO}/>
          </Link>
        </div>
        <div className="hidden md:flex space-x-4">
          {navbaroptions
            .filter((item) => item.authreq === !!userid)
            .map((item) => (
              <Link
                key={item.id}
                to={item.to}
                className="text-black hover:bg-slate-100  px-3 py-2 rounded-md text-sm font-medium"
              >
                {item.icon?<img className="h-8" src={item.icon}/>:item.name}
              </Link>
            ))}
          {userid ? (
            <button
              onClick={handleLogout}
              className="text-black hover:bg-slate-100  px-3 py-2 rounded-md text-sm font-medium h-10"
            >
              <img className="h-8 " src={logoutimg}/>
            </button>
          ) : null}
        </div>
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleNavbar}
            className=" focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden mt-2">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3"></div>
          {navbaroptions
            .filter((item) => item.authreq === !!userid)
            .map((item) => (
              <Link
                key={item.id}
                to={item.to}
                className="text-black hover:bg-slate-100 px-3 py-2 rounded-md text-base font-medium flex flex-row"
              >
                <img className="h-4 pr-4 mt-1" src={item.icon}/> {item.name}
              </Link>
            ))}
          {userid ? (
            <button onClick={handleLogout} className="text-black w-full text-left hover:bg-slate-100  flex flex-row px-3 py-2 rounded-md text-base font-medium">
              <img className="h-4 pr-4 mt-1" src={logoutimg}/>Logout
            </button>
          ) : null}
        </div>
      )}
    </nav>
  );
};

export default Navbar;