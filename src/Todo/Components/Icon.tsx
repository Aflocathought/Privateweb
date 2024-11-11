import { Select } from "antd";
import { Option } from "@fluentui/react-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IDropdownOption } from "@fluentui/react";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

interface IconProps {
  IconSelect: (icon: string) => void;
  onIconInput: string;
  show?: boolean;
}
export const Icon: React.FC<IconProps> = ({
  IconSelect,
  onIconInput,
  show,
}) => {
  const [changeIconPanel, setChangeIconPanel] = useState(false);
  const iconOptions: IDropdownOption[] = Object.keys(fas).map((iconName) => ({
    key: iconName,
    text: iconName,
  }));
  iconOptions.unshift({ key: "", text: "无（请选择图标）" });

  const handleIconChange = (value: string) => {
    IconSelect(value);
    setChangeIconPanel(false);
  };

  return (
    <div style={{ position: "relative" }}>
      {show && (
        <FontAwesomeIcon
          icon={fas[onIconInput]}
          style={{ fontSize: "30px" }}
          onClick={() => {
            setChangeIconPanel(!changeIconPanel);
          }}
        />
      )}
      {changeIconPanel && (
        <Select
          className="fadeIn cicon"
          showSearch={true}
          placeholder="请选择图标"
          onChange={handleIconChange}
        >
          {iconOptions.map((option) => (
            <Option key={option.key}>{option.text}</Option>
          ))}
        </Select>
      )}
    </div>
  );
};
