const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getSettings: () => ipcRenderer.invoke('settings:get'),
  saveSettings: (settings) => ipcRenderer.invoke('settings:save', settings),

  getProducts: () => ipcRenderer.invoke('products:get'),
  saveProducts: (products) => ipcRenderer.invoke('products:save', products),

  getDocuments: () => ipcRenderer.invoke('documents:get'),
  saveDocument: (record) => ipcRenderer.invoke('documents:save', record),
  deleteDocument: (id) => ipcRenderer.invoke('documents:delete', id),

  nextNumber: (type) => ipcRenderer.invoke('counter:next', type)
});
