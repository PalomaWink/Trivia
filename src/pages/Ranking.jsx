import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Ranking.css';

export default class Ranking extends Component {
  render() {
    const { history } = this.props;
    return (
      <div className="rank-container">
        <h1 data-testid="ranking-title">Ranking</h1>
        <button
          type="button"
          data-testid="btn-go-home"
          onClick={ () => history.push('/') }
        >
          Inicio
        </button>
      </div>
    );
  }
}

Ranking.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};
