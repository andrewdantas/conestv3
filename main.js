const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain, dialog, globalShortcut } = require('electron/main')
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
        width: 1100, //largura
        height: 800, //altura
        resizable: false,  // Impede o redimensionamento manual
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // Menu personalizado (comentar para debugar)
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))

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
function aboutWindow() {
    nativeTheme.themeSource = "light"
    const main = BrowserWindow.getFocusedWindow()
    let about
    if (main) {
        about = new BrowserWindow({
            width: 1100,
            height: 800,
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
let client
function clientWindow() {
    nativeTheme.themeSource = "light"
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
        client = new BrowserWindow({
            width: 1100,
            height: 800,
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

    client.loadFile('./src/views/clientes.html')

    //client.once('ready-to-show', () => {
    // dialog.showMessageBox(client, {
    // type: 'info',
    // title: 'Aviso',
    // message: 'Pesquise um cliente antes de continuar',
    //  buttons: ['OK']
    // })
    //})
}

// Janela Fornecedores
let supplier
function supplierWindow() {
    nativeTheme.themeSource = "light"
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
        supplier = new BrowserWindow({
            width: 1100,
            height: 800,
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

    //supplier.once('ready-to-show', () => {
    // dialog.showMessageBox(supplier, {
    //   type: 'info',
    // title: 'Aviso',
    //  message: 'Pesquise um forncedor antes de continuar',
    //  buttons: ['OK']
    // })
    //})
}

// Janela Produtos
let products
function productsWindow() {
    nativeTheme.themeSource = "light"
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
        products = new BrowserWindow({
            width: 1100,
            height: 800,
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

    products.loadFile('./src/views/produtos.html')

    // products.once('ready-to-show', () => {
    // dialog.showMessageBox(products, {
    // type: 'info',
    // title: 'Aviso',
    // message: 'Pesquise um produto antes de continuar',
    // buttons: ['OK']
    // })
    //})
}

// Janela Relatórios
let reports
function reportsWindow() {
    nativeTheme.themeSource = "light"
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
        reports = new BrowserWindow({
            width: 1100,
            height: 800,
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
    // Registar atalho global para devtools em qualquer janela ativa
    globalShortcut.register('Ctrl+Shift+I', () => {
        const tools = BrowserWindow.getFocusedWindow()
        if (tools) {
            tools.webContents.openDevTools()
        }
    })

    // Desregistrar atalhos globais antes de sair
    app.on('will-quit', () => {
        globalShortcut.unregisterAll()
    })

    createWindow()
    // Melhor local para estabelecer a conexão com o banco de dados
    // Importar antes o módulo de conexã no início do código

    // conexão com o banco de dados
    ipcMain.on('db-connect', async (event, message) => {
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

// Reduzir logs não críticos (mensagens no console quando executar devtools)
app.commandLine.appendSwitch('log-level', '3')


// Template do menu
const template = [
    {
        label: 'Cadastro',
        submenu: [
            {
                label: 'Clientes',
                click: () => clientWindow()
            },
            {
                label: 'Fornecedores',
                click: () => supplierWindow()
            },
            {
                label: 'Produtos',
                click: () => productsWindow()
            },
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
        label: 'Relatórios'
    },

    {
        label: 'Zoom',
        submenu: [
            {
                label: 'Aplicar zoom',
                role: 'zoomIn'
            },

            {
                label: 'Reduzir',
                role: 'zoomOut'
            },

            {
                label: 'Restaurar o zoom padrão',
                role: 'resetZoom'
            },
        ]
    },

    {
        label: 'Ajuda',
        submenu: [
            {
                label: 'Repositório',
                click: () => shell.openExternal('SEU LINK DO GITHUB')
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
            dddCliente: cliente.dddCli,
            emailCliente: cliente.emailCli,
            cepCliente: cliente.cepCli,
            logradouroCliente: cliente.logradouroCli,
            numeroCliente: cliente.numeroCli,
            bairroCliente: cliente.bairroCli,
            cidadeCliente: cliente.cidadeCli,
            ufCliente: cliente.ufCli,
            telefoneCliente: cliente.telefoneCli,
            cpfCliente: cliente.cpfCli,
            complementoCliente: cliente.complementoCli
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
// CAMPO DE BUSCA (MENSAGEM 3X "Preencha um nome no campo de busca")
ipcMain.on('dialog-search', () => {
    dialog.showMessageBox({
        type: 'warning',
        title: 'Atenção!',
        message: 'Preencha um nome no campo de busca',
        buttons: ['OK']
    })
})

ipcMain.on('search-client', async (event, cliNome) => {
    // teste de recebimento do nome do cliente a ser pesquisado (passo 2)
    console.log(cliNome)
    // Passo 3 e 4 - Pesquisar no banco de dados o client pelo nome
    // find() -> buscar no banco de dados (mongoose)
    // RegExp -> filtro pelo nome do cliente, 'i' insensitive ( maiúsculo ou minúsculo)
    // ATENÇÃO: nomeCliente -> model | cliNome -> renderizador
    try {
        const dadosCliente = await clienteModel.find({
            nomeCliente: new RegExp(cliNome, 'i')
        })
        console.log(dadosCliente) // teste do passo 3 e 4
        // Passo 5 - slide -> enviar os dados do cliente para o renderizador (JSON.stringify converte para JSON)
        // Melhoria na experiência do usuário (se não existir o cliente cadastrado, enviar mensagem e questionar se o usário deseja cadastrar um novo cliente)
        if (dadosCliente.length === 0) {
            dialog.showMessageBox({
                type: 'warning',
                title: 'Clientes',
                message: 'Cliente não cadastrado.\nDeseja cadastrar este cliente?', // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                buttons: ['Sim', 'Não']
            }).then((result) => {
                console.log(result)
                if (result.response === 0) {
                    // Enviar ao renderizador um pedido para setar o nome do cliente (trazendo do campo de busca) e liberar o botão adicionar
                    event.reply('set-nameClient')
                } else {
                    // Enviar ao renderizador um pedido para limpar os campos do formulário
                    event.reply('reset-form')
                }
            })
        }
        event.reply('data-client', JSON.stringify(dadosCliente))
    } catch (error) {
        console.log(error)
    }
})
// Fim CRUD Read <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// CRUD Update >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('update-client', async (event, cliente) => {
    // teste de recebimento dos dados do cliente ( passo 2 )
    console.log(cliente)
    try {
        const clienteEditado = await clienteModel.findByIdAndUpdate(
            cliente.idCli, {
            nomeCliente: cliente.nomeCli,
            dddCliente: cliente.dddCli,
            emailCliente: cliente.emailCli,
            cepCliente: cliente.cepCli,
            logradouroCliente: cliente.logradouroCli,
            numeroCliente: cliente.numeroCli,
            bairroCliente: cliente.bairroCli,
            cidadeCliente: cliente.cidadeCli,
            ufCliente: cliente.ufCli,
            telefoneCliente: cliente.telefoneCli,
            cpfCliente: cliente.cpfCli,
            complementoCliente: cliente.complementoCli
        },
            {
                new: true
            }
        )

    } catch (error) {
        console.log(error)
    }
    dialog.showMessageBox(client, {
        type: 'info',
        message: 'Dados do cliente alterados com sucesso.',
        buttons: ['OK']
    }).then((result) => {
        if (result.response === 0) {
            event.reply('reset-form')
        }
    })
})
// Fim do CRUD Update <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// CRUD Delete <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
ipcMain.on('delete-client', async (event, idCliente) => {
    //Teste de recebimento do id do Cliente (passo 2 do slide)
    console.log(idCliente)
    // Confirmação antes de excluir o cliente *IMPORTANTE*
    // "client" é a variável ref a janela de cleintes
    const { response } = await dialog.showMessageBox(client, {
        type: 'warning',
        buttons: ['Cancelar', 'Excluir'], //[0,1]
        title: 'Atenção!',
        message: 'Tem certeza que deseja excluir esse cliente?'
    })
    // apoio a lógica
    console.log(response)
    if (response === 1) {
        // Passo 3 slide
        try {
            const clienteExcluido = await clienteModel.findByIdAndDelete(idCliente)
            dialog.showMessageBox({
                type: 'info',
                title: 'Aviso',
                message: 'Cliente excluído com sucesso!!!',
                buttons: ['OK']
            })
            event.reply('reset-form')
        } catch (error) {

        }
    }
})
// Fim do CRUD delete >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

/********************************************/
/*************** Fornecedores **************/
/******************************************/

// Acessar site externo
ipcMain.on('url-site', (event, site) => {
    let url = site.url
    // console.log(url)
    shell.openExternal(url)
    
})

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
            dddFornecedor: fornecedor.dddFor,
            siteFornecedor: fornecedor.siteFor,
            cepFornecedor: fornecedor.cepFor,
            logradouroFornecedor: fornecedor.logradouroFor,
            numeroFornecedor: fornecedor.numeroFor,
            bairroFornecedor: fornecedor.bairroFor,
            cidadeFornecedor: fornecedor.cidadeFor,
            ufFornecedor: fornecedor.ufFor,
            cpnjFornecedor: fornecedor.cnpjFor,
            complementoFornecedor: fornecedor.complementoFor,
            telefoneFornecedor: fornecedor.telefoneFor
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
        const dadosFornecedor = await fornecedorModel.find({
            nomeFornecedor: new RegExp(forNome, 'i')
        })
        console.log(dadosFornecedor) // teste do passo 3 e 4
        // Passo 5 - slide -> enviar os dados do fornecedor para o renderizador (JSON.stringify converte para JSON)
        // Melhoria na experiência do usuário (se não existir o fornecedor cadastrado, enviar mensagem e questionar se o usário deseja cadastrar um novo fornecedor)
        if (dadosFornecedor.length === 0) {
            dialog.showMessageBox({
                type: 'warning',
                title: 'Fornecedor',
                message: 'Fornecedor não cadastrado.\nDeseja cadastrar este fornecedor?',
                buttons: ['Sim', 'Não']
            }).then((result) => {
                console.log(result)
                if (result.response === 0) {
                    // Enviar ao renderizador um pedido para setar o nome do fornecedor (trazendo do campo de busca) e liberar o botão adicionar
                    event.reply('set-nameSupplier')
                } else {
                    // Enviar ao renderizador um pedido para limpar os campos do formulário
                    event.reply('reset-form')
                }
            })
        }
        event.reply('data-supplier', JSON.stringify(dadosFornecedor))
    } catch (error) {
        console.log(error)
    }
})
// Fim CRUD Read <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// CRUD Update >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('update-supplier', async (event, fornecedor) => {
    // teste de recebimento dos dados do fornecedor ( passo 2 )
    console.log(fornecedor)
    try {
        const fornecedorEditado = await fornecedorModel.findByIdAndUpdate(
            fornecedor.idFor, {
            nomeFornecedor: fornecedor.nomeFor,
            dddFornecedor: fornecedor.dddFor,
            siteFornecedor: fornecedor.siteFor,
            cepFornecedor: fornecedor.cepFor,
            logradouroFornecedor: fornecedor.logradouroFor,
            numeroFornecedor: fornecedor.numeroFor,
            bairroFornecedor: fornecedor.bairroFor,
            cidadeFornecedor: fornecedor.cidadeFor,
            ufFornecedor: fornecedor.ufFor,
            cpnjFornecedor: fornecedor.cnpjFor,
            complementoFornecedor: fornecedor.complementoFor,
            telefoneFornecedor: fornecedor.telefoneFor
        },
            {
                new: true
            }
        )

    } catch (error) {
        console.log(error)
    }
    dialog.showMessageBox(supplier, {
        type: 'info',
        message: 'Dados do fornecedor alterados com sucesso.',
        buttons: ['OK']
    }).then((result) => {
        if (result.response === 0) {
            event.reply('reset-form')
        }
    })
})
// Fim do CRUD Update <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// CRUD Delete <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
ipcMain.on('delete-supplier', async (event, idFornecedor) => {
    //Teste de recebimento do id do Fornecedor (passo 2 do slide)
    console.log(idFornecedor)
    // Confirmação antes de excluir o Fornecedor *IMPORTANTE*
    // "supplier" é a variável ref a janela de fornecedor
    const { response } = await dialog.showMessageBox(supplier, {
        type: 'warning',
        buttons: ['Cancelar', 'Excluir'], //[0,1]
        title: 'Atenção!',
        message: 'Tem certeza que deseja excluir esse fornecedor?'
    })
    // apoio a lógica
    console.log(response)
    if (response === 1) {
        // Passo 3 slide
        try {
            const fornecedorExcluido = await fornecedorModel.findByIdAndDelete(idFornecedor)
            dialog.showMessageBox({
                type: 'info',
                title: 'Aviso',
                message: 'Fornecedor excluído com sucesso!!!',
                buttons: ['OK']
            })
            event.reply('reset-form')
        } catch (error) {

        }
    }
})
// Fim do CRUD delete >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>



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


// CRUD Read - Nome barcode >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

ipcMain.on('search-product', async (event, proNome) => {
    // teste de recebimento do nome do produto a ser pesquisado (passo 2)
    console.log(proNome)
    // Passo 3 e 4 - Pesquisar no banco de dados o produto pelo nome
    // find() -> buscar no banco de dados (mongoose)
    // RegExp -> filtro pelo nome do produto, 'i' insensitive ( maiúsculo ou minúsculo)
    // ATENÇÃO: nomeProduto -> model | proNome -> renderizador
    try {
        const dadosProduto = await produtoModel.find({
            nomeProduto: new RegExp(proNome, 'i')
        })
        console.log(dadosProduto) // teste do passo 3 e 4
        // Passo 5 - slide -> enviar os dados do produto para o renderizador (JSON.stringify converte para JSON)
        // Melhoria na experiência do usuário (se não existir o produto cadastrado, enviar mensagem e questionar se o usário deseja cadastrar um novo produto)
        if (dadosProduto.length === 0) {
            dialog.showMessageBox({
                type: 'warning',
                title: 'Produto',
                message: 'Produto não cadastrado.\nDeseja cadastrar este produto?',
                buttons: ['Sim', 'Não']
            }).then((result) => {
                console.log(result)
                if (result.response === 0) {
                    // Enviar ao renderizador um pedido para setar o nome do produto (trazendo do campo de busca) e liberar o botão adicionar
                    event.reply('set-nameProduct')
                } else {
                    // Enviar ao renderizador um pedido para limpar os campos do formulário
                    event.reply('reset-form')
                }
            })
        }
        event.reply('data-product', JSON.stringify(dadosProduto))
    } catch (error) {
        console.log(error)
    }
})
// Fim CRUD Read <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// CRUD Delete - Nome produto <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
ipcMain.on('delete-product', async (event, idProduto) => {
    //Teste de recebimento do id do Produto (passo 2 do slide)
    console.log(idProduto)
    // Confirmação antes de excluir o Produto *IMPORTANTE*
    // "products" é a variável ref a janela de produtos
    const { response } = await dialog.showMessageBox(products, {
        type: 'warning',
        buttons: ['Cancelar', 'Excluir'], //[0,1]
        title: 'Atenção!',
        message: 'Tem certeza que deseja excluir esse produto?'
    })
    // apoio a lógica
    console.log(response)
    if (response === 1) {
        // Passo 3 slide
        try {
            const produtoExcluido = await produtoModel.findByIdAndDelete(idProduto)
            dialog.showMessageBox({
                type: 'info',
                title: 'Aviso',
                message: 'Produto excluído com sucesso!!!',
                buttons: ['OK']
            })
            event.reply('reset-form')
        } catch (error) {

        }
    }
})
// Fim do CRUD delete >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>



//***************************BARCODE********************************/
//**************************************************************** */
//>>>>>>>>>>>>>>>>>BARCODE - DELETE - UPDATE>>>>>>>>>>>>>>>>>>>>>>>*/

// CRUD Read Barcode >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('search-barcode', async (event, barCode) => {
    // teste de recebimento do nome do produto a ser pesquisado (passo 2)
    console.log(barCode)
    // Passo 3 e 4 - Pesquisar no banco de dados o produto pelo nome
    // find() -> buscar no banco de dados (mongoose)
    // RegExp -> filtro pelo nome do produto, 'i' insensitive ( maiúsculo ou minúsculo)
    // ATENÇÃO: nomeProduto -> model | proNome -> renderizador
    try {
        const dadosBarcode = await produtoModel.find({
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

// CRUD Update BARCODE>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('update-product', async (event, produto) => {
    // teste de recebimento dos dados do produto ( passo 2 )
    console.log(produto)
    try {
        const produtoEditado = await produtoModel.findByIdAndUpdate(
            produto.idPro, {
            nomeProduto: produto.nomePro,
            barcodeProduto: produto.barcodePro,
            precoProduto: produto.precoPro
        },
            {
                new: true
            }
        )

    } catch (error) {
        console.log(error)
    }
    dialog.showMessageBox(products, {
        type: 'info',
        message: 'Dados do produto alterados com sucesso.',
        buttons: ['OK']
    }).then((result) => {
        if (result.response === 0) {
            event.reply('reset-form')
        }
    })
})
// Fim do CRUD Update <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


// CRUD Delete - Nome produto <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
ipcMain.on('delete-barcode', async (event, idProduto) => {
    //Teste de recebimento do id do Produto (passo 2 do slide)
    console.log(idProduto)
    // Confirmação antes de excluir o Produto *IMPORTANTE*
    // "products" é a variável ref a janela de produtos
    const { response } = await dialog.showMessageBox(products, {
        type: 'warning',
        buttons: ['Cancelar', 'Excluir'], //[0,1]
        title: 'Atenção!',
        message: 'Tem certeza que deseja excluir esse produto?'
    })
    // apoio a lógica
    console.log(response)
    if (response === 1) {
        // Passo 3 slide
        try {
            const barcodeExcluido = await produtoModel.findByIdAndDelete(idProduto)
            dialog.showMessageBox({
                type: 'info',
                title: 'Aviso',
                message: 'Produto excluído com sucesso!!!',
                buttons: ['OK']
            })
            event.reply('reset-form')
        } catch (error) {

        }
    }
})
// Fim do CRUD delete >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>