import React from 'react';
import { screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import { act } from 'react-dom/test-utils';
import { questionsResponse } from '../../cypress/mocks/questions';
import App from '../App';

beforeEach(() => {
  jest.spyOn(global, 'fetch');
  global.fetch.mockResolvedValue({
    json: jest.fn().mockResolvedValue(questionsResponse),
  });
});

afterEach(jest.restoreAllMocks);

describe('Testes da tela de ranking', () => {
  it('Verifica se a tela de rankin e renderizada corretamente e se ao clicar em "Inicio" o usu[ário é redirecionado para a tela de login  ', async () => {
    const INICIAL_STATE = {
      name: '',
      assertions: '',
      score: 0,
      gravatarEmail: '',
    };
    const { history } = renderWithRouterAndRedux(<App />, INICIAL_STATE, '/ranking');
    screen.getByTestId('ranking-title');
    const btnHome = screen.getByTestId('btn-go-home');
    userEvent.click(btnHome);

    await waitFor(() => {
      const { pathname } = history.location;
      expect(pathname).toBe('/');
    })
  });

  it('Verifica se o botão que leva ao ranking está funcionando e se todas as informações aparecem na tela', async () => {
    const { history } = renderWithRouterAndRedux(<App />);

    const name = 'teste teste'
    const email = 'teste@teste.com';
    const btnPlay = screen.getByTestId('btn-play');

    userEvent.type(screen.getByTestId('input-player-name'), name);
    userEvent.type(screen.getByTestId('input-gravatar-email'), email);

    await waitFor(() => {
      userEvent.click(btnPlay);
    })

    await waitFor(() => {
      userEvent.click(screen.getByTestId('correct-answer'));
    })

    const btnNext = await screen.findByTestId('btn-next');
    userEvent.click(btnNext);

    await waitFor(() => {
      userEvent.click(screen.getByTestId('correct-answer'));
    })

    const btnNext2 = await screen.findByTestId('btn-next');
    userEvent.click(btnNext2);

    await waitFor(() => {
      userEvent.click(screen.getByTestId('correct-answer'));
    })

    const btnNext3 = await screen.findByTestId('btn-next');
    userEvent.click(btnNext3);

    await waitFor(() => {
      userEvent.click(screen.getByTestId('correct-answer'));
    })

    const btnNext4 = await screen.findByTestId('btn-next');
    userEvent.click(btnNext4);

    await waitFor(() => {
      userEvent.click(screen.getByTestId('correct-answer'));
    })

    const btnNext5 = await screen.findByTestId('btn-next');
    userEvent.click(btnNext5);

    await waitFor(() => {
      const { pathname } = history.location;
      expect(pathname).toBe('/feedback');
    });
    await screen.findByTestId('btn-play-again');
    const btnRanking = await screen.findByTestId('btn-ranking');

    userEvent.click(btnRanking);

    await waitFor(() => {
      const { pathname } = history.location;
      expect(pathname).toBe('/ranking');
    });
  });

  it('Veirifica se é listado mais de um usuário no ranking e se a colocação está correta', async () => {
    const inicialState = {
      player: {
        name: '',
        assertions: '',
        score: 0,
        gravatarEmail: '',
      }
    }
    const players = [
      {
        "nome": "Player1",
        "ponto": 40,
        "img": "https://www.gravatar.com/avatar/4f64c9f81bb0d4ee969aaf7b4a5a6f40"
      },
      {
        "nome": "Player2",
        "ponto": 134,
        "img": "https://www.gravatar.com/avatar/d676af2c6c6aa5303d89104df10f417c"
      }
    ];

    localStorage.setItem('ranking', JSON.stringify(players))

    const { history, debug } = renderWithRouterAndRedux(<App />, inicialState, '/ranking');

    await waitFor(() => {
      const { pathname } = history.location;
      expect(pathname).toBe('/ranking');
    });

    await screen.findByTestId('ranking-title')
    const playerName = await screen.findAllByTestId(/player-name/i)
    expect(playerName).toHaveLength(2);

    const playerScore = await screen.findAllByTestId(/player-score/i)
    expect(playerScore).toHaveLength(2);

    const firstPlayerScore = screen.getByTestId('player-score-0').textContent;
    const secondPlayerScore = screen.getByTestId('player-score-1').textContent;

    expect(parseInt(firstPlayerScore)).toBeGreaterThan(parseInt(secondPlayerScore));
    debug();
  });

})