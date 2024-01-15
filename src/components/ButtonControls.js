import { Button, ButtonGroup } from "@chakra-ui/react";

const ButtonControls = ({ activeButton, setActiveButton, mapping, color }) => {
  function handleDataChange(event) {
    const buttonId = event.target.id;
    setActiveButton(buttonId);
  }
  return (
    <ButtonGroup
      size="sm"
      isAttached
      colorScheme={color}
      variant="solid"
      style={{
        position: "absolute",
        top: "10px",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {mapping.map((button) => (
        <Button
          key={`button-${button.id}`}
          id={button.id}
          onClick={handleDataChange}
          isActive={activeButton === button.id}
        >
          {button.name}
        </Button>
      ))}
    </ButtonGroup>
  );
};

export default ButtonControls;
