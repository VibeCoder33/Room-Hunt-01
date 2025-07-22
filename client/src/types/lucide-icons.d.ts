declare module "lucide-react/dist/esm/icons/*" {
  import { FC } from "react";
  const Icon: FC<{
    color?: string;
    size?: number | string;
    strokeWidth?: number;
    absoluteStrokeWidth?: boolean;
    className?: string;
  }>;
  export default Icon;
}
