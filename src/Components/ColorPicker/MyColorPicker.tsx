import { ColorPicker } from "antd";
import { useState } from "react";
import {
  cyan,
  generate,
  gold,
  green,
  lime,
  magenta,
  orange,
  presetPalettes,
  purple,
  red,
} from "@ant-design/colors";
import { ColorPickerProps, theme } from "antd";

interface MyColorPickerProps {
  color: string;
  onSelect: (color: string) => void;
}

type Presets = Required<ColorPickerProps>["presets"][number];

export const MyColorPicker: React.FC<MyColorPickerProps> = ({
  color,
  onSelect,
}) => {
  const [colorInput, setColorInput] = useState<string>(color);

  const onColorInput = (color: string) => {
    setColorInput(color);
    onSelect(color); // 使用传递的新颜色值
  };

  const genPresets = (presets = presetPalettes) =>
    Object.entries(presets).map<Presets>(([label, colors]) => ({
      label,
      colors,
      defaultOpen: false,
    }));

  const { token } = theme.useToken();
  const colorpreset = genPresets({
    red,
    magenta,
    orange,
    gold,
    lime,
    green,
    cyan,
    primary: generate(token.colorPrimary),
    purple,
  });

  return (
    <ColorPicker
      className="ml-2"
      value={colorInput}
      presets={colorpreset}
      showText={false}
      onChangeComplete={(e) => onColorInput(e.toHexString())}
    />
  );
};