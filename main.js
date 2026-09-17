const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// ===== Local data store (fully offline — a single JSON file on this PC) =====
const DATA_FILE = path.join(app.getPath('userData'), 'store.json');

const DEFAULT_PRODUCTS = [
  { id: 1, name: "PP U MONO 1/2 HP", rate: 11500 },
  { id: 2, name: "یونین 25 ایم ایم ترک پلاسٹک", rate: 165 },
  { id: 3, name: "سیکٹ 3/4*25 ایم ایم ترک پلاسٹک", rate: 221 },
  { id: 4, name: "ٹی 1/2*25 ایم ایم ترک پلاسٹک", rate: 231 },
  { id: 5, name: "GI بوش 3/4*1", rate: 185 },
  { id: 6, name: 'GI نپل بیر "3/4', rate: 156 },
  { id: 7, name: "ایلبو 25 ایم ایم ترک پلاسٹک", rate: 40.5 },
  { id: 8, name: "ٹی 32 ایم ایم ترک پلاسٹک", rate: 84 },
  { id: 9, name: "سیکٹ 32 ایم ایم ترک پلاسٹک", rate: 52.5 },
  { id: 10, name: "چیک نٹ 3/4*1 ڈیورا", rate: 450 },
  { id: 11, name: "سیکٹ 3/4*32 ایم ایم ترک پلاسٹک", rate: 336 },
  { id: 12, name: "یونین 32 ایم ایم ترک پلاسٹک", rate: 237 },
  { id: 13, name: "دھاگا گولا", rate: 20 },
  { id: 14, name: "ٹفلون ٹیپ", rate: 40 },
  { id: 15, name: "ایلبو 32 ایم ایم ترک پلاسٹک", rate: 66.5 },
  { id: 16, name: "سیکٹ 25 ایم ایم ترک پلاسٹک", rate: 28 },
  { id: 17, name: "فٹ پائپ 25 ایم ایم ترک پلاسٹک", rate: 72.83 },
  { id: 18, name: "فٹ پائپ 32 ایم ایم ترک پلاسٹک", rate: 116.5 },
  { id: 19, name: "بوش 1*1/4 GI", rate: 325 },
  { id: 20, name: 'GI نپل بیر "1', rate: 235 },
  { id: 21, name: "سیکٹ 1*32 ایم ایم ترک پلاسٹک", rate: 426 }
];

const DEFAULT_STORE = {
  settings: {
    shopName: "استاد انور",
    shopAddr: "فتح خان بازار بہاولپور",
    shopPhone: "Ph. 0622-882554"
  },
  products: DEFAULT_PRODUCTS,
  documents: [], // {id, type, number, date, time, staffName, role, items:[{name,rate,qty}], total}
  counters: { Quotation: 0, Invoice: 0 }
};

function loadStore() {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_STORE, null, 2), 'utf-8');
      return JSON.parse(JSON.stringify(DEFAULT_STORE));
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    const s = Object.assign({}, DEFAULT_STORE, parsed);
    if (!s.counters) s.counters = { Quotation: 0, Invoice: 0 };
    if (!s.products) s.products = DEFAULT_PRODUCTS;
    if (!s.documents) s.documents = [];
    if (!s.settings) s.settings = Object.assign({}, DEFAULT_STORE.settings);
    return s;
  } catch (e) {
    console.error('Failed to load store, using defaults:', e);
    return JSON.parse(JSON.stringify(DEFAULT_STORE));
  }
}

function writeStore(store) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write store:', e);
  }
}

let store = loadStore();

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.setMenuBarVisibility(false);
  win.loadFile(path.join(__dirname, 'src', 'index.html'));
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ===== IPC handlers =====
ipcMain.handle('settings:get', () => {
  return store.settings;
});
ipcMain.handle('settings:save', (event, settings) => {
  store.settings = Object.assign({}, store.settings, settings);
  writeStore(store);
  return store.settings;
});

ipcMain.handle('products:get', () => {
  return store.products;
});
ipcMain.handle('products:save', (event, products) => {
  store.products = products;
  writeStore(store);
  return store.products;
});

ipcMain.handle('documents:get', () => {
  return store.documents;
});
ipcMain.handle('documents:save', (event, record) => {
  const idx = store.documents.findIndex(d => d.id === record.id);
  if (idx >= 0) store.documents[idx] = record;
  else store.documents.unshift(record);
  writeStore(store);
  return store.documents;
});
ipcMain.handle('documents:delete', (event, id) => {
  store.documents = store.documents.filter(d => d.id !== id);
  writeStore(store);
  return store.documents;
});

ipcMain.handle('counter:next', (event, type) => {
  if (!store.counters) store.counters = { Quotation: 0, Invoice: 0 };
  const cur = (store.counters[type] || 0) + 1;
  store.counters[type] = cur;
  writeStore(store);
  const prefix = type === 'Invoice' ? 'INV-' : 'Q-';
  return prefix + String(cur).padStart(4, '0');
});
