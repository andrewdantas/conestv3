/**
 * Processo de renderização
 * fornecedores.html
 */

// CRUD Create >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// Passo 1 - slide (capturar os dados dos inputs do form)
let formFornecedor = document.getElementById('frmSupplier')
let nomeFornecedor = document.getElementById('inputNameSupplier')
let foneFornecedor = document.getElementById('inputPhoneSupplier')
let siteFornecedor = document.getElementById('inputSiteSupplier')
let cepFornecedor = document.getElementById('inputCepSupplier')
let logradouroFornecedor = document.getElementById('inputLogradouroSupplier')
let bairroFornecedor = document.getElementById('inputBairroSupplier')
let cidadeFornecedor = document.getElementById('inputCidadeSupplier')
let ufFornecedor = document.getElementById('inputUfSupplier')

// Evento associado ao botão adicionar (quando o botão for pressionado)
formFornecedor.addEventListener('submit', async (event) => {
    // Evitar o comportamento padrão de envio em um form
    event.preventDefault()
    // Teste importante! (fluxo dos dados)
    // console.log(nomeCliente.value, foneCliente.value, emailCliente.value)

    // Passo 2 - slide (envio das informações para o main)
    // Criar um objeto
    const fornecedor = {
        nomeFor: nomeFornecedor.value,
        foneFor: foneFornecedor.value,
        siteFor: siteFornecedor.value,
        cepFor: cepFornecedor.value,
        logradouroFor: logradouroFornecedor.value,
        bairroFor: bairroFornecedor.value,
        cidadeFor: cidadeFornecedor.value,
        ufFor: ufFornecedor.value
    }
    api.novoFornecedor(fornecedor)
})
// Fim do CRUD Create <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// Função para preencher os dados de endereço automaticamente
cepFornecedor.addEventListener('blur', async () => {
    let cep = cepFornecedor.value.replace(/\D/g, '') // Remove caracteres não numéricos

    if (cep.length === 8) { // Verifica se o CEP tem 8 dígitos
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
            const data = await response.json()

            if (data.erro) {
                //alert("CEP não encontrado!")
            } else {
                logradouroFornecedor.value = data.logradouro
                bairroFornecedor.value = data.bairro
                cidadeFornecedor.value = data.localidade
                ufFornecedor.value = data.uf
            }
        } catch (error) {
            console.log("Erro ao buscar CEP:", error)
            //alert("Erro ao buscar o CEP.")
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
cepFornecedor.addEventListener('blur', async () => {
    let cep = cepFornecedor.value.replace(/\D/g, '') // Remove caracteres não numéricos

    if (cep.length === 8) { // Verifica se o CEP tem 8 dígitos
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
            const data = await response.json()

            if (data.erro) {
                //alert("CEP não encontrado!")
            } else {
                logradouroFornecedor.value = data.logradouro
                bairroFornecedor.value = data.bairro
                cidadeFornecedor.value = data.localidade
                ufFornecedor.value = data.uf

                // Determina o DDD baseado na UF ou cidade
                const ddd = getDDD(data.uf, data.localidade)
                foneFornecedor.value = `(${ddd}) `
            }
        } catch (error) {
            console.log("Erro ao buscar CEP:", error)
        }
    }
})


// Reset Form >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
api.resetarFormulario((args) => {
    document.getElementById('inputNameSupplier').value = ""
    document.getElementById('inputPhoneSupplier').value = ""
    document.getElementById('inputSiteSupplier').value = ""
    document.getElementById('inputCepSupplier').value = ""
    document.getElementById('inputLogradouroSupplier').value = ""
    document.getElementById('inputBairroSupplier').value = ""
    document.getElementById('inputCidadeSupplier').value = ""
    document.getElementById('inputUfSupplier').value = ""
})


// Fim - Reset Form <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<