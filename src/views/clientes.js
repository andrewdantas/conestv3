/**
 * Processo de renderização
 * clientes.html
 */

// Array usado nos métodos para manipulação da estrutura de dados 
let arrayCliente = []

// CRUD Create >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// Passo 1 - slide (capturar os dados dos inputs do form)
let formCliente = document.getElementById('frmClient')
let nomeCliente = document.getElementById('inputNameClient')
let foneCliente = document.getElementById('inputPhoneClient')
let emailCliente = document.getElementById('inputEmailClient')
let cepCliente = document.getElementById('inputCepClient')
let logradouroCliente = document.getElementById('inputLogradouroClient')
let bairroCliente = document.getElementById('inputBairroClient')
let cidadeCliente = document.getElementById('inputCidadeClient')
let ufCliente = document.getElementById('inputUfClient')


// Evento associado ao botão adicionar (quando o botão for pressionado)
formCliente.addEventListener('submit', async (event) => {
    // Evitar o comportamento padrão de envio em um form
    event.preventDefault()
    // Teste importante! (fluxo dos dados)
    // console.log(nomeCliente.value, foneCliente.value, emailCliente.value)

    // Passo 2 - slide (envio das informações para o main)
    // Criar um objeto
    const cliente = {
        nomeCli: nomeCliente.value,
        foneCli: foneCliente.value,
        emailCli: emailCliente.value,
        cepCli: cepCliente.value,
        logradouroCli: logradouroCliente.value,
        bairroCli: bairroCliente.value,
        cidadeCli: cidadeCliente.value,
        ufCli: ufCliente.value
    }
    api.novoCliente(cliente)
})
// Fim do CRUD Create <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


// CRUD Read >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function buscarCliente() {
    // Passo 1 (slide)
    let cliNome = document.getElementById('searchClient').value
    console.log(cliNome)
    // Passo 2 (slide) - Enviar o pedido de busca do cliente ao main
    api.buscarCliente(cliNome)
    // Passo 5 - Recebimento dos dados do cliente
    api.renderizarCliente((event, dadosCliente) => {
        // teste de recebimento dos dados do cliente
        console.log(dadosCliente)
        // Passo 6 (slide) - Renderização dos dados dos cliente no formulário
        const clienteRenderizado = JSON.parse(dadosCliente)
        arrayCliente = clienteRenderizado
        // teste para entendimento da lógica
        console.log(arrayCliente)
        // percorrer o array de clientes, extrair os dados e setar (preencher) os campos do formulário
        arrayCliente.forEach((c) => {
            document.getElementById('inputNameClient').value = c.nomeCliente
            document.getElementById('inputPhoneClient').value = c.foneCliente
            document.getElementById('inputEmailClient').value = c.emailCliente
            document.getElementById('inputClient').value = c._id
        })
    })
}
// Fim do CRUD Read <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<



// Função para preencher os dados de endereço automaticamente
cepCliente.addEventListener('blur', async () => {
    let cep = cepCliente.value.replace(/\D/g, '') // Remove caracteres não numéricos

    if (cep.length === 8) { // Verifica se o CEP tem 8 dígitos
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
            const data = await response.json()

            if (data.erro) {
                console.log("CEP não encontrado!")
            } else {
                logradouroCliente.value = data.logradouro
                bairroCliente.value = data.bairro
                cidadeCliente.value = data.localidade
                ufCliente.value = data.uf
            }
        } catch (error) {
            console.log("Erro ao buscar CEP:", error)
        }
    }
})

// Mapeamento de DDDs por estado ou cidade
const dddMapping = {
    // Região Norte
    "AC": 68, // Acre
    "AM": 92, // Amazonas
    "AP": 96, // Amapá
    "PA": 91, // Pará
    "RO": 69, // Rondônia
    "RR": 95, // Roraima
    "TO": 63, // Tocantins

    // Região Nordeste
    "AL": 82, // Alagoas
    "BA": 71, // Bahia
    "CE": 85, // Ceará
    "MA": 98, // Maranhão
    "PB": 83, // Paraíba
    "PE": 81, // Pernambuco
    "PI": 86, // Piauí
    "RN": 84, // Rio Grande do Norte
    "SE": 79, // Sergipe

    // Região Centro-Oeste
    "DF": 61, // Distrito Federal
    "GO": 62, // Goiás
    "MT": 65, // Mato Grosso
    "MS": 67, // Mato Grosso do Sul

    // Região Sudeste
    "ES": 27, // Espírito Santo
    "MG": 31, // Minas Gerais
    "RJ": 21, // Rio de Janeiro
    "SP": 11, // São Paulo

    // Região Sul
    "PR": 41, // Paraná
    "RS": 51, // Rio Grande do Sul
    "SC": 48, // Santa Catarina

}

// Função para buscar o DDD com base na UF ou Cidade
function getDDD(uf, cidade) {
    // Se a cidade específica estiver mapeada, use-a
    if (dddMapping[cidade]) {
        return dddMapping[cidade]
    }
    // Caso contrário, use o DDD geral do estado (UF)
    return dddMapping[uf] || "Desconhecido"
}

// Função para preencher os dados de endereço e DDD automaticamente
cepCliente.addEventListener('blur', async () => {
    let cep = cepCliente.value.replace(/\D/g, '') // Remove caracteres não numéricos

    if (cep.length === 8) { // Verifica se o CEP tem 8 dígitos
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
            const data = await response.json()

            if (data.erro) {
                console.log("CEP não encontrado!")
            } else {
                logradouroCliente.value = data.logradouro
                bairroCliente.value = data.bairro
                cidadeCliente.value = data.localidade
                ufCliente.value = data.uf

                // Determina o DDD baseado na UF ou cidade
                const ddd = getDDD(data.uf, data.localidade)
                foneCliente.value = `(${ddd}) `
            }
        } catch (error) {
            console.log("Erro ao buscar CEP:", error)
        }
    }
})


// Reset Form >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
api.resetarFormulario((args) => {
    document.getElementById('inputNameClient').value = ""
    document.getElementById('inputPhoneClient').value = ""
    document.getElementById('inputEmailClient').value = ""
    document.getElementById('inputCepClient').value = ""
    document.getElementById('inputLogradouroClient').value = ""
    document.getElementById('inputBairroClient').value = ""
    document.getElementById('inputCidadeClient').value = ""
    document.getElementById('inputUfClient').value = ""
})
// Fim - Reset Form <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<