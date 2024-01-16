import { Skeleton, Spinner } from "@chakra-ui/react";

const Loading = ({ color }) => (
  <>
    <Skeleton height="100vh" startColor="white" endColor={`${color}.100`} />
    <div style={{ position: "absolute", top: "50%", right: "50%" }}>
      <Spinner thickness="4px" speed="0.65s" size="xl" color={`${color}.500`} />
    </div>
  </>
);

export default Loading;
