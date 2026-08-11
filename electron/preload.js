import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('janiBridge', {
  getMemory: () => ipcRenderer.invoke('memory:get'),
  setMemory: (key, value) => ipcRenderer.invoke('memory:set', key, value),
});
