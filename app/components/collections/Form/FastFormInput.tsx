import React from "react";
import type { FormInputProps } from "semantic-ui-react";
import { Form } from "semantic-ui-react";

interface FastInputProps extends FormInputProps {
  name: string;
}

export default function FastFormInput({ name, ...props }: FastInputProps) {
  const [value, setValue] = React.useState("");
  return (
    <Form.Input
      name={name}
      id={`${name}-input`}
      value={value}
      onChange={(event) => setValue(event.currentTarget.value)}
      type="text"
      {...props}
    />
  );
}
