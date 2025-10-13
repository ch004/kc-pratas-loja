// ===================================
// 1. Variáveis Globais e Inicialização
// ===================================

// Variável de estado: armazena todos os produtos que o cliente adicionou
let itensCarrinho = [];

// Elementos HTML do Carrinho
const carrinhoLateral = document.getElementById('carrinho-lateral');
const botaoAbrir = document.getElementById('abrir-carrinho');
const botaoFechar = document.getElementById('fechar-carrinho');
const listaItens = document.getElementById('itens-carrinho');
const valorTotalSpan = document.getElementById('valor-total');
const contadorCarrinhoSpan = document.getElementById('contador-carrinho');
const produtosContainer = document.querySelector('.produtos'); // Seletor do seu container de produtos
const botaoFinalizar = document.getElementById('finalizar-compra');


// ===================================
// 2. Lógica de Abrir e Fechar o Carrinho
// ===================================

// Ação de Abrir o Carrinho
botaoAbrir.addEventListener('click', () => {
    // Adiciona a classe 'aberto' que o CSS usa para mostrar a barra lateral
    carrinhoLateral.classList.add('aberto');
});

// Ação de Fechar o Carrinho
botaoFechar.addEventListener('click', () => {
    carrinhoLateral.classList.remove('aberto');
});


// ===================================
// 3. Funções de Adicionar/Remover/Atualizar
// ===================================

/**
 * Adiciona um produto ao carrinho
 * @param {string} nome - Nome do produto (ex: Colar de Trevo)
 * @param {number} preco - Preço do produto (ex: 44.90)
 * @param {string} id - ID único (usaremos o nome por enquanto)
 */
function adicionarAoCarrinho(nome, preco, id) {
    const itemExistente = itensCarrinho.find(item => item.id === id);

    if (itemExistente) {
        // Se o item já existe, apenas aumenta a quantidade
        itemExistente.quantidade++;
    } else {
        // Se é um item novo, adiciona com quantidade 1
        itensCarrinho.push({ nome, preco, id, quantidade: 1 });
    }

    // Atualiza a interface (a lista de itens e o total)
    renderizarCarrinho();
    // Faz o carrinho abrir automaticamente para feedback
    carrinhoLateral.classList.add('aberto');
}

/**
 * Remove um item do carrinho
 * @param {string} id - ID do item a ser removido
 */
function removerDoCarrinho(id) {
    // Filtra a lista, mantendo apenas os itens que NÃO têm o ID passado
    itensCarrinho = itensCarrinho.filter(item => item.id !== id);
    renderizarCarrinho();
}

/**
 * Atualiza o display do carrinho (HTML, Total, Contador)
 */
function renderizarCarrinho() {
    // Limpa o conteúdo atual da lista de itens
    listaItens.innerHTML = '';
    let total = 0;
    let contador = 0;

    if (itensCarrinho.length === 0) {
        // Mostra mensagem de carrinho vazio
        listaItens.innerHTML = '<p class="carrinho-vazio-msg">Seu carrinho está vazio.</p>';
    } else {
        // Percorre cada item no array e cria o HTML para ele
        itensCarrinho.forEach(item => {
            const precoTotalItem = item.preco * item.quantidade;
            total += precoTotalItem;
            contador += item.quantidade;
            
            const itemHTML = `
                <div class="carrinho-item">
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

    // Atualiza o total e o contador de itens no cabeçalho
    valorTotalSpan.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    contadorCarrinhoSpan.textContent = contador;

    // Adiciona o evento de clique aos novos botões de remoção
    document.querySelectorAll('.botao-remover').forEach(botao => {
        botao.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            removerDoCarrinho(id);
        });
    });
}


// ===================================
// 4. Lógica de Envio (Transformar em WhatsApp)
// ===================================

botaoFinalizar.addEventListener('click', () => {
    if (itensCarrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    // Monta a mensagem para o WhatsApp
    let mensagem = "Olá! Gostaria de fazer o seguinte pedido na KC Pratas:\n\n";
    let totalFinal = 0;

    itensCarrinho.forEach(item => {
        const precoItem = item.preco * item.quantidade;
        totalFinal += precoItem;
        mensagem += `${item.quantidade}x ${item.nome} - R$ ${precoItem.toFixed(2).replace('.', ',')}\n`;
    });

    mensagem += `\nTotal do Pedido: R$ ${totalFinal.toFixed(2).replace('.', ',')}`;
    mensagem += "\n\nPor favor, me ajude a finalizar a compra e calcular o frete. Obrigado(a)!";

    // Formata a mensagem para a URL
    const numeroWhatsApp = '5511977429648'; // Seu número de WhatsApp
    const mensagemCodificada = encodeURIComponent(mensagem);
    const url = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;

    // Abre a URL em uma nova aba
    window.open(url, '_blank');
});


// ===================================
// 5. Conectar os Botões dos Produtos
// ===================================

// Quando a página carregar, a função irá configurar todos os botões dos produtos.
document.addEventListener('DOMContentLoaded', () => {
    
    // Primeiro, vamos garantir que a sua estrutura HTML de produtos tenha um ID único para cada DIV de produto.
    // Você PRECISA modificar a sua estrutura HTML de cada produto assim:
    // <div class="produto" data-nome="Colar de Trevo Vazado" data-preco="44.90" data-id="colar-trevo">
    
    document.querySelectorAll('.produto').forEach(produtoDiv => {
        // Encontra o botão "Comprar no WhatsApp" ou similar dentro da DIV do produto
        const botaoAntigo = produtoDiv.querySelector('.botao-whatsapp'); 
        
        // Cria um novo botão "Adicionar ao Carrinho"
        const novoBotao = document.createElement('button');
        novoBotao.textContent = 'Adicionar ao Carrinho';
        novoBotao.classList.add('botao-adicionar-carrinho');
        
        // Substitui o botão antigo pelo novo
        if (botaoAntigo) {
            botaoAntigo.parentNode.replaceChild(novoBotao, botaoAntigo);
        } else {
            // Se não encontrou o botão antigo, apenas adiciona o novo no final
            produtoDiv.appendChild(novoBotao);
        }

        // Adiciona a funcionalidade de clique ao novo botão
        novoBotao.addEventListener('click', () => {
            // Pega as informações do produto a partir dos atributos 'data-' na DIV
            const nome = produtoDiv.getAttribute('data-nome');
            const precoTexto = produtoDiv.getAttribute('data-preco');
            const id = produtoDiv.getAttribute('data-id');
            
            // Converte o preço de texto para número para o cálculo
            const preco = parseFloat(precoTexto); 
            
            if (nome && preco && id) {
                adicionarAoCarrinho(nome, preco, id);
            } else {
                console.error("Erro: Produto faltando atributos 'data-nome', 'data-preco' ou 'data-id' no HTML.");
                alert("Erro ao adicionar produto. Verifique o HTML.");
            }
        });
    });

    // Inicia o renderizador
    renderizarCarrinho();
});