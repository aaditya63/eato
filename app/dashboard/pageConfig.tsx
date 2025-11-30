import { ReactElement } from "react";
import {
  Home,
  Users,
  ShoppingBag,
  PieChart,
  Wallet,
  Pizza,
  Box,
  BadgePercent,
} from "lucide-react";

export interface PageItem {
  name: string;
  icon: ReactElement;
  path: string;
}

export interface PageSection {
  section: string;
  items: PageItem[];
}

export const pageConfig: PageSection[] = [
  {
    section: "Main",
    items: [
      { name: "Dashboard", icon: <Home size={22} />, path: "/dashboard" },
      { name: "Orders", icon: <Box size={22} />, path: "/dashboard/orders" },
      { name: "Foods", icon: <Pizza size={22} />, path: "/dashboard/foods" },
      { name: "Coupons", icon: <BadgePercent size={22} />, path: "/dashboard/coupons" }
    ]
  },
  {
    section: "Users",
    items: [
      { name: "Customers", icon: <Users size={22} />, path: "/dashboard/customers" },
    ]
  },
];
