import {
  LayoutDashboard,
  UserCog,
  Users,
  FileText,
  ChartColumn,
  ClipboardList,
  UserRound,
  Settings,
 CircleHelp,
  LogOut,
} from "lucide-react";

import { ROLES } from "./roles";

export const SIDEBAR_MENU = {
  [ROLES.ADMIN]: {
    main: [
      {
        title: "Dashboard",
        path: "/admin/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Doctors",
        path: "/admin/doctors",
        icon: UserCog,
      },
      {
        title: "Patients",
        path: "/admin/patients",
        icon: Users,
      },
      {
        title: "Reports",
        path: "/admin/reports",
        icon: FileText,
      },
      {
        title: "Analytics",
        path: "/admin/analytics",
        icon: ChartColumn,
      },
    ],
    account: [
      {
        title: "Settings",
        path: "/settings",
        icon: Settings,
      },
      {
        title: "Help",
        path: "/help",
        icon: CircleHelp,
      },
      {
        title: "Logout",
        path: "/logout",
        icon: LogOut,
      },
    ],
  },

  [ROLES.DOCTOR]: {
    main: [
      {
        title: "Dashboard",
        path: "/doctor/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Patients",
        path: "/doctor/patients",
        icon: Users,
      },
      {
        title: "Prescriptions",
        path: "/doctor/prescriptions",
        icon: ClipboardList,
      },
    ],
    account: [
      {
        title: "Settings",
        path: "/settings",
        icon: Settings,
      },
      {
        title: "Logout",
        path: "/logout",
        icon: LogOut,
      },
    ],
  },

  [ROLES.PATIENT]: {
    main: [
      {
        title: "Dashboard",
        path: "/patient/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Prescriptions",
        path: "/patient/prescriptions",
        icon: ClipboardList,
      },
      {
        title: "Profile",
        path: "/patient/profile",
        icon: UserRound,
      },
    ],
    account: [
      {
        title: "Settings",
        path: "/settings",
        icon: Settings,
      },
      {
        title: "Logout",
        path: "/logout",
        icon: LogOut,
      },
    ],
  },
};