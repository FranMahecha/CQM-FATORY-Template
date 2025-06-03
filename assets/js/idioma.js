// Cargar el header y footer en un contenedor
function loadHTML(file, containerId, callback) {
    fetch(file)
        .then((response) => {
            if (response.ok) return response.text();
            console.error(`Error al cargar ${file}: ${response.statusText}`);
        })
        .then((html) => {
            if (html) {
                document.getElementById(containerId).innerHTML = html;
                if (typeof callback === "function") callback();
            }
        })
        .catch((error) => console.error(`Error en fetch: ${error}`));
}

function reinitializeHeaderEffects() {
    if (typeof $ !== 'undefined' && $.fn.bootsnav) {
        const navbar = $('.navbar');
        if (navbar.length) {
            navbar.removeClass('bootsnav');
            navbar.bootsnav();
        } else {
            console.warn("No se encontró .navbar para bootsnav");
        }
    } else {
        console.warn("Plugin bootsnav no está cargado");
    }

    // WOW.js
    if (typeof WOW !== 'undefined') {
        new WOW().init();
    }
}

/////////////////////////////////////////////////////////////////////

const GEO_API_URL = "http://ip-api.com/json/";

const countryLanguageMap = {
    "co": "es", // Colombia
    "us": "en", // Estados Unidos
    "fr": "fr", // Francia
    "de": "de", // Alemania
    "pt": "pt", // Portugal
};

let translations = {};

const loadTranslations = async (lang) => {
    try {
        const response = await fetch(`assets/translations/${lang}.json`);
        console.log(`Cargando archivo: ${lang}.json`);
        if (response.ok) {
            return await response.json();
        } else {
            console.error(`Error al cargar el archivo de traducción: translations/${lang}.json`);
            return {};
        }
    } catch (error) {
        console.error(`Error al obtener el archivo de traducción: ${error}`);
        return {};
    }
};

let elementsToTranslate = [];

function updateElementsToTranslate() {
    elementsToTranslate = document.querySelectorAll('[data-i18n]');
}

// Función para traducir elementos con data-i18n
const translatePage = (translations) => {
    elementsToTranslate.forEach((element) => {
        const key = element.getAttribute('data-i18n');
        const translation = translations[key];
        if (translation) {
            if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
                element.setAttribute("placeholder", translation);
            } else {
                element.innerHTML = translation;
            }
        }
    });
};

// Asigna eventos a los botones de cambio de idioma
function setupLanguageSwitch() {
    document.querySelectorAll('.language-switch').forEach((btn) => {
        btn.onclick = async (e) => {
            e.preventDefault();
            const selectedLang = btn.dataset.lang;
            const selectedIcon = btn.dataset.icon;
            localStorage.setItem("idiomaSeleccionado", selectedLang);
            if (selectedIcon) {
                localStorage.setItem("idiomaIcono", selectedIcon);
                const languageIcon = document.getElementById("language-icon");
                if (languageIcon) languageIcon.src = selectedIcon;
            }
            translations = await loadTranslations(selectedLang);
            updateElementsToTranslate();
            translatePage(translations);
            setupLanguageSwitch(); 
        };
    });
}

const detectarIdiomaPorLocalizacion = async () => {
    try {
        const extraerLocalizacion = await fetch(GEO_API_URL);
        if (extraerLocalizacion.ok) {
            const convertir = await extraerLocalizacion.json();
            const obtenerCodigo = convertir.countryCode.toLowerCase();
            console.log("Código de país detectado:", obtenerCodigo);

            return countryLanguageMap[obtenerCodigo] || "en";
        } else {
            console.error("Error al obtener la localización");
            return "en";
        }
    } catch (error) {
        console.error("Error al obtener la localización:", error);
        return "en";
    }
};

// Inicializar la página con el idioma guardado o detectado
const cargarPagina = async () => {
    let idiomaGuardado = localStorage.getItem("idiomaSeleccionado");
    const idiomasDisponibles = ["es", "en", "fr", "de", "pt"];
    if (!idiomaGuardado || !idiomasDisponibles.includes(idiomaGuardado)) {
        const idiomaNavegador = navigator.language || navigator.userLanguage;
        const idiomaDetectado = idiomaNavegador.split('-')[0];
        idiomaGuardado = idiomasDisponibles.includes(idiomaDetectado) ? idiomaDetectado : "en";
        localStorage.setItem("idiomaSeleccionado", idiomaGuardado);
    }
    console.log(`Idioma seleccionado: ${idiomaGuardado}`);
    translations = await loadTranslations(idiomaGuardado);
    updateElementsToTranslate();
    translatePage(translations);
    setupLanguageSwitch();
};

// Función para el desplazamiento suave
const setupSmoothScrolling = () => {
    document.querySelectorAll('.scrollto').forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').replace('#', '');
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
};

document.addEventListener("DOMContentLoaded", async () => {
    await cargarPagina();

    loadHTML("footer.html", "footer-container", () => {
        updateElementsToTranslate();
        translatePage(translations);
        setupLanguageSwitch();
    });
});