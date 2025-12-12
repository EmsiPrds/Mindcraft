import type { InputHTMLAttributes, ReactNode } from "react";

interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "prefix" | "suffix"> {
  icon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
  inputClassName?: string;
}

const TextField = ({
  icon,
  rightIcon,
  containerClassName = "",
  inputClassName = "",
  ...props
}: TextFieldProps) => {
  return (
    <div className={`relative ${containerClassName}`}>
      {icon && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none z-10 transition-colors">
          {icon}
        </span>
      )}
      <input
        {...props}
        className={`w-full ${icon ? "pl-12" : "pl-4"} ${
          rightIcon ? "pr-12" : "pr-4"
        } py-3.5 rounded-xl border border-gray-600 bg-gray-700 text-white placeholder-gray-400 outline-none transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:shadow-lg text-sm sm:text-base ${inputClassName}`}
      />
      {rightIcon && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer z-10 text-gray-400 hover:text-gray-300 transition-colors">
          {rightIcon}
        </span>
      )}
    </div>
  );
};

export default TextField;
