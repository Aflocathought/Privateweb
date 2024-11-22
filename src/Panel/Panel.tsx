import { StyledContainer } from "../Components/StyledContainer/StyledContainer";
import { SystemMonitor } from "../SystemMonitor/SystemMonitor";
export const Panel = () => {
  return (
    <StyledContainer className="mt-4" style={{minWidth: "40%", height: "auto" }}>
      <div className="panel_container">
        <SystemMonitor />
      </div>
    </StyledContainer>
  );
};
