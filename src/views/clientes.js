/**
 * Processo de renderização
 * clientes.js
 */
 
const foco = document.getElementById('searchClient')
 
//Mudar as propriedades do documento html ao iniciar a janela
document.addEventListener('DOMContentLoaded', () => {
    //btnCreate.disabled = true
    btnUpdate.disabled = true
    btnDelete.disabled = true
    foco.focus()
    //Desativar o input das caixas de texto dentro da Div .bloqueio
    document.querySelectorAll('.bloqueio input').forEach(input => {
        input.disabled = true
    })
})
 
// Função para manipular o evento da tecla Enter
function teclaEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault()
        buscarCliente()
    }
}
 
// Função para remover o manipulador do evento da tecla Enter
function restaurarEnter() {
    document.getElementById('frmClient').removeEventListener('keydown', teclaEnter)
}
 
// manipulando o evento (tecla Enter)
document.getElementById('frmClient').addEventListener('keydown', teclaEnter)
 
// Array usado nos métodos para manipulação da estrutura de dados
let arrayCliente = []
 
// Passo 1 - slide (capturar os dados dos inputs do form)
let formCliente = document.getElementById('frmClient')
let idCliente = document.getElementById('inputIdClient')
let nomeCliente = document.getElementById('inputNameClient')
let dddCliente = document.getElementById('inputdddClient')
let emailCliente = document.getElementById('inputEmailClient')
let cepCliente = document.getElementById('inputCepClient')
let logradouroCliente = document.getElementById('inputLogradouroClient')
let numeroCliente = document.getElementById('inputNumeroClient')
let bairroCliente = document.getElementById('inputBairroClient')
let cidadeCliente = document.getElementById('inputCidadeClient')
let ufCliente = document.getElementById('inputUfClient')
let telefoneCliente = document.getElementById('inputTelefoneClient')
let cpfCliente = document.getElementById('inputCpfClient')
let complementoCliente = document.getElementById('inputComplementoClient')
 
// CRUD Create/Update >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Evento associado ao botão adicionar (quando o botão for pressionado)
formCliente.addEventListener('submit', async (event) => {
    // Evitar o comportamento padrão de envio em um form
    event.preventDefault()
        // Teste importante! (fluxo dos dados)
        / console.log(idCliente.value, nomeCliente.value, dddCliente.value, emailCliente.value)
 
    // Passo 2 - slide (envio das informações para o main)
    // Estratégia para determinar se é um novo cadastro de cliente ou a edição de um cliente já existente
    if (idCliente.value === "") {
        // Criar um objeto
        const cliente = {
            nomeCli: nomeCliente.value,
            dddCli: dddCliente.value,
            emailCli: emailCliente.value,
            cepCli: cepCliente.value,
            logradouroCli: logradouroCliente.value,
            numeroCli: numeroCliente.value,
            bairroCli: bairroCliente.value,
            cidadeCli: cidadeCliente.value,
            ufCli: ufCliente.value,
            telefoneCli: telefoneCliente.value,
            cpfCli: cpfCliente.value,
            complementoCli: complementoCliente.value
        }
        api.novoCliente(cliente)
    } else {
        // Criar um objeto
        const cliente = {
            idCli: idCliente.value,
            nomeCli: nomeCliente.value,
            dddCli: dddCliente.value,
            emailCli: emailCliente.value,
            cepCli: cepCliente.value,
            logradouroCli: logradouroCliente.value,
            numeroCli: numeroCliente.value,
            bairroCli: bairroCliente.value,
            cidadeCli: cidadeCliente.value,
            ufCli: ufCliente.value,
            telefoneCli: telefoneCliente.value,
            cpfCli: cpfCliente.value,
            complementoCli: complementoCliente.value
        }
        api.editarCliente(cliente)
    }
})
// Fim do CRUD Create/Update <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 
// CRUD Read >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function buscarCliente() {
    // Passo 1 (slide)
    let cliNome = document.getElementById('searchClient').value
    //validação
    if (cliNome === "") {
        api.validarBusca() //validação do campo obrigatório
        foco.focus()
    } else {
        //console.log(cliNome) // teste do passo 1
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
                document.getElementById('inputIdClient').value = c._id
                document.getElementById('inputNameClient').value = c.nomeCliente
                document.getElementById('inputdddClient').value = c.dddCliente
                document.getElementById('inputEmailClient').value = c.emailCliente
                document.getElementById('inputCepClient').value = c.cepCliente
                document.getElementById('inputLogradouroClient').value = c.logradouroCliente
                document.getElementById('inputNumeroClient').value = c.numeroCliente
                document.getElementById('inputBairroClient').value = c.bairroCliente
                document.getElementById('inputCidadeClient').value = c.cidadeCliente
                document.getElementById('inputUfClient').value = c.ufCliente
                document.getElementById('inputTelefoneClient').value = c.telefoneCliente
                document.getElementById('inputCpfClient').value = c.cpfCliente
                document.getElementById('inputComplementoClient').value = c.complementoCliente
 
                //limpar o campo de busca e remover o foco
                foco.value = ""
 
                foco.disabled = true
                btnRead.disabled = true
                btnCreate.disabled = true
 
                //foco.blur()
                //liberar os botões editar e excluir
                document.getElementById('btnUpdate').disabled = false
                document.getElementById('btnDelete').disabled = false
                //restaurar o padrão da tecla Enter
                restaurarEnter()
            })
        })
    }
    //setar o nome do cliente e liberar o botão adicionar
    api.setarNomeCliente(() => {
        //setar o nome do cliente      
        let campoNome = document.getElementById('searchClient').value
        document.getElementById('inputNameClient').focus()
        document.getElementById('inputNameClient').value = campoNome
        //limpar o campo de busca e remover o foco
        foco.value = ""
        foco.blur()
        //liberar o botão adicionar
        btnCreate.disabled = false
        //restaurar o padrão da tecla Enter
        restaurarEnter()
        //Reativar o input das caixas de texto
        document.querySelectorAll('.bloqueio input').forEach(input => {
            input.disabled = false
        })
    })
}
// Fim do CRUD Read <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 
 
// CRUD Delete >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function excluirCliente() {
    api.deletarCliente(idCliente.value) // Passo 1 do slide
}
// Fim do CRUD Delete <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 
 
 
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
                dddCliente.value = `(${ddd}) `
            }
        } catch (error) {
            console.log("Erro ao buscar CEP:", error)
        }
    }
})
 
 
// Reset Form >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
api.resetarFormulario((args) => {
    resetForm()
})
 
function resetForm() {
    // Recarregar a página
    location.reload()
}
// Fim - Reset Form <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

function validarCpf(cpf) {
    cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false; // CPF inválido
    }

    let soma = 0, peso = 10;

    // Primeiro dígito verificador
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * peso--;
    }
    let digito1 = 11 - (soma % 11);
    if (digito1 >= 10) digito1 = 0;
    if (parseInt(cpf.charAt(9)) !== digito1) return false;

    // Segundo dígito verificador
    soma = 0;
    peso = 11;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * peso--;
    }
    let digito2 = 11 - (soma % 11);
    if (digito2 >= 10) digito2 = 0;
    if (parseInt(cpf.charAt(10)) !== digito2) return false;

    return true;
}

async function validarExistenciaCpf(cpf) {
    const inputCpf = document.getElementById('inputCpfClient');

    if (!validarCpf(cpf)) {
        inputCpf.value = '';
        inputCpf.placeholder = 'CPF inválido!';
        return;
    }

    try {
        const response = await fetch(`https://api.validador-cpf.com/${cpf}`); // API fictícia, substitua por uma real
        const data = await response.json();

        if (data.exists) {
        } else {
            inputCpf.placeholder = 'CPF não encontrado!';
        }
    } catch (error) {
        inputCpf.placeholder = 'Erro ao validar CPF';
        console.error('Erro ao validar CPF:', error);
    }
}

document.getElementById('inputCpfClient').addEventListener('blur', () => {
    const cpf = document.getElementById('inputCpfClient').value;
    validarExistenciaCpf(cpf);
});

// Restaurar placeholder quando o usuário digitar novamente
document.getElementById('inputCpfClient').addEventListener('input', function () {
    this.placeholder = 'Digite seu CPF';
});
