# Aviator + Calculadora com Scraper de Cashout

## Visão Geral

Esta é uma aplicação Electron que exibe uma calculadora de gerenciamento local ao lado do jogo Aviator da Sorte na Bet. A aplicação inclui um scraper integrado que detecta e registra automaticamente seus valores de cashout e multiplicadores da seção "Minhas Apostas".

## Como o Scraper Funciona

O scraper opera em segundo plano, injetando um script na página do jogo. Ele não interage com sua conta nem realiza apostas. Sua única função é observar a lista "Minhas Apostas".

1.  O script aguarda até que a lista "Minhas Apostas" esteja visível na página.
2.  Ele usa um `MutationObserver` para detectar quando uma nova aposta concluída é adicionada à lista.
3.  Quando uma nova aposta é detectada, o script a identifica procurando pelo elemento multiplicador (por exemplo, `1.50x`).
4.  Em seguida, ele procura pelo valor do cashout em R$ associado a essa aposta.
5.  Os dados extraídos (valor do cashout e multiplicador) são enviados para o processo principal do Electron e exibidos no console/terminal onde você iniciou a aplicação.

## Atualizando os Seletores (Se o Scraper Parar de Funcionar)

Sites de jogos podem mudar seu código HTML, o que pode quebrar o scraper. Se você perceber que os valores de cashout não estão mais sendo registrados, precisará atualizar os "seletores" no arquivo `preload.js`.

**Seletores Atuais:**
*   Contêiner de "Minhas Apostas": `app-my-bets`
*   Elemento do Multiplicador: `.bubble-multiplier`

**Como Encontrar Novos Seletores:**

1.  **Habilite as Ferramentas de Desenvolvedor:** No arquivo `main.js`, certifique-se de que a seguinte linha **não** esteja comentada (sem `//` no início):
    ```javascript
    rightView.webContents.openDevTools({ mode: "detach" });
    ```
2.  **Inicie a Aplicação:** Execute `npm start`. A janela do jogo e uma janela separada de "Ferramentas de Desenvolvedor" (com código) devem abrir.
3.  **Use o Inspetor:** Na janela de código, clique no ícone do inspetor (um quadrado com um ponteiro de mouse).
4.  **Selecione o Elemento:** Mova o mouse para a janela do jogo e clique na área que você deseja inspecionar (por exemplo, a lista "Minhas Apostas" ou um multiplicador `1.50x`).
5.  **Encontre a Classe ou Tag:** A janela de código mostrará o HTML do elemento. Procure por um atributo `class="..."` ou um nome de tag (como `app-my-bets`) que pareça ser o identificador principal.
6.  **Atualize o `preload.js`:** Abra o arquivo `preload.js` e substitua os valores antigos em `MY_BETS_CONTAINER_SELECTOR` ou `MULTIPLIER_SELECTOR` pelos novos que você encontrou.
7.  **Teste:** Salve o arquivo e reinicie a aplicação para ver se o scraper funciona novamente.

## Executando a Aplicação

Para executar a aplicação, use o seguinte comando no seu terminal:

```bash
npm start
```
