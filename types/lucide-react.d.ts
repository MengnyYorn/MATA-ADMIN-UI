/**
 * Type declaration for lucide-react so TypeScript can resolve the module.
 * The package ships with its own types; this ensures the module is found
 * when using moduleResolution: "bundler".
 */
declare module "lucide-react" {
  import type { FC, SVGProps } from "react";
  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    absoluteStrokeWidth?: boolean;
  }
  export type LucideIcon = FC<LucideProps>;
  export const ChevronDownIcon: LucideIcon;
  export const ChevronUpIcon: LucideIcon;
  export const CheckIcon: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const XIcon: LucideIcon;
  export const PanelLeft: LucideIcon;
  export const Home: LucideIcon;
  export const Store: LucideIcon;
  export const LayoutDashboard: LucideIcon;
  export const ShoppingBag: LucideIcon;
  export const ShoppingCart: LucideIcon;
  export const Users: LucideIcon;
  export const Settings: LucideIcon;
  export const LogOut: LucideIcon;
  export const Plus: LucideIcon;
  export const Edit3: LucideIcon;
  export const Trash2: LucideIcon;
  export const Save: LucideIcon;
  export const MoreVertical: LucideIcon;
  export const HelpCircle: LucideIcon;
  export const Search: LucideIcon;
  export const User: LucideIcon;
  export const CreditCard: LucideIcon;
  export const Bell: LucideIcon;
}
