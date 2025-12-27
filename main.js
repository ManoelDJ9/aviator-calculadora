const path = require("path");
const fs = require("fs");
const { app, BrowserWindow, BrowserView, session, shell, dialog } = require("electron");

let win;
let leftView;
let rightView;
let GAME_URL;

try {
  const configPath = path.join(__dirname, "config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  GAME_URL = config.GAME_URL;
} catch (error) {
  dialog.showErrorBox(
    "Erro de Configuração",
    "Não foi possível ler o arquivo de configuração (config.json) ou a GAME_URL não foi encontrada. Verifique se o arquivo existe e está no formato JSON correto."
  );
  app.quit();
}

// Se você já tiver a URL final do Spribe com token (aviator-next.spribegaming.com/?user=...&token=...),
// pode trocar aqui e melhora MUITO a chance de funcionar direto.

function setLayoutBounds() {
  if (!win || !leftView || !rightView) return;

  const [w, h] = win.getContentSize();

  const topBar = 0;      // se quiser uma barra sua em cima, aumente aqui
  const gap = 8;
  const leftWidth = Math.floor(w * 0.45); // 45% calculadora
  const rightWidth = w - leftWidth - gap; // resto pro jogo

  leftView.setBounds({ x: 0, y: topBar, width: leftWidth, height: h - topBar });
  rightView.setBounds({ x: leftWidth + gap, y: topBar, width: rightWidth, height: h - topBar });

  leftView.setAutoResize({ width: true, height: true });
  rightView.setAutoResize({ width: true, height: true });
}

function createWindow() {
  win = new BrowserWindow({
    width: 1400,
    height: 820,
    backgroundColor: "#0b0d14",
    title: "Aviator + Calculadora",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  // ===== LEFT (Calculadora) =====
  leftView = new BrowserView({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  win.addBrowserView(leftView);

  const calcPath = path.join(__dirname, "renderer", "calc.html");
  leftView.webContents.loadFile(calcPath);

  // ===== RIGHT (Aviator) =====
  // Dica importante:
  // Usar partition persistente ajuda a manter cookies/sessão como "um navegador".
  const rightPartition = "persist:aviator";
  const rightSess = session.fromPartition(rightPartition);

  rightView = new BrowserView({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      partition: rightPartition
    }
  });

  win.addBrowserView(rightView);
  rightView.webContents.loadURL(GAME_URL, {
    // userAgent opcional: às vezes melhora compatibilidade com algumas plataformas
    userAgent:
      "Mozilla.5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
  });

  // Se o site tentar abrir popups/novas abas, a gente pode mandar abrir no navegador padrão:
  rightView.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  // Layout inicial + sempre que redimensionar
  setLayoutBounds();
  win.on("resize", () => setLayoutBounds());

  // Opcional: DevTools (F12) para o rightView
  // rightView.webContents.openDevTools({ mode: "detach" });

  win.on("closed", () => {
    win = null;
    leftView = null;
    rightView = null;
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
