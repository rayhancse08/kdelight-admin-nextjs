import { ComponentType } from "react";

export type SubItem = {
  title: string;
  url: string;
};

export type NavItem = {
  title: string;
  icon: ComponentType<any>;
  url?: string;
  items?: SubItem[];
};

export type NavSection = {
  label: string;
  items: NavItem[];
};