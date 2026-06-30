import {
  LayoutDashboard,
  UserCog,
  Users,
  FileText,
  ClipboardList,
  UserRound,
  Activity,
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
        title: "Profile",
        path: "/admin/profile",
        icon: UserRound,
      },
    ],
    account: [
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
        title: "Sessions",
        path: "/doctor/sessions",
        icon: Activity,
      },
      {
        title: "Prescriptions",
        path: "/doctor/prescriptions",
        icon: ClipboardList,
      },
      {
        title: "Profile",
        path: "/doctor/profile",
        icon: UserRound,
      },
    ],
    account: [
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
        title: "Sessions",
        path: "/patient/sessions",
        icon: Activity,
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
        title: "Logout",
        path: "/logout",
        icon: LogOut,
      },
    ],
  },
};
