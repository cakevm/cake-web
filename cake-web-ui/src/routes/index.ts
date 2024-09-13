// All components mapping with path for internal routes

import { lazy } from "react";

const Dashboard = lazy(() => import("../pages/protected/Dashboard"));
const Page404 = lazy(() => import("../pages/protected/404"));
const Blank = lazy(() => import("../pages/protected/Blank"));
const Charts = lazy(() => import("../pages/protected/Charts"));
const Strategies = lazy(() => import("../pages/protected/Strategies"));
const Pools = lazy(() => import("../pages/protected/Pools"));
const PoolDetails = lazy(() => import("../pages/protected/PoolDetails"));
const UserManagement = lazy(() => import("../pages/protected/UserManagement"));
const Transactions = lazy(() => import("../pages/protected/Transactions"));

const ProfileSettings = lazy(
  () => import("../pages/protected/ProfileSettings"),
);

const routes = [
  {
    path: "/dashboard", // the url
    component: Dashboard, // view rendered
  },
  {
    path: "/pools",
    component: Pools,
  },
  {
    path: "/pools/:address",
    component: PoolDetails,
  },
  {
    path: "/strategies",
    component: Strategies,
  },
  {
    path: "/admin/users",
    component: UserManagement,
  },
  {
    path: "/transactions",
    component: Transactions,
  },
  {
    path: "/settings-profile",
    component: ProfileSettings,
  },
  {
    path: "/charts",
    component: Charts,
  },
  {
    path: "/404",
    component: Page404,
  },
  {
    path: "/blank",
    component: Blank,
  },
];

export default routes;
