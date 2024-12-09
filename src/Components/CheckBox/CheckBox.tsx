import "./checkbox.css";

interface CheckBoxProps {
  className?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const CheckBox: React.FC<CheckBoxProps> = ({
  className,
  checked,
  onChange,
}) => {
  const onCheck = () => {
    onChange(!checked);
  };
  return <div className={`checkbox_container ${className}`} style={}>

  </div>;
};
