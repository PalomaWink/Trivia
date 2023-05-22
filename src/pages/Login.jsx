import React from 'react';
import PropTypes from 'prop-types';

class Login extends React.Component {
  state = {
    name: '',
    email: '',
    playDisabled: true,
  };

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({
      [name]: value,
    }, this.inputValidation);
  };

  inputValidation = () => {
    const { name, email } = this.state;
    const emailCorreto = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email);
    const validations = [name.length, email.length, emailCorreto];
    const validInputs = validations.every((v) => v);
    this.setState({
      playDisabled: !validInputs,
    });
  };

  btnConfig = () => {
    const { history } = this.props;
    history.push('/settings');
  };

  render() {
    const { name, email, playDisabled } = this.state;
    /*  const { history } = this.props; */
    return (
      <div>
        <label htmlFor="input-name">
          Nome:
          <input
            id="input-name"
            name="name"
            type="text"
            data-testid="input-player-name"
            value={ name }
            onChange={ this.handleChange }
          />
        </label>
        <label htmlFor="input-name">
          Email:
          <input
            id="input-email"
            name="email"
            type="email"
            data-testid="input-gravatar-email"
            value={ email }
            onChange={ this.handleChange }
          />
        </label>
        <button
          data-testid="btn-play"
          disabled={ playDisabled }
        //   onClick={ () => history.push('/')}
        >
          Play
        </button>
        <button
          type="button"
          data-testid="btn-settings"
          onClick={ this.btnConfig }
        >
          Configurações

        </button>
      </div>
    );
  }
}

Login.propTypes = {
  /*  dispatch: PropTypes.func.isRequired, */
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default Login;
