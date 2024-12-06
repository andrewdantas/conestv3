/**
 * Segurança e Desempenho
 */

const { contextBridge, ipcRenderer} = require('electron')

// Estabelecer a conexão com o banco (pedido para o main abrir a conexão com o banco de dados)
ipcRenderer.send('db-connect')

contextBridge.exposeInMainWorld('api', {
    dbMensagem: (message) => ipcRenderer.on('db-message', message),
    fecharJanela: () => ipcRenderer.send('close-about'),
    janelaClientes: () => ipcRenderer.send('open-client'),
    janelaFornecedores: () => ipcRenderer.send('open-supplier'),
    janelaProdutos: () => ipcRenderer.send('open-products'),
    janelaRelatorios: () => ipcRenderer.send('open-reports'),
    resetarFormulario: (args) => ipcRenderer.on('reset-form', args),
    novoCliente: (cliente) => ipcRenderer.send('new-client', cliente),
    novoFornecedor: (fornecedor) => ipcRenderer.send('new-supplier', fornecedor),
    novoProduto: (produto) => ipcRenderer.send('new-product', produto),
    buscarCliente: (cliNome) => ipcRenderer.send('search-client', cliNome),
    renderizarCliente: (dadosCliente) => ipcRenderer.on('data-client', dadosCliente),
    buscarFornecedor: (forNome) => ipcRenderer.send('search-supplier', forNome),
    renderizarFornecedor: (dadosFornecedor) => ipcRenderer.on('data-supplier', dadosFornecedor),
    buscarProduto: (proNome) => ipcRenderer.send('search-product', proNome),
    renderizarProduto: (dadosProduto) => ipcRenderer.on('data-product', dadosProduto),
    buscarProdutoPorBarcode: (barCode) => ipcRenderer.send('search-barcode', barCode),
    renderizarBarcode: (dadosBarcode) => ipcRenderer.on('data-barcode', dadosBarcode)
})