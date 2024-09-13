import Header from "./Header";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import routes from "../routes";
import React, { Suspense, lazy } from "react";
import SuspenseContent from "./SuspenseContent";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import {RootState} from "../app/store.ts";

const Page404 = lazy(() => import("../pages/protected/404"));

const PageContent: React.FC = () => {
  const mainContentRef = useRef(null);
  const { pageTitle } = useSelector((state: RootState) => state.header);

  // Scroll back to top on new page load
  useEffect(() => {
    mainContentRef.current.scroll({
      top: 0,
      behavior: "smooth",
    });
  }, [pageTitle]);

  return (
    <div className="drawer-content flex flex-col">
      <Header />
      <main
        className="flex-1 overflow-y-auto bg-base-200 px-6 pt-4 md:pt-4"
        ref={mainContentRef}
      >
        <Suspense fallback={<SuspenseContent />}>
          <Routes>
            {routes.map((route, key) => {
              return (
                <Route
                  key={key}
                  path={`${route.path}`}
                  element={<route.component />}
                />
              );
            })}

            {/* Redirecting unknown url to 404 page */}
            <Route path="*" element={<Page404 />} />
          </Routes>
        </Suspense>
        <div className="h-16"></div>
      </main>
    </div>
  );
}

export default PageContent;
