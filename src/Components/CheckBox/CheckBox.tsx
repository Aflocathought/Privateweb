import "./checkbox.css"

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}
export const Checkbox = (props: CheckboxProps) => {
  const onCheck = () => {
    props.onChange(!props.checked);
  }
  return <div className="checkbox_container">
    
  </div>;
};
