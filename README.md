# Trivia React Redux

O objetivo deste projeto é criar um jogo de quiz inspirado no famoso jogo Trivia, similar ao "Show do Milhão". O jogo será desenvolvido utilizando as tecnologias React e Redux. O desenvolvimento será realizado em equipe, seguindo as tarefas e demandas organizadas em um quadro Kanban. Para simular uma experiência mais realista do ambiente de trabalho, foi realizado uma cópia deste quadro para gerenciar o trabalho do grupo.

## Tecnologias Utilizadas

- **JavaScript**: Linguagem de programação utilizada para desenvolver o projeto.
- **Node.js**: Ambiente de execução do JavaScript no servidor.
- **NPM**: Gerenciador de pacotes para o Node.js, utilizado para gerenciar e instalar quaisquer dependências do projeto.
- **React**: Biblioteca JavaScript para construção de interfaces de usuário.
- **Redux**: Gerenciador de estados globais.
- **Testing Library**: É uma família de pacotes que ajuda a testar os componentes da sua aplicação de maneira centrada no usuário.

## Estrutura do Projeto

O projeto possui uma estrutura de pastas padrão para um projeto React:

    src/
        App.jsx
        components/
            Header.jsx
        index.js
        helpers/
            storage.js
        pages/
            Feedback.jsx
            Feedback.css
            Game.jsx
            Game.css
            Login.jsx
            Login.css
            Ranking.jsx
            Ranking.css
            Settings.jsx
            Settings.css
        redux/
            actions/
                index.js
            reducer/
                index.js
                player.js
                token.js
            store.js
        setupTests.js
        serviceWorker.js
        tests/
            helpers/
                renderWithRouterAndRedux.js
            feedback.test.js
            game.test.js
            login.test.js
            ranking.test.js

## Como Executar o Projeto

Para executar este projeto localmente, siga estas etapas:

1. Clone o repositório para o seu computador.
2. Navegue até a pasta do projeto e execute `npm install` para instalar as dependências.
3. Execute `npm start` para iniciar o servidor de desenvolvimento.

## Contribuindo

Este projeto é para fins educacionais, portanto, pull requests não serão aceitos, foi desenvolvido em colaboração com:

- Nelson Hamada <https://github.com/nelsonhamada>
- Rodrigo Silva Ferreira <https://github.com/RodrigoSFDev>
- Amanda Rodrigues <https://github.com/amandarosr>

## Licença

Este projeto está licenciado sob a licença MIT.