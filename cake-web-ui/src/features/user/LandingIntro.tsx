import TemplatePointers from "./components/TemplatePointers";
import React from 'react';

const LandingIntro: React.FC = () => {
  return (
    <div className="hero min-h-full rounded-l-xl bg-base-200">
      <div className="hero-content py-12">
        <div className="max-w-md">
          <h1 className="text-center text-3xl font-bold">
            <img
              src="/logo192.png"
              className="mask mask-circle mr-2 inline-block w-12"
              alt="dashwind-logo"
            />
            DashWind
          </h1>

          <div className="mt-12 text-center">
            <img
              src="./intro.png"
              alt="Dashwind Admin Template"
              className="inline-block w-48"
            ></img>
          </div>

          {/* Importing pointers component */}
          <TemplatePointers />
        </div>
      </div>
    </div>
  );
}

export default LandingIntro;
