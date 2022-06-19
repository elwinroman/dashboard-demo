class Sidebar {

    constructor() {
        // Cookies

        // Elementos del DOM
        this.list_menu_link = document.querySelectorAll(".menu-link");
        this.toggle_sidebar = document.querySelector(".mynavbar .toggle-sidebar");
    }
    
    /** Función que reposiciona los contenedores de submenús en paralelo a su menú padre (small sidebar) */
    reposicionarContenedorSubmenus() {
        for(let menu_link of this.list_menu_link) {
            let submenu_container = menu_link.nextElementSibling;
            // let pos = Utils.getOffset(menu_link);
            let pos = getOffset(menu_link);
            submenu_container.style.top = pos.top + "px";
        }    
    }
    
    /** Función que colapsa los contenedores de submenús */ 
    colapsarSubmenusActivos() {
        let list_submenuContainer_active = document.querySelectorAll(".menu-panel.active .submenu-panel");
        list_submenuContainer_active.forEach(submenuContainer => {
            Animation.collapse(submenuContainer);
        });
    }
    
    /** Función que remueve la clase 'active' de los menús activados * !!!!!!! refactorizar */
    removerClasesActivas() {
        let list_menuPanel_active = document.querySelectorAll(".menu-panel.active");
        list_menuPanel_active.forEach(menuPanel => {
            menuPanel.classList.remove("active");
        });
    }

    /** Función toggle que muestra y oculta los contenedores de submenús */ 
    toggleSubmenuContainer() {
        for(let menu_link of this.list_menu_link) {
            // 'arrow function' evita el alcance de 'this' del disparador de eventos  
            menu_link.addEventListener("click", () => {
                let menu_panel = menu_link.parentElement;
                let submenu_container = menu_link.nextElementSibling;

                // Si el sidebar es predeterminado
                if(!document.body.classList.contains("short")) {
                    // Condicional para el toggle himself
                    if(menu_panel.classList.contains("active")) {
                        Animation.collapse(submenu_container);  // colapsa el menu activado
                        sessionStorage.removeItem("menu-link"); // elimina la session del menu activado
                    }
                    else {
                        this.colapsarSubmenusActivos();
                        this.removerClasesActivas();
                        Animation.expand(submenu_container); // expande el menu clickeado

                        // Guardar la session del menú activado
                        let val = menu_link.dataset.id;
                        sessionStorage.setItem("menu-link", val);
                    }
                } else {    // Si el sidebar es pequeño
                    this.reposicionarContenedorSubmenus();
                    if (!menu_panel.classList.contains("active"))
                        this.removerClasesActivas();
                }

                menu_panel.classList.toggle("active");
            });
        }
    }

    /** Función toggle que muestra el sidebar predeterminado o sidebar pequeño al hacer click en el icono burguer */
    toggleSidebar() {
        this.toggle_sidebar.addEventListener("click", () => {
            document.body.classList.toggle("short");
            this.colapsarSubmenusActivos();
            this.removerClasesActivas();
            
            if(!document.body.classList.contains("short")) {    // Si el sidebar es predeterminado
                let id_menuLink = sessionStorage.getItem("menu-link");
                // Restaurar el contenedor de submenú activo si existe en la session
                if(id_menuLink != null) {    
                    let submenu_container = document.querySelector(`.menu-link[data-id="${id_menuLink}"]`).nextElementSibling;
                    let menu_panel = document.querySelector(`.menu-link[data-id="${id_menuLink}"]`).parentElement;
                    menu_panel.classList.add("active");
                    Animation.expand(submenu_container);
                }
                
                sessionStorage.setItem("sidebar", "default");
            } else {    // Si el sidebar es pequeño
                sessionStorage.setItem("sidebar", "short");  
            }
        });
    }

    /** Función que maneja el responsive del sidebar al redimensionar la ventana */
    resizeWindow() {
        window.addEventListener("resize", () => {
            let sizeWindow = window.innerWidth;
            console.log(sizeWindow);
            switch(true) {
                // Tamaño pequeño
                case(sizeWindow < 500):
                    console.log("tamaño pequeño");
                    break;
                // Tamaño medio
                case(sizeWindow < 768):
                    // repeticion de codigo
                    let id_menuLink = sessionStorage.getItem("menu-link");
                    // Restaurar el contenedor de submenú activo si existe en la session
                    if(id_menuLink != null) {    
                        let submenu_container = document.querySelector(`.menu-link[data-id="${id_menuLink}"]`).nextElementSibling;
                        let menu_panel = document.querySelector(`.menu-link[data-id="${id_menuLink}"]`).parentElement;
                        menu_panel.classList.add("active");
                        Animation.expand(submenu_container);
                    }
                    sessionStorage.setItem("sidebar", "default");
                    document.body.classList.remove("short");
                    break;
                default:
                    this.colapsarSubmenusActivos();
                    this.removerClasesActivas();
                    document.body.classList.add("short");
                    sessionStorage.setItem("sidebar", "short");
                    break;
            }
            /*if (window.innerWidth < 990) {
                this.colapsarSubmenusActivos();
                this.removerClasesActivas();
                document.body.classList.add("short");
                sessionStorage.setItem("sidebar", "short");
            } else {
                let id_menuLink = sessionStorage.getItem("menu-link");
                // Restaurar el contenedor de submenú activo si existe en la session
                if(id_menuLink != null) {    
                    let submenu_container = document.querySelector(`.menu-link[data-id="${id_menuLink}"]`).nextElementSibling;
                    let menu_panel = document.querySelector(`.menu-link[data-id="${id_menuLink}"]`).parentElement;
                    menu_panel.classList.add("active");
                    Animation.expand(submenu_container);
                }
                sessionStorage.setItem("sidebar", "default");
                document.body.classList.remove("short");
            }*/
        }); 
    }
}

sidebar = new Sidebar();
sidebar.toggleSubmenuContainer();
sidebar.toggleSidebar();
sidebar.resizeWindow();

/////////////////////////////////////////////////////////////////////
var Animation = {
    collapse: element => {
        if (document.body.contains(element))
            element.style.height = 0;
    },
    expand: element => {
        if (document.body.contains(element)) {
            var sectionHeight = element.scrollHeight;
            element.style.height = sectionHeight + "px";
        }
    }
}
// retorna la posición del elemento
function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
    };
}

/*var Sidebarrrrrr = {
    //Reduce el tamaño del sidebar dependiendo del tamaño de la ventana
    resizeEvent: function () {
        window.addEventListener("resize", function () {
            if (this.innerWidth < 990) {
                Sidebar.collapseActiveMenus();
                Sidebar.removeActiveClasses();
                document.body.classList.add("short");
            } else {
                document.body.classList.remove("short");
            }
        });
    }
};*/