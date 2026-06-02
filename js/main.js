// ----- 1. BOTÓN VOLVER ARRIBA -----
const crearBotonVolver = () => {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.id = 'btn-volver';
    btn.style.cssText = `
        position: fixed; bottom: 30px; right: 30px; z-index: 99;
        background: #6c63ff; color: white; border: none;
        border-radius: 50%; width: 50px; height: 50px;
        font-size: 1.2rem; cursor: pointer; display: none;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        transition: opacity 0.3s;
    `;
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        btn.style.display = window.scrollY > 500 ? 'block' : 'none';
    });
};

// ----- 2. EFECTO TIPEO SIMPLE EN EL HERO (OPCIONAL) -----
const iniciarTipeo = () => {
    const elemento = document.querySelector('.subtitle');
    if (!elemento) return;
    
    const textoOriginal = elemento.textContent;
    elemento.textContent = '';
    
    let i = 0;
    const intervalo = setInterval(() => {
        if (i < textoOriginal.length) {
            elemento.textContent += textoOriginal.charAt(i);
            i++;
        } else {
            clearInterval(intervalo);
        }
    }, 80);
};

// ----- 3. ANIMAR TARJETAS AL APARECER (SCROLL) -----
const animarEntrada = () => {
    const tarjetas = document.querySelectorAll('.proyecto-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.2 });

    tarjetas.forEach(tarjeta => {
        tarjeta.style.opacity = 0;
        tarjeta.style.transform = 'translateY(30px)';
        tarjeta.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(tarjeta);
    });
};

// ----- INICIALIZAR TODO AL CARGAR -----
document.addEventListener('DOMContentLoaded', () => {
    crearBotonVolver();
    iniciarTipeo(); // Quita esta línea si no quieres el efecto
    animarEntrada();
});

function toggleFullscreen(videoId) {
    const video = document.getElementById(videoId);
    
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) { /* Safari */
        video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) { /* IE/Edge */
        video.msRequestFullscreen();
    }
}


//------------ DEMO PRYECTOS------------//
function abrirDemoFullscreen(contenedorId, videoId) {
    const contenedor = document.getElementById(contenedorId);
    const video = document.getElementById(videoId);
    
    // Pausar el video por si estaba reproduciéndose en la miniatura
    video.pause();
    
    // Mostrar controles en pantalla completa
    video.setAttribute('controls', 'controls');
    
    // Pedir pantalla completa al contenedor
    if (contenedor.requestFullscreen) {
        contenedor.requestFullscreen();
    } else if (contenedor.webkitRequestFullscreen) {
        contenedor.webkitRequestFullscreen();
    } else if (contenedor.msRequestFullscreen) {
        contenedor.msRequestFullscreen();
    }
    
    // Reproducir el video
    video.play();
    
    // Cuando salga de pantalla completa, quitar controles y pausar
    const salirFullscreen = () => {
        if (!document.fullscreenElement) {
            video.pause();
            video.removeAttribute('controls');
            document.removeEventListener('fullscreenchange', salirFullscreen);
            document.removeEventListener('webkitfullscreenchange', salirFullscreen);
        }
    };
    
    document.addEventListener('fullscreenchange', salirFullscreen);
    document.addEventListener('webkitfullscreenchange', salirFullscreen);
}

// ----- CARRUSEL DE FONDO DEL HERO -----
const iniciarCarrusel = () => {
    const slides = document.querySelectorAll('.carousel-slide');
    
    // Solo ejecutar si hay slides (estamos en index.html)
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    const intervalTime = 4000; // Cambia cada 4 segundos
    
    const nextSlide = () => {
        // Quitar active del actual
        slides[currentSlide].classList.remove('active');
        
        // Siguiente slide (o volver al primero)
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Activar el nuevo
        slides[currentSlide].classList.add('active');
    };
    
    // Iniciar el intervalo
    setInterval(nextSlide, intervalTime);
};

// Agregar a la inicialización existente
document.addEventListener('DOMContentLoaded', () => {
    crearBotonVolver();
    animarEntrada();
    iniciarCarrusel(); // ← Agregar esta línea
});

// ----- TOGGLE "LEER MÁS" EN PROYECTOS -----
function toggleDescripcion(boton) {
    // Evitar que el clic se propague a otros elementos
    event.stopPropagation();
    
    // Encontrar la tarjeta exacta a la que pertenece este botón
    const tarjeta = boton.closest('.proyecto-card');
    const descripcionCompleta = tarjeta.querySelector('.proyecto-descripcion-completa');
    
    // Si no hay descripción completa, no hacer nada
    if (!descripcionCompleta) return;
    
    // Toggle de la clase solo en esta tarjeta
    descripcionCompleta.classList.toggle('activa');
    boton.classList.toggle('abierto');
    
    // Cambiar texto del botón
    if (descripcionCompleta.classList.contains('activa')) {
        boton.innerHTML = 'Leer menos <i class="fas fa-chevron-down"></i>';
    } else {
        boton.innerHTML = 'Leer más <i class="fas fa-chevron-down"></i>';
    }
}