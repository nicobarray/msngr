import React, { Component } from "react";
import styled from "styled-components";

const AppLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Button = styled.button`
  width: 200px;
  height: 50px;

  font-size: 2em;
`;

class App extends Component {
  render() {
    return (
      <AppLayout>
        <Button>Create</Button>
      </AppLayout>
    );
  }
}

export default App;
