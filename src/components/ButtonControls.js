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
      }}
    >
      <Select
        width="50%"
        variant="outline"
        bg={`${color}.600`}
        borderColor={`${color}.600`}
        backgroundColor={`${color}.600`}
        color="white"
        focusBorderColor={`${color}.600`}
        onChange={(e) => setActiveButton(e.target.value)}
        value={activeButton}
        margin="auto"
      >
        {mapping.map((button) => (
          <option value={button.id} key={`button-${button.id}`}>
            {button.name}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default ButtonControls;
