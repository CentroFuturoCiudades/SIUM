import { Select } from "@chakra-ui/react";

const ButtonControls = ({ activeButton, setActiveButton, mapping, color }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "10px",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
      }}
    >
      <Select
        width="50%"
        variant="outline"
        bg={`${color}.400`}
        borderColor={`${color}.500`}
        borderWidth="0.12rem"
        backgroundColor={`${color}.400`}
        color="white"
        focusBorderColor={`${color}.500`}
        onChange={(e) => setActiveButton(e.target.value)}
        value={activeButton}
        margin="auto"
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
