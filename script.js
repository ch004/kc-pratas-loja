// ===================================
// 1. Variáveis Globais (APENAS ESTADO)
// ===================================

let itensCarrinho = []; 


// ===================================
// 2. Funções de Adicionar/Remover/Atualizar
// ===================================

/**
 * Adiciona um produto ao carrinho
 */
function adicionarAoCarrinho(nome, preco, id, imagemUrl) { 
    const itemExistente = itensCarrinho.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        itensCarrinho.push({ nome, preco, id, quantidade: 1, imagemUrl }); 
    }

    renderizarCarrinho();
}

/**
 * Remove um item do carrinho
 */
function removerDoCarrinho(id) {
    itensCarrinho = itensCarrinho.filter(item => item.id !== id);
    renderizarCarrinho();
}

/**
 * Atualiza o display do carrinho (HTML, Total, Contador)
 */
function renderizarCarrinho() {
    const listaItens = document.getElementById('itens-carrinho');
    const valorTotalSpan = document.getElementById('valor-total');
    const contadorCarrinhoSpan = document.getElementById('contador-carrinho');
    
    // Verificação de segurança: se os elementos não existem, interrompe
    if (!listaItens || !valorTotalSpan || !contadorCarrinhoSpan) return;


    listaItens.innerHTML = '';
    let total = 0;
    let contador = 0;

    if (itensCarrinho.length === 0) {
        listaItens.innerHTML = '<p class="carrinho-vazio-msg">Seu carrinho está vazio.</p>';
    } else {
        itensCarrinho.forEach(item => {
            const precoTotalItem = item.preco * item.quantidade;
            total += precoTotalItem;
            contador += item.quantidade;
            
            const itemHTML = `
                <div class="carrinho-item">
                    <img src="${item.imagemUrl}" alt="${item.nome}" class="carrinho-item-thumb"> 
                    <p class="carrinho-item-nome">${item.nome}</p>
                    <div class="carrinho-item-info">
                        <span class="carrinho-item-quantidade">${item.quantidade}x</span>
                        <span class="carrinho-item-preco">R$ ${precoTotalItem.toFixed(2).replace('.', ',')}</span>
                        <button class="botao-remover" data-id="${item.id}">&times;</button>
                    </div>
                </div>
            `;
            listaItens.innerHTML += itemHTML;
        });
    }

    valorTotalSpan.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    contadorCarrinhoSpan.textContent = contador;

    document.querySelectorAll('.botao-remover').forEach(botao => {
        botao.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            removerDoCarrinho(id);
        });
    });
}


// ===================================
// 3. Lógica do Carrossel (Banner)
// ===================================

let slideIndex = 1; // Variável global para controlar qual slide está ativo

function showSlides() {
    let i;
    // Pega todos os slides (divs com a classe .banner-slide)
    let slides = document.querySelectorAll(".banner-slide");
    
    // Se não encontrar os slides (por causa da correção de HTML anterior), para a função
    if (slides.length === 0) {
        console.warn("Carrossel: Não foram encontrados slides.");
        return; 
    }

    // Se o slideIndex for maior que o número de slides, volta para o primeiro (loop infinito)
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }
    
    // Esconde todos os slides (display: none;)
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    
    // Mostra o slide atual (slideIndex - 1, pois arrays começam em 0)
    slides[slideIndex - 1].style.display = "block";  
    
    // Prepara para o próximo slide
    slideIndex++;
    
    // Chama a função novamente em 4 segundos (4000ms)
    setTimeout(showSlides, 4000); 
}


// ===================================
// 4. Lógica de Envio (WhatsApp)
// ===================================

function finalizarCompraWhatsapp() {
    if (itensCarrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    let mensagem = "Olá! Gostaria de fazer o seguinte pedido na KC Pratas:\n\n";
    let totalFinal = 0;

    itensCarrinho.forEach(item => {
        const precoItem = item.preco * item.quantidade;
        totalFinal += precoItem;
        mensagem += `${item.quantidade}x ${item.nome} - R$ ${precoItem.toFixed(2).replace('.', ',')}\n`;
    });

    mensagem += `\nTotal do Pedido: R$ ${totalFinal.toFixed(2).replace('.', ',')}`;
    mensagem += "\n\nPor favor, me ajude a finalizar a compra e calcular o frete. Obrigado(a)!";

    // Número do WhatsApp (Ajuste se necessário)
    const numeroWhatsApp = '5511977429648'; 
    const mensagemCodificada = encodeURIComponent(mensagem);
    const url = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;

    window.open(url, '_blank');
}


// ===================================
// 5. INICIALIZAÇÃO E CONEXÃO (RODA DEPOIS DO HTML ESTAR PRONTO)
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    
    // A. Elementos HTML do Carrinho
    const carrinhoLateral = document.getElementById('carrinho-lateral');
    const botaoAbrir = document.getElementById('abrir-carrinho');
    const botaoFechar = document.getElementById('fechar-carrinho');
    const botaoFinalizar = document.getElementById('finalizar-compra');

    // B. Lógica de Abrir e Fechar o Carrinho
    if (botaoAbrir && carrinhoLateral) { // Verifica a existência
        botaoAbrir.addEventListener('click', () => {
            carrinhoLateral.classList.add('aberto');
        });
    }

    if (botaoFechar && carrinhoLateral) { // Verifica a existência
        botaoFechar.addEventListener('click', () => {
            carrinhoLateral.classList.remove('aberto');
        });
    }
    
    // C. Conectar o botão Finalizar Compra ao WhatsApp
    if (botaoFinalizar) {
        botaoFinalizar.addEventListener('click', finalizarCompraWhatsapp);
    }
    
    // D. Conectar os Botões "Adicionar ao Carrinho" aos produtos
    document.querySelectorAll('.produto').forEach(produtoDiv => {
        
        // Cria o botão dinamicamente e anexa ele no HTML
        const novoBotao = document.createElement('button');
        novoBotao.textContent = 'Adicionar ao Carrinho';
        novoBotao.classList.add('botao-adicionar-carrinho');
        
        const produtoInfo = produtoDiv.querySelector('.produto-info');
        if (produtoInfo) {
            produtoInfo.appendChild(novoBotao);
        } else {
            // Caso não encontre .produto-info, anexa ao final da div .produto
            produtoDiv.appendChild(novoBotao);
        }

        novoBotao.addEventListener('click', () => {
            const nome = produtoDiv.getAttribute('data-nome');
            const precoTexto = produtoDiv.getAttribute('data-preco');
            const id = produtoDiv.getAttribute('data-id');
            const imagemUrl = produtoDiv.getAttribute('data-imagem-url'); 
            
            const preco = parseFloat(precoTexto); 
            
            if (nome && preco && id && imagemUrl) {
                adicionarAoCarrinho(nome, preco, id, imagemUrl); 
                carrinhoLateral.classList.add('aberto'); 
            } else {
                console.error("Erro: Produto faltando atributos 'data-nome', 'data-preco', 'data-id' ou 'data-imagem-url' no HTML.");
            }
        });
    });

    // E. Inicializa o Contador do Carrinho e o Carrossel
    renderizarCarrinho();
    showSlides(); // <-- Aqui o Carrossel é iniciado!
});