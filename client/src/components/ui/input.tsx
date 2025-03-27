import React, { useState, useEffect, useCallback } from "react";
import { Search, X, EyeOff, Eye } from "lucide-react";
import styled from "styled-components";
import debounce from "@/lib/debounce.ts";
import { cn } from "@/lib/utils";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  debounce?: number;
  onChange?: (value: string) => void;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, error, onChange = () => { }, debounce: delay, ...props }, ref) => {
    const [localValue, setLocalValue] = useState(value || "");
    const [inputType, setInputType] = useState(type || "text");

    useEffect(() => {
      if (value !== undefined) {
        setLocalValue(value);
      }
    }, [value]);

    const handleChange = useCallback(
      delay
        ? debounce((newValue: string) => onChange(newValue), delay)
        : (newValue: string) => onChange(newValue),
      [onChange, delay]
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
      handleChange(newValue);
    };

    return (
      <div>
        <div className="relative">
          {/* INPUT SEARCH */}
          {type === "search" && (
            <Search className="absolute top-1/2 left-3 -translate-y-1/2 size-5" />
          )}
          {type === "search" && String(localValue).length >= 1 && (
            <button
              onClick={() => setLocalValue("")}
              className="absolute top-1/2 right-4 -translate-y-1/2 size-5"
              tabIndex={2}
            >
              <X size={20} />
            </button>
          )}

          {/* INPUT PASSWORD */}
          {type === "password" && (
            <button
              tabIndex={2}
              type="button"
              onClick={() => setInputType(inputType === "password" ? "text" : "password")}
              className={`absolute top-1/2 right-4 -translate-y-1/2 size-5 ${error ? "text-danger" : ''}`}
            >
              {inputType === "password" ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}

          <InputStyle
            type={inputType}
            value={localValue}
            onChange={handleInputChange}
            tabIndex={1}
            className={cn(
              `${type === "search" ? "px-9 h-[35px]" : "px-3 h-10"
              } flex w-full rounded-md border border-input bg-background py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 hover:border-primary focus:border-primary outline-none ring-primary/50 ring-offset-0 focus:ring transition-shadow duration-300 ease-in-out`,
              { "!border-danger !ring-danger/60 animate-shakeError": error },
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-danger mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

const InputStyle = styled.input`
  &::-webkit-search-cancel-button {
    display: none;
  }

  &::-moz-search-cancel-button {
    display: none;
  }
`;

export { Input };
