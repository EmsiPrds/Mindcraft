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
        } py-3.5 rounded-sm minecraft-block bg-[#4A4A4A] text-white placeholder-gray-500 outline-none transition-all duration-200 focus:bg-[#5A5A5A] focus:border-[#7CB342] text-base ${inputClassName}`}
        style={{
          borderStyle: 'solid',
          borderWidth: '3px',
          borderColor: '#1A1A1A',
          borderTopColor: '#6A6A6A',
          borderLeftColor: '#6A6A6A',
          borderRightColor: '#1A1A1A',
          borderBottomColor: '#1A1A1A',
        }}
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
