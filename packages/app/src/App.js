import React, { Component } from "react";
import styled from "styled-components";

const AppLayout = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

class App extends Component {
  render() {
    return (
      <AppLayout>
        <button>Create</button>
      </AppLayout>
    );
  }
}

export default App;
