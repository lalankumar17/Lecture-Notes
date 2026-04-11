import { Link } from "react-router-dom";
import BrandLogo from "./BrandLogo";

const Navbar = () => {
  return (
    <div className="navbar w-full mb-10 bg-white shadow-md flex items-center justify-between mt-2 p-2">
      <div>
        <Link to={"/"} className="inline-flex pl-10 md:pl-12">
          <BrandLogo />
        </Link>
      </div>

      <div className="mr-3 md:mr-5 lg:mr-6">
        <nav>
          <ul className="flex justify-center gap-4 flex-row items-center">
            <li className="cursor-pointer px-4 p-1 hover:bg-green-200 rounded-2xl">
              <Link to={"/"}>
                <p className="cursor-pointer">Home</p>
              </Link>
            </li>
            <li className="cursor-pointer px-4 p-1 hover:bg-green-200 rounded-2xl">
              <p className="cursor-pointer">About</p>
            </li>
            <li>
              <button
                onClick={() => window.open("https://github.com/lalankumar17/Lecture-Notes", "_blank")}
                className="text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-all"
                style={{
                  background: "linear-gradient(to right, white -123%, black 74%)",
                }}
              >
                Github
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
