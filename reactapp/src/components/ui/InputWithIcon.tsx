import * as React from "react";

import { cn } from "@/lib/utils";

interface InputWithIconProp extends React.ComponentProps<"input"> {
  icon1?: React.ReactNode;
  icon2?: React.ReactNode;
  bgColor?: string;
}

const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProp>(
  ({ className, type, bgColor, icon2, icon1, ...props }, ref) => {
    return (
      <div
        className={cn(
          "flex items-center gap-2 border rounded-sm w-full border border-gray-400",
          bgColor,
          className
        )}
        style={{ padding: "5px" }}
      >
        {icon1 && <span className="pl-1">{icon1}</span>}
        <input
          type={type}
          ref={ref}
          {...props}
          className={cn(
            "placeholder:text-sm border-none bg-muted outline-none text-[black] w-full ",
            className
          )}
        />
        {icon2 && <span className="pl-1">{icon2}</span>}
      </div>
    );
  }
);

InputWithIcon.displayName = "InputWithIcon";

export { InputWithIcon };
