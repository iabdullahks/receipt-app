// Browser fallback if running directly in a web browser (outside Electron)
if (typeof window.api === 'undefined') {
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
      shopPhone: "Ph. 0622-882554",
      ownerPin: ""
    },
    products: DEFAULT_PRODUCTS,
    documents: [],
    counters: { Quotation: 0, Invoice: 0 }
  };
  function getStore() {
    try {
      const data = localStorage.getItem('quotation_app_store');
      return data ? Object.assign({}, DEFAULT_STORE, JSON.parse(data)) : JSON.parse(JSON.stringify(DEFAULT_STORE));
    } catch (e) {
      return JSON.parse(JSON.stringify(DEFAULT_STORE));
    }
  }
  function saveStore(s) {
    localStorage.setItem('quotation_app_store', JSON.stringify(s));
  }
  window.api = {
    getSettings: async () => getStore().settings,
    saveSettings: async (settings) => {
      const s = getStore();
      s.settings = Object.assign({}, s.settings, settings);
      saveStore(s);
      return s.settings;
    },
    getProducts: async () => getStore().products,
    saveProducts: async (prods) => {
      const s = getStore();
      s.products = prods;
      saveStore(s);
      return s.products;
    },
    getDocuments: async () => getStore().documents,
    saveDocument: async (rec) => {
      const s = getStore();
      const idx = s.documents.findIndex(d => d.id === rec.id);
      if (idx >= 0) s.documents[idx] = rec;
      else s.documents.unshift(rec);
      saveStore(s);
      return s.documents;
    },
    deleteDocument: async (id) => {
      const s = getStore();
      s.documents = s.documents.filter(d => d.id !== id);
      saveStore(s);
      return s.documents;
    },
    nextNumber: async (type) => {
      const s = getStore();
      s.counters = s.counters || { Quotation: 0, Invoice: 0 };
      const cur = (s.counters[type] || 0) + 1;
      s.counters[type] = cur;
      saveStore(s);
      const prefix = type === 'Invoice' ? 'INV-' : 'Q-';
      return prefix + String(cur).padStart(4, '0');
    }
  };
}

/* ============ STATE ============ */
let currentRole = null;   // 'owner' | 'cashier'
let currentStaffName = '';
let products = [];
let items = [];
let docType = 'Quotation';
let currentSavedId = null;
let lang = 'ur';
let editingDocId = null;

/* ============ LABELS DICTIONARY ============ */
const LABELS = {
  ur: {
    appTitle: "استاد انور",
    loginSub: "کوٹیشن اور انوائس سسٹم",
    yourNameOptional: "آپ کا نام (اختیاری)",
    namePlaceholder: "مثلاً بلال",
    roleOwner: "مالک (Owner)",
    ownerDesc: "مکمل رسائی + پروڈکٹس + تمام ہسٹری",
    roleCashier: "کیشیئر (Cashier)",
    cashierDesc: "بل بنائیں + صرف آج کے اپنے ریکارڈز",
    langToggle: "اردو / EN",
    switchUser: "صارف تبدیل کریں",
    tabBill: "نیا بل",
    tabHistory: "ہسٹری (ریکارڈز)",
    tabProducts: "پروڈکٹس",
    tabSettings: "شاپ سیٹنگز",
    docTypeQuote: "کوٹیشن (Quotation)",
    docTypeInv: "انوائس (Invoice)",
    lblDate: "تاریخ",
    lblDocNum: "ڈاکومنٹ نمبر",
    lblTime: "وقت",
    lblStaffName: "سٹاف کا نام",
    lblProduct: "پروڈکٹ",
    lblRate: "قیمت / ریٹ",
    lblQty: "تعداد",
    btnAddItem: "+ شامل کریں",
    btnClearAll: "تمام آئٹمز صاف کریں",
    btnPrint: "🖨️ پرنٹ / PDF محفوظ کریں",
    btnSave: "💾 محفوظ کریں اور اگلا نمبر لیں",
    btnConvert: "↻ اس کوٹیشن کو انوائس میں تبدیل کریں",
    thTotal: "کل رقم",
    thRate: "ریٹ",
    thProduct: "پروڈکٹ",
    thQty: "تعداد",
    msgNoItems: "کوئی آئٹم شامل نہیں کیا گیا",
    lblTotalItemsQty: "کل آئٹمز / کل تعداد",
    lblGrandTotal: "میزان / کل",
    msgThanks: "آپ کے تعاون کا بہت شکریہ!",
    historyTitleOwner: "تمام محفوظ شدہ ریکارڈز",
    historyTitleCashier: "آج کے میرے اندراجات",
    filterAllTypes: "تمام اقسام",
    btnFilter: "فلٹر کریں",
    btnClearFilter: "فلٹر ختم کریں",
    manageProductsTitle: "پروڈکٹس اور قیمتوں کا انتظام",
    lblNewProdName: "نئی پروڈکٹ کا نام (اردو)",
    btnAddProduct: "+ پروڈکٹ شامل کریں",
    shopSettingsTitle: "دکان کی معلومات و سیٹنگز",
    lblShopName: "دکان کا نام (اردو)",
    lblPhone: "فون نمبر",
    lblAddress: "پتہ (اردو)",
    lblOwnerPin: "مالک کا پن کوڈ (بغیر پاسورڈ خالی چھوڑیں)",
    btnSaveSettings: "سیٹنگز محفوظ کریں",
    pinModalTitle: "مالک تصدیق (PIN)",
    pinModalSub: "جاری رکھنے کے لیے اپنا پن کوڈ درج کریں:",
    btnCancel: "منسوخ",
    btnLogin: "لاگ ان",
    editStaffTitle: "سٹاف کا نام تبدیل کریں",
    editStaffSub: "ڈاکومنٹ کے لیے سٹاف کا نام اپڈیٹ کریں: ",
    btnSave: "محفوظ کریں",
    emptyHist: "کوئی ریکارڈ نہیں ملا",
    btnEditStaff: "نام تبدیل",
    btnDelete: "حذف"
  },
  en: {
    appTitle: "Ustaad Anwar",
    loginSub: "Quotation & Invoice System",
    yourNameOptional: "Your Name (optional)",
    namePlaceholder: "e.g. Bilal",
    roleOwner: "Owner",
    ownerDesc: "Full access + products + all history",
    roleCashier: "Cashier",
    cashierDesc: "Create bills + today's own entries",
    langToggle: "اردو / EN",
    switchUser: "Switch User",
    tabBill: "New Bill",
    tabHistory: "History",
    tabProducts: "Products",
    tabSettings: "Shop Settings",
    docTypeQuote: "Quotation",
    docTypeInv: "Invoice",
    lblDate: "Date",
    lblDocNum: "Doc #",
    lblTime: "Time",
    lblStaffName: "Staff Name",
    lblProduct: "Product",
    lblRate: "Rate",
    lblQty: "Qty",
    btnAddItem: "+ Add",
    btnClearAll: "Clear all items",
    btnPrint: "🖨️ Print / Save as PDF",
    btnSave: "💾 Save & Get Next Number",
    btnConvert: "↻ Convert this Quotation to Invoice",
    thTotal: "Total",
    thRate: "Rate",
    thProduct: "Product",
    thQty: "Qty",
    msgNoItems: "No items added yet",
    lblTotalItemsQty: "Total Items/Quantity",
    lblGrandTotal: "Total",
    msgThanks: "Thank you for your business!",
    historyTitleOwner: "All Saved Documents (Owner view)",
    historyTitleCashier: "My Today's Entries",
    filterAllTypes: "All types",
    btnFilter: "Filter",
    btnClearFilter: "Clear",
    manageProductsTitle: "Manage Products & Prices",
    lblNewProdName: "New Product Name (Urdu)",
    btnAddProduct: "+ Add Product",
    shopSettingsTitle: "Shop Settings",
    lblShopName: "Shop Name (Urdu)",
    lblPhone: "Phone",
    lblAddress: "Address (Urdu)",
    lblOwnerPin: "Owner PIN (leave blank for no password)",
    btnSaveSettings: "Save Settings",
    pinModalTitle: "Owner Authentication",
    pinModalSub: "Please enter your Owner PIN to continue:",
    btnCancel: "Cancel",
    btnLogin: "Login",
    editStaffTitle: "Edit Staff Name",
    editStaffSub: "Update the staff name for document: ",
    btnSave: "Save",
    emptyHist: "No documents found",
    btnEditStaff: "Edit Staff",
    btnDelete: "Delete"
  }
};

function toggleLang(){
  lang = lang === 'ur' ? 'en' : 'ur';
  applyLabels();
}

function applyLabels(){
  const L = LABELS[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if(key === 'historyTitle'){
      el.textContent = currentRole === 'owner' ? L.historyTitleOwner : L.historyTitleCashier;
    } else if(L[key]){
      el.textContent = L[key];
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if(L[key]) el.placeholder = L[key];
  });

  // Sync doc title in receipt preview
  const rDoc = document.getElementById('rDocTitle');
  if(rDoc) rDoc.textContent = docType;
}

/* ============ DATE / TIME RESET ============ */
function resetDateTime(){
  const now = new Date();
  const d = document.getElementById('docDate');
  const t = document.getElementById('docTime');
  if(d) d.value = now.toISOString().slice(0, 10);
  if(t) t.value = now.toTimeString().slice(0, 5);
}

/* ============ LOGIN / LOGOUT & OWNER PIN ============ */
async function login(role){
  if(role === 'owner'){
    const s = await window.api.getSettings();
    if(s && s.ownerPin && s.ownerPin.trim() !== ''){
      openOwnerPinModal();
      return;
    }
  }
  completeLogin(role);
}

function openOwnerPinModal(){
  const modal = document.getElementById('ownerPinModal');
  const input = document.getElementById('ownerPinInput');
  input.value = '';
  modal.style.display = 'flex';
  setTimeout(() => input.focus(), 50);
}

function cancelOwnerPin(){
  document.getElementById('ownerPinModal').style.display = 'none';
}

async function submitOwnerPin(){
  const input = document.getElementById('ownerPinInput');
  const entered = input.value.trim();
  const s = await window.api.getSettings();
  if(s && s.ownerPin && s.ownerPin.trim() === entered){
    document.getElementById('ownerPinModal').style.display = 'none';
    completeLogin('owner');
  } else {
    alert(lang === 'ur' ? 'غلط پن کوڈ درج کیا گیا ہے!' : 'Incorrect Owner PIN!');
    input.value = '';
    input.focus();
  }
}

async function completeLogin(role){
  currentRole = role;
  currentStaffName = document.getElementById('loginName').value.trim() || (role === 'owner' ? 'Owner' : 'Cashier');

  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('appScreen').style.display = 'block';
  document.getElementById('roleBadge').textContent = role === 'owner' ? 'Owner' : 'Cashier';
  document.getElementById('docUser').value = currentStaffName;

  document.querySelectorAll('.owner-only').forEach(el=>{
    el.style.display = (role === 'owner') ? '' : 'none';
  });
  document.getElementById('ownerFilters').style.display = (role === 'owner') ? 'flex' : 'none';

  await loadSettings();
  await loadProducts();
  showTab('bill');
  applyLabels();
  resetDateTime();
  render();
  syncHeader();
}

function logout(){
  currentRole = null;
  currentSavedId = null;
  items = [];
  document.getElementById('loginName').value = '';
  document.getElementById('docInv').value = '';
  document.getElementById('appScreen').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
}

/* ============ TABS ============ */
function showTab(name){
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  document.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none');
  const panel = document.getElementById('tab-' + name);
  if(panel) panel.style.display = 'block';
  if(name === 'history') renderHistory();
  if(name === 'products') renderProductsTable();
  if(name === 'settings') loadSettingsForm();
}

/* ============ SETTINGS ============ */
async function loadSettings(){
  const s = await window.api.getSettings();
  document.getElementById('shopTitleTop').textContent = s.shopName || "استاد انور";
  document.getElementById('rName').textContent = s.shopName || "استاد انور";
  document.getElementById('rAddr').textContent = s.shopAddr || "فتح خان بازار بہاولپور";
  document.getElementById('rPhone').textContent = s.shopPhone || "Ph. 0622-882554";
  window._settings = s;
}

function loadSettingsForm(){
  const s = window._settings || {};
  document.getElementById('setShopName').value = s.shopName || '';
  document.getElementById('setShopPhone').value = s.shopPhone || '';
  document.getElementById('setShopAddr').value = s.shopAddr || '';
  document.getElementById('setOwnerPin').value = s.ownerPin || '';
}

async function saveSettingsForm(){
  const s = {
    shopName: document.getElementById('setShopName').value.trim(),
    shopPhone: document.getElementById('setShopPhone').value.trim(),
    shopAddr: document.getElementById('setShopAddr').value.trim(),
    ownerPin: document.getElementById('setOwnerPin').value.trim()
  };
  await window.api.saveSettings(s);
  await loadSettings();
  alert(lang === 'ur' ? 'سیٹنگز محفوظ ہو گئیں' : 'Settings saved successfully.');
}

/* ============ PRODUCTS (billing dropdown) ============ */
async function loadProducts(){
  products = await window.api.getProducts();
  const sel = document.getElementById('prodSelect');
  sel.innerHTML = '';
  products.forEach((p,i)=>{
    const o = document.createElement('option');
    o.value = i;
    o.textContent = p.name;
    sel.appendChild(o);
  });
  syncRate();
}

function syncRate(){
  const sel = document.getElementById('prodSelect');
  if(products[sel.value]) {
    document.getElementById('prodRate').value = products[sel.value].rate;
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('prodSelect').addEventListener('change', syncRate);
});

/* ============ PRODUCTS MANAGEMENT (owner only) ============ */
function renderProductsTable(){
  const body = document.getElementById('prodTableBody');
  const L = LABELS[lang];
  body.innerHTML = products.map((p,idx) => `
    <tr>
      <td><input class="prod-name-input" value="${(p.name||'').replace(/"/g,'&quot;')}" onchange="updateProductField(${idx},'name',this.value)"></td>
      <td><input class="rate-input" type="number" step="0.01" value="${p.rate}" onchange="updateProductField(${idx},'rate',parseFloat(this.value)||0)"></td>
      <td><button class="btn btn-danger" onclick="deleteProduct(${idx})">${L.btnDelete}</button></td>
    </tr>`).join('');
}

async function updateProductField(idx, field, value){
  if(products[idx]){
    products[idx][field] = value;
    await window.api.saveProducts(products);
    await loadProducts();
  }
}

async function deleteProduct(idx){
  const msg = lang === 'ur' ? 'کیا آپ واقعی اس پروڈکٹ کو حذف کرنا چاہتے ہیں؟' : 'Delete this product?';
  if(!confirm(msg)) return;
  products.splice(idx,1);
  await window.api.saveProducts(products);
  await loadProducts();
  renderProductsTable();
}

async function addProduct(){
  const nameInput = document.getElementById('newProdName');
  const rateInput = document.getElementById('newProdRate');
  const name = nameInput.value.trim();
  const rate = parseFloat(rateInput.value) || 0;
  if(!name){
    alert(lang === 'ur' ? 'پروڈکٹ کا نام درج کریں' : 'Please enter a product name');
    return;
  }
  const maxId = products.reduce((m,p)=>Math.max(m,p.id||0),0);
  products.push({ id: maxId+1, name, rate });
  await window.api.saveProducts(products);
  await loadProducts();
  renderProductsTable();
  nameInput.value = '';
  rateInput.value = '';
}

/* ============ DOC TYPE ============ */
function setDocType(type){
  docType = type;
  document.getElementById('btnTypeQuote').classList.toggle('active', type==='Quotation');
  document.getElementById('btnTypeInv').classList.toggle('active', type==='Invoice');
  document.getElementById('rDocTitle').textContent = type;
  document.getElementById('convertBtn').style.display = (type==='Quotation' && currentSavedId) ? 'block' : 'none';
  if(!currentSavedId){ document.getElementById('docInv').value = ''; }
  syncHeader();
}

/* ============ ITEMS ============ */
function addItem(){
  const sel = document.getElementById('prodSelect');
  const p = products[sel.value];
  if(!p) return;
  const rate = parseFloat(document.getElementById('prodRate').value) || 0;
  const qty = parseInt(document.getElementById('prodQty').value) || 1;
  items.push({ name: p.name, rate, qty });
  document.getElementById('prodQty').value = 1;
  render();
}

function removeItem(idx){
  items.splice(idx,1);
  render();
}

function clearAll(){
  items = [];
  currentSavedId = null;
  document.getElementById('docInv').value = '';
  document.getElementById('convertBtn').style.display = 'none';
  resetDateTime();
  render();
  syncHeader();
}

function render(){
  const list = document.getElementById('itemList');
  const L = LABELS[lang];
  list.innerHTML = items.map((it,idx) => `
    <div class="item-row">
      <div class="info"><div class="name">${it.name}</div><div class="sub">${L.lblRate} ${it.rate} × ${L.lblQty} ${it.qty} = ${(it.rate*it.qty).toFixed(2)}</div></div>
      <button class="btn btn-danger" onclick="removeItem(${idx})">✕</button>
    </div>`).join('');

  const body = document.getElementById('rBody');
  if(items.length === 0){
    body.innerHTML = `<tr><td colspan="4" class="empty-msg">${L.msgNoItems}</td></tr>`;
  } else {
    body.innerHTML = items.map(it => `
      <tr>
        <td class="c-total">${(it.rate*it.qty).toFixed(2).replace(/\.00$/,'')}</td>
        <td class="c-rate">${it.rate}</td>
        <td class="c-prod">${it.name}</td>
        <td class="c-qty">${it.qty}</td>
      </tr>`).join('');
  }

  const totalQty = items.reduce((s,it)=>s+it.qty,0);
  const totalAmt = items.reduce((s,it)=>s+it.rate*it.qty,0);
  document.getElementById('tQty').innerHTML = `${items.length}/${totalQty}<br><span data-i18n="lblTotalItemsQty">${L.lblTotalItemsQty}</span>`;
  document.getElementById('tAmt').textContent = totalAmt.toFixed(2).replace(/\.00$/,'');
}

/* ============ HEADER SYNC ============ */
function syncHeader(){
  document.getElementById('mUser').textContent = 'Staff: ' + (document.getElementById('docUser').value || '—');
  document.getElementById('mInv').textContent = 'Doc#: ' + (document.getElementById('docInv').value || '—');
  const d = document.getElementById('docDate').value;
  document.getElementById('mDate').textContent = 'Date: ' + (d ? new Date(d).toLocaleDateString('en-GB').replace(/\//g,'-') : '—');
  const t = document.getElementById('docTime').value;
  document.getElementById('mTime').textContent = 'Time: ' + (t || '—');
}

document.addEventListener('DOMContentLoaded', ()=>{
  ['docDate','docInv','docTime','docUser'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.addEventListener('input', syncHeader);
  });
  resetDateTime();
});

/* ============ SAVE / CONVERT / PRINT ============ */
async function saveDocument(isAutoSave = false){
  if(items.length === 0){
    alert(lang === 'ur' ? 'محفوظ کرنے سے پہلے کم از کم ایک آئٹم شامل کریں۔' : 'Add at least one item before saving.');
    return null;
  }

  let number = document.getElementById('docInv').value;
  if(!currentSavedId || !number){
    try {
      number = await window.api.nextNumber(docType);
      document.getElementById('docInv').value = number;
    } catch(e) {
      console.error('Failed to generate number:', e);
    }
  }
  syncHeader();

  const totalAmt = items.reduce((s,it)=>s+it.rate*it.qty,0);
  const record = {
    id: currentSavedId || (Date.now() + '-' + Math.random().toString(36).slice(2,7)),
    type: docType,
    number: document.getElementById('docInv').value || number,
    date: document.getElementById('docDate').value,
    time: document.getElementById('docTime').value,
    staffName: document.getElementById('docUser').value,
    role: currentRole,
    items: JSON.parse(JSON.stringify(items)),
    total: totalAmt
  };

  await window.api.saveDocument(record);
  await renderHistory();

  const savedNumber = record.number;

  if(!isAutoSave){
    const msg = (docType === 'Invoice' ? 'Invoice' : 'Quotation') + ' saved as ' + savedNumber;
    alert(lang === 'ur' ? `${docType === 'Invoice' ? 'انوائس' : 'کوٹیشن'} نمبر ${savedNumber} کے نام سے محفوظ ہو گئی` : msg);

    // Reset form to clean state ready for next bill
    items = [];
    currentSavedId = null;
    document.getElementById('docInv').value = '';
    document.getElementById('convertBtn').style.display = 'none';
    resetDateTime();
    render();
    syncHeader();
  } else {
    currentSavedId = record.id;
    document.getElementById('convertBtn').style.display = (docType==='Quotation') ? 'block' : 'none';
  }

  return record;
}

async function convertToInvoice(){
  if(!currentSavedId){
    alert(lang === 'ur' ? 'پہلے اس کوٹیشن کو محفوظ کریں۔' : 'Save this quotation first.');
    return;
  }
  const invNumber = await window.api.nextNumber('Invoice');
  currentSavedId = Date.now() + '-' + Math.random().toString(36).slice(2,7);
  docType = 'Invoice';
  document.getElementById('docInv').value = invNumber;
  setDocType('Invoice');
  await saveDocument(false);
}

async function printBill(){
  if(items.length === 0){
    alert(lang === 'ur' ? 'بل خالی ہے۔ پرنٹ کرنے سے پہلے کم از کم ایک آئٹم شامل کریں۔' : 'Cannot print an empty bill. Please add at least one item.');
    return;
  }

  // Auto-save if not saved yet to ensure history tracking
  if(!currentSavedId){
    await saveDocument(true);
  }

  const docNum = document.getElementById('docInv').value || docType;
  const originalTitle = document.title;
  document.title = docNum;

  window.print();

  document.title = originalTitle;
}

/* ============ HISTORY ============ */
function todayStr(){
  const d = new Date();
  return d.toISOString().slice(0,10);
}

async function renderHistory(){
  applyLabels();
  let docs = await window.api.getDocuments();
  const L = LABELS[lang];

  if(currentRole === 'cashier'){
    const today = todayStr();
    docs = docs.filter(d => d.role === 'cashier' && d.staffName === currentStaffName && (d.date || '').slice(0,10) === today);
  } else {
    const typeFilter = document.getElementById('filterType').value;
    const dateFilter = document.getElementById('filterDate').value;
    if(typeFilter) docs = docs.filter(d => d.type === typeFilter);
    if(dateFilter) docs = docs.filter(d => (d.date || '').slice(0,10) === dateFilter);
  }

  const el = document.getElementById('historyListFull');
  if(docs.length === 0){
    el.innerHTML = `<div class="empty-hist">${L.emptyHist}</div>`;
    return;
  }

  el.innerHTML = docs.map(d => `
    <div class="hist-card">
      <div class="h-main" onclick="loadRecord('${d.id}')">
        <b><span class="${d.type==='Invoice'?'tag-inv':'tag-quote'}">${d.type}</span>${d.number}</b>
        <span>${d.date || ''} ${d.time || ''} — ${d.staffName || ''} — ${L.thTotal}: ${d.total.toFixed(2)}</span>
      </div>
      <div class="hist-actions">
        ${currentRole === 'owner' ? `<button class="btn btn-secondary small" onclick="event.stopPropagation(); openEditStaffModal('${d.id}')">${L.btnEditStaff}</button>` : ''}
        ${currentRole === 'owner' ? `<button class="btn btn-danger small" onclick="event.stopPropagation(); deleteRecord('${d.id}')">${L.btnDelete}</button>` : ''}
      </div>
    </div>`).join('');
}

function clearFilter(){
  document.getElementById('filterType').value = '';
  document.getElementById('filterDate').value = '';
  renderHistory();
}

async function loadRecord(id){
  const docs = await window.api.getDocuments();
  const rec = docs.find(d => d.id === id);
  if(!rec) return;
  currentSavedId = rec.id;
  docType = rec.type;
  items = JSON.parse(JSON.stringify(rec.items));
  document.getElementById('docInv').value = rec.number;
  document.getElementById('docDate').value = rec.date;
  document.getElementById('docTime').value = rec.time;
  document.getElementById('docUser').value = rec.staffName;
  setDocType(rec.type);
  render();
  syncHeader();
  showTab('bill');
}

async function deleteRecord(id){
  const msg = lang === 'ur' ? 'کیا آپ واقعی اس ڈاکومنٹ کو حذف کرنا چاہتے ہیں؟' : 'Delete this document?';
  if(!confirm(msg)) return;
  await window.api.deleteDocument(id);
  if(currentSavedId === id){
    currentSavedId = null;
  }
  renderHistory();
}

/* ============ EDIT STAFF NAME (Owner) ============ */
async function openEditStaffModal(id){
  const docs = await window.api.getDocuments();
  const rec = docs.find(d => d.id === id);
  if(!rec) return;
  editingDocId = id;
  document.getElementById('editStaffDocNum').textContent = rec.number;
  const input = document.getElementById('editStaffInput');
  input.value = rec.staffName || '';
  document.getElementById('editStaffModal').style.display = 'flex';
  setTimeout(() => input.focus(), 50);
}

function cancelEditStaff(){
  editingDocId = null;
  document.getElementById('editStaffModal').style.display = 'none';
}

async function submitEditStaff(){
  if(!editingDocId) return;
  const newStaffName = document.getElementById('editStaffInput').value.trim();
  const docs = await window.api.getDocuments();
  const rec = docs.find(d => d.id === editingDocId);
  if(rec){
    rec.staffName = newStaffName;
    await window.api.saveDocument(rec);
    await renderHistory();
    alert(lang === 'ur' ? 'سٹاف کا نام تبدیل کر دیا گیا' : 'Staff name updated successfully.');
  }
  cancelEditStaff();
}
