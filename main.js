const { app, BrowserWindow, dialog } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { autoUpdater } = require('electron-updater');

let phpProcess = null;
let mainWindow = null;
let isUpdating = false;

function checkServer() {
  return new Promise((resolve) => {
    const req = http.get('http://127.0.0.1:8898', () => resolve(true));

    req.on('error', () => resolve(false));

    req.setTimeout(2000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function ensurePersistentFolders() {
  const videosPath = app.getPath('videos');
  const coursesPath = path.join(videosPath, 'Biblioteca de Cursos');

  if (!fs.existsSync(coursesPath)) {
    fs.mkdirSync(coursesPath, { recursive: true });
  }

  return {
    videosPath,
    coursesPath
  };
}

function startPhpServer() {
  return new Promise((resolve, reject) => {
    const phpPath = app.isPackaged
      ? path.join(process.resourcesPath, 'php', 'php.exe')
      : path.join(__dirname, 'php', 'php.exe');

    const projectPath = app.isPackaged
      ? path.join(process.resourcesPath, 'www')
      : path.join(__dirname, 'www');

    const { videosPath, coursesPath } = ensurePersistentFolders();

    phpProcess = spawn(
      phpPath,
      ['-S', '127.0.0.1:8898', '-t', 'public'],
      {
        cwd: projectPath,
        windowsHide: true,
        env: {
          ...process.env,
          APP_VERSION: app.getVersion(),
          APP_VIDEOS_DIR: videosPath,
          APP_COURSES_DIR: coursesPath
        }
      }
    );

    phpProcess.on('error', reject);

    if (phpProcess.stdout) {
      phpProcess.stdout.on('data', (data) => {
        console.log('[PHP]', data.toString());
      });
    }

    if (phpProcess.stderr) {
      phpProcess.stderr.on('data', (data) => {
        console.log('[PHP]', data.toString());
      });
    }

    phpProcess.on('exit', (code, signal) => {
      console.log(`[PHP] Processo encerrado. code=${code} signal=${signal}`);
      phpProcess = null;
    });

    setTimeout(resolve, 1500);
  });
}

async function waitForServer(maxTries = 20) {
  for (let i = 0; i < maxTries; i++) {
    const ok = await checkServer();
    if (ok) return true;
    await new Promise((r) => setTimeout(r, 1000));
  }

  return false;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadURL('http://127.0.0.1:8898');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function killProcessTree(pid) {
  return new Promise((resolve) => {
    if (!pid) {
      resolve();
      return;
    }

    if (process.platform !== 'win32') {
      try {
        process.kill(pid, 'SIGTERM');
      } catch (err) {
        console.error('[Process] Erro ao encerrar PID:', err);
      }
      setTimeout(resolve, 1000);
      return;
    }

    const killer = spawn(
      'taskkill',
      ['/PID', String(pid), '/T', '/F'],
      { windowsHide: true }
    );

    killer.on('error', (err) => {
      console.error('[Process] Erro ao executar taskkill:', err);
      resolve();
    });

    killer.on('close', (code) => {
      console.log(`[Process] taskkill finalizado com code=${code}`);
      resolve();
    });
  });
}

async function stopPhpProcess() {
  if (!phpProcess) return;

  const pid = phpProcess.pid;
  console.log(`[PHP] Encerrando árvore do processo PID=${pid}`);

  await killProcessTree(pid);
  phpProcess = null;

  await new Promise((r) => setTimeout(r, 800));
}

async function installDownloadedUpdate() {
  if (isUpdating) return;
  isUpdating = true;

  try {
    console.log('[Updater] Preparando instalação...');
    await stopPhpProcess();

    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.hide();
    }

    console.log('[Updater] Chamando quitAndInstall...');
    autoUpdater.quitAndInstall(false, true);
  } catch (err) {
    console.error('[Updater] Erro ao instalar atualização:', err);
    isUpdating = false;
  }
}

function setupAutoUpdater() {
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = false;

  autoUpdater.on('checking-for-update', () => {
    console.log('[Updater] Verificando atualizações...');
  });

  autoUpdater.on('update-available', (info) => {
    console.log('[Updater] Atualização disponível:', info?.version);
  });

  autoUpdater.on('update-not-available', () => {
    console.log('[Updater] Nenhuma atualização disponível.');
  });

  autoUpdater.on('error', (err) => {
    console.log(
      '[Updater] Erro no auto update:',
      err == null ? 'desconhecido' : err.message
    );
  });

  autoUpdater.on('download-progress', (progressObj) => {
    const percent = progressObj?.percent ? progressObj.percent.toFixed(1) : '0.0';
    console.log(`[Updater] Baixando atualização: ${percent}%`);
  });

  autoUpdater.on('update-downloaded', async () => {
    const result = await dialog.showMessageBox(mainWindow, {
      type: 'info',
      buttons: ['Atualizar agora', 'Depois'],
      defaultId: 0,
      cancelId: 1,
      title: 'Atualização disponível',
      message: 'Uma nova versão da Biblioteca Mahal foi baixada.',
      detail: 'Clique em "Atualizar agora" para fechar o app e instalar.'
    });

    if (result.response === 0) {
      console.log('[Updater] Usuário confirmou atualização');
      await installDownloadedUpdate();
    }
  });
}

app.whenReady().then(async () => {
  try {
    const online = await checkServer();

    if (!online) {
      await startPhpServer();
      const ready = await waitForServer();

      if (!ready) {
        throw new Error('O servidor PHP local não iniciou.');
      }
    }

    createWindow();
    setupAutoUpdater();

    setTimeout(() => {
      autoUpdater.checkForUpdatesAndNotify();
    }, 5000);

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  } catch (err) {
    dialog.showErrorBox(
      'Erro ao iniciar a Biblioteca Mahal',
      String(err?.message || err)
    );
    app.quit();
  }
});

app.on('before-quit', () => {
  if (!isUpdating && phpProcess?.pid) {
    killProcessTree(phpProcess.pid).catch(() => {});
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin' && !isUpdating) {
    app.quit();
  }
});