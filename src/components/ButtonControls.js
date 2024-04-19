import { Select } from "@chakra-ui/react";

const ButtonControls = ({ activeButton, setActiveButton, mapping, color, onClick }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        width: "50%",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
        transform: "translateX(50%)"
      }}
    >
      <Select
        width="100%"
        variant="outline"
        bg={`${color}.400`}
        borderColor={`${color}.500`}
        borderWidth="0.12rem"
        backgroundColor={`${color}.400`}
        color="white"
        focusBorderColor={`${color}.500`}
        onChange={(e) => setActiveButton(e.target.value)}
        value={activeButton}
        onClick={onClick}
      >
        {mapping.map((button) => (
          <option value={button.id} key={`button-${button.id}`} style={{color: "gray"}}>
            {button.name}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default ButtonControls;
