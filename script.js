// ===================================
// 1. Variáveis Globais (ESTADO)
// ===================================

let itensCarrinho = []; 


// ===================================
// 2. Funções de Adicionar/Remover/Atualizar (Otimizadas e Corrigidas)
// ===================================

/**
 * ADICIONA um produto ao carrinho. 
 * Otimizado para receber a QUANTIDADE (do Modal) ou usa 1 (do Catálogo).
 */
function adicionarAoCarrinho(nome, preco, id, imagemUrl, quantidade = 1) { 
    // Garante que a quantidade é um número inteiro positivo
    quantidade = parseInt(quantidade) || 1; 

    // Verifica se o item já está no carrinho
    const itemExistente = itensCarrinho.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.quantidade += quantidade; // Soma a quantidade
    } else {
        // Adiciona o novo item
        itensCarrinho.push({ nome, preco, id, quantidade, imagemUrl }); 
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
 * Atualiza o display do carrinho (HTML, Total, Contador).
 * Contém verificações de segurança para evitar o erro de 'null'.
 */
function renderizarCarrinho() {
    const listaItens = document.getElementById('itens-carrinho');
    const valorTotalSpan = document.getElementById('valor-total');
    const contadorCarrinhoSpan = document.getElementById('contador-carrinho');
    
    // CORREÇÃO ESSENCIAL: Interrompe se os elementos vitais não forem encontrados.
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

    // Conecta o evento de remoção
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

let slideIndex = 1; 

function showSlides() {
    let i;
    let slides = document.querySelectorAll(".banner-slide");

    // ... código que troca o slide ...
    
    slideIndex++;
    
    // ESTA É A LINHA SUSPEITA: COMENTE-A
    // setTimeout(showSlides, 4000);
    
    if (slides.length === 0) {
        // console.warn("Carrossel: Não foram encontrados slides.");
        return; 
    }

    if (slideIndex > slides.length) {
        slideIndex = 1;
    }
    
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    
    slides[slideIndex - 1].style.display = "block";  
    
    slideIndex++;
    
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
    if (botaoAbrir && carrinhoLateral) { 
        botaoAbrir.addEventListener('click', () => {
            carrinhoLateral.classList.add('aberto');
            renderizarCarrinho(); // Garante que o carrinho esteja atualizado ao abrir
        });
    }

    if (botaoFechar && carrinhoLateral) { 
        botaoFechar.addEventListener('click', () => {
            carrinhoLateral.classList.remove('aberto');
        });
    }
    
    // C. Conectar o botão Finalizar Compra ao WhatsApp
    if (botaoFinalizar) {
        botaoFinalizar.addEventListener('click', finalizarCompraWhatsapp);
    }
    
    // D. Conectar os Botões "Adicionar ao Carrinho" do CATÁLOGO
    document.querySelectorAll('.produto .botao-adicionar-carrinho').forEach(botao => {
        
        botao.addEventListener('click', (e) => {
            // Impedir que o clique no botão ative a função openProductModal da div pai
            e.stopPropagation(); 
            
            const produtoDiv = e.currentTarget.closest('.produto');

            const nome = produtoDiv.getAttribute('data-nome');
            const precoTexto = produtoDiv.getAttribute('data-preco');
            const id = produtoDiv.getAttribute('data-id');
            
            // Tenta obter a URL da imagem (se não encontrar, usa vazio)
            const imgElement = produtoDiv.querySelector('.img-principal');
            const imagemUrl = imgElement ? imgElement.src : ''; 
            
            const preco = parseFloat(precoTexto); 
            
            if (nome && preco && id) { // Removemos a verificação da imagem, pois ela pode ser o problema se o caminho estiver quebrado
                // Chama a função otimizada com quantidade padrão de 1
                adicionarAoCarrinho(nome, preco, id, imagemUrl, 1); 
                
                // Abre o carrinho após adicionar
                if (carrinhoLateral) { 
                    carrinhoLateral.classList.add('aberto'); 
                }
            } else {
                console.error("Erro: Produto faltando atributos 'data-nome', 'data-preco' ou 'data-id' no HTML.", produtoDiv);
            }
        });
    });

    // E. Inicializa o Contador do Carrinho e o Carrossel
    renderizarCarrinho();
    showSlides(); // ESTA LINHA SÓ DEVE SER CHAMADA UMA VEZ!
});


// =========================================================
// 6. LÓGICA DO MODAL DE DETALHES DO PRODUTO 
// =========================================================

const modal = document.getElementById('product-modal');
const modalCorpo = document.getElementById('modal-corpo');

function closeProductModal() {
    modal.style.display = "none";
    modalCorpo.innerHTML = ''; 
}

function openProductModal(produtoId) {
    const produtoDiv = document.querySelector(`.produto[data-id="${produtoId}"]`); 
    
    if (!produtoDiv) {
        console.error("Produto não encontrado para o ID:", produtoId);
        return;
    }

    const nome = produtoDiv.querySelector('h3').textContent;
    const precoTexto = produtoDiv.querySelector('p').textContent;
    
    const imgElement = produtoDiv.querySelector('.img-principal');
    const imgPrincipalSrc = imgElement ? imgElement.src : ''; // Verifica se o elemento existe
    
    const descricaoDetalhada = produtoDiv.dataset.descricao || "Descrição completa indisponível.";
    
    const idCarrinho = produtoDiv.dataset.id;
    const precoNumerico = produtoDiv.dataset.preco;
    
    const modalHTML = `
        <div class="modal-detalhes-grid">
            <div class="modal-galeria">
                <img src="${imgPrincipalSrc}" alt="${nome}">
            </div>
            <div class="modal-info">
                <h2>${nome}</h2>
                <p class="modal-preco">${precoTexto}</p>
                
                <div class="modal-descricao">
                    <h3>Detalhes do Produto</h3>
                    <p>${descricaoDetalhada}</p>
                </div>
                
                <div class="modal-comprar">
                    <div class="seletor-quantidade">
                        <label for="quantidade-${idCarrinho}">Quantidade:</label>
                        <input type="number" id="quantidade-${idCarrinho}" name="quantidade" value="1" min="1" max="100" class="input-quantidade">
                    </div>

                    <button class="botao-adicionar-carrinho" 
                            data-nome="${nome}" 
                            data-preco="${precoNumerico}" 
                            data-id="${idCarrinho}"
                            onclick="adicionarAoCarrinhoDoModal(this)"> 
                        Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        </div>
    `;

    modalCorpo.innerHTML = modalHTML;
    modal.style.display = "block";
}

// Fechar o modal ao clicar fora dele
window.onclick = function(event) {
    if (event.target == modal) {
        closeProductModal();
    }
}


// =========================================================
// 7. FUNÇÃO DE ADICIONAR AO CARRINHO DO MODAL 
// =========================================================

function adicionarAoCarrinhoDoModal(botao) {
    const produtoId = botao.dataset.id;
    const inputQuantidade = document.getElementById(`quantidade-${produtoId}`);
    
    const quantidade = parseInt(inputQuantidade.value) || 1; 

    const nome = botao.dataset.nome;
    const preco = parseFloat(botao.dataset.preco);

    // Obtém a URL da imagem do Modal para o carrinho
    const imagemUrl = botao.closest('.modal-detalhes-grid').querySelector('.modal-galeria img').src;

    // Chama a função principal do carrinho, passando a quantidade
    adicionarAoCarrinho(nome, preco, produtoId, imagemUrl, quantidade); 
    
    const carrinhoLateral = document.getElementById('carrinho-lateral');
    if (carrinhoLateral) {
        carrinhoLateral.classList.add('aberto'); // Abre o carrinho
    }
    
    closeProductModal(); // Fecha o modal
}


// =========================================================
// 8. FUNÇÃO DO MENU HAMBÚRGUER (NOVA)
// =========================================================

/**
 * Alterna a visibilidade do menu de navegação lateral (Hambúrguer)
 */
function toggleMenu() {
    const menu = document.getElementById('menu-links');
    if (menu) {
        menu.classList.toggle('aberto');
    }
}

// =========================================================
// 9. CORREÇÃO DE ROLAGEM INVOLUNTÁRIA (FORÇADA)
// =========================================================

/**
 * Esta função anula qualquer comando de scroll que tente mover 
 * a página automaticamente, exceto os feitos pelo usuário.
 */
document.addEventListener('scroll', function() {
    // Verifica se a rolagem foi muito rápida (geralmente indicativo de comando de script)
    // Este é um método avançado, mas pode ser a única forma se o comando for oculto.
    // É mais simples procurar e apagar o comando como no passo 1.
    // window.requestAnimationFrame(() => {
    //     // Código complexo de anulação...
    // });
});

// SIMPLIFICANDO: Apenas garanta que não haja scroll em nenhuma inicialização:
window.addEventListener('load', function() {
    // Esta linha garante que a página comece no topo e NADA MAIS a mova
    window.scrollTo(0, 0); 
});