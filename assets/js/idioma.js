// Cargar el header y footer en un contenedor
function loadHTML(file, containerId, callback) {
    fetch(file)
        .then((response) => {
            if (response.ok) {
                return response.text();
            } else {
                console.error(`Error al cargar ${file}: ${response.statusText}`);
            }
        })
        .then((html) => {
            if (html) {
                document.getElementById(containerId).innerHTML = html;
                if (callback) callback();
            }
        })
        .catch((error) => console.error(`Error en fetch: ${error}`));
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
        const translation = translations[key] || translations['en']?.[key];
        if (translation) {
            if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
                element.setAttribute("placeholder", translation);
            } else {
                element.innerHTML = translation;
            }
        }
    });
};

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

    loadHTML("header.html", "header-container", async () => {
        updateElementsToTranslate();
        translatePage(translations);

        const languageButtons = document.querySelectorAll('.language-switch');
        const languageIcon = document.getElementById("language-icon");

        let idiomaGuardado = localStorage.getItem("idiomaSeleccionado");
        if (idiomaGuardado) {
            const selectedButton = document.querySelector(`.language-switch[data-lang="${idiomaGuardado}"]`);
            if (selectedButton) {
                const iconSrc = selectedButton.getAttribute("data-icon");
                languageIcon.src = iconSrc;
            }
        }

        languageButtons.forEach((btn) => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const selectedLang = btn.dataset.lang;
                const selectedIcon = btn.dataset.icon;
                localStorage.setItem("idiomaSeleccionado", selectedLang);
                localStorage.setItem("idiomaIcono", selectedIcon);
                languageIcon.src = selectedIcon;
                translations = await loadTranslations(selectedLang);
                updateElementsToTranslate();
                translatePage(translations);
            });
        });
    });

    loadHTML("footer.html", "footer-container", () => {
        updateElementsToTranslate();
        translatePage(translations);
    });
});


