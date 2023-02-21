import React from "react";
import type { FormSelectProps } from "semantic-ui-react";
import { Form } from "semantic-ui-react";

type Value = boolean | number | string | (boolean | number | string)[];
interface FastInputProps extends FormSelectProps {
  name: string;
  initialValue: Value;
}

export default function FastFormSelect({
  name,
  initialValue,
  ...props
}: FastInputProps) {
  const [value, setValue] = React.useState<Value>(initialValue);
  return (
    <Form.Select
      name={name}
      id={`${name}-select`}
      value={value}
      onChange={(event, data) => {
        if (data.value) setValue(data.value);
      }}
      {...props}
    />
  );
}
