/**
 * Modelo de Dados (Produtos)
 */
 
// importação de bibliotecas
const { model, Schema } = require('mongoose')
 
// criação da estrutura de dados ("tabela") que será usada no banco
const produtosSchema = new Schema ({
    nomeProduto: {
        type: String
    },
    barcodeProduto: {
        type: String
    },
    precoProduto: {
        type: String
    }
})
 
// exportar para o arquivo main.js
// Para modificar o nome da coleção ("tabela"), basta modificar na linha abaixo o rótulo 'Produtos', sempre iniciando com letra maiúscula
module.exports = model('Produtos', produtosSchema)