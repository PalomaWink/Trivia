import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../components/Header';

class Game extends React.Component {
  state = {
    results: '',
    qIndex: 0,
    answers: '',
    ativar: false,
  };

  async componentDidMount() {
    const token = localStorage.getItem('token');
    const { qIndex } = this.state;
    try {
      const response = await fetch(`https://opentdb.com/api.php?amount=5&token=${token}`);
      const data = await response.json();
      const num = 3;
      if (data.response_code === num) {
        const { history } = this.props;
        localStorage.removeItem('token');
        history.push('/');
      }
      const entities = {
        '&#039;': '\'',
        '&quot;': '"',
        '&ntilde;': 'ñ',
        '&eacute;': 'é',
        '&amp;': '&',
        '&uuml;': 'ü',
      };
      const replaced = data.results.map((element) => {
        const question = element.question.replace(/&#?\w+;/g, (match) => entities[match] || match);
        const correct = element.correct_answer.replace(/&#?\w+;/g, (match) => entities[match] || match);
        const incorrect = element.incorrect_answers.map((elementTwo) => elementTwo.replace(/&#?\w+;/g, (match) => entities[match] || match));
        return { ...element, question, correct, incorrect };
      });
      const answersArray = [{ correct: replaced[qIndex].correct_answer },
        ...replaced[qIndex].incorrect_answers];
      const randomizedAnswers = this.shuffleArray(answersArray);
      this.setState({
        results: replaced,
        answers: randomizedAnswers,
      });
      console.log(data.results);
    } catch (err) {
      console.log('Um erro foi capturado.', err);
    }
  }

  clickOn = () => {
    this.setState({
      ativar: true,
    });
  };

  shuffleArray = (array) => { // código do stackoverflow (Knuth Shuffle)
    let currentIndex = array.length;
    let randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  };

  render() {
    const { results, qIndex, answers, ativar } = this.state;
    return (
      <div>
        <Header />
        { results.length ? (
          <div>
            <h2 data-testid="question-category">{ results[qIndex].category }</h2>
            <h3 data-testid="question-text">{ results[qIndex].question }</h3>
            <div data-testid="answer-options">
              { answers.map((a, i) => {
                if (typeof (a) === 'object') {
                  return (
                    <button
                      data-testid="correct-answer"
                      onClick={ this.clickOn }
                      className={ ativar ? 'correto' : '' }
                      key={ i }
                    >
                      {a.correct}
                    </button>
                  );
                }
                return (
                  <button
                    key={ i }
                    onClick={ this.clickOn }
                    className={ ativar ? 'errado' : '' }
                    data-testid={ `wrong-answer-${i}` }
                  >
                    {a}
                  </button>
                );
              }) }
              {/* <button
                data-testid="correct-answer"
              >
                { results[qIndex].correct_answer }
              </button>
              { results[qIndex].incorrect_answers.map((a, i) => (
                <button key={ i } data-testid={ `wrong-answer-${i}` }>
                  { a }
                </button>
              )) } */}
            </div>
          </div>
        ) : null }
      </div>
    );
  }
}

Game.propTypes = {
  // dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  ...state,
});

export default connect(mapStateToProps)(Game);
