import React from 'react';
import styled from 'styled-components';
import {Redirect} from 'react-router-dom';
import {Row, Col} from 'react-grid-system';

import constants from '../constants';
import Pseudo from '../components/Pseudo';

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

export default class Index extends React.Component {
  state = {
    loading: false,
    url: null,
    error: null,
  };

  handleCreate = async () => {
    this.setState(() => ({loading: true}));

    let update = {loading: false};

    try {
      const res = await fetch(constants.API_ENDPOINT + '/create', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({from: localStorage.getItem('pseudo')}),
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
          <Col md={12} align={'center'}>
            <Button onClick={this.handleCreate} disabled={this.state.loading}>
              {this.state.loading ? '...' : 'Create'}
            </Button>
          </Col>
        </Row>
        <Row>
          <Col md={12} align={'center'}>
            {this.state.url && <Redirect push to={`/chat#${this.state.url}`} />}
          </Col>
        </Row>
        <Row>
          <Col md={12} align={'center'}>
            {this.state.error}
          </Col>
        </Row>
      </Page>
    );
  }
}
