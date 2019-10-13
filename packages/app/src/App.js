import React, { Component } from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Container } from "react-grid-system";

import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Join from "./pages/Join";

const AppLayout = styled.div`
  background: black;
  height: 100vh;
`;

if (!localStorage.getItem('pseudo')) {
  const ts = Date.now() + ''
  const pseudo ='anon-' + [...ts].reverse().join('').substr(0,5)
  localStorage.setItem('pseudo', pseudo)
}

class App extends Component {
  render() {
    return (
      <AppLayout>
        <Router>
          <Container>
            <Switch>
              <Route exact path="/chat" component={Chat} />
              <Route exact path="/join" component={Join} />
              <Route component={Index} />
            </Switch>
          </Container>
        </Router>
      </AppLayout>
    );
  }
}

export default App;
