import { Outlet } from "react-router-dom";
import clsx from "clsx";

const bgPattern =
  "bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(59,130,246,0.05)_10px,rgba(59,130,246,0.05)_20px)]";

const GeneralLayout = () => {
  return (
    <div className={clsx("min-h-screen", "p-10", bgPattern)}>
      <Outlet />
    </div>
  );
};

export default GeneralLayout;
