import { StyledContainer } from "../Components/StyledContainer/StyledContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
export const Setting = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        opacity: !open && !isVisible ? 0 : 1,
        transition: "opacity 0.3s ease-in-out",
        zIndex: 6,
      }}
    >
      <div
        onClick={() => {
          setOpen(!open);
        }}
      >
        <StyledContainer className="min-w-14 h-14 items-center justify-center">
          <FontAwesomeIcon
            icon={faGear}
            style={{
              color: "rgba(255,255,255,0.7)",
              width: "30px",
              height: "30px",
            }}
          />
        </StyledContainer>
      </div>

      <div
        className={`flex relative -left-14 top-14 rounded-2xl bg-[rgba(255,255,255,0.3)] flex-col w-auto
          opacity-${open ? "100" : "0"}`}
        style={{
          opacity: open ? 1 : 0,
          transition: "opacity 0.2s ease-in-out",
          backdropFilter: "blur(2px)",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <div className="flex">
            
        </div>
      </div>
    </div>
  );
};
