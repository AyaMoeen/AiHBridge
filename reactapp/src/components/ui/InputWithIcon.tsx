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
          "flex items-center gap-2 border rounded-sm w-full",
          bgColor,
          className
        )}
        style={{ padding: "5px" }}
      >
        {icon1 && <span>{icon1}</span>}
        <input
          type={type}
          ref={ref}
          {...props}
          className={cn(
            "border-none bg-transparent outline-none text-[black] border-input w-full",
            className
          )}
        />
        {icon2 && <span>{icon2}</span>}
      </div>
    );
  }
);

InputWithIcon.displayName = "InputWithIcon";

export { InputWithIcon };
