import React from "react";
import styled from "styled-components";

const Button = styled.button`
  width: 200px;
  height: 50px;

  color: white;
  border: 1px solid white;
  background: transparent;

  text-transform: uppercase;
`;

export default props => {
  return <Button>Unlock</Button>;
};
