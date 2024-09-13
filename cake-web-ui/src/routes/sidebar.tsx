/** Icons are imported separatly to reduce build time */
import Squares2X2Icon from "@heroicons/react/24/outline/Squares2X2Icon";
import CodeBracketSquareIcon from "@heroicons/react/24/outline/CodeBracketSquareIcon";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import Cog6ToothIcon from "@heroicons/react/24/outline/Cog6ToothIcon";
import ChartBarIcon from "@heroicons/react/24/outline/ChartBarIcon";
import CurrencyDollarIcon from "@heroicons/react/24/outline/CurrencyDollarIcon";
import InboxArrowDownIcon from "@heroicons/react/24/outline/InboxArrowDownIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import { BanknotesIcon } from "@heroicons/react/16/solid";

const iconClasses = `h-6 w-6`;
const submenuIconClasses = `h-5 w-5`;

const routes = [
  {
    path: "/app/dashboard",
    icon: <Squares2X2Icon className={iconClasses} />,
    name: "Dashboard",
  },
  {
    path: "/app/pools", // url
    icon: <BanknotesIcon className={iconClasses} />, // icon component
    name: "Pools", // name that appear in Sidebar
  },
  {
    path: "/app/strategies", // url
    icon: <InboxArrowDownIcon className={iconClasses} />, // icon component
    name: "Strategies", // name that appear in Sidebar
  },
  {
    path: "/app/transactions", // url
    icon: <CurrencyDollarIcon className={iconClasses} />, // icon component
    name: "Transactions", // name that appear in Sidebar
  },
  {
    path: "/app/charts", // url
    icon: <ChartBarIcon className={iconClasses} />, // icon component
    name: "Analytics", // name that appear in Sidebar
  },
  {
    path: "", //no url needed as this has submenu
    icon: <Cog6ToothIcon className={`${iconClasses} inline`} />, // icon component
    name: "Settings", // name that appear in Sidebar
    submenu: [
      {
        path: "/app/settings-profile", //url
        icon: <UserIcon className={submenuIconClasses} />, // icon component
        name: "Profile", // name that appear in Sidebar
      },
    ],
  },
  {
    path: "", //no url needed as this has submenu
    icon: <CodeBracketSquareIcon className={`${iconClasses} inline`} />, // icon component
    name: "Admin", // name that appear in Sidebar
    submenu: [
      {
        path: "/app/admin/users", // url
        icon: <UsersIcon className={submenuIconClasses} />, // icon component
        name: "Users", // name that appear in Sidebar
      },
    ],
  },
];

export default routes;
