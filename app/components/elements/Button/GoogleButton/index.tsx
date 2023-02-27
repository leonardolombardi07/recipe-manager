import { PureComponent } from "react";
import { GoogleIcon } from "./icons";
import { darkStyle, lightStyle, disabledStyle, hoverStyle } from "./styles";

interface Props {
  label?: string;
  disabled?: boolean;
  type?: "dark" | "light";
  tabIndex?: number;
  style?: React.CSSProperties;
  onClick: () => void;
}

interface State {
  hovered: boolean;
}

export default class GoogleButton extends PureComponent<Props, State> {
  static defaultProps = {
    label: "Sign in with Google",
    disabled: false,
    type: "dark",
    tabIndex: 0,
    onClick: () => {},
  };

  state = {
    hovered: false,
  };

  getStyle = (propStyles: any) => {
    const baseStyle = this.props.type === "dark" ? darkStyle : lightStyle;
    if (this.state.hovered) {
      return { ...baseStyle, ...hoverStyle, ...propStyles };
    }
    if (this.props.disabled) {
      return { ...baseStyle, ...disabledStyle, ...propStyles };
    }
    return { ...baseStyle, ...propStyles };
  };

  mouseOver = () => {
    if (!this.props.disabled) {
      this.setState({ hovered: true });
    }
  };

  mouseOut = () => {
    if (!this.props.disabled) {
      this.setState({ hovered: false });
    }
  };

  click = () => {
    if (!this.props.disabled) {
      this.props.onClick();
    }
  };

  render() {
    const { label, style, disabled, ...otherProps } = this.props;

    return (
      <div
        {...otherProps}
        role="button"
        onClick={this.click}
        style={this.getStyle(style)}
        onMouseOver={this.mouseOver}
        onMouseOut={this.mouseOut}
      >
        <GoogleIcon {...this.props} />
        <span>{label}</span>
      </div>
    );
  }
}
