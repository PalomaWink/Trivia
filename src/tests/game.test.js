import React from 'react';
import { screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import { act } from 'react-dom/test-utils';
import { questionsResponse, invalidTokenQuestionsResponse } from '../../cypress/mocks/questions';
import App from '../App';


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
    const name = 'Teste'
    const email = 'teste@teste.com';
    const btnPlay = screen.getByTestId('btn-play');
  
    userEvent.type(screen.getByTestId('input-player-name'), name);
    userEvent.type(screen.getByTestId('input-gravatar-email'), email);

    userEvent.click(btnPlay);
    
    await waitFor(() => {
      screen.getByTestId('correct-answer')
      screen.getByTestId('header-player-name')
      screen.getByTestId('header-score')
      screen.getByTestId('question-category')
    })

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

  it('Verifica se ao clicar no botao next a próxima pergunta aparece na tela', async () => {
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
    expect(screen.getByTestId('question-category')).toBeInTheDocument();
    expect(screen.getByTestId('answer-options')).toBeInTheDocument();
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

    expect(screen.getByRole('heading', { name: /30/i })).toBeInTheDocument();

    await waitFor(() => expect(screen.getByRole('heading', { name: /29/i })).toBeInTheDocument(), {timeout: 31000});

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: '0' })).toBeInTheDocument();
    }, {timeout: 31000});
  }, 35000);

  it('Testando o estado global da aplicação', async () => {
    const INICIAL_STATE = {
      name: '',
      assertions: '',
      score: 0,
      gravatarEmail: '',
    };
    renderWithRouterAndRedux(<App />, INICIAL_STATE, '/game' );
    await waitForElementToBeRemoved(() => screen.getByText(/loading/i));
    
    await waitFor(() => {
      screen.findByTestId('correct-answer')
      screen.findByTestId('header-player-name')
      screen.findByTestId('header-score')
    })
  });

  it('Verifica se ao expirar o token, o usuário é direcionado para a tela de login', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(invalidTokenQuestionsResponse),
    });

    const { history } = renderWithRouterAndRedux(<App />);

    const name = 'Teste'
    const email = 'teste@teste.com';
    const btnPlay = screen.getByTestId('btn-play');
  
    userEvent.type(screen.getByTestId('input-player-name'), name);
    userEvent.type(screen.getByTestId('input-gravatar-email'), email);
  
    userEvent.click(btnPlay);
  
    await waitFor(() => {
      const{ pathname } = history.location;
      expect(pathname).toBe('/game');
    });

    await waitFor(() => {
      const{ pathname } = history.location;
      expect(pathname).toBe('/');
    });
  })

  it('Verifica se aparece 3 opções de respostas erradas', async () => {
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

    expect(screen.getAllByTestId(/wrong-answer-/i)).toHaveLength(3);
  });

  it('Testando clicks do usuário', async () => {
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
      const{ pathname } = history.location;
      expect(pathname).toBe('/feedback');
    });
    await screen.findByTestId('btn-play-again');
    await screen.findByTestId('btn-ranking');
  });

})