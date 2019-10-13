import React from "react";
import { Redirect } from "react-router-dom";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { Container, Row, Col } from "react-grid-system";

import constants from "../constants";

const Page = styled.div`
  padding-top: 64px;
  color: white;
`;

const JoinUrl = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 32px;

  text-align: center;
  line-height: 32px;
`;

const Messages = styled.div`
  display: flex;
  flex-flow: column-reverse nowrap;

  max-height: calc(100vh - 132px);
  overflow: auto;
`;

const Message = styled.div`
  display: inline;
  width: 25vw;
  margin-bottom: 4px;

  align-self: ${props => (props.isMe ? "flex-end" : "auto")};
  padding-left: ${props => (props.isMe ? 0 : 4)}px;
  padding-right: ${props => (props.isMe ? 4 : 0)}px;
  text-align: ${props => (props.isMe ? "right" : "left")};

  border-radius: 5px;
  border-bottom-right-radius: ${props => (props.isMe ? 0 : 5)}px;
  border-bottom-left-radius: ${props => (props.isMe ? 5 : 0)}px;

  background: aquamarine;
  color: black;
`;

const Button = styled.button`
  width: 100%;
  height: 50px;

  color: white;
  border: 1px solid white;
  background: transparent;

  text-transform: uppercase;
`;

const Input = styled.input`
  width: 100%;
  height: 50px;

  padding-left: 1em;

  color: black;
  border: 1px solid white;
  background: white;
`;

const StickyFooter = styled.div`
  position: fixed;
  top: calc(100vh - 50px);
  left: 0;
  height: 50px;
  width: 100vw;
`;

export default withRouter(
  class Chat extends React.Component {
    state = {
      loading: false,
      id: null,
      error: null,
      errno: null,
      text: ""
    };

    interval = null;

    async componentDidMount() {
      await this.tick();

      this.interval = setInterval(this.tick.bind(this), 10000);
    }

    async tick() {
      try {
        const hash = this.props.location.hash;

        let id = null;
        if (hash) {
          id = hash.substr(1);
        }

        if (!id) {
          console.log("chat id not defined", id);
          return;
        }

        const res = await fetch(`${constants.API_ENDPOINT}/chat/${id}`);
        const ts = await res.json();
        this.setState({ id: ts.id, errno: ts.errno });
        console.log(ts);
      } catch (err) {
        this.setState({ error: err });
      }
    }

    componentWillUnmount() {
      clearInterval(this.interval);
    }

    handleSend = async () => {
      console.log("SEND");
      this.setState(() => ({ loading: true }));

      if (!this.state.id) {
        console.log("error");
        this.setState({
          error: { error: "Cannot send message when id is not defined" },
          errno: "EL1",
          id: this.state.id,
          loading: false
        });
      }

      try {
        const res = await fetch(`${constants.API_ENDPOINT}/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: this.state.text,
            id: this.state.id,
            from: localStorage.getItem("pseudo")
          })
        });

        const body = await res.json();

        if (body.errno && body.errno === "LINK_INVITE_PENDING") {
          this.setState({ error: "Wait for other user..." });
        }
      } catch (err) {
        console.log(err);
        this.setState({ error: err, errno: "qsdqsd" });
      }

      this.setState({ loading: false });
    };

    render() {
      return (
        <Page>
          <JoinUrl>
            To invite someone, send this {constants.API_ENDPOINT}/join#
            {this.state.id}
          </JoinUrl>
          {this.state.errno && <Redirect replace to={"/"} />}
          {this.state.error && (
            <Row>
              <Col md={12} align={"center"}>
                {this.state.error.error}
              </Col>
            </Row>
          )}
          <Messages>
            {[..."testnqsjdkjqsdjfhjkqshdfjhqjksdhfjkqhsdjkfhqjksdhfjkqhsdfkj"]
              .map(msg => ({
                message: "test",
                origin: Math.random() * 100 < 50 ? "me" : "other"
              }))
              .map((msg, index) => (
                <Message isMe={msg.origin === "me"} key={index}>
                  {msg.message}
                </Message>
              ))}
          </Messages>
          <StickyFooter>
            <Container>
              <Row>
                <Col md={10}>
                  <Input
                    value={this.state.message}
                    onChange={ev => {
                      const val = ev.target.value;
                      this.setState(() => ({ text: val }));
                    }}
                  />
                </Col>
                <Col md={2}>
                  <Button
                    onClick={this.handleSend}
                    disabled={this.state.loading}
                  >
                    {this.state.loading ? "..." : "Send"}
                  </Button>
                </Col>
              </Row>
            </Container>
          </StickyFooter>
        </Page>
      );
    }
  }
);
