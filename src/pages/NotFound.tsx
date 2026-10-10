import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import logoPandaOnly from "@/assets/logoPandaOnly.png";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4">
      <div aria-hidden className="paper-dots absolute inset-0 -z-10" />
      <div className="text-center">
        <div className="mizige mx-auto mb-6 flex h-36 w-36 items-center justify-center rounded-[1.75rem] border border-hsk/25 shadow-soft">
          <img src={logoPandaOnly} alt="" className="relative h-24 w-auto" />
        </div>
        <h1 className="mb-2 font-display text-5xl font-bold text-maroon">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">Oops! Page not found</p>
        <Link
          to="/"
          className="inline-flex h-12 items-center rounded-full bg-maroon px-6 font-bold text-white transition-colors hover:bg-maroon-deep"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
