const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// ===== Local data store (fully offline — a single JSON file on this PC) =====
const DATA_FILE = path.join(app.getPath('userData'), 'store.json');

const DEFAULT_PRODUCTS = [
  { id: 1, sku: "SKU-001", name: "PP U MONO 1/2 HP", category: "Motors & Pumps", rate: 11500, stock: 15 },
  { id: 2, sku: "SKU-002", name: "یونین 25 ایم ایم ترک پلاسٹک", category: "Pipes & Fittings", rate: 165, stock: 85 },
  { id: 3, sku: "SKU-003", name: "سیکٹ 3/4*25 ایم ایم ترک پلاسٹک", category: "Pipes & Fittings", rate: 221, stock: 65 },
  { id: 4, sku: "SKU-004", name: "ٹی 1/2*25 ایم ایم ترک پلاسٹک", category: "Pipes & Fittings", rate: 231, stock: 45 },
  { id: 5, sku: "SKU-005", name: "GI بوش 3/4*1", category: "Hardware & Fittings", rate: 185, stock: 50 },
  { id: 6, sku: "SKU-006", name: 'GI نپل بیر "3/4', category: "Hardware & Fittings", rate: 156, stock: 70 },
  { id: 7, sku: "SKU-007", name: "ایلبو 25 ایم ایم ترک پلاسٹک", category: "Pipes & Fittings", rate: 40.5, stock: 120 },
  { id: 8, sku: "SKU-008", name: "ٹی 32 ایم ایم ترک پلاسٹک", category: "Pipes & Fittings", rate: 84, stock: 90 },
  { id: 9, sku: "SKU-009", name: "سیکٹ 32 ایم ایم ترک پلاسٹک", category: "Pipes & Fittings", rate: 52.5, stock: 110 },
  { id: 10, sku: "SKU-010", name: "چیک نٹ 3/4*1 ڈیورا", category: "Hardware & Fittings", rate: 450, stock: 35 },
  { id: 11, sku: "SKU-011", name: "سیکٹ 3/4*32 ایم ایم ترک پلاسٹک", category: "Pipes & Fittings", rate: 336, stock: 40 },
  { id: 12, sku: "SKU-012", name: "یونین 32 ایم ایم ترک پلاسٹک", category: "Pipes & Fittings", rate: 237, stock: 55 },
  { id: 13, sku: "SKU-013", name: "دھاگا گولا", category: "Accessories", rate: 20, stock: 200 },
  { id: 14, sku: "SKU-014", name: "ٹفلون ٹیپ", category: "Accessories", rate: 40, stock: 150 },
  { id: 15, sku: "SKU-015", name: "ایلبو 32 ایم ایم ترک پلاسٹک", category: "Pipes & Fittings", rate: 66.5, stock: 85 },
  { id: 16, sku: "SKU-016", name: "سیکٹ 25 ایم ایم ترک پلاسٹک", category: "Pipes & Fittings", rate: 28, stock: 130 },
  { id: 17, sku: "SKU-017", name: "فٹ پائپ 25 ایم ایم ترک پلاسٹک", category: "Pipes & Fittings", rate: 72.83, stock: 95 },
  { id: 18, sku: "SKU-018", name: "فٹ پائپ 32 ایم ایم ترک پلاسٹک", category: "Pipes & Fittings", rate: 116.5, stock: 60 },
  { id: 19, sku: "SKU-019", name: "بوش 1*1/4 GI", category: "Hardware & Fittings", rate: 325, stock: 40 },
  { id: 20, sku: "SKU-020", name: 'GI نپل بیر "1', category: "Hardware & Fittings", rate: 235, stock: 45 },
  { id: 21, sku: "SKU-021", name: "سیکٹ 1*32 ایم ایم ترک پلاسٹک", category: "Pipes & Fittings", rate: 426, stock: 30 }
];

const DEFAULT_STORE = {
  settings: {
    shopName: "استاد انور",
    shopSub: "سینیٹری اینڈ ہارڈ ویئر سٹور",
    shopAddr: "فتح خان بازار بہاولپور",
    shopPhone: "Ph. 0622-882554",
    shopLogo: "",
    ownerPin: "1234"
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
    if (!s.products) {
      s.products = DEFAULT_PRODUCTS;
    } else {
      // Migrate legacy product items missing SKU, category, or stock
      s.products = s.products.map((p, idx) => ({
        id: p.id || (idx + 1),
        sku: p.sku || `SKU-${String(p.id || idx + 1).padStart(3, '0')}`,
        name: p.name || 'Product ' + (idx + 1),
        category: p.category || 'General',
        rate: Number(p.rate) || 0,
        stock: p.stock !== undefined ? Number(p.stock) : 50
      }));
    }
    if (!s.documents) s.documents = [];
    s.settings = Object.assign({}, DEFAULT_STORE.settings, s.settings);
    if (!s.settings.ownerPin) s.settings.ownerPin = "1234";
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
