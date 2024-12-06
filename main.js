const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain, dialog} = require('electron/main')
const path = require('node:path')

// Importação módulo de conexão 
const { dbConnect, desconectar } = require('./database.js')
// status de conexão com o banco. No MongoDB é mais eficiente mantrer uma única conexão aberta durante todo o tempo de vida do aplicativo e usá-lo quando necessário. Fechar e reabrir constantemente a conexão aumenta a sobrecarga e reduz o desempenho do servidor.
// a variável abaixo é usada para garantir que o banco de dados inicie desconectado (evitar abrir outra instância).
let dbcon = null

// importação do Schema Clientes da camada model
const clienteModel = require('./src/models/Clientes.js')

// importação do Schema Fornecedores da camada model
const fornecedorModel = require('./src/models/Fornecedores.js')

// importação do Schema Produtos da camada model
const produtoModel = require('./src/models/Produtos.js')


// Janela Principal
let win
function createWindow() {
    nativeTheme.themeSource = 'light'
    win = new BrowserWindow({
        width: 1280,
        height: 720,
        resizable: false,  // Impede o redimensionamento manual
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // Menu personalizado (comentar para debugar)
   // Menu.setApplicationMenu(Menu.buildFromTemplate(template))
    
    win.loadFile('./src/views/index.html')

    // botões
    ipcMain.on('open-client', () => {
        clientWindow()
    })

    ipcMain.on('open-supplier', () => {
        supplierWindow()
    })

    ipcMain.on('open-products', () => {
        productsWindow()
    })

    ipcMain.on('open-reports', () => {
        reportsWindow()
    })
}

// Janela Sobre
function aboutWindow () {
    nativeTheme.themeSource = "light"
    const main = BrowserWindow.getFocusedWindow()
    let about
    if (main) {
        about = new BrowserWindow ({
            width: 1280,
            height: 720,
            autoHideMenuBar: true,
            resizable: false,
            minimizable: false,
            //titleBarStyle: "hidden" // Esconder a barra de estilo (ex: totem de auto atendimento)
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
         })
    }
    
    about.loadFile('./src/views/sobre.html')

    // Fechar a janela quando receber mensagem do processo de renderização.
    ipcMain.on('close-about', () => {
        if (about && !about.isDestroyed()) {
            about.close()
        }
    })

}

// Janela Clientes
function clientWindow () {
    nativeTheme.themeSource = "light"
    const main = BrowserWindow.getFocusedWindow()
    let client
    if (main) {
        client = new BrowserWindow ({
            width: 1280,
            height: 720,
            //autoHideMenuBar: true,
            resizable: true,
            minimizable: true,
            //titleBarStyle: "hidden" // Esconder a barra de estilo (ex: totem de auto atendimento)
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
         })
    }
    
    client.loadFile('./src/views/clientes.html')

}

// Janela Fornecedores
function supplierWindow () {
    nativeTheme.themeSource = "light"
    const main = BrowserWindow.getFocusedWindow()
    let supplier
    if (main) {
        supplier = new BrowserWindow ({
            width: 1280,
            height: 720,
            autoHideMenuBar: true,
            resizable: true,
            minimizable: true,
            //titleBarStyle: "hidden" // Esconder a barra de estilo (ex: totem de auto atendimento)
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
         })
    }
    
    supplier.loadFile('./src/views/fornecedores.html')

}

// Janela Produtos
function productsWindow () {
    nativeTheme.themeSource = "light"
    const main = BrowserWindow.getFocusedWindow()
    let products
    if (main) {
        products = new BrowserWindow ({
            width: 1280,
            height: 720,
            autoHideMenuBar: true,
            resizable: true,
            minimizable: true,
            //titleBarStyle: "hidden" // Esconder a barra de estilo (ex: totem de auto atendimento)
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
         })
    }
    
    products.loadFile('./src/views/produtos.html')

}

// Janela Relatórios
function reportsWindow () {
    nativeTheme.themeSource = "light"
    const main = BrowserWindow.getFocusedWindow()
    let reports
    if (main) {
        reports = new BrowserWindow ({
            width: 1280,
            height: 720,
            autoHideMenuBar: true,
            resizable: true,
            minimizable: true,
            //titleBarStyle: "hidden" // Esconder a barra de estilo (ex: totem de auto atendimento)
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
         })
    }
    
    reports.loadFile('./src/views/relatorios.html')

}

// Execução assíncrona do aplicativo electron
app.whenReady().then(() => {
    createWindow()

    // Melhor local para estabelecer a conexão com o banco de dados
    // Importar antes o módulo de conexã no início do código

    // conexão com o banco de dados
    ipcMain.on('db-connect', async(event, message) => {
        // a linha abaixo estabelece a conexão com o banco
        dbcon = await dbConnect()
        // enviar ao renderizador uma mensagem para trocar o ícone do status do banco de dados
        event.reply('db-message', "conectado")
    })

    // desconectar do banco de dados ao encerrar a aplicação
    app.on('before-quit', async () => {
        await desconectar(dbcon)
    })

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

// Encerrar a aplicação quando a janela for fechada (windows e linux)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// Template do menu
const template = [
    {
        label: 'Arquivo',
        submenu: [
            {
                label: 'Novo',
                accelerator: 'CmdOrCtrl+N'
            },

            {
                label: 'Abrir',
                accelerator: 'CmdOrCtrl+O'
            },
            {
                label: 'Salvar',
                accelerator: 'CmdOrCtrl+S'
            },
            {
                label: 'Salvar Como',
                accelerator: 'CmdOrCtrl+Shift+S'
            },

            {
                type: 'separator'
            },
            {
                label: 'Sair',
                accelerator: 'Alt+F4',
                click: () => app.quit()
            }

        ]
    },

    {
        label: 'Zoom',
        submenu: [
            {
                label:'Aplicar zoom',
                role: 'zoomIn'
            },

            {
                label:'Reduzir',
                role: 'zoomOut'
            },

            {
                label:'Restaurar o zoom padrão',
                role: 'resetZoom'
            },
        ]
    },

    {
        label: 'Ajuda',
        submenu: [
            {
                label: 'Repositório',
                click: () => shell.openExternal('https://github.com/andrewdantas/conestv3')
            },

            {
                label: 'Sobre',
                click: () => aboutWindow() 
            }
        ]
    }
]

/****************************************/
/*************** Clientes **************/
/**************************************/

// CRUD Create >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Recebimento dos dados do formulário do cliente
ipcMain.on('new-client', async (event, cliente) => {
    // Teste de recebimento dos dados (Passo 2 - slide) Importante!
    console.log(cliente)

    // Passo 3 - slide (cadastrar os dados do banco de dados)
    try {
        // Criar um novo objeto usando a classe modelo
        const novoCliente = new clienteModel({
            nomeCliente: cliente.nomeCli,
            foneCliente: cliente.foneCli,
            emailCliente: cliente.emailCli,
            cepCliente: cliente.cepCli,
            logradouroCliente: cliente.logradouroCli,
            numeroCliente: cliente.numeroCli,
            bairroCliente: cliente.bairroCli,
            cidadeCliente: cliente.cidadeCli,
            ufCliente: cliente.ufCli
        })
        // A linha abaixo usa a biblioteca moongoose para salvar
        await novoCliente.save()

        // Confirmação  de cliente  adicionado no banco
        dialog.showMessageBox({
            type: 'info',
            title: 'Aviso',
            message: "Cliente Adicionado com Sucesso",
            buttons: ['OK']
        })
        // Enviar uma resposta para o renderizador resetar o formulário
        event.reply('reset-form')

    } catch (error) {
        console.log(error)
    }
})
// Fim CRUD Create <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


// CRUD Read >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('search-client', async (event, cliNome) => {
    // teste de recebimento do nome do cliente a ser pesquisado (passo 2)
    console.log(cliNome)
    // Passo 3 e 4 - Pesquisar no banco de dados o client pelo nome
    // find() -> buscar no banco de dados (mongoose)
    // RegExp -> filtro pelo nome do cliente, 'i' insensitive ( maiúsculo ou minúsculo)
    // ATENÇÃO: nomeCliente -> model | cliNome -> renderizador
    try {
        const dadosCliente = await clienteModel.find ({
            nomeCliente: new RegExp(cliNome, 'i')
        })
        console.log(dadosCliente) // teste do passo 3 e 4
        // Passo 5 - slide -> enviar os dados do cliente para o renderizador (JSON.stringify converte para JSON)
        event.reply('data-client', JSON.stringify(dadosCliente))
    } catch (error) {
        console.log(error)
    }
})
// Fim CRUD Read <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<



/********************************************/
/*************** Fornecedores **************/
/******************************************/

// CRUD Create >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Recebimento dos dados do formulário do fornecedor
ipcMain.on('new-supplier', async (event, fornecedor) => {
    // Teste de recebimento dos dados (Passo 2 - slide) Importante!
    console.log(fornecedor)

    // Passo 3 - slide (cadastrar os dados do banco de dados)
    try {
        // Criar um novo objeto usando a classe modelo
        const novoFornecedor = new fornecedorModel({
            nomeFornecedor: fornecedor.nomeFor,
            foneFornecedor: fornecedor.foneFor,
            siteFornecedor: fornecedor.siteFor,
            cepFornecedor: fornecedor.cepFor,
            logradouroFornecedor: fornecedor.logradouroFor,
            numeroFornecedor: fornecedor.numeroFor,
            bairroFornecedor: fornecedor.bairroFor,
            cidadeFornecedor: fornecedor.cidadeFor,
            ufFornecedor: fornecedor.ufFor

        })
        // A linha abaixo usa a biblioteca moongoose para salvar
        await novoFornecedor.save()

        // Confirmação  de cliente  adicionado no banco
        dialog.showMessageBox({
            type: 'info',
            title: 'Aviso',
            message: "Fornecedor Adicionado com Sucesso",
            buttons: ['OK']
        })
        // Enviar uma resposta para o renderizador resetar o formulário
        event.reply('reset-form')

    } catch (error) {
        console.log(error)
    }
})
// Fim CRUD Create <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


// CRUD Read >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('search-supplier', async (event, forNome) => {
    // teste de recebimento do nome do fornecedor a ser pesquisado (passo 2)
    console.log(forNome)
    // Passo 3 e 4 - Pesquisar no banco de dados o fornecedor pelo nome
    // find() -> buscar no banco de dados (mongoose)
    // RegExp -> filtro pelo nome do fornecedor, 'i' insensitive ( maiúsculo ou minúsculo)
    // ATENÇÃO: nomeFornecedor -> model | forNome -> renderizador
    try {
        const dadosFornecedor = await fornecedorModel.find ({
            nomeFornecedor: new RegExp(forNome, 'i')
        })
        console.log(dadosFornecedor) // teste do passo 3 e 4
        // Passo 5 - slide -> enviar os dados do fornecedor para o renderizador (JSON.stringify converte para JSON)
        event.reply('data-supplier', JSON.stringify(dadosFornecedor))
    } catch (error) {
        console.log(error)
    }
})
// Fim CRUD Read <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<



/********************************************/
/*************** Produtos ******************/
/******************************************/

// CRUD Create >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Recebimento dos dados do formulário do produto
ipcMain.on('new-product', async (event, produto) => {
    // Teste de recebimento dos dados (Passo 2 - slide) Importante!
    console.log(produto)

    // Passo 3 - slide (cadastrar os dados do banco de dados)
    try {
        // Criar um novo objeto usando a classe modelo
        const novoProduto = new produtoModel({
            nomeProduto: produto.nomePro,
            barcodeProduto: produto.barcodePro,
            precoProduto: produto.precoPro
        })
        // A linha abaixo usa a biblioteca moongoose para salvar
        await novoProduto.save()

        // Confirmação  de cliente  adicionado no banco
        dialog.showMessageBox({
            type: 'info',
            title: 'Aviso',
            message: "Produto Adicionado com Sucesso",
            buttons: ['OK']
        })
        // Enviar uma resposta para o renderizador resetar o formulário
        event.reply('reset-form')

    } catch (error) {
        console.log(error)
    }
})
// Fim CRUD Create <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


// CRUD Read >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('search-product', async (event, proNome) => {
    // teste de recebimento do nome do produto a ser pesquisado (passo 2)
    console.log(proNome)
    // Passo 3 e 4 - Pesquisar no banco de dados o produto pelo nome
    // find() -> buscar no banco de dados (mongoose)
    // RegExp -> filtro pelo nome do produto, 'i' insensitive ( maiúsculo ou minúsculo)
    // ATENÇÃO: nomeProduto -> model | proNome -> renderizador
    try {
        const dadosProduto = await produtoModel.find ({
            nomeProduto: new RegExp(proNome, 'i')
        })
        console.log(dadosProduto) // teste do passo 3 e 4
        // Passo 5 - slide -> enviar os dados do produto para o renderizador (JSON.stringify converte para JSON)
        event.reply('data-product', JSON.stringify(dadosProduto))
    } catch (error) {
        console.log(error)
    }
})
// Fim CRUD Read <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// CRUD Read Barcode >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('search-barcode', async (event, barCode) => {
    // teste de recebimento do nome do produto a ser pesquisado (passo 2)
    console.log(barCode)
    // Passo 3 e 4 - Pesquisar no banco de dados o produto pelo nome
    // find() -> buscar no banco de dados (mongoose)
    // RegExp -> filtro pelo nome do produto, 'i' insensitive ( maiúsculo ou minúsculo)
    // ATENÇÃO: nomeProduto -> model | proNome -> renderizador
    try {
        const dadosBarcode = await produtoModel.find ({
            barcodeProduto: new RegExp(barCode, 'i')
        })
        console.log(dadosBarcode) // teste do passo 3 e 4
        // Passo 5 - slide -> enviar os dados do produto para o renderizador (JSON.stringify converte para JSON)
        event.reply('data-barcode', JSON.stringify(dadosBarcode))
    } catch (error) {
        console.log(error)
    }
})
// Fim CRUD Read Barcode <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<