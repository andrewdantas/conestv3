/**
 * Modelo de Dados (Fornecedores)
 */

// importação de bibliotecas
const { model, Schema } = require('mongoose')

// criação da estrutura de dados ("tabela") que será usada no banco
const fornecedoresSchema = new Schema ({
    nomeFornecedor: {
        type: String
    },
    foneFornecedor: {
        type: String
    },
    siteFornecedor: {
        type: String
    },
})

// exportar para o arquivo main.js
// Para modificar o nome da coleção ("tabela"), basta modificar na linha abaixo o rótulo 'Fornecedor', sempre iniciando com letra maiúscula
module.exports = model('Fornecedores', fornecedoresSchema)