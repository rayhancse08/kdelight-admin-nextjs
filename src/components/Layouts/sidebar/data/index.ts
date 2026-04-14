import * as Icons from "../icons";
import { NavSection } from "@/types/nav";

export const NAV_DATA: NavSection[] = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        url: "/",
        items: [], // keep empty or remove if not needed
      },

      {
        title: "Products",
        url: "/products",
        icon: Icons.Table,
        items: [],
      },

      {
        title: "Sales Orders",
        url: "/sales",
        icon: Icons.Table,
        items: [],
      },

      {
        title: "Purchase Orders",
        url: "/purchases",
        icon: Icons.Table,
        items: [],
      },

      {
        title: "Stores",
        url: "/stores",
        icon: Icons.Table,
        items: [],
      },
      {
        title: "Brand",
        url: "/brands",
        icon: Icons.Table,
        items: [],
      },

      {
        title: "Warehouse",
        url: "/warehouse",
        icon: Icons.Table,
        items: [],
      },
      {
        title: "Report",
        url: "/report",
        icon: Icons.Table,
        items: [],
      },
      {
        title: "Vendors",
        url: "/vendors",
        icon: Icons.Table,
        items: [],
      },
      {
        title: "Monthly Tax",
        url: "/tax",
        icon: Icons.Table,
        items: [],
      },
      {
        title: "Monthly Cash In",
        url: "/cashin",
        icon: Icons.Table,
        items: [],
      },
      {
        title: "Monthly Warehouse Cost",
        url: "/warehouse-cost",
        icon: Icons.Table,
        items: [],
      },
    ],
  },
];