import { Button } from "antd";
import { useState } from "react";
interface ButtonCProps {
  style?: {};
  children?: React.ReactNode;
  className?: string;
  showComponent?: JSX.Element;
}

export const ButtonC: React.FC<ButtonCProps> = ({
  style,
  children,
  className,
  showComponent,
}) => {
  const [show, setShow] = useState(false);
  return (
    <>
      <Button
        onClick={() => setShow(!show)}
        style={style}
        className={className}
      >
        {children}
      </Button>
      {showComponent && show ? <div >{showComponent}</div> : null}
    </>
  );
};
