# Aviator + Calculadora (Electron)

## Como o projeto deve funcionar (visão final)

- O aplicativo abre UMA ÚNICA JANELA (uma única “tela”).
- A tela é dividida em duas partes:
  - Lado esquerdo: Calculadora de Gestão (HTML local do projeto).
  - Lado direito: O jogo Aviator carregado diretamente dentro do app.
- Nada deve abrir “em outra aba” por padrão.
- O usuário consegue:
  - usar a calculadora normalmente,
  - e ao mesmo tempo ver/jogar o Aviator no painel da direita,
  - tudo sem sair da mesma tela.

## Por que Electron (e não iframe)
- Muitos sites de cassino bloqueiam iframe por segurança (CSP, X-Frame-Options, etc).
- No Electron, usamos BrowserView, que é como se fossem duas abas internas do navegador,
  lado a lado, dentro da mesma janela.
- Isso replica o comportamento dos “apps que funcionam”.

## Requisitos
- Windows 10/11
- Node.js instalado (LTS recomendado)

## Instalação
1) Abra a pasta do projeto no terminal.
2) Rode:
   npm install
3) Depois:
   npm start

## Onde fica cada parte
- Calculadora (esquerda):
  `renderer/calc.html`
- Aviator (direita):
  `config.json` -> chave `GAME_URL`

## Observação importante sobre login
- Se o site exigir login, você vai logar DENTRO do painel da direita.
- Como usamos partition persistente (`persist:aviator`), os cookies/sessão ficam salvos.
- Assim, quando fechar e abrir o app, pode continuar logado.

## Se o Aviator não carregar
Existem 3 motivos comuns:
1) O site bloqueia ambiente “embutido” (menos comum no Electron, mas pode ocorrer).
2) Precisa de login e/ou captcha.
3) A URL correta é a “final” da Spribe (aviator-next.spribegaming.com/?user=...&token=...).

Nesse caso, a solução mais forte é:
- Abrir o Aviator no navegador,
- pegar a URL final com token (a que você mostrou no iframe),
- colar no `GAME_URL` do `config.json`.
Isso normalmente faz o jogo carregar direto.

## Objetivo do projeto
- Entregar um app que:
  - mantém a calculadora fixa e acessível,
  - e mantém o Aviator ao lado,
  - tudo em UMA única tela,
  - com layout estável e redimensionável.
