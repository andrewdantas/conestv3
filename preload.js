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
    buscarCliente: (cliNome) => ipcRenderer.send('search-client', cliNome),
    renderizarCliente: (dadosCliente) => ipcRenderer.on('data-client', dadosCliente),
    deletarCliente: (idCliente) => ipcRenderer.send('delete-client', idCliente),
    editarCliente: (cliente) => ipcRenderer.send('update-client', cliente),
    novoFornecedor: (fornecedor) => ipcRenderer.send('new-supplier', fornecedor),
    buscarFornecedor: (forNome) => ipcRenderer.send('search-supplier', forNome),
    renderizarFornecedor: (dadosFornecedor) => ipcRenderer.on('data-supplier', dadosFornecedor),
    deletarFornecedor: (idFornecedor) => ipcRenderer.send('delete-supplier', idFornecedor),
    editarFornecedor: (fornecedor) => ipcRenderer.send('update-supplier', fornecedor),
    novoProduto: (produto) => ipcRenderer.send('new-product', produto),
    buscarProduto: (proNome) => ipcRenderer.send('search-product', proNome),
    renderizarProduto: (dadosProduto) => ipcRenderer.on('data-product', dadosProduto),
    buscarProdutoPorBarcode: (barCode) => ipcRenderer.send('search-barcode', barCode),
    renderizarBarcode: (dadosBarcode) => ipcRenderer.on('data-barcode', dadosBarcode),
    deletarProduto: (idProduto) => ipcRenderer.send('delete-product', idProduto),
    editarProduto: (produto) => ipcRenderer.send('update-product', produto)
})