interface StyledContainerProps {
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
}
export const StyledContainer: React.FC<StyledContainerProps> = ({
  style,
  children,
  className,
}) => {
  const combinedStyles: React.CSSProperties = {
    backgroundColor: "rgba(255,255,255,0.3)",
    backdropFilter: "blur(2px)",
    ...style, // 合并传入的样式
  };
  return (
    <div
      style={combinedStyles}
      className={`flex fixed rounded-2xl items-center justify-center ${className}`}
    >
      {children}
    </div>
  );
};
