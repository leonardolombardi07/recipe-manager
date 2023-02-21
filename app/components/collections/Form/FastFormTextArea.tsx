import React from "react";
import type { FormTextAreaProps } from "semantic-ui-react";
import { Form } from "semantic-ui-react";

interface FastInputProps extends FormTextAreaProps {
  name: string;
}

export default function FastFormTextArea({ name, ...props }: FastInputProps) {
  const [value, setValue] = React.useState("");
  return (
    <Form.TextArea
      name={name}
      id={`${name}-textarea`}
      value={value}
      onChange={(event) => setValue(event.currentTarget.value)}
      {...props}
    />
  );
}
