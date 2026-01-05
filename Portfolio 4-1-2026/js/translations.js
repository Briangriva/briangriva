// Global translations for the portfolio
window.translations = {
    es: {
        'nav-about': 'Sobre Mí',
        'nav-skills': 'Habilidades',
        'nav-projects': 'Proyectos',
        'nav-certificates': 'Certificados',
        'nav-contact': 'Contacto',
        'hero-subtitle': 'Full Stack Developer',
        'section-about': 'Sobre Mí',
        'text-about': '¡Hola! Soy Brian Griva, un desarrollador Full Stack apasionado por construir experiencias web robustas y visualmente atractivas. Con una sólida base en tecnologías front-end y back-end, me especializo en transformar ideas complejas en soluciones funcionales y escalables. Mi objetivo es crear interfaces intuitivas y sistemas eficientes que impulsen el éxito de los proyectos.',
        'section-skills': 'Habilidades',
        'section-projects': 'Proyectos',
        'section-certificates': 'Certificados',
        'section-contact': 'Contacto',
        'contact-subtitle': 'Ponte en contacto conmigo a través de estos canales',
        'text-contact': 'Puedes contactarme en',
        'text-contact-end': 'o a través de mis redes sociales.',
        'btn-email': '✉️ Enviar Email',
        'btn-whatsapp': '💬 WhatsApp',
        'email-subject': 'Contacto desde portafolio',
        'email-message': 'Hola Brian, te contacto desde tu portafolio.',
        'project-1-title': 'E-commerce Dinámico',
        'project-1-desc': 'Plataforma de compras online con pasarela de pagos.',
        'project-1-link': 'Ver Demo',
        'project-2-title': 'API RESTful para Blog',
        'project-2-desc': 'Backend escalable con autenticación y base de datos.',
        'project-2-link': 'Ver Repo',
        'project-3-title': 'Dashboard Administrativo',
        'project-3-desc': 'Interfaz de gestión con gráficos y estadísticas.',
        'project-3-link': 'Ver Demo',
        'cert-1-title': 'HTML & CSS',
        'cert-2-title': 'JavaScript',
        'cert-3-title': 'React.js',
        'cert-4-title': 'Node.js',
        'cert-5-title': 'Python principiante',
        'cert-6-title': 'Python intermedio',
        'cert-7-title': 'Python avanzado',
        'cert-8-title': 'Diplomado en Python',
        'cert-institution': 'Universidad Tecnológica Nacional',
        'cert-view': 'Ver Certificado'
    },
    en: {
        'nav-about': 'About Me',
        'nav-skills': 'Skills',
        'nav-projects': 'Projects',
        'nav-certificates': 'Certificates',
        'nav-contact': 'Contact',
        'hero-subtitle': 'Full Stack Developer',
        'section-about': 'About Me',
        'text-about': 'Hi! I am Brian Griva, a Full Stack developer passionate about building robust and visually attractive web experiences. With a solid foundation in front-end and back-end technologies, I specialize in transforming complex ideas into functional and scalable solutions. My goal is to create intuitive interfaces and efficient systems that drive project success.',
        'section-skills': 'Skills',
        'section-projects': 'Projects',
        'section-certificates': 'Certificates',
        'section-contact': 'Contact',
        'contact-subtitle': 'Get in touch with me through these channels',
        'text-contact': 'You can contact me at',
        'text-contact-end': 'or through my social networks.',
        'btn-email': '✉️ Send Email',
        'btn-whatsapp': '💬 WhatsApp',
        'email-subject': 'Contact from portfolio',
        'email-message': 'Hi Brian, I am contacting you from your portfolio.',
        'project-1-title': 'Dynamic E-commerce',
        'project-1-desc': 'Online shopping platform with payment gateway.',
        'project-1-link': 'View Demo',
        'project-2-title': 'RESTful API for Blog',
        'project-2-desc': 'Scalable backend with authentication and database.',
        'project-2-link': 'View Repo',
        'project-3-title': 'Admin Dashboard',
        'project-3-desc': 'Management interface with charts and statistics.',
        'project-3-link': 'View Demo',
        'cert-1-title': 'HTML & CSS',
        'cert-2-title': 'JavaScript',
        'cert-3-title': 'React.js',
        'cert-4-title': 'Node.js',
        'cert-5-title': 'Python Beginner',
        'cert-6-title': 'Python Intermediate',
        'cert-7-title': 'Python Advanced',
        'cert-8-title': 'Python Diploma',
        'cert-institution': 'National Technology University',
        'cert-view': 'View Certificate'
    }
};

// Function to translate page content
window.translatePage = function(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (window.translations[lang] && window.translations[lang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'BUTTON') {
                el.value = window.translations[lang][key];
                el.textContent = window.translations[lang][key];
            } else {
                el.textContent = window.translations[lang][key];
            }
        }
    });
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
};
