/**
 * Processo de renderização
 * produtos.js
 */

// Array usado nos métodos para manipulação da estrutura de dados 
let arrayProduto = []

// CRUD Create >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// Passo 1 - slide (capturar os dados dos inputs do form)
let formProduto = document.getElementById('frmProduct')
let nomeProduto = document.getElementById('inputNameProduct')
let barcodeProduto = document.getElementById('inputBarcodeProduct')
let precoProduto = document.getElementById('inputPriceProduct')

// Evento associado ao botão adicionar (quando o botão for pressionado)
formProduto.addEventListener('submit', async (event) => {
    // Evitar o comportamento padrão de envio em um form
    event.preventDefault()
    // Teste importante! (fluxo dos dados)
    // console.log(nomeCliente.value, foneCliente.value, emailCliente.value)

    // Passo 2 - slide (envio das informações para o main)
    // Criar um objeto
    const produto = {
        nomePro: nomeProduto.value,
        barcodePro: barcodeProduto.value,
        precoPro: precoProduto.value
    }
    api.novoProduto(produto)
})
// Fim do CRUD Create <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


// CRUD Read >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function buscarProduto() {
    // Passo 1 (slide)
    let proNome = document.getElementById('searchProduct').value
    console.log(proNome)
    // Passo 2 (slide) - Enviar o pedido de busca do produto ao main
    api.buscarProduto(proNome)
    // Passo 5 - Recebimento dos dados do produto
    api.renderizarProduto((event, dadosProduto) => {
        // teste de recebimento dos dados do produto
        console.log(dadosProduto)
        // Passo 6 (slide) - Renderização dos dados dos produto no formulário
        const produtoRenderizado = JSON.parse(dadosProduto)
        arrayProduto = produtoRenderizado
        // teste para entendimento da lógica
        console.log(arrayProduto)
        // percorrer o array de produtos, extrair os dados e setar (preencher) os campos do formulário
        arrayProduto.forEach((c) => {
            document.getElementById('inputNameProduct').value = c.nomeProduto
            document.getElementById('inputBarcodeProduct').value = c.barcodeProduto
            document.getElementById('inputPriceProduct').value = c.precoProduto
            document.getElementById('inputProduct').value = c._id
        })
    })
}
// Fim do CRUD Read <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
function buscarProdutoPorBarcode() {
    // Passo 1 (slide)
    let barNome = document.getElementById('searchBarcode').value
    console.log(barNome)
    // Passo 2 (slide) - Enviar o pedido de busca do produto ao main
    api.buscarProdutoPorBarcode(barNome)
    // Passo 5 - Recebimento dos dados do produto
    api.renderizarBarcode((event, dadosBarcode) => {
        // teste de recebimento dos dados do produto
        console.log(dadosBarcode)
        // Passo 6 (slide) - Renderização dos dados dos produto no formulário
        const barcodeRenderizado = JSON.parse(dadosBarcode)
        arrayProduto = barcodeRenderizado
        // teste para entendimento da lógica
        console.log(arrayProduto)
        // percorrer o array de produtos, extrair os dados e setar (preencher) os campos do formulário
        arrayProduto.forEach((c) => {
            document.getElementById('inputNameProduct').value = c.nomeProduto
            document.getElementById('inputBarcodeProduct').value = c.barcodeProduto
            document.getElementById('inputPriceProduct').value = c.precoProduto
            document.getElementById('inputProduct').value = c._id
        })
    })
}
// CRUD Read por Código de Barras >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// Fim do CRUD Read por Código de Barras <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<



// Reset Form >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
api.resetarFormulario((args) => {
    document.getElementById('inputNameProduct').value = ""
    document.getElementById('inputBarcodeProduct').value = ""
    document.getElementById('inputPriceProduct').value = ""
})


// Fim - Reset Form <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<