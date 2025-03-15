/**
 * Processo de renderização
 * produtos.js
 */
 
const foco = document.getElementById('searchProduct'); // Campo de busca pelo nome
const focoBarcode = document.getElementById('searchBarcode'); // Campo de busca pelo barcode
 
// Mudar as propriedades do documento HTML ao iniciar a janela
document.addEventListener('DOMContentLoaded', () => {
    // Configurações iniciais
    btnUpdate.disabled = true;
    btnDelete.disabled = true;
    focoBarcode.focus(); // Foco inicial no campo de barcode
});

// Receber a mensagem de barcode inválido
api.barcodeInvalido(() => {
    document.getElementById('inputBarcodeProduct').classList.add('campo-invalido')
})

// Remover a borda vermelha ao digitar
document.getElementById('inputBarcodeProduct').addEventListener('input', () => {
    document.getElementById('inputBarcodeProduct').classList.remove('campo-invalido')
})
 
// Manipulação do evento Enter para buscar por nome ou barcode
function teclaEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Impede o comportamento padrão da tecla Enter
        const valorBusca = focoBarcode.value || foco.value; // Obtém o valor do campo de busca
 
        if (focoBarcode === document.activeElement) {
            buscarProdutoPorBarcode(valorBusca); // Busca por barcode
        } else if (foco === document.activeElement) {
            buscarProduto(valorBusca); // Busca por nome
        }
    }
}
 
// Função para remover o manipulador do evento da tecla Enter
function restaurarEnter() {
    document.getElementById('frmProduct').removeEventListener('keydown', teclaEnter);
    document.getElementById('frmProduct').addEventListener('keydown', teclaEnter); // Reativa o listener
}
 
// Manipulando o evento (tecla Enter)
document.getElementById('frmProduct').addEventListener('keydown', teclaEnter);
 
// Array usado nos métodos para manipulação da estrutura de dados
let arrayProduto = [];
let arrayBarcode = [];
 
// Passo 1 - Capturar os dados dos inputs do form
let formProduto = document.getElementById('frmProduct');
let idProduto = document.getElementById('inputIdProduct');
let nomeProduto = document.getElementById('inputNameProduct');
let barcodeProduto = document.getElementById('inputBarcodeProduct');
let precoProduto = document.getElementById('inputPriceProduct');
let caminhoImagemProduto = document.getElementById('pathImageProduct');
let imagem = document.getElementById('imageProductPreview');
 
//variavel usada para armazenar o caminho da imagem
let caminhoImagem
 
// CRUD Create/Update >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// solicitar ao main o uso de explorador de aquivos e armazenar o caminho da imagem selecionada na variável caminhoImagem
async function uploadImage() {
    caminhoImagem = await api.selecionarArquivo()
    console.log(caminhoImagem)
    imagem.src = `file://${caminhoImagem}`
    btnCreate.focus()
}
 
formProduto.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita o comportamento padrão de envio do formulário

    // Criar um objeto produto
    if (idProduto.value === "") {
        // Novo produto
        const produto = {
            nomePro: nomeProduto.value,
            barcodePro: barcodeProduto.value,
            precoPro: precoProduto.value,
            caminhoImagemPro: caminhoImagem ? caminhoImagem : "" // Adiciona o caminho da imagem
        };
        api.novoProduto(produto); // Envia o novo produto para a API
    } else {
        // Editar produto existente
        const produto = {
            idPro: idProduto.value,
            nomePro: nomeProduto.value,
            barcodePro: barcodeProduto.value,
            precoPro: precoProduto.value,
            caminhoImagemPro: caminhoImagem ? caminhoImagem : "" // Adiciona o caminho da imagem
        };
        api.editarProduto(produto); // Envia o produto editado para a API
    }
});
// Fim do CRUD Create/Update <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 
// CRUD Read >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function buscarProduto() {
    let proNome = foco.value;

    if (proNome === "") {
        api.validarBusca(); // Validação do campo obrigatório
        foco.focus();
    } else {
        api.buscarProduto(proNome); // Envia a busca para a API

        api.renderizarProduto((event, dadosProduto) => {
            const produtoRenderizado = JSON.parse(dadosProduto);
            arrayProduto = produtoRenderizado;

            if (arrayProduto.length > 0) {
                // Produto encontrado
                arrayProduto.forEach((p) => {
                    document.getElementById('inputIdProduct').value = p._id;
                    document.getElementById('inputNameProduct').value = p.nomeProduto;
                    document.getElementById('inputBarcodeProduct').value = p.barcodeProduto;
                    document.getElementById('inputPriceProduct').value = p.precoProduto;

                    // Renderizar a imagem do produto (se existir)
                    if (p.caminhoImagemProduto) {
                        imagem.src = p.caminhoImagemProduto; // Atualiza o src da imagem
                    } else {
                        imagem.src = "../public/img/camera.png"; // Imagem padrão se não houver caminho
                    }

                    // Limpar o campo de busca e remover o foco
                    foco.value = ""; // Limpa o campo de busca
                    btnRead.disabled = true;
                    btnCreate.disabled = true; // Mantém o botão de adicionar desabilitado

                    btnUpdate.disabled = false;
                    btnDelete.disabled = false;
                    restaurarEnter();

                    // Desabilitar os campos de busca
                    desabilitarCamposBusca();
                });
            } else {
                // Produto não encontrado
                btnCreate.disabled = false; // Habilita o botão de adicionar
                btnUpdate.disabled = true;
                btnDelete.disabled = true;

                // Desabilitar os campos de busca
                desabilitarCamposBusca();
            }
        });
    }
}
 
 
// Captura o evento para setar o nome do produto
api.setarNomeProduto((event, nomeProduto) => {
    document.getElementById('inputNameProduct').value = nomeProduto; // Preenche o campo de nome do produto
    document.getElementById('searchProduct').value = ""; // Limpa o campo de busca
    btnCreate.disabled = false; // Habilita o botão de adicionar
 
    // Desabilitar os campos de busca
    desabilitarCamposBusca();
 
    // Colocar o foco no campo de nome do produto
    document.getElementById('inputNameProduct').focus();
});
 
 
// Função para buscar produto por barcode
let isProcessing = false; // Variável para controlar o estado de processamento
 
function buscarProdutoPorBarcode(barCode) {
    if (isProcessing) return; // Se já estiver processando, ignora
    isProcessing = true; // Marca como processando

    if (barCode === "") {
        api.validarBusca(); // Validação do campo obrigatório
        focoBarcode.focus();
    } else {
        api.buscarProdutoPorBarcode(barCode); // Envia a busca para a API

        api.renderizarBarcode((event, dadosBarcode) => {
            const barcodeRenderizado = JSON.parse(dadosBarcode);
            arrayBarcode = barcodeRenderizado;

            if (arrayBarcode.length > 0) {
                // Produto encontrado
                arrayBarcode.forEach((p) => {
                    document.getElementById('inputIdProduct').value = p._id;
                    document.getElementById('inputNameProduct').value = p.nomeProduto;
                    document.getElementById('inputBarcodeProduct').value = p.barcodeProduto;
                    document.getElementById('inputPriceProduct').value = p.precoProduto;

                    // Renderizar a imagem do produto (se existir)
                    if (p.caminhoImagemProduto) {
                        imagem.src = p.caminhoImagemProduto; // Atualiza o src da imagem
                    } else {
                        imagem.src = "../public/img/camera.png"; // Imagem padrão se não houver caminho
                    }

                    // Limpar o campo de busca e remover o foco
                    focoBarcode.value = "";
                    btnRead.disabled = true;
                    btnCreate.disabled = true;

                    btnUpdate.disabled = false;
                    btnDelete.disabled = false;
                    restaurarEnter();

                    // Desabilitar os campos de busca
                    desabilitarCamposBusca();
                });
            } else {
                // Produto não encontrado
                btnCreate.disabled = false; // Habilita o botão de adicionar
                btnUpdate.disabled = true;
                btnDelete.disabled = true;

                // Desabilitar os campos de busca
                desabilitarCamposBusca();
            }

            isProcessing = false; // Marca como processamento concluído
        });
    }
}
 
focoBarcode.value = ""; // Limpa o campo de busca
 
 
// Captura o evento para setar o código de barras
api.setarBarcode((event, barCode) => {
    document.getElementById('inputBarcodeProduct').value = barCode; // Preenche o campo de código de barras
    document.getElementById('searchBarcode').value = ""; // Limpa o campo de busca
    btnCreate.disabled = false; // Habilita o botão de adicionar
 
    // Desabilitar os campos de busca
    desabilitarCamposBusca();
 
    // Colocar o foco no campo de código de barras
    document.getElementById('inputBarcodeProduct').focus();
});
 
 
// Evento de input no campo de barcode para simular o "Enter"
let timeoutId;
 
focoBarcode.addEventListener('input', function () {
    clearTimeout(timeoutId); // Limpa o timeout anterior
    timeoutId = setTimeout(() => {
        if (focoBarcode.value !== "") {
            const enterEvent = new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                key: "Enter",
                keyCode: 13,
                which: 13,
            });
            focoBarcode.dispatchEvent(enterEvent); // Dispara o evento "Enter"
        }
    }, 200); // Atraso de 200ms (ajuste conforme necessário)
});
 
// CRUD Delete >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function excluirProduto() {
    api.deletarProduto(idProduto.value); // Envia o ID do produto para a API
}
// Fim do CRUD Delete <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 
 
// Função para desabilitar os campos de busca
function desabilitarCamposBusca() {
    document.getElementById('searchProduct').disabled = true; // Desabilita o campo de busca por nome
    document.getElementById('searchBarcode').disabled = true; // Desabilita o campo de busca por barcode
}
 
// Função para habilitar os campos de busca
function habilitarCamposBusca() {
    document.getElementById('searchProduct').disabled = false; // Habilita o campo de busca por nome
    document.getElementById('searchBarcode').disabled = false; // Habilita o campo de busca por barcode
}
 
// Função para navegar entre os campos com a tecla Enter
function navegarComEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Impede o comportamento padrão do Enter
 
        // Obtém o campo atual
        const campoAtual = event.target;
 
        // Obtém todos os campos do formulário
        const campos = Array.from(document.querySelectorAll('#frmProduct input[required]'));
 
        // Encontra o índice do campo atual
        const indiceAtual = campos.indexOf(campoAtual);
 
        // Se o campo atual for o último, envia o formulário
        if (indiceAtual === campos.length - 1) {
            document.getElementById('frmProduct').dispatchEvent(new Event('submit'));
        } else {
            // Move o foco para o próximo campo
            campos[indiceAtual + 1].focus();
        }
    }
}
 
// Adiciona o evento de tecla Enter a todos os campos required
document.querySelectorAll('#frmProduct input[required]').forEach(campo => {
    campo.addEventListener('keydown', navegarComEnter);
});
 
 
// Reset Form >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
api.resetarFormulario((args) => {
    resetForm();
});
 
function resetForm() {
    location.reload(); // Recarrega a página para resetar o formulário
}
// Fim - Reset Form <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<