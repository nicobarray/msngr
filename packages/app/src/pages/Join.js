import React from "react";
import styled from "styled-components";
import {withRouter} from 'react-router-dom'
import { Redirect } from "react-router-dom";
import { Row, Col } from "react-grid-system";

import constants from "../constants";
import Pseudo from "../components/Pseudo";

const Page = styled.div`
  padding-top: 32px;
  color: white;
`;

const Button = styled.button`
  width: 200px;
  height: 50px;

  color: white;
  border: 1px solid white;
  background: transparent;

  text-transform: uppercase;
`;

export default withRouter(class Join extends React.Component {
  state = {
    loading: false,
    url: null,
    error: null
  };

  handleJoin = async () => {
    this.setState(() => ({ loading: true }));

    const { hash } = this.props.location

    if (!hash) {
        return;
    }
    const id = hash.substr(1)

    let update = { loading: false };

    try {
      const res = await fetch(constants.API_ENDPOINT + "/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, from: localStorage.getItem('pseudo') })
      });
      const url = await res.text();
      update.url = url;
    } catch (err) {
      update.error = err;
    }

    this.setState(() => update);
  };

  render() {
    return (
      <Page>
        <Pseudo />
        <Row>
          <Col md={12} align={"center"}>
            <Button onClick={this.handleJoin} disabled={this.state.loading}>
              {this.state.loading ? "..." : "Join"}
            </Button>
          </Col>
        </Row>
        <Row>
          <Col md={12} align={"center"}>
            {this.state.url && <Redirect push to={`/chat#${this.state.url}`} />}
          </Col>
        </Row>
        <Row>
          <Col md={12} align={"center"}>
            {this.state.error}
          </Col>
        </Row>
      </Page>
    );
  }
})
