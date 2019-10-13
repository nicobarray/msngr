import React from "react";
import PropTypes from "prop-types";

export default class Pseudo extends React.Component {
  static propTypes = {
    onPseudoChange: PropTypes.func
  };

  state = {
    pseudo: ""
  };

  componentDidMount() {
    const pseudo = localStorage.getItem("pseudo")
    if (pseudo) {
      this.setState({ pseudo })
    }
  }

  handleChange = ev => {
    const { value } = ev.target;
    this.setState({ pseudo: value });
  };

  handleSubmit = ev => {
    ev.preventDefault();
    localStorage.setItem("pseudo", this.state.pseudo);

    this.props.onPseudoChange && this.props.onPseudoChange();
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            value={this.state.pseudo}
            onChange={this.handleChange}
          />
        </form>
      </div>
    );
  }
}
