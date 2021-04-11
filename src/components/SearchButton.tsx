import React from "react";
import Button from "react-bootstrap/Button";
import { BsArrowRepeat } from "react-icons/bs";
import "./SearchButton.css";

export default function SearchButton({
  isLoading = false,
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <Button
      disabled={disabled || isLoading}
      className={`SearchButton ${className}`}
      {...props}
    >
      {isLoading && <BsArrowRepeat className="spinning" />}
      {props.children}
    </Button>
  );
}
