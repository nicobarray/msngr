import React from "react";
import styled from "styled-components";
import { Row, Col } from "react-grid-system";

const Page = styled.div`
  padding-top: 32px;
`;

const Button = styled.button`
  width: 200px;
  height: 50px;

  color: white;
  border: 1px solid white;
  background: transparent;

  text-transform: uppercase;
`;

export default class Index extends React.Component {
  state = {
    loading: false
  };

  handleCreate = async () => {
    this.setState(() => ({ loading: true }));
    await new Promise(resolve => setTimeout(resolve, 2000));
    this.setState(() => ({ loading: false }));
  };

  render() {
    return (
      <Page>
        <Row>
          <Col md={12} align={"center"}>
            <Button onClick={this.handleCreate} disabled={this.state.loading}>
              {this.state.loading ? "..." : "Create"}
            </Button>
          </Col>
        </Row>
      </Page>
    );
  }
}
