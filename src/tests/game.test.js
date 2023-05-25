import React from 'react';
import { screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import { act } from 'react-dom/test-utils';
import { questionsResponse } from '../../cypress/mocks/questions';
import App from '../App';
import Game from '../pages/Game';

beforeEach(() => {
  jest.spyOn(global, 'fetch');
  global.fetch.mockResolvedValue({
    json: jest.fn().mockResolvedValue(questionsResponse),
  });
});

afterEach(jest.restoreAllMocks);

describe('Testes para a tela de game', () => {

  it('Verifica se todos os elementos estão presentes na página', async() => {
    renderWithRouterAndRedux(<App />);
    const nameRigth = 'teste teste'
    const emailRigtht = 'teste@teste.com';
    const btnPlay = screen.getByTestId('btn-play');
  
    act(() => userEvent.type(screen.getByTestId('input-player-name'), nameRigth));
    act(() => userEvent.type(screen.getByTestId('input-gravatar-email'), emailRigtht));
    userEvent.click(btnPlay);

    screen.getByRole('img');
    screen.getAllByRole('button');
  });

  it('Verifica se API foi chamada', async () => {
    renderWithRouterAndRedux(<App />);
    const nameRigth = 'teste teste'
    const emailRigtht = 'teste@teste.com';
    const btnPlay = screen.getByTestId('btn-play');
  
    act(() => userEvent.type(screen.getByTestId('input-player-name'), nameRigth));
    act(() => userEvent.type(screen.getByTestId('input-gravatar-email'), emailRigtht));
    userEvent.click(btnPlay);

    expect(global.fetch).toHaveBeenCalled();

  });

  it('Verifica se ao clicar na resposta correta o botao muda de cor', async () => {
    const INICIAL_STATE = {
      name: '',
      assertions: '',
      score: 0,
      gravatarEmail: '',
    };
    renderWithRouterAndRedux(<App />, INICIAL_STATE, '/game' );
   
    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    await waitFor(() => {
      userEvent.click(screen.getByTestId('correct-answer'));
    })
    
    expect(screen.getByTestId('correct-answer')).toHaveStyle('background-color: ButtonFace');
  });

  it('Verifica se ao clicar na resposta errada o botao muda de cor', async () => {
    const INICIAL_STATE = {
      name: '',
      assertions: '',
      score: 0,
      gravatarEmail: '',
    };
    renderWithRouterAndRedux(<App />, INICIAL_STATE, '/game' );

    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    await waitFor(() => {
      userEvent.click(screen.getByTestId('correct-answer'));
    })

    const btnNext = await screen.findByTestId('btn-next');
    userEvent.click(btnNext);

    expect(screen.getByText("In quantum physics, which of these theorised sub-atomic particles has yet to be observed?")).toBeInTheDocument();
  });
  it('Verifica se apos responder 5 perguntas o usuario e redirecionado para a tela de feedback', async () => {
    const INICIAL_STATE = {
      name: '',
      assertions: '',
      score: 0,
      gravatarEmail: '',
    };
    const { history } = renderWithRouterAndRedux(<App />, INICIAL_STATE, '/game' );
    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
    
    await waitFor(() => {
      userEvent.click(screen.getByTestId('correct-answer'));
    })
    
    const btnNext = await screen.findByTestId('btn-next');
    userEvent.click(btnNext);

    await waitFor(() => {
      userEvent.click(screen.getByTestId('correct-answer'));
    })

    userEvent.click(btnNext);

    await waitFor(() => {
      userEvent.click(screen.getByTestId('correct-answer'));
    })

    userEvent.click(btnNext);

    await waitFor(() => {
      userEvent.click(screen.getByTestId('correct-answer'));
    })

    userEvent.click(btnNext);

    await waitFor(() => {
      userEvent.click(screen.getByTestId('correct-answer'));
    })

    userEvent.click(btnNext);

    await waitFor(() => {
      history.push('/feedback')
      const{ pathname } = history.location;
      expect(pathname).toBe('/feedback');
    })
  });

  it('Verifica se o timer de 30 segundos esta funcionando', async () => {
    const INICIAL_STATE = {
      name: '',
      assertions: '',
      score: 0,
      gravatarEmail: '',
    };
    renderWithRouterAndRedux(<App />, INICIAL_STATE, '/game' );
    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));

    expect(screen.getByText(/30/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText(/29/i)).toBeInTheDocument(), {timeout: 31000});

    expect(screen.getByText(/0/i)).toBeInTheDocument();
  });
})