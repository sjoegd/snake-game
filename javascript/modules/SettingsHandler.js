
/**
 * COLOR SCHEMES: 
 * 
 *  BLUE:
 *      bg-color: #7fe5e0, #29d0c7
 *      bg-wrapper:  #177772
 *      ui-bg: #115955
 *      overlay: #177772
 *      overlay-hover: #115955
 *  BLUEGREEN:
 *      bg-color: #7be9de, #22d7c5
 *      bg-wrapper:  #137a70
 *      ui-bg: #0e5c54
 *      overlay: #137a70
 *      overlay-hover: #0e5c54
 *  NIGHTMODE(grey/blue):
 *      bg-color: #a5a7bf, #676b92
 *      bg-wrapper:  #3b3d53
 *      ui-bg: #2c2e3e
 *      overlay: #3b3d53
 *      overlay-hover: #2c2e3e
 *   RED:
 *      bg-color: #f14164, #ee1b45
 *      bg-wrapper:  #cd1037
 *      ui-bg: #be0e31
 *      overlay: #cd1037
 *      overlay-hover: #be0e31
 *   PURPLE:
 *      bg-color: #9d4edd, #7a38b2
 *      bg-wrapper:  #582187
 *      ui-bg: #471671
 *      overlay: #582187
 *      overlay-hover: #471671
 */

export default class SettingsHandler {

    themes = {
        BLUE: {
            "--bg-wrapper":  "#177772",
            "--bg-ui": "#115955",
            "--bg-overlay": "#177772",
            "--bg-overlay-hover": "#115955"
        },
        NIGHTMODE: {
            "--bg-wrapper":  "#3b3d53",
            "--bg-ui": "#2c2e3e",
            "--bg-overlay": "#3b3d53",
            "--bg-overlay-hover": "#2c2e3e"
        },
        PURPLE: {
            "--bg-wrapper":  "#582187",
            "--bg-ui": "#471671",
            "--bg-overlay": "#582187",
            "--bg-overlay-hover": "#471671"
        },
    }

    constructor(THEME) {
        this.root = document.querySelector(":root")
        this.getVariables();
        this.initializeSettingsListeners(THEME);
    }

    getVariables() {
        this.bg_wrapper = "--bg-wrapper";
        this.bg_ui = "--bg-ui";
        this.bg_overlay = "--bg-overlay"
        this.bg_overlay_hover = "--bg-overlay-hover"
        this.game_bg = document.querySelector(".game_background")
    }

    setTheme(THEME) {
        let theme = this.themes[THEME];

        if(!theme) {
            return;
        } 

        this.setRootProperty(this.bg_wrapper, theme[this.bg_wrapper])
        this.setRootProperty(this.bg_ui, theme[this.bg_ui])
        this.setRootProperty(this.bg_overlay, theme[this.bg_overlay])
        this.setRootProperty(this.bg_overlay_hover, theme[this.bg_overlay_hover])
        this.game_bg.style.backgroundImage = `url("../../images/${THEME}.png")`
    }
    

    setSelectedTheme(element) {
        if(this.selectedTheme?.classList.contains("selected")) {
            this.selectedTheme.classList.remove("selected")
        }
        element.classList.add("selected")
        this.selectedTheme = element
    }

    setRootProperty(property, value) {
        this.root.style.setProperty(property, value)
    }

    initializeSettingsListeners(beginTHEME) {
        // THEMES
        let BLUE_THEME = document.getElementById("BLUE_THEME");
        let PURPLE_THEME = document.getElementById("PURPLE_THEME");
        let NIGHT_THEME = document.getElementById("NIGHT_THEME");

        let THEMES = [
            {ELEMENT: BLUE_THEME, value: "BLUE"},
            {ELEMENT: PURPLE_THEME, value: "PURPLE"}, 
            {ELEMENT: NIGHT_THEME, value: "NIGHTMODE"}
        ];
        
        THEMES.forEach(THEME => {
            if(THEME.value == beginTHEME) {
                this.setSelectedTheme(THEME.ELEMENT);
                this.setTheme(THEME.value); 
            }

            THEME.ELEMENT.addEventListener(("click"), () => {
                this.setSelectedTheme(THEME.ELEMENT);
                this.setTheme(THEME.value);
            })
        })
    }
}