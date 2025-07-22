declare module "lucide-react" {
  import * as React from "react";
  import * as Icons from "lucide-react";
  // Usage: <Icons.User ... />
  export type IconProps = React.SVGProps<SVGSVGElement> & {
    color?: string;
    size?: string | number;
  };
  export const Send: React.FC<IconProps>;
  export const Phone: React.FC<IconProps>;
  export const Video: React.FC<IconProps>;
  export const MoreVertical: React.FC<IconProps>;
}
