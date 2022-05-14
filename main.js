document.addEventListener('DOMContentLoaded', function() { "use strict";

const toggle = document.querySelector(".mynavbar .toggle-sidebar");
const content = document.querySelector("section.content");
// función toggle para el sidebar
toggle.addEventListener("click", () => {
    Sidebar.collapseActiveMenus();
    Sidebar.removeActiveClasses();
    document.body.classList.toggle("short");
});

const sidebar = document.querySelector(".sidebar");
const footer = document.querySelector("footer");
const list_menu_link = document.querySelectorAll(".menu-link");

function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
    };
}

// Posiciona el submenu panel en la paralelo al menu link
function posicionarSubmenu() {
    for(let menu_link of list_menu_link) {
        let submenu_panel = menu_link.nextElementSibling;
        let pos = getOffset(menu_link);
        submenu_panel.style.top = pos.top + "px";
    }
}

var Sidebar = {
    // Colapsa los menus abiertos
    collapseActiveMenus: function() {
        let list_sp_active = document.querySelectorAll(".menu-panel.active .submenu-panel");
        list_sp_active.forEach(sp_active => {
            console.log("collapsing active submenus...");
            Animation.collapse(sp_active);
        });
    },
    // Remueve las clases 'active'
    removeActiveClasses: function() {
        let list_mp_act = document.querySelectorAll(".menu-panel.active");
        list_mp_act.forEach(mp_act => {
            mp_act.classList.remove("active");
        });
    },
    // Oculta o muestra los submenus al hacer click en el link del menu
    submenu_hide_show: function() {
        for(let menu_link of list_menu_link) {
            menu_link.addEventListener("click", function() {
                let menu_panel = this.parentElement;
                let submenu_panel = this.nextElementSibling;
                
                // Handle sidebar default
                if(!document.body.classList.contains("short")) {
                    if(menu_panel.classList.contains("active"))
                        Animation.collapse(submenu_panel);  // colapsa el menu clickeado
                    else {
                        Sidebar.collapseActiveMenus();
                        Sidebar.removeActiveClasses();
                        Animation.expand(submenu_panel); // expande el menu clickeado
                    }
                } 
                // Handle short sidebar
                else {
                    posicionarSubmenu();
                    if(!menu_panel.classList.contains("active"))
                        Sidebar.removeActiveClasses();
                }
                menu_panel.classList.toggle("active");
            });
        }
    }
};

Sidebar.submenu_hide_show();

});

/////////////////////////////////////////////////////////////////////
var Animation = {
	collapse: element => {
		if(document.body.contains(element))
            element.style.height = 0;
	},
	expand: element => {
		if(document.body.contains(element)) {
			var sectionHeight = element.scrollHeight;
			element.style.height = sectionHeight + "px";
		}
	}
}
/////////////////////////////////////////////////////////////////////