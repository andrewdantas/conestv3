/**
 * Segurança e Desempenho
 */

const { contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('api', {
    fecharJanela: () => ipcRenderer.send('close-about'),
    janelaClientes: () => ipcRenderer.send('open-client'),
    janelaFornecedores: () => ipcRenderer.send('open-supplier'),
    janelaProdutos: () => ipcRenderer.send('open-products'),
    janelaRelatorios: () => ipcRenderer.send('open-reports'),
})