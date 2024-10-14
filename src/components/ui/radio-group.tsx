"use client";

import * as React from 'react';

interface RadioGroupProps {
  children: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

interface RadioGroupItemProps {
  value: string;
  id: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ children, value, onValueChange, className }) => {
  return (
    <div className={className} role="radiogroup">
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { isChecked: child.props.value === value, onValueChange })
          : child
      )}
    </div>
  );
};

export const RadioGroupItem: React.FC<RadioGroupItemProps> = ({ value, id, isChecked, onValueChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="radio"
        id={id}
        value={value}
        checked={isChecked}
        onChange={() => onValueChange(value)}
        className="radio-input"
      />
      <label htmlFor={id}>{value}</label>
    </div>
  );
};
