/**
 * Modelo de Dados (Clientes)
 */

// importação de bibliotecas
const { model, Schema } = require('mongoose')

// criação da estrutura de dados ("tabela") que será usada no banco
const clienteSchema = new Schema ({
    nomeCliente: {
        type: String
    },
    foneCliente: {
        type: String
    },
    emailCliente: {
        type: String
    },
    cepCliente: {
        type: String
    },
    logradouroCliente: {
        type: String
    },
    bairroCliente: {
        type: String
    },
    cidadeCliente: {
        type: String
    },
    ufCliente: {
        type: String
    }
})

// exportar para o arquivo main.js
// Para modificar o nome da coleção ("tabela"), basta modificar na linha abaixo o rótulo 'Clientes', sempre iniciando com letra maiúscula
module.exports = model('Clientes', clienteSchema)
