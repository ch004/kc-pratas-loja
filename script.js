// VARIÁVEIS DE CONTROLE DO CARROSSEL
let slideIndex = 0;
// Seleciona todos os elementos com a classe 'banner-slide'
const slides = document.querySelectorAll('.banner-slide'); 
const totalSlides = slides.length;

// FUNÇÃO PRINCIPAL PARA MOSTRAR OS SLIDES
function showSlides() {
    // Esconde todos os slides (Define display: none)
    slides.forEach(slide => {
        slide.style.display = 'none';  
    });

    // Incrementa o índice
    slideIndex++;

    // Se o índice for maior que o número total de slides, volta para 1
    if (slideIndex > totalSlides) {
        slideIndex = 1
    }

    // Se houver slides, mostra o slide atual
    if (totalSlides > 0) {
        // Arrays são baseados em 0, por isso usamos (slideIndex - 1)
        slides[slideIndex - 1].style.display = 'block';
    }
    
    // Chama a função novamente após 4 segundos (4000 milissegundos)
    // Isso cria a transição automática
    setTimeout(showSlides, 4000); 
}

// Inicia a função showSlides quando todo o HTML é carregado
document.addEventListener('DOMContentLoaded', () => {
    // Só inicia se houver slides no HTML
    if (totalSlides > 0) {
        showSlides();
    }
});