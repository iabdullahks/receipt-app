// =========================================================
// USTAAD ANWAR - QUOTATION & INVOICE APPLICATION (APP.JS)
// =========================================================

// Browser fallback if running directly in a web browser (outside Electron)
if (typeof window.api === 'undefined') {
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
    documents: [],
    counters: { Quotation: 0, Invoice: 0 }
  };

  function getStore() {
    try {
      const data = localStorage.getItem('quotation_app_store');
      if (!data) return JSON.parse(JSON.stringify(DEFAULT_STORE));
      const s = Object.assign({}, DEFAULT_STORE, JSON.parse(data));
      if (!s.settings) s.settings = Object.assign({}, DEFAULT_STORE.settings);
      if (!s.settings.ownerPin) s.settings.ownerPin = "1234";
      if (!s.products || s.products.length === 0) s.products = DEFAULT_PRODUCTS;
      else {
        s.products = s.products.map((p, idx) => ({
          id: p.id || (idx + 1),
          sku: p.sku || `SKU-${String(p.id || idx + 1).padStart(3, '0')}`,
          name: p.name || 'Product ' + (idx + 1),
          category: p.category || 'General',
          rate: Number(p.rate) || 0,
          stock: p.stock !== undefined ? Number(p.stock) : 50
        }));
      }
      return s;
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

/* ============ APPLICATION STATE ============ */
let currentRole = null;              // 'owner' | 'cashier'
let currentStaffName = '';
let products = [];
let items = [];
let docType = 'Quotation';
let currentSavedId = null;
let lang = 'ur';
let editingDocId = null;
let windowSettings = {};

// Security & PIN state
let adminSessionUnlocked = false;    // Tracks owner session verification
let pendingPinCallback = null;       // Callback after PIN verification
let pendingPinAction = '';
let revenuePrivacyUnlocked = false;  // Toggle revenue masking

// Combobox autocomplete state
let selectedProduct = null;
let comboboxOpen = false;
let activeComboboxIndex = -1;
let filteredProducts = [];

// Filter state
let invoiceDatePill = 'all';
let quoteDatePill = 'all';
let cashierDatePill = 'all';

/* ============ DATE & TIME UTILITIES ============ */
function getLocalDateStr(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getLocalTimeStr(d = new Date()) {
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return '—';
  const cleanStr = String(dateStr).split('T')[0];
  const parts = cleanStr.split('-');
  if (parts.length === 3) {
    const [y, m, d] = parts;
    return `${d}-${m}-${y}`; // DD-MM-YYYY format
  }
  return cleanStr;
}

function resetDateTime() {
  const d = document.getElementById('docDate');
  const t = document.getElementById('docTime');
  if (d) d.value = getLocalDateStr();
  if (t) t.value = getLocalTimeStr();
  syncHeader();
}

/* ============ LABELS DICTIONARY ============ */
const LABELS = {
  ur: {
    appTitle: "استاد انور",
    loginSub: "کوٹیشن اور انوائس مینجمنٹ سسٹم",
    yourNameOptional: "سٹاف کا نام (اختیاری)",
    namePlaceholder: "مثلاً بلال / Bilal",
    roleOwner: "Owner (مالک)",
    ownerDesc: "مکمل رسائی + انوینٹری + رپورٹس + سیٹنگز (4-Digit PIN)",
    roleCashier: "Cashier (کیشیئر)",
    cashierDesc: "بل بنائیں + کیشیئر ہسٹری + پرنٹ انوائس",
    langToggle: "اردو / EN",
    switchUser: "صارف تبدیل کریں",
    tabBill: "📝 نیا بل",
    tabInvoices: "🧾 فروخت انوائسز",
    tabQuotations: "📋 کوٹیشنز",
    tabCashierHistory: "👤 کیشیئر ہسٹری",
    tabProducts: "📦 پروڈکٹس اور انوینٹری",
    tabSettings: "⚙️ شاپ سیٹنگز",
    docTypeQuote: "📋 کوٹیشن (Quotation)",
    docTypeInv: "🧾 انوائس (Invoice)",
    lblDate: "تاریخ (Date)",
    lblDocNum: "ڈاکومنٹ نمبر (Doc #)",
    lblTime: "وقت (Time)",
    lblStaffName: "کیشیئر / سٹاف کا نام",
    lblSearchProduct: "پروڈکٹ تلاش کریں (نام یا SKU)",
    btnQuickAdd: "+ نئی پروڈکٹ",
    lblRate: "قیمت / ریٹ (Rs.)",
    lblQty: "تعداد (Qty)",
    btnAddItem: "+ شامل کریں",
    itemsInBill: "بل میں شامل اشیاء",
    btnClearAll: "تمام اشیاء صاف کریں",
    btnPrint: "🖨️ پرنٹ / PDF محفوظ کریں",
    btnSave: "💾 محفوظ کریں اور اگلا نمبر لیں",
    btnConvert: "↻ اس کوٹیشن کو انوائس میں تبدیل کریں",
    thTotal: "کل رقم",
    thRate: "ریٹ",
    thProduct: "پروڈکٹ",
    thQty: "تعداد",
    thSku: "SKU",
    thCategory: "کیٹیگری",
    thStock: "سٹاک",
    thActions: "اقدامات",
    msgNoItems: "کوئی آئٹم شامل نہیں کیا گیا",
    lblTotalItemsQty: "کل اشیاء / کل تعداد",
    lblGrandTotal: "میزان / Total (Rs.)",
    msgThanks: "آپ کے تعاون کا بہت شکریہ!",
    invoicesTitle: "فروخت انوائسز ہسٹری",
    invoicesSub: "تمام محفوظ شدہ سیلز انوائسز کا ریکارڈ",
    totalInvoicesCount: "کل انوائسز",
    totalRevenueLabel: "کل سیلز آمدنی",
    quotationsTitle: "کوٹیشنز کا ریکارڈ",
    quotationsSub: "تیار کردہ تخمینہ جات اور کوٹیشنز",
    totalQuotationsCount: "کل کوٹیشنز",
    totalQuoteValue: "تخمینی کل رقم",
    cashierHistoryTitle: "کیشیئر سرگرمی اور سیلز ریکارڈ",
    cashierHistorySub: "ہر کیشیئر کی انوائسز اور سیلز کی تفصیلات",
    cashierBillsCount: "کل بلز تعداد",
    cashierRevenueCount: "وصول شدہ سیلز",
    cashierUnitsCount: "کل بیچی گئی تعداد",
    lblSelectCashier: "کیشیئر منتخب کریں:",
    allCashiers: "تمام کیشیئرز (All)",
    lblFilterDate: "تاریخ:",
    pillAll: "تمام (All)",
    pillToday: "آج (Today)",
    pillYesterday: "گزشتہ کل (Yesterday)",
    pillMonth: "اس ماہ (This Month)",
    btnClearFilter: "صاف کریں",
    manageProductsTitle: "پروڈکٹس اور انوینٹری کا انتظام",
    manageProductsSub: "نئے آئٹمز، قیمتیں، سٹاک، اور کیٹیگریز اپڈیٹ کریں",
    totalProductsCount: "کل پروڈکٹس",
    totalStockUnits: "کل سٹاک یونٹس",
    addNewProductTitle: "+ نیا آئٹم شامل کریں",
    lblProdName: "پروڈکٹ کا نام *",
    lblSku: "SKU / کوڈ",
    lblCategory: "کیٹیگری",
    lblStock: "سٹاک تعداد *",
    btnAddProduct: "+ ڈیٹا بیس میں محفوظ کریں",
    shopSettingsTitle: "دکان کی معلومات اور سیٹنگز",
    shopSettingsSub: "نام، پتہ، فون نمبر، دکان کا لوگو اور 4-Digit Owner PIN تبدیل کریں",
    shopBrandingTitle: "🏢 دکان کی معلومات اور برانڈنگ",
    lblShopName: "دکان کا نام (Shop Name) *",
    lblShopSub: "ذیلی عنوان / ٹیگ لائن",
    lblAddress: "پتہ (Address)",
    lblPhone: "رابطہ / فون نمبر",
    lblShopLogo: "دکان کا لوگو (Shop Logo)",
    noLogoYet: "لوگو موجود نہیں",
    btnUploadLogo: "📁 نیا لوگو منتخب کریں",
    btnRemoveLogo: "حذف لوگو",
    btnSaveSettings: "💾 سیٹنگز محفوظ کریں",
    pinSecurityTitle: "🔒 4-Digit Owner PIN سیکیورٹی",
    pinSecurityHint: "حساس کاموں (سیلز آمدنی، قیمتوں کی تبدیلی، سیٹنگز، اور حذف) کے لیے 4 ہندسوں کا پن کوڈ استعمال کریں۔",
    pinProtectionActive: "4-Digit PIN پروٹیکشن فعال ہے",
    pinCurrentHint: "ڈیفالٹ پن کوڈ 1234 ہے، نیچے سے تبدیل کریں:",
    lblCurrentPin: "موجودہ 4-Digit PIN",
    lblNewPin: "نیا 4-Digit PIN (صرف 4 ہندسے)",
    lblConfirmPin: "نئے PIN کی تصدیق کریں",
    btnUpdatePin: "🔑 4-Digit PIN اپڈیٹ کریں",
    pinModalTitle: "مالک تصدیق (4-Digit PIN)",
    pinModalSub: "حساس کارروائی جاری رکھنے کے لیے اپنا 4 ہندسوں کا پن کوڈ درج کریں:",
    btnCancel: "منسوخ (Cancel)",
    btnVerifyPin: "تصدیق کریں (Unlock)",
    quickAddTitle: "+ فوری نئی پروڈکٹ شامل کریں",
    editStaffTitle: "سٹاف کا نام تبدیل کریں",
    editStaffSub: "ڈاکومنٹ کے لیے سٹاف کا نام اپڈیٹ کریں: ",
    adminUnlocked: "Admin Unlocked",
    adminLocked: "Admin Locked"
  },
  en: {
    appTitle: "Ustaad Anwar",
    loginSub: "Quotation & Invoice Management System",
    yourNameOptional: "Staff Name (optional)",
    namePlaceholder: "e.g. Bilal",
    roleOwner: "Owner",
    ownerDesc: "Full access + Inventory + Reports + Settings (4-Digit PIN)",
    roleCashier: "Cashier",
    cashierDesc: "Create bills + Cashier history + Print invoice",
    langToggle: "اردو / EN",
    switchUser: "Switch User",
    tabBill: "📝 New Bill",
    tabInvoices: "🧾 Invoices",
    tabQuotations: "📋 Quotations",
    tabCashierHistory: "👤 Cashier History",
    tabProducts: "📦 Products & Stock",
    tabSettings: "⚙️ Shop Settings",
    docTypeQuote: "📋 Quotation",
    docTypeInv: "🧾 Invoice",
    lblDate: "Date",
    lblDocNum: "Doc #",
    lblTime: "Time",
    lblStaffName: "Cashier / Staff Name",
    lblSearchProduct: "Search Product (Name / SKU)",
    btnQuickAdd: "+ New Product",
    lblRate: "Rate / Price (Rs.)",
    lblQty: "Quantity",
    btnAddItem: "+ Add Item",
    itemsInBill: "Items in current bill",
    btnClearAll: "Clear All Items",
    btnPrint: "🖨️ Print / Save as PDF",
    btnSave: "💾 Save & Get Next Number",
    btnConvert: "↻ Convert Quotation to Invoice",
    thTotal: "Total",
    thRate: "Rate",
    thProduct: "Product",
    thQty: "Qty",
    thSku: "SKU",
    thCategory: "Category",
    thStock: "Stock",
    thActions: "Actions",
    msgNoItems: "No items added yet",
    lblTotalItemsQty: "Total Items / Quantity",
    lblGrandTotal: "Grand Total (Rs.)",
    msgThanks: "Thank you for your business!",
    invoicesTitle: "Sales Invoices History",
    invoicesSub: "Strictly generated sales invoices records",
    totalInvoicesCount: "Total Invoices",
    totalRevenueLabel: "Total Sales Revenue",
    quotationsTitle: "Quotations Section",
    quotationsSub: "Prepared quotations & estimates with 1-click invoice conversion",
    totalQuotationsCount: "Total Quotations",
    totalQuoteValue: "Total Quote Value",
    cashierHistoryTitle: "Cashier Activity & Sales Logs",
    cashierHistorySub: "Detailed logs and activity for each cashier",
    cashierBillsCount: "Total Bills",
    cashierRevenueCount: "Sales Revenue",
    cashierUnitsCount: "Total Units Sold",
    lblSelectCashier: "Select Cashier:",
    allCashiers: "All Cashiers",
    lblFilterDate: "Date:",
    pillAll: "All Time",
    pillToday: "Today",
    pillYesterday: "Yesterday",
    pillMonth: "This Month",
    btnClearFilter: "Clear",
    manageProductsTitle: "Manage Products & Inventory",
    manageProductsSub: "Add items, update stock, prices, categories & SKUs",
    totalProductsCount: "Total Products",
    totalStockUnits: "Total Stock Units",
    addNewProductTitle: "+ Add New Product",
    lblProdName: "Product Name *",
    lblSku: "SKU / Code",
    lblCategory: "Category",
    lblStock: "Initial Stock *",
    btnAddProduct: "+ Save to Database",
    shopSettingsTitle: "Shop Settings & Branding",
    shopSettingsSub: "Update name, address, contact, logo, and 4-Digit Owner PIN",
    shopBrandingTitle: "🏢 Shop Details & Branding",
    lblShopName: "Shop Name *",
    lblShopSub: "Subtitle / Tagline",
    lblAddress: "Shop Address",
    lblPhone: "Contact / Phone Number",
    lblShopLogo: "Shop Logo",
    noLogoYet: "No logo uploaded",
    btnUploadLogo: "📁 Choose Logo Image",
    btnRemoveLogo: "Remove Logo",
    btnSaveSettings: "💾 Save Settings",
    pinSecurityTitle: "🔒 4-Digit Owner PIN Security",
    pinSecurityHint: "Use a 4-digit PIN for sensitive actions: viewing revenue, modifying prices, deleting records, and editing settings.",
    pinProtectionActive: "4-Digit PIN Protection is Active",
    pinCurrentHint: "Default PIN is 1234. Change it below:",
    lblCurrentPin: "Current 4-Digit PIN",
    lblNewPin: "New 4-Digit PIN (4 digits only)",
    lblConfirmPin: "Confirm New PIN",
    btnUpdatePin: "🔑 Update 4-Digit PIN",
    pinModalTitle: "Owner Authentication (4-Digit PIN)",
    pinModalSub: "Please enter your 4-digit Owner PIN to proceed:",
    btnCancel: "Cancel",
    btnVerifyPin: "Unlock",
    quickAddTitle: "+ Quick Add New Product",
    editStaffTitle: "Edit Staff Name",
    editStaffSub: "Update staff name for document: ",
    adminUnlocked: "Admin Unlocked",
    adminLocked: "Admin Locked"
  }
};

function toggleLang() {
  lang = lang === 'ur' ? 'en' : 'ur';
  applyLabels();
  renderInvoices();
  renderQuotations();
  renderCashierHistory();
  renderProductsTable();
}

function applyLabels() {
  const L = LABELS[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (L[key]) el.textContent = L[key];
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (L[key]) el.placeholder = L[key];
  });

  const rDoc = document.getElementById('rDocTitle');
  if (rDoc) rDoc.textContent = docType;

  updateAdminSessionBadge();
}

/* ============ TOAST NOTIFICATIONS ============ */
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 200);
  }, 2800);
}

/* ============ SETTINGS & BRANDING ============ */
async function loadSettings() {
  try {
    const s = await window.api.getSettings();
    windowSettings = s || {};

    const shopName = s.shopName || "استاد انور";
    const shopSub = s.shopSub || "سینیٹری اینڈ ہارڈ ویئر سٹور";
    const shopAddr = s.shopAddr || "فتح خان بازار بہاولپور";
    const shopPhone = s.shopPhone || "Ph. 0622-882554";
    const shopLogo = s.shopLogo || "";

    // App topbar
    document.getElementById('shopTitleTop').textContent = shopName;
    document.getElementById('shopSubTop').textContent = shopSub;

    // Login screen
    document.getElementById('loginShopTitle').textContent = shopName;
    document.getElementById('loginShopSub').textContent = shopSub;

    // Receipt preview
    document.getElementById('rName').textContent = shopName;
    document.getElementById('rSub').textContent = shopSub;
    document.getElementById('rAddr').textContent = shopAddr;
    document.getElementById('rPhone').textContent = shopPhone;

    // Logos
    const logos = ['loginLogo', 'topbarLogo', 'rLogo', 'logoPreviewImg'];
    logos.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (shopLogo) {
        el.src = shopLogo;
        el.style.display = 'block';
      } else {
        el.src = '';
        el.style.display = 'none';
      }
    });

    const placeholder = document.getElementById('logoPlaceholderText');
    const removeBtn = document.getElementById('btnRemoveLogo');
    if (placeholder) placeholder.style.display = shopLogo ? 'none' : 'block';
    if (removeBtn) removeBtn.style.display = shopLogo ? 'inline-block' : 'none';

  } catch (e) {
    console.error('Failed to load settings:', e);
  }
}

function loadSettingsForm() {
  const s = windowSettings || {};
  document.getElementById('setShopName').value = s.shopName || '';
  document.getElementById('setShopSub').value = s.shopSub || '';
  document.getElementById('setShopAddr').value = s.shopAddr || '';
  document.getElementById('setShopPhone').value = s.shopPhone || '';

  // Clear PIN change inputs
  document.getElementById('currentOwnerPinInput').value = '';
  document.getElementById('newOwnerPinInput').value = '';
  document.getElementById('confirmOwnerPinInput').value = '';
}

async function saveSettingsForm() {
  requireOwnerPin('save settings', async () => {
    const s = {
      shopName: document.getElementById('setShopName').value.trim() || "استاد انور",
      shopSub: document.getElementById('setShopSub').value.trim(),
      shopAddr: document.getElementById('setShopAddr').value.trim(),
      shopPhone: document.getElementById('setShopPhone').value.trim(),
      shopLogo: windowSettings.shopLogo || ""
    };
    await window.api.saveSettings(s);
    await loadSettings();
    showToast(lang === 'ur' ? 'دکان کی سیٹنگز کامیابی سے محفوظ ہو گئیں' : 'Shop settings saved successfully.');
  });
}

function handleLogoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    alert(lang === 'ur' ? 'لوگو کی فائل کا سائز 2MB سے کم ہونا چاہیے' : 'Logo image must be under 2MB.');
    return;
  }

  const reader = new FileReader();
  reader.onload = async (e) => {
    const dataUri = e.target.result;
    windowSettings.shopLogo = dataUri;
    await window.api.saveSettings({ shopLogo: dataUri });
    await loadSettings();
    showToast(lang === 'ur' ? 'لوگو اپڈیٹ ہو گیا' : 'Shop logo updated.');
  };
  reader.readAsDataURL(file);
}

async function removeLogo() {
  requireOwnerPin('remove logo', async () => {
    windowSettings.shopLogo = "";
    await window.api.saveSettings({ shopLogo: "" });
    await loadSettings();
    showToast(lang === 'ur' ? 'لوگو حذف کر دیا گیا' : 'Logo removed.');
  });
}

/* ============ 4-DIGIT OWNER PIN SECURITY ============ */
function validate4DigitPin(pin) {
  return /^\d{4}$/.test(pin);
}

function requireOwnerPin(actionName, onAuthorized) {
  if (currentRole !== 'owner') {
    alert(lang === 'ur' ? 'یہ کارروائی صرف مالک (Owner) کر سکتا ہے' : 'This action is restricted to Owner.');
    return;
  }

  // If session already verified, proceed immediately
  if (adminSessionUnlocked) {
    onAuthorized();
    return;
  }

  pendingPinAction = actionName;
  pendingPinCallback = onAuthorized;
  openPinModal(actionName);
}

function openPinModal(actionName = '') {
  const modal = document.getElementById('ownerPinModal');
  const input = document.getElementById('ownerPinInput');
  const errorMsg = document.getElementById('pinErrorMsg');
  const title = document.getElementById('pinModalTitle');
  const sub = document.getElementById('pinModalSub');

  input.value = '';
  if (errorMsg) {
    errorMsg.style.display = 'none';
    errorMsg.textContent = '';
  }

  if (actionName) {
    sub.textContent = lang === 'ur'
      ? `کارروائی (${actionName}) کی تصدیق کے لیے 4 ہندسوں کا پن کوڈ درج کریں:`
      : `Enter 4-digit Owner PIN to authorize (${actionName}):`;
  }

  modal.style.display = 'flex';
  setTimeout(() => input.focus(), 60);
}

function cancelOwnerPin() {
  document.getElementById('ownerPinModal').style.display = 'none';
  pendingPinCallback = null;
  pendingPinAction = '';
}

async function submitOwnerPin() {
  const input = document.getElementById('ownerPinInput');
  const errorMsg = document.getElementById('pinErrorMsg');
  const entered = input.value.trim();

  if (!validate4DigitPin(entered)) {
    errorMsg.textContent = lang === 'ur' ? 'پن کوڈ لازماً 4 ہندسوں پر مشتمل ہونا چاہیے!' : 'PIN must be exactly 4 numeric digits!';
    errorMsg.style.display = 'block';
    input.focus();
    return;
  }

  const s = await window.api.getSettings();
  const currentPin = s.ownerPin || "1234";

  if (entered === currentPin) {
    adminSessionUnlocked = true;
    updateAdminSessionBadge();
    document.getElementById('ownerPinModal').style.display = 'none';

    if (pendingPinCallback) {
      const cb = pendingPinCallback;
      pendingPinCallback = null;
      cb();
    }
  } else {
    errorMsg.textContent = lang === 'ur' ? 'غلط پن کوڈ درج کیا گیا ہے!' : 'Incorrect 4-digit PIN!';
    errorMsg.style.display = 'block';
    input.value = '';
    input.focus();
  }
}

function toggleAdminSessionLock() {
  if (currentRole !== 'owner') return;
  adminSessionUnlocked = !adminSessionUnlocked;
  updateAdminSessionBadge();
  showToast(adminSessionUnlocked ? 'Admin session unlocked' : 'Admin session locked', 'success');
}

function updateAdminSessionBadge() {
  const btn = document.getElementById('adminSessionBtn');
  const icon = document.getElementById('adminSessionIcon');
  const text = document.getElementById('adminSessionText');
  if (!btn) return;

  if (currentRole === 'owner') {
    btn.style.display = 'inline-flex';
    if (adminSessionUnlocked) {
      icon.textContent = '🔓';
      text.textContent = LABELS[lang].adminUnlocked;
      btn.style.background = '#ecfdf5';
      btn.style.borderColor = '#a7f3d0';
      btn.style.color = '#065f46';
    } else {
      icon.textContent = '🔒';
      text.textContent = LABELS[lang].adminLocked;
      btn.style.background = '#fef2f2';
      btn.style.borderColor = '#fecaca';
      btn.style.color = '#991b1b';
    }
  } else {
    btn.style.display = 'none';
  }
}

async function changeOwnerPin() {
  const curInput = document.getElementById('currentOwnerPinInput');
  const newInput = document.getElementById('newOwnerPinInput');
  const confInput = document.getElementById('confirmOwnerPinInput');

  const curVal = curInput.value.trim();
  const newVal = newInput.value.trim();
  const confVal = confInput.value.trim();

  const s = await window.api.getSettings();
  const actualPin = s.ownerPin || "1234";

  if (curVal !== actualPin) {
    alert(lang === 'ur' ? 'موجودہ پن کوڈ غلط ہے!' : 'Current PIN is incorrect!');
    curInput.focus();
    return;
  }

  if (!validate4DigitPin(newVal)) {
    alert(lang === 'ur' ? 'نیا پن کوڈ لازماً 4 ہندسوں پر مشتمل ہونا چاہیے!' : 'New PIN must be exactly 4 digits!');
    newInput.focus();
    return;
  }

  if (newVal !== confVal) {
    alert(lang === 'ur' ? 'نیا پن اور تصدیقی پن آپس میں نہیں ملتے!' : 'New PIN and Confirm PIN do not match!');
    confInput.focus();
    return;
  }

  await window.api.saveSettings({ ownerPin: newVal });
  windowSettings.ownerPin = newVal;
  adminSessionUnlocked = true;
  updateAdminSessionBadge();

  curInput.value = '';
  newInput.value = '';
  confInput.value = '';

  showToast(lang === 'ur' ? '4-Digit PIN کامیابی سے تبدیل کر دیا گیا' : 'Owner PIN updated successfully.');
}

function toggleRevenuePrivacy() {
  if (revenuePrivacyUnlocked) {
    revenuePrivacyUnlocked = false;
    renderInvoices();
    return;
  }
  requireOwnerPin('view revenue', () => {
    revenuePrivacyUnlocked = true;
    renderInvoices();
  });
}

/* ============ LOGIN / LOGOUT ============ */
async function login(role) {
  const nameInput = document.getElementById('loginName');
  const enteredName = nameInput.value.trim();

  if (role === 'owner') {
    const s = await window.api.getSettings();
    const pin = s.ownerPin || "1234";
    pendingPinCallback = () => completeLogin('owner', enteredName || 'Owner');
    openPinModal('Owner Login');
    return;
  }

  completeLogin('cashier', enteredName || 'Cashier');
}

async function completeLogin(role, staffName) {
  currentRole = role;
  currentStaffName = staffName;

  // Persist staff name across app restarts
  try { localStorage.setItem('quotation_last_staff_name', staffName); } catch(e) {}

  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('appScreen').style.display = 'block';

  document.getElementById('roleBadge').textContent = role === 'owner' ? 'Owner' : 'Cashier';
  document.getElementById('docUser').value = currentStaffName;

  document.querySelectorAll('.owner-only').forEach(el => {
    el.style.display = (role === 'owner') ? '' : 'none';
  });

  updateAdminSessionBadge();

  await loadSettings();
  await loadProducts();
  showTab('bill');
  applyLabels();
  resetDateTime();
  render();
  syncHeader();
}

function logout() {
  currentRole = null;
  currentStaffName = '';
  currentSavedId = null;
  adminSessionUnlocked = false;
  revenuePrivacyUnlocked = false;
  items = [];

  // Restore last staff name so user doesn't have to retype it
  try {
    const savedName = localStorage.getItem('quotation_last_staff_name') || '';
    document.getElementById('loginName').value = savedName;
  } catch(e) {
    document.getElementById('loginName').value = '';
  }

  document.getElementById('docInv').value = '';
  document.getElementById('appScreen').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
}

/* ============ TAB NAVIGATION ============ */
function showTab(name) {
  // If navigating to owner-restricted tabs, ensure authorization
  if ((name === 'products' || name === 'settings') && currentRole !== 'owner') {
    alert('Access restricted to Owner.');
    return;
  }

  if (name === 'settings') {
    requireOwnerPin('access shop settings', () => {
      switchTabInternal(name);
      loadSettingsForm();
    });
    return;
  }

  switchTabInternal(name);
}

function switchTabInternal(name) {
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  document.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none');

  const panel = document.getElementById('tab-' + name);
  if (panel) panel.style.display = 'block';

  if (name === 'invoices') renderInvoices();
  if (name === 'quotations') renderQuotations();
  if (name === 'cashierHistory') renderCashierHistory();
  if (name === 'products') renderProductsTable();
}

/* ============ SEARCHABLE COMBOBOX (BILLING) ============ */
async function loadProducts() {
  products = await window.api.getProducts();

  // Populate category datalist in settings/add
  const datalist = document.getElementById('categoryDatalist');
  if (datalist) {
    const cats = [...new Set(products.map(p => p.category).filter(Boolean))];
    datalist.innerHTML = cats.map(c => `<option value="${c}">`).join('');
  }

  // Populate category filter in Products tab
  const catFilter = document.getElementById('prodCategoryFilter');
  if (catFilter) {
    const cats = [...new Set(products.map(p => p.category).filter(Boolean))];
    catFilter.innerHTML = '<option value="">تمام کیٹیگریز (All Categories)</option>' +
      cats.map(c => `<option value="${c}">${c}</option>`).join('');
  }

  initCombobox();
}

function initCombobox() {
  const input = document.getElementById('prodComboboxInput');
  const dropdown = document.getElementById('comboboxDropdown');
  if (!input || !dropdown) return;

  input.addEventListener('input', () => {
    const val = input.value.trim().toLowerCase();
    if (!val) {
      filteredProducts = [...products];
    } else {
      filteredProducts = products.filter(p =>
        (p.name && p.name.toLowerCase().includes(val)) ||
        (p.sku && p.sku.toLowerCase().includes(val)) ||
        (p.category && p.category.toLowerCase().includes(val))
      );
    }
    activeComboboxIndex = -1;
    renderComboboxDropdown();
    dropdown.style.display = 'block';
    comboboxOpen = true;
  });

  input.addEventListener('keydown', (e) => {
    if (!comboboxOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        toggleCombobox();
        e.preventDefault();
      }
      return;
    }

    const items = dropdown.querySelectorAll('.combobox-item');
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeComboboxIndex = (activeComboboxIndex + 1) % items.length;
      updateActiveComboboxItem(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeComboboxIndex = (activeComboboxIndex - 1 + items.length) % items.length;
      updateActiveComboboxItem(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeComboboxIndex >= 0 && filteredProducts[activeComboboxIndex]) {
        selectProduct(filteredProducts[activeComboboxIndex]);
      } else if (filteredProducts.length > 0) {
        selectProduct(filteredProducts[0]);
      }
    } else if (e.key === 'Escape') {
      dropdown.style.display = 'none';
      comboboxOpen = false;
    }
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    const wrap = document.getElementById('comboboxWrap');
    if (wrap && !wrap.contains(e.target)) {
      dropdown.style.display = 'none';
      comboboxOpen = false;
    }
  });
}

function updateActiveComboboxItem(items) {
  items.forEach((it, idx) => {
    it.classList.toggle('active', idx === activeComboboxIndex);
    if (idx === activeComboboxIndex) {
      it.scrollIntoView({ block: 'nearest' });
    }
  });
}

function renderComboboxDropdown() {
  const dropdown = document.getElementById('comboboxDropdown');
  if (filteredProducts.length === 0) {
    dropdown.innerHTML = `<div style="padding:12px; text-align:center; color:#64748b; font-size:12.5px;">
      کوئی پروڈکٹ نہیں ملی (No product found)<br>
      <button type="button" class="btn btn-secondary small" style="margin-top:6px;" onclick="openQuickAddModal()">+ نئی شامل کریں</button>
    </div>`;
    return;
  }

  dropdown.innerHTML = filteredProducts.map((p, idx) => {
    const stockClass = p.stock <= 0 ? 'out-stock' : (p.stock <= 5 ? 'low-stock' : 'in-stock');
    const stockText = p.stock <= 0 ? 'Out of Stock' : `Stock: ${p.stock}`;
    return `
      <div class="combobox-item" onclick="selectProductByIndex(${idx})">
        <div class="cb-item-left">
          <div class="cb-item-name">${p.name}</div>
          <div class="cb-item-meta">
            <span class="badge-sku">${p.sku || 'SKU'}</span>
            <span class="badge-cat">${p.category || 'General'}</span>
          </div>
        </div>
        <div class="cb-item-right">
          <div class="cb-item-rate">Rs. ${p.rate}</div>
          <span class="badge-stock ${stockClass}">${stockText}</span>
        </div>
      </div>
    `;
  }).join('');
}

function selectProductByIndex(idx) {
  if (filteredProducts[idx]) {
    selectProduct(filteredProducts[idx]);
  }
}

function selectProduct(p) {
  selectedProduct = p;
  const input = document.getElementById('prodComboboxInput');
  const rateInput = document.getElementById('prodRate');
  const qtyInput = document.getElementById('prodQty');
  const dropdown = document.getElementById('comboboxDropdown');

  input.value = `${p.name} (${p.sku || ''})`;
  rateInput.value = p.rate;
  qtyInput.value = 1;

  // Selected chip preview
  const chip = document.getElementById('selectedProdChip');
  document.getElementById('chipSku').textContent = p.sku || '—';
  document.getElementById('chipCategory').textContent = p.category || '—';
  const stockEl = document.getElementById('chipStock');
  stockEl.textContent = p.stock !== undefined ? p.stock : '50';
  chip.style.display = 'flex';

  dropdown.style.display = 'none';
  comboboxOpen = false;

  // Shift focus to Qty
  qtyInput.focus();
  qtyInput.select();
}

function toggleCombobox(e) {
  if (e) e.stopPropagation();
  const dropdown = document.getElementById('comboboxDropdown');
  if (comboboxOpen) {
    dropdown.style.display = 'none';
    comboboxOpen = false;
  } else {
    filteredProducts = [...products];
    activeComboboxIndex = -1;
    renderComboboxDropdown();
    dropdown.style.display = 'block';
    comboboxOpen = true;
    document.getElementById('prodComboboxInput').focus();
  }
}

function clearCombobox(e) {
  if (e) e.stopPropagation();
  document.getElementById('prodComboboxInput').value = '';
  document.getElementById('prodRate').value = '';
  document.getElementById('prodQty').value = 1;
  document.getElementById('selectedProdChip').style.display = 'none';
  selectedProduct = null;
  document.getElementById('comboboxDropdown').style.display = 'none';
  comboboxOpen = false;
}

/* ============ QUICK ADD PRODUCT MODAL ============ */
function openQuickAddModal() {
  document.getElementById('quickProdName').value = '';
  document.getElementById('quickProdSku').value = `SKU-${String(products.length + 1).padStart(3, '0')}`;
  document.getElementById('quickProdCategory').value = 'General';
  document.getElementById('quickProdRate').value = '';
  document.getElementById('quickProdStock').value = '50';
  document.getElementById('quickAddProductModal').style.display = 'flex';
  setTimeout(() => document.getElementById('quickProdName').focus(), 50);
}

function closeQuickAddModal() {
  document.getElementById('quickAddProductModal').style.display = 'none';
}

async function submitQuickAddProduct() {
  const name = document.getElementById('quickProdName').value.trim();
  const sku = document.getElementById('quickProdSku').value.trim() || `SKU-${String(products.length + 1).padStart(3, '0')}`;
  const category = document.getElementById('quickProdCategory').value.trim() || 'General';
  const rate = parseFloat(document.getElementById('quickProdRate').value);
  const stock = parseInt(document.getElementById('quickProdStock').value, 10);

  if (!name) {
    alert(lang === 'ur' ? 'پروڈکٹ کا نام درج کریں' : 'Please enter product name.');
    return;
  }
  if (isNaN(rate) || rate < 0) {
    alert(lang === 'ur' ? 'درست قیمت درج کریں' : 'Please enter a valid rate/price.');
    return;
  }

  const maxId = products.reduce((m, p) => Math.max(m, p.id || 0), 0);
  const newProd = {
    id: maxId + 1,
    sku,
    name,
    category,
    rate,
    stock: isNaN(stock) ? 50 : stock
  };

  products.push(newProd);
  await window.api.saveProducts(products);
  await loadProducts();

  closeQuickAddModal();
  selectProduct(newProd);
  showToast(lang === 'ur' ? 'نئی پروڈکٹ شامل کر دی گئی' : 'Product added successfully.');
}

/* ============ BILL ITEMS & RECEIPT ============ */
function addItem() {
  let prodName = '';
  let prodSku = '';
  let rate = parseFloat(document.getElementById('prodRate').value) || 0;
  const qty = parseInt(document.getElementById('prodQty').value, 10) || 1;

  if (selectedProduct) {
    prodName = selectedProduct.name;
    prodSku = selectedProduct.sku || '';
  } else {
    prodName = document.getElementById('prodComboboxInput').value.trim();
  }

  if (!prodName) {
    alert(lang === 'ur' ? 'برائے مہربانی پروڈکٹ منتخب کریں یا نام درج کریں۔' : 'Please select or enter a product.');
    document.getElementById('prodComboboxInput').focus();
    return;
  }

  if (qty <= 0) {
    alert(lang === 'ur' ? 'تعداد کم از کم 1 ہونی چاہیے' : 'Quantity must be at least 1.');
    return;
  }

  items.push({
    sku: prodSku,
    name: prodName,
    rate,
    qty
  });

  // Reset inputs
  clearCombobox();
  render();
}

function removeItem(idx) {
  items.splice(idx, 1);
  render();
}

function clearAll() {
  items = [];
  currentSavedId = null;
  document.getElementById('docInv').value = '';
  document.getElementById('convertBtn').style.display = 'none';
  clearCombobox();
  resetDateTime();
  render();
  syncHeader();
}

function render() {
  // Update badge count
  const countBadge = document.getElementById('itemsCountBadge');
  if (countBadge) countBadge.textContent = items.length;

  // Bill items list in editor
  const list = document.getElementById('itemList');
  const L = LABELS[lang];

  if (items.length === 0) {
    list.innerHTML = `<div style="padding:16px; text-align:center; color:#94a3b8; font-size:12.5px;">${L.msgNoItems}</div>`;
  } else {
    list.innerHTML = items.map((it, idx) => `
      <div class="item-row">
        <div class="info">
          <div class="name">${it.name} ${it.sku ? `<small style="color:#64748b;">(${it.sku})</small>` : ''}</div>
          <div class="sub">${L.lblRate} ${it.rate} × ${L.lblQty} ${it.qty} = Rs. ${(it.rate * it.qty).toFixed(2)}</div>
        </div>
        <button type="button" class="btn btn-danger small" onclick="removeItem(${idx})" title="Remove">✕</button>
      </div>
    `).join('');
  }

  // Thermal Receipt items table
  const body = document.getElementById('rBody');
  if (items.length === 0) {
    body.innerHTML = `<tr><td colspan="4" class="empty-msg">${L.msgNoItems}</td></tr>`;
  } else {
    body.innerHTML = items.map(it => `
      <tr>
        <td class="c-total">${(it.rate * it.qty).toFixed(2).replace(/\.00$/, '')}</td>
        <td class="c-rate">${it.rate}</td>
        <td class="c-prod">${it.name}</td>
        <td class="c-qty">${it.qty}</td>
      </tr>
    `).join('');
  }

  const totalQty = items.reduce((s, it) => s + it.qty, 0);
  const totalAmt = items.reduce((s, it) => s + (it.rate * it.qty), 0);

  document.getElementById('tQty').innerHTML = `${items.length}/${totalQty}<br><span data-i18n="lblTotalItemsQty">${L.lblTotalItemsQty}</span>`;
  document.getElementById('tAmt').textContent = totalAmt.toFixed(2).replace(/\.00$/, '');
}

/* ============ HEADER SYNC ============ */
function syncHeader() {
  document.getElementById('mUser').textContent = 'Staff: ' + (document.getElementById('docUser').value || '—');
  document.getElementById('mInv').textContent = 'Doc#: ' + (document.getElementById('docInv').value || '—');

  const d = document.getElementById('docDate').value;
  document.getElementById('mDate').textContent = 'Date: ' + formatDisplayDate(d);

  const t = document.getElementById('docTime').value;
  document.getElementById('mTime').textContent = 'Time: ' + (t || '—');
}

function setDocType(type) {
  docType = type;
  document.getElementById('btnTypeQuote').classList.toggle('active', type === 'Quotation');
  document.getElementById('btnTypeInv').classList.toggle('active', type === 'Invoice');
  document.getElementById('rDocTitle').textContent = type;
  document.getElementById('convertBtn').style.display = (type === 'Quotation' && currentSavedId) ? 'block' : 'none';

  if (!currentSavedId) {
    document.getElementById('docInv').value = '';
  }
  syncHeader();
}

/* ============ SAVE / CONVERT / PRINT ============ */
async function saveDocument(isAutoSave = false) {
  if (items.length === 0) {
    alert(lang === 'ur' ? 'محفوظ کرنے سے پہلے کم از کم ایک آئٹم شامل کریں۔' : 'Add at least one item before saving.');
    return null;
  }

  let number = document.getElementById('docInv').value;
  if (!currentSavedId || !number) {
    try {
      number = await window.api.nextNumber(docType);
      document.getElementById('docInv').value = number;
    } catch (e) {
      console.error('Failed to generate number:', e);
    }
  }
  syncHeader();

  const totalAmt = items.reduce((s, it) => s + (it.rate * it.qty), 0);
  const record = {
    id: currentSavedId || (Date.now() + '-' + Math.random().toString(36).slice(2, 7)),
    type: docType,
    number: document.getElementById('docInv').value || number,
    date: document.getElementById('docDate').value || getLocalDateStr(),
    time: document.getElementById('docTime').value || getLocalTimeStr(),
    staffName: document.getElementById('docUser').value || currentStaffName || 'Staff',
    role: currentRole,
    items: JSON.parse(JSON.stringify(items)),
    total: totalAmt,
    timestamp: Date.now()
  };

  await window.api.saveDocument(record);

  // Update inventory stock counts for saved invoices
  if (docType === 'Invoice' && !currentSavedId) {
    updateStockAfterSale(record.items);
  }

  const savedNumber = record.number;

  if (!isAutoSave) {
    showToast(lang === 'ur'
      ? `${docType === 'Invoice' ? 'سیلز انوائس' : 'کوٹیشن'} نمبر ${savedNumber} محفوظ ہو گئی`
      : `${docType} #${savedNumber} saved successfully!`
    );

    // Reset editor
    items = [];
    currentSavedId = null;
    document.getElementById('docInv').value = '';
    document.getElementById('convertBtn').style.display = 'none';
    clearCombobox();
    resetDateTime();
    render();
    syncHeader();
  } else {
    currentSavedId = record.id;
    document.getElementById('convertBtn').style.display = (docType === 'Quotation') ? 'block' : 'none';
  }

  return record;
}

async function updateStockAfterSale(soldItems) {
  let changed = false;
  soldItems.forEach(item => {
    const prod = products.find(p => p.name === item.name || (item.sku && p.sku === item.sku));
    if (prod && prod.stock !== undefined) {
      prod.stock = Math.max(0, prod.stock - item.qty);
      changed = true;
    }
  });
  if (changed) {
    await window.api.saveProducts(products);
    await loadProducts();
  }
}

async function convertToInvoice() {
  if (!currentSavedId) {
    alert(lang === 'ur' ? 'پہلے اس کوٹیشن کو محفوظ کریں۔' : 'Save this quotation first.');
    return;
  }

  const invNumber = await window.api.nextNumber('Invoice');
  currentSavedId = Date.now() + '-' + Math.random().toString(36).slice(2, 7);
  docType = 'Invoice';
  document.getElementById('docInv').value = invNumber;
  setDocType('Invoice');
  await saveDocument(false);
  showToast(`Converted to Invoice #${invNumber}!`, 'success');
}

async function convertQuotationDirectly(id) {
  const docs = await window.api.getDocuments();
  const quote = docs.find(d => d.id === id);
  if (!quote) return;

  const invNumber = await window.api.nextNumber('Invoice');
  const invoiceRecord = {
    id: Date.now() + '-' + Math.random().toString(36).slice(2, 7),
    type: 'Invoice',
    number: invNumber,
    date: getLocalDateStr(),
    time: getLocalTimeStr(),
    staffName: currentStaffName || quote.staffName,
    role: currentRole,
    items: JSON.parse(JSON.stringify(quote.items)),
    total: quote.total,
    convertedFrom: quote.number,
    timestamp: Date.now()
  };

  await window.api.saveDocument(invoiceRecord);
  updateStockAfterSale(invoiceRecord.items);

  showToast(lang === 'ur'
    ? `کوٹیشن ${quote.number} کو کامیابی سے انوائس ${invNumber} میں تبدیل کر دیا گیا`
    : `Quotation ${quote.number} successfully converted to Invoice ${invNumber}!`
  );

  renderQuotations();
  renderInvoices();
}

async function printBill() {
  if (items.length === 0) {
    alert(lang === 'ur' ? 'بل خالی ہے۔ پرنٹ کرنے سے پہلے کم از کم ایک آئٹم شامل کریں۔' : 'Cannot print an empty bill. Please add at least one item.');
    return;
  }

  if (!currentSavedId) {
    await saveDocument(true);
  }

  const docNum = document.getElementById('docInv').value || docType;
  const originalTitle = document.title;
  document.title = docNum;

  window.print();

  document.title = originalTitle;
}

/* ============ INVOICE HISTORY (STRICTLY INVOICES) ============ */
function setInvoiceDatePill(pill, btn) {
  invoiceDatePill = pill;
  document.querySelectorAll('#tab-invoices .pill-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const dateInput = document.getElementById('invFilterDate');
  if (pill === 'today') {
    dateInput.value = getLocalDateStr();
  } else if (pill === 'yesterday') {
    const yest = new Date();
    yest.setDate(yest.getDate() - 1);
    dateInput.value = getLocalDateStr(yest);
  } else if (pill === 'all') {
    dateInput.value = '';
  }
  renderInvoices();
}

function clearInvoiceFilters() {
  document.getElementById('invSearchInput').value = '';
  document.getElementById('invFilterDate').value = '';
  invoiceDatePill = 'all';
  setInvoiceDatePill('all', document.querySelector('#tab-invoices .pill-btn'));
}

async function renderInvoices() {
  let docs = await window.api.getDocuments();
  const L = LABELS[lang];

  // Strictly filter for Invoices
  docs = docs.filter(d => d.type === 'Invoice');

  // Search filter
  const search = (document.getElementById('invSearchInput').value || '').trim().toLowerCase();
  if (search) {
    docs = docs.filter(d =>
      (d.number && d.number.toLowerCase().includes(search)) ||
      (d.staffName && d.staffName.toLowerCase().includes(search)) ||
      (d.items && d.items.some(it => it.name && it.name.toLowerCase().includes(search)))
    );
  }

  // Date filter
  const dateFilter = document.getElementById('invFilterDate').value;
  if (dateFilter) {
    docs = docs.filter(d => (d.date || '').slice(0, 10) === dateFilter);
  } else if (invoiceDatePill === 'month') {
    const currentMonth = getLocalDateStr().slice(0, 7); // YYYY-MM
    docs = docs.filter(d => (d.date || '').slice(0, 7) === currentMonth);
  }

  // Metrics
  const totalRev = docs.reduce((s, d) => s + (Number(d.total) || 0), 0);
  document.getElementById('invCountMetric').textContent = docs.length;

  const revEl = document.getElementById('invRevenueMetric');
  const lockBtn = document.getElementById('btnRevealRevenue');
  const isRevealed = revenuePrivacyUnlocked || (currentRole === 'owner' && adminSessionUnlocked);

  if (isRevealed) {
    revEl.textContent = `Rs. ${totalRev.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    lockBtn.textContent = '🔓';
    lockBtn.title = 'Click to lock';
  } else {
    revEl.textContent = 'Rs. •••••••';
    lockBtn.textContent = '🔒';
    lockBtn.title = 'Click to reveal revenue (Requires 4-Digit PIN)';
  }

  const listEl = document.getElementById('invoicesList');
  if (docs.length === 0) {
    listEl.innerHTML = `<div class="empty-hist">کوئی سیلز انوائس نہیں ملی (No invoices found)</div>`;
    return;
  }

  listEl.innerHTML = docs.map(d => {
    const itemsSummary = (d.items || []).map(it => `${it.name} (x${it.qty})`).join(', ');
    return `
      <div class="hist-card">
        <div class="h-main" onclick="loadRecord('${d.id}')">
          <div class="h-top-row">
            <span class="tag-inv">Invoice</span>
            <b class="h-doc-num">${d.number}</b>
            <span class="h-total-amt">Rs. ${(d.total || 0).toFixed(2)}</span>
          </div>
          <div class="h-sub-info">
            <span>📅 ${formatDisplayDate(d.date)} ${d.time || ''}</span>
            <span>👤 Staff: <b>${d.staffName || '—'}</b></span>
            <span class="h-items-summary">📦 ${itemsSummary || 'No items'}</span>
          </div>
        </div>
        <div class="hist-actions">
          <button class="btn btn-secondary small" onclick="loadRecord('${d.id}')" title="View / Edit">👁️</button>
          <button class="btn btn-secondary small" onclick="reprintDoc('${d.id}')" title="Print Receipt">🖨️</button>
          ${currentRole === 'owner' ? `<button class="btn btn-secondary small" onclick="openEditStaffModal('${d.id}')">✏️</button>` : ''}
          ${currentRole === 'owner' ? `<button class="btn btn-danger small" onclick="deleteInvoicePrompt('${d.id}')">🗑️</button>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function deleteInvoicePrompt(id) {
  requireOwnerPin('delete invoice', async () => {
    const msg = lang === 'ur' ? 'کیا آپ واقعی اس انوائس کو حذف کرنا چاہتے ہیں؟' : 'Are you sure you want to permanently delete this invoice?';
    if (!confirm(msg)) return;
    await window.api.deleteDocument(id);
    if (currentSavedId === id) currentSavedId = null;
    renderInvoices();
    renderCashierHistory();
    showToast('Invoice deleted', 'error');
  });
}

/* ============ QUOTATIONS (DEDICATED SECTION) ============ */
function setQuoteDatePill(pill, btn) {
  quoteDatePill = pill;
  document.querySelectorAll('#tab-quotations .pill-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const dateInput = document.getElementById('quoteFilterDate');
  if (pill === 'today') {
    dateInput.value = getLocalDateStr();
  } else if (pill === 'all') {
    dateInput.value = '';
  }
  renderQuotations();
}

function clearQuoteFilters() {
  document.getElementById('quoteSearchInput').value = '';
  document.getElementById('quoteFilterDate').value = '';
  quoteDatePill = 'all';
  setQuoteDatePill('all', document.querySelector('#tab-quotations .pill-btn'));
}

async function renderQuotations() {
  let docs = await window.api.getDocuments();

  // Strictly filter for Quotations
  docs = docs.filter(d => d.type === 'Quotation');

  // Search filter
  const search = (document.getElementById('quoteSearchInput').value || '').trim().toLowerCase();
  if (search) {
    docs = docs.filter(d =>
      (d.number && d.number.toLowerCase().includes(search)) ||
      (d.staffName && d.staffName.toLowerCase().includes(search)) ||
      (d.items && d.items.some(it => it.name && it.name.toLowerCase().includes(search)))
    );
  }

  // Date filter
  const dateFilter = document.getElementById('quoteFilterDate').value;
  if (dateFilter) {
    docs = docs.filter(d => (d.date || '').slice(0, 10) === dateFilter);
  } else if (quoteDatePill === 'month') {
    const currentMonth = getLocalDateStr().slice(0, 7);
    docs = docs.filter(d => (d.date || '').slice(0, 7) === currentMonth);
  }

  // Metrics
  const totalVal = docs.reduce((s, d) => s + (Number(d.total) || 0), 0);
  document.getElementById('quoteCountMetric').textContent = docs.length;
  document.getElementById('quoteValueMetric').textContent = `Rs. ${totalVal.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const listEl = document.getElementById('quotationsList');
  if (docs.length === 0) {
    listEl.innerHTML = `<div class="empty-hist">کوئی کوٹیشن نہیں ملی (No quotations found)</div>`;
    return;
  }

  listEl.innerHTML = docs.map(d => {
    const itemsSummary = (d.items || []).map(it => `${it.name} (x${it.qty})`).join(', ');
    return `
      <div class="hist-card">
        <div class="h-main" onclick="loadRecord('${d.id}')">
          <div class="h-top-row">
            <span class="tag-quote">Quotation</span>
            <b class="h-doc-num">${d.number}</b>
            <span class="h-total-amt">Rs. ${(d.total || 0).toFixed(2)}</span>
          </div>
          <div class="h-sub-info">
            <span>📅 ${formatDisplayDate(d.date)} ${d.time || ''}</span>
            <span>👤 Prepared by: <b>${d.staffName || '—'}</b></span>
            <span class="h-items-summary">📋 ${itemsSummary || 'No items'}</span>
          </div>
        </div>
        <div class="hist-actions">
          <button class="btn btn-convert small" onclick="convertQuotationDirectly('${d.id}')" title="Convert to Invoice">↻ تبدیل انوائس</button>
          <button class="btn btn-secondary small" onclick="loadRecord('${d.id}')" title="View in Editor">👁️</button>
          <button class="btn btn-secondary small" onclick="reprintDoc('${d.id}')" title="Print Quotation">🖨️</button>
          ${currentRole === 'owner' ? `<button class="btn btn-danger small" onclick="deleteQuotationPrompt('${d.id}')">🗑️</button>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function deleteQuotationPrompt(id) {
  requireOwnerPin('delete quotation', async () => {
    const msg = lang === 'ur' ? 'کیا آپ واقعی اس کوٹیشن کو حذف کرنا چاہتے ہیں؟' : 'Are you sure you want to delete this quotation?';
    if (!confirm(msg)) return;
    await window.api.deleteDocument(id);
    if (currentSavedId === id) currentSavedId = null;
    renderQuotations();
    showToast('Quotation deleted', 'error');
  });
}

/* ============ CASHIER HISTORY (ACTIVITY & SALES LOGS) ============ */
function setCashierDatePill(pill, btn) {
  cashierDatePill = pill;
  document.querySelectorAll('#tab-cashierHistory .pill-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  const dateInput = document.getElementById('cashierFilterDate');
  if (pill === 'today') {
    dateInput.value = getLocalDateStr();
  } else if (pill === 'all') {
    dateInput.value = '';
  }
  renderCashierHistory();
}

function clearCashierFilters() {
  document.getElementById('cashierFilterDate').value = '';
  const sel = document.getElementById('cashierStaffSelect');
  if (sel) sel.value = '';
  cashierDatePill = 'all';
  setCashierDatePill('all', document.querySelector('#tab-cashierHistory .pill-btn'));
}

async function renderCashierHistory() {
  let docs = await window.api.getDocuments();

  // Filter only sales transactions (Invoices)
  let sales = docs.filter(d => d.type === 'Invoice');

  // Populate cashier select dropdown (for Owner)
  const staffSelect = document.getElementById('cashierStaffSelect');
  if (staffSelect) {
    const cashiers = [...new Set(sales.map(d => d.staffName).filter(Boolean))];
    const curVal = staffSelect.value;
    staffSelect.innerHTML = `<option value="">تمام کیشیئرز (All Cashiers)</option>` +
      cashiers.map(c => `<option value="${c}" ${c === curVal ? 'selected' : ''}>${c}</option>`).join('');
  }

  // Filter according to role
  if (currentRole === 'cashier') {
    document.getElementById('cashierSelectGroup').style.display = 'none';
    document.getElementById('cashierSummaryCards').style.display = 'none';
    document.getElementById('cashierSubLabel').textContent = `کیشیئر: ${currentStaffName} کی ذاتی سیلز ہسٹری`;

    // Filter by logged-in cashier
    sales = sales.filter(d => (d.staffName || '').toLowerCase() === currentStaffName.toLowerCase());
  } else {
    document.getElementById('cashierSelectGroup').style.display = 'flex';
    document.getElementById('cashierSummaryCards').style.display = 'grid';
    document.getElementById('cashierSubLabel').textContent = 'تمام کیشیئرز کی کارکردگی اور سیلز کا تفصیلی ریکارڈ';

    const selectedStaff = staffSelect ? staffSelect.value : '';
    if (selectedStaff) {
      sales = sales.filter(d => d.staffName === selectedStaff);
    }
  }

  // Date filtering
  const dateFilter = document.getElementById('cashierFilterDate').value;
  if (dateFilter) {
    sales = sales.filter(d => (d.date || '').slice(0, 10) === dateFilter);
  } else if (cashierDatePill === 'month') {
    const currentMonth = getLocalDateStr().slice(0, 7);
    sales = sales.filter(d => (d.date || '').slice(0, 7) === currentMonth);
  }

  // Calculate cashier summary metrics
  const totalBills = sales.length;
  const totalRevenue = sales.reduce((s, d) => s + (Number(d.total) || 0), 0);
  const totalUnits = sales.reduce((s, d) => s + (d.items || []).reduce((q, it) => q + (Number(it.qty) || 0), 0), 0);

  document.getElementById('cashierBillsMetric').textContent = totalBills;
  document.getElementById('cashierRevenueMetric').textContent = `Rs. ${totalRevenue.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  document.getElementById('cashierUnitsMetric').textContent = totalUnits;

  // Render Owner Cashier Breakdown Cards
  if (currentRole === 'owner') {
    renderCashierBreakdownCards(docs.filter(d => d.type === 'Invoice'));
  }

  // Render Transaction Log
  const listEl = document.getElementById('cashierTransactionsList');
  if (sales.length === 0) {
    listEl.innerHTML = `<div class="empty-hist">کوئی کیشیئر سرگرمی ریکارڈ نہیں ملا (No cashier activity found)</div>`;
    return;
  }

  listEl.innerHTML = sales.map(d => {
    const itemsCount = (d.items || []).reduce((s, it) => s + it.qty, 0);
    return `
      <div class="hist-card">
        <div class="h-main" onclick="loadRecord('${d.id}')">
          <div class="h-top-row">
            <span class="tag-inv">Sale</span>
            <b class="h-doc-num">${d.number}</b>
            <span class="h-total-amt">Rs. ${(d.total || 0).toFixed(2)}</span>
          </div>
          <div class="h-sub-info">
            <span>📅 ${formatDisplayDate(d.date)} ${d.time || ''}</span>
            <span>👤 Cashier: <b>${d.staffName || 'Staff'}</b></span>
            <span>🛍️ Units Sold: <b>${itemsCount}</b></span>
          </div>
        </div>
        <div class="hist-actions">
          <button class="btn btn-secondary small" onclick="loadRecord('${d.id}')" title="View / Load">👁️ View</button>
          <button class="btn btn-secondary small" onclick="reprintDoc('${d.id}')" title="Reprint Receipt">🖨️ Print</button>
        </div>
      </div>
    `;
  }).join('');
}

function renderCashierBreakdownCards(allInvoices) {
  const container = document.getElementById('cashierSummaryCards');
  if (!container) return;

  const cashierMap = {};
  allInvoices.forEach(inv => {
    const name = inv.staffName || 'Unassigned';
    if (!cashierMap[name]) {
      cashierMap[name] = { count: 0, revenue: 0, lastSale: inv.date + ' ' + (inv.time || '') };
    }
    cashierMap[name].count += 1;
    cashierMap[name].revenue += (Number(inv.total) || 0);
  });

  const names = Object.keys(cashierMap);
  if (names.length === 0) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = names.map(name => `
    <div class="cashier-stat-card">
      <div class="cashier-stat-name">
        <span>👤 ${name}</span>
        <span class="badge-count">${cashierMap[name].count} bills</span>
      </div>
      <div class="cashier-stat-row">
        <span>Total Sales:</span>
        <b>Rs. ${cashierMap[name].revenue.toLocaleString('en-PK')}</b>
      </div>
      <div class="cashier-stat-row">
        <span>Last Active:</span>
        <span>${formatDisplayDate(cashierMap[name].lastSale.slice(0, 10))}</span>
      </div>
    </div>
  `).join('');
}

/* ============ RECORD LOADING & REPRINT ============ */
async function loadRecord(id) {
  const docs = await window.api.getDocuments();
  const rec = docs.find(d => d.id === id);
  if (!rec) return;

  currentSavedId = rec.id;
  docType = rec.type || 'Invoice';
  items = JSON.parse(JSON.stringify(rec.items || []));

  document.getElementById('docInv').value = rec.number || '';
  document.getElementById('docDate').value = rec.date || getLocalDateStr();
  document.getElementById('docTime').value = rec.time || getLocalTimeStr();
  document.getElementById('docUser').value = rec.staffName || '';

  setDocType(rec.type || 'Invoice');
  render();
  syncHeader();
  showTab('bill');
}

async function reprintDoc(id) {
  await loadRecord(id);
  setTimeout(() => {
    window.print();
  }, 100);
}

/* ============ EDIT STAFF MODAL ============ */
async function openEditStaffModal(id) {
  requireOwnerPin('edit staff name', async () => {
    const docs = await window.api.getDocuments();
    const rec = docs.find(d => d.id === id);
    if (!rec) return;

    editingDocId = id;
    document.getElementById('editStaffDocNum').textContent = rec.number;
    const input = document.getElementById('editStaffInput');
    input.value = rec.staffName || '';
    document.getElementById('editStaffModal').style.display = 'flex';
    setTimeout(() => input.focus(), 50);
  });
}

function cancelEditStaff() {
  editingDocId = null;
  document.getElementById('editStaffModal').style.display = 'none';
}

async function submitEditStaff() {
  if (!editingDocId) return;
  const newStaffName = document.getElementById('editStaffInput').value.trim();
  const docs = await window.api.getDocuments();
  const rec = docs.find(d => d.id === editingDocId);
  if (rec) {
    rec.staffName = newStaffName;
    await window.api.saveDocument(rec);
    await renderInvoices();
    await renderQuotations();
    await renderCashierHistory();
    showToast(lang === 'ur' ? 'سٹاف کا نام تبدیل ہو گیا' : 'Staff name updated successfully.');
  }
  cancelEditStaff();
}

/* ============ PRODUCTS MANAGEMENT (OWNER ONLY) ============ */
function renderProductsTable() {
  const body = document.getElementById('prodTableBody');
  if (!body) return;

  const search = (document.getElementById('prodTableSearch')?.value || '').trim().toLowerCase();
  const categoryFilter = document.getElementById('prodCategoryFilter')?.value || '';

  let list = [...products];
  if (search) {
    list = list.filter(p =>
      (p.name && p.name.toLowerCase().includes(search)) ||
      (p.sku && p.sku.toLowerCase().includes(search)) ||
      (p.category && p.category.toLowerCase().includes(search))
    );
  }
  if (categoryFilter) {
    list = list.filter(p => p.category === categoryFilter);
  }

  // Update summary counts
  const totalStock = products.reduce((s, p) => s + (Number(p.stock) || 0), 0);
  const countEl = document.getElementById('prodTotalCount');
  const stockEl = document.getElementById('prodTotalStock');
  if (countEl) countEl.textContent = products.length;
  if (stockEl) stockEl.textContent = totalStock;

  if (list.length === 0) {
    body.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:24px; color:#94a3b8;">کوئی پروڈکٹ نہیں ملی</td></tr>`;
    return;
  }

  body.innerHTML = list.map((p, idx) => {
    const realIdx = products.findIndex(item => item.id === p.id);
    const stockClass = p.stock <= 0 ? 'out-stock' : (p.stock <= 5 ? 'low-stock' : 'in-stock');
    return `
      <tr>
        <td>
          <input class="sku-input" value="${p.sku || ''}" onchange="updateProductField(${realIdx}, 'sku', this.value)">
        </td>
        <td>
          <input class="prod-name-input" value="${(p.name || '').replace(/"/g, '&quot;')}" onchange="updateProductField(${realIdx}, 'name', this.value)">
        </td>
        <td>
          <input value="${p.category || 'General'}" onchange="updateProductField(${realIdx}, 'category', this.value)">
        </td>
        <td>
          <input class="stock-input" type="number" min="0" value="${p.stock !== undefined ? p.stock : 50}" onchange="updateProductField(${realIdx}, 'stock', parseInt(this.value, 10)||0)">
        </td>
        <td>
          <input class="rate-input" type="number" step="0.01" value="${p.rate}" onchange="updateProductField(${realIdx}, 'rate', parseFloat(this.value)||0)">
        </td>
        <td style="text-align:center;">
          <button class="btn btn-danger small" onclick="deleteProductPrompt(${realIdx})">🗑️</button>
        </td>
      </tr>
    `;
  }).join('');
}

async function updateProductField(idx, field, value) {
  if (field === 'rate') {
    requireOwnerPin('modify product price', async () => {
      saveProductFieldInternal(idx, field, value);
    });
  } else {
    saveProductFieldInternal(idx, field, value);
  }
}

async function saveProductFieldInternal(idx, field, value) {
  if (products[idx]) {
    products[idx][field] = value;
    await window.api.saveProducts(products);
    await loadProducts();
    showToast('Product updated');
  }
}

function deleteProductPrompt(idx) {
  requireOwnerPin('delete product', async () => {
    const msg = lang === 'ur' ? 'کیا آپ واقعی اس پروڈکٹ کو حذف کرنا چاہتے ہیں؟' : 'Delete this product?';
    if (!confirm(msg)) return;
    products.splice(idx, 1);
    await window.api.saveProducts(products);
    await loadProducts();
    renderProductsTable();
    showToast('Product deleted', 'error');
  });
}

async function addProduct() {
  requireOwnerPin('add product', async () => {
    const nameInput = document.getElementById('newProdName');
    const skuInput = document.getElementById('newProdSku');
    const catInput = document.getElementById('newProdCategory');
    const rateInput = document.getElementById('newProdRate');
    const stockInput = document.getElementById('newProdStock');

    const name = nameInput.value.trim();
    const sku = skuInput.value.trim() || `SKU-${String(products.length + 1).padStart(3, '0')}`;
    const category = catInput.value.trim() || 'General';
    const rate = parseFloat(rateInput.value);
    const stock = parseInt(stockInput.value, 10);

    if (!name) {
      alert(lang === 'ur' ? 'پروڈکٹ کا نام درج کریں' : 'Please enter product name.');
      nameInput.focus();
      return;
    }
    if (isNaN(rate) || rate < 0) {
      alert(lang === 'ur' ? 'درست قیمت درج کریں' : 'Please enter valid rate.');
      rateInput.focus();
      return;
    }

    const maxId = products.reduce((m, p) => Math.max(m, p.id || 0), 0);
    products.push({
      id: maxId + 1,
      sku,
      name,
      category,
      rate,
      stock: isNaN(stock) ? 50 : stock
    });

    await window.api.saveProducts(products);
    await loadProducts();
    renderProductsTable();

    nameInput.value = '';
    skuInput.value = '';
    rateInput.value = '';
    stockInput.value = '50';

    showToast(lang === 'ur' ? 'پروڈکٹ کامیابی سے شامل ہو گئی' : 'Product added successfully.');
  });
}

/* ============ INITIALIZATION ============ */
document.addEventListener('DOMContentLoaded', async () => {
  // Date/Time input event listeners
  ['docDate', 'docInv', 'docTime', 'docUser'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', syncHeader);
      el.addEventListener('change', syncHeader);
    }
  });

  await loadSettings();
  await loadProducts();
  resetDateTime();
  applyLabels();

  // Pre-fill login name from last session
  try {
    const savedName = localStorage.getItem('quotation_last_staff_name') || '';
    if (savedName) {
      const loginNameEl = document.getElementById('loginName');
      if (loginNameEl) loginNameEl.value = savedName;
    }
  } catch(e) {}
});
