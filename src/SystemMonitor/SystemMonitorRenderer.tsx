import "./SystemMonitor.css";
import { dataStructure } from "./SystemMonitor";
import { StyledContainer } from "../Components/StyledContainer/StyledContainer";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
interface SystemMonitorRendererProps {
  SystemInfo: dataStructure;
}

export const SystemMonitorRenderer: React.FC<SystemMonitorRendererProps> = ({
  SystemInfo,
}) => {
  const normalizeData = (data: dataStructure): dataStructure => {
    try {
      return {
        cpu: data.cpu ?? 0,
        memory: {
          total: data.memory?.total ?? 0,
          available: data.memory?.available ?? 0,
          percent: data.memory?.percent ?? 0,
          used: data.memory?.used ?? 0,
          free: data.memory?.free ?? 0,
        },
        network: {
          up: data.network?.up ?? 0,
          down: data.network?.down ?? 0,
          upTotal: data.network?.upTotal ?? 0,
          downTotal: data.network?.downTotal ?? 0,
        },
        response_time: data.response_time ?? 0,
      };
    } catch (error) {
      return {
        cpu: 0,
        memory: {
          total: 0,
          available: 0,
          percent: 0,
          used: 0,
          free: 0,
        },
        network: {
          up: 0,
          down: 0,
          upTotal: 0,
          downTotal: 0,
        },
        response_time: 0,
      };
    }
  };

  // 标准化 SystemInfo 数据
  const normalizedSystemInfo = normalizeData(SystemInfo);

  return (
    <StyledContainer style={{minWidth:"200px"}}>
      <div style={{minWidth:"80px"}}>
        <p>CPU {normalizedSystemInfo.cpu}%</p>
        <p>内存 {normalizedSystemInfo.memory.percent}%</p>
      </div>
      <div className="ml-2">
        <div className="flex items-center">
          <FontAwesomeIcon icon={faArrowUp} />
          <p className="ml-2">{normalizedSystemInfo.network.up}</p>
        </div>
        <div className="flex items-center">
          <FontAwesomeIcon icon={faArrowDown} />
          <p className="ml-2">{normalizedSystemInfo.network.down}</p>
        </div>
      </div>
    </StyledContainer>
  );
};
