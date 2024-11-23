const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain, dialog} = require('electron/main')
const path = require('node:path')

// Importação módulo de conexão 
const { dbConnect, desconectar } = require('./database.js')
// status de conexão com o banco. No MongoDB é mais eficiente mantrer uma única conexão aberta durante todo o tempo de vida do aplicativo e usá-lo quando necessário. Fechar e reabrir constantemente a conexão aumenta a sobrecarga e reduz o desempenho do servidor.
// a variável abaixo é usada para garantir que o banco de dados inicie desconectado (evitar abrir outra instância).
let dbcon = null

// importação do Schema Clientes da camada model
const clienteModel = require('./src/models/Clientes.js')

// Janela Principal
let win
function createWindow() {
    nativeTheme.themeSource = 'light'
    win = new BrowserWindow({
        width: 1010,
        height: 720,
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
            width: 320,
            height: 160,
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
            width: 800,
            height: 600,
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
            width: 800,
            height: 600,
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
            width: 800,
            height: 600,
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
            width: 800,
            height: 600,
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

// CRUD Create >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Recebimento dos dados do formulário
ipcMain.on('new-client', async (event, cliente) => {
    // Teste de recebimento dos dados (Passo 2 - slide) Importante!
    console.log(cliente)

    // Passo 3 - slide (cadastrar os dados do banco de dados)
    try {
        // Criar um novo objeto usando a classe modelo
        const novoCliente = new clienteModel({
            nomeCliente: cliente.nomeCli,
            foneCliente: cliente.foneCli,
            emailCliente: cliente.emailCli
        })
        // A linha abaixo usa a biblioteca moongoose para salvar
        await novoCliente.save()

        // Confirmação  de cliente  adicionado no banco
        dialog.showMessageBox({
            type: 'info',
            title: 'Aviso',
            message: "Cliente adicionado com sucesso",
            buttons: ['OK']
        })
        // Enviar uma resposta para o renderizador resetar o formulário
        event.reply('reset-form')

    } catch (error) {
        console.log(error)
    }
})
