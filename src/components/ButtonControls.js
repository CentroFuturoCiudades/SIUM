import { Select, useMediaQuery } from "@chakra-ui/react";

const ButtonControls = ({
  activeButton,
  setActiveButton,
  mapping,
  color,
  onClick,
}) => {
  const [isMobile] = useMediaQuery("(max-width: 800px)");
  return (
    <div
      style={{
        position: "absolute",
        top: isMobile ? "10px" : "1.5dvh",
        width: "50%",
        marginLeft: "25%",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
      }}
    >
      <Select
        variant="outline"
        bg={`${color}.400`}
        borderColor={`${color}.500`}
        borderWidth="0.12rem"
        w="100%"
        h={isMobile ? "40px" : "5dvh"}
        fontSize={isMobile ? "14px" : "min(1.2dvw, 2.4dvh)"}
        backgroundColor={`${color}.400`}
        color="white"
        focusBorderColor={`${color}.500`}
        onChange={(e) => setActiveButton(e.target.value)}
        value={activeButton}
        onClick={onClick}
      >
        {mapping.map((button) => (
          <option
            value={button.id}
            key={`button-${button.id}`}
            style={{ color: "gray" }}
          >
            {button.name}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default ButtonControls;
