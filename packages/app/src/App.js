import React, { Component } from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Container } from "react-grid-system";

import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Vault from "./pages/Vault";

const AppLayout = styled.div`
  background: black;
  height: 100vh;
`;

class App extends Component {
  render() {
    return (
      <AppLayout>
        <Router>
          <Container>
            <Switch>
              <Route exact path="/chat" component={Chat} />
              <Route exact path="/vault" component={Vault} />
              <Route component={Index} />
            </Switch>
          </Container>
        </Router>
      </AppLayout>
    );
  }
}

export default App;
