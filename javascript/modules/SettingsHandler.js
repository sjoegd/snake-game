
/**
 * COLOR SCHEMES: 
 * 
 *  BLUE:
 *      bg-color: #7fe5e0, #29d0c7
 *      bg-wrapper:  #177772
 *      ui-bg: #115955
 *      overlay: #177772
 *      overlay-hover: #115955
 *  NIGHTMODE(grey/blue):
 *      bg-color: #a5a7bf, #676b92
 *      bg-wrapper:  #3b3d53
 *      ui-bg: #2c2e3e
 *      overlay: #3b3d53
 *      overlay-hover: #2c2e3e
 *   PURPLE:
 *      bg-color: #9d4edd, #7a38b2
 *      bg-wrapper:  #582187
 *      ui-bg: #471671
 *      overlay: #582187
 *      overlay-hover: #471671
 * 
 * SPEEDS:
 * 
 *  SLOW: 18ms
 *  NORMAL: 15ms
 *  FAST: 12ms
 *
 * Snake Colors (--snake-color):
 * 
 * Lightgreen(Default): #a0c432; tongue: red;
 * Yellow: #f6cd61; tongue: red;
 * White: #eeeeee; tongue: red;
 * Pink: #ff3377; tongue: ?
 * Orange: #FF7F3F; tongue: ?
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

    speeds = {
        SLOW: 18,
        NORMAL: 15,
        FAST: 12
    }

    snake_colors = {
        LIGHTGREEN: {
            color: "#a0c432",
            tongue: "red"
        },
        YELLOW: {
            color: "#f6cd61",
            tongue: "red"
        },
        WHITE: {
            color: "#eeeeee",
            tongue: "red"
        },
        PINK: {
            color: "#ff3377",
            tongue: "red"
        },
        ORANGE: {
            color: "#FF7F3F",
            tongue: "red"
        }
    }

    apple_svgs = {
        APPLE: `<svg class="applesvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 47.5 47.5"><defs><clipPath id="a"><path d="M0 38h38V0H0v38Z"/></clipPath></defs><g clip-path="url(#a)" transform="matrix(1.25 0 0 -1.25 0 47.5)"><path fill="#dd2e44" d="M25 30c-3 0-3-1-6-1s-3 1-6 1c-4 0-9-2-9-9C4 10 10 1 14 1c3 0 3 1 5 1s2-1 5-1c4 0 10 9 10 20 0 7-5 9-9 9"/><path fill="#77b255" d="M20 30s3 4 8 4c4 0 6-2 6-2s-4-3-7-3-7 1-7 1"/><path fill="#662113" d="M19 27a1 1 0 0 0-1 1c0 3.441 1.2 6.615 3.293 8.707a1 1 0 1 0 1.415-1.414C20.987 33.573 20 30.915 20 28a1 1 0 0 0-1-1"/></g></svg>`,
        MOUSE: `<svg class="mousesvg" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 47.5 47.5" viewBox="0 0 47.5 47.5"><defs><clipPath id="a"><path d="M0 38h38V0H0v38Z"/></clipPath></defs><g clip-path="url(#a)" transform="matrix(1.25 0 0 -1.25 0 47.5)"><path fill="#ea596e" d="M0 0h-13a1 1 0 1 0 0 2H0c2.542 0 4 1.367 4 3.75C4 7.287 2.357 9 0 9h-7a1 1 0 1 0 0 2h7c3.589 0 6-2.715 6-5.25C6 2.257 3.645 0 0 0" transform="translate(31 1)"/><path fill="#ccd6dd" d="M0 0c0 2.85 3 7.035 0 7.035-4 0-10.137-6.566-10.137-8.442 0-1.876 6.441-1.876 9.29-1.876C2.002-3.283 0-2.85 0 0" transform="translate(13 10.283)"/><path fill="#ccd6dd" d="M0 0c0 7.973-6.554 9.752-11.381 8.787-9.38-1.876-11.132-6.442-11.132-10.194 0-4.922 9.149-4.691 14.071-4.691C-3.521-6.098 0-4.923 0 0" transform="translate(34 13.098)"/><path fill="#ccd6dd" d="m0 0-17.106-1.875 3.531-5.629H0V0Z" transform="translate(26 14.504)"/><path fill="#ccd6dd" d="M0 0c0 2.683-1.997 4.857-4.458 4.857-2.463 0-4.46-2.174-4.46-4.857 0-2.683 1.997-4.857 4.46-4.857C-1.997-4.857 0-2.683 0 0" transform="translate(17.918 19.857)"/><path fill="#f4abba" d="M0 0c0-1.788-1.141-3.239-2.548-3.239-1.408 0-2.548 1.451-2.548 3.239 0 1.788 1.14 3.238 2.548 3.238C-1.141 3.238 0 1.788 0 0" transform="translate(15.37 19.317)"/><path fill="#dd2e44" d="M0 0a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0" transform="translate(11 12.5)"/></g></svg>`,
    }

    constructor(gameManager, THEME = "BLUE", SPEED = "NORMAL", COLOR = "LIGHTGREEN", APPLE = "APPLE") {
        this.gameManager = gameManager;
        this.root = document.querySelector(":root")
        this.getVariables();
        this.initializeSettingsListeners(THEME, SPEED, COLOR, APPLE);
    }

    getVariables() {
        this.bg_wrapper = "--bg-wrapper";
        this.bg_ui = "--bg-ui";
        this.bg_overlay = "--bg-overlay";
        this.bg_overlay_hover = "--bg-overlay-hover";
        this.snake_color = "--snake-color";
        this.snake_tongue_color = "";
        this.apple_div = document.querySelector("#apple");
        this.game_bg = document.querySelector(".game_background");
    }

    setRootProperty(property, value) {
        this.root.style.setProperty(property, value)
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
        this.game_bg.style.backgroundImage = `url("https://sjoegd.github.io/snake-game/images/backgrounds/${THEME}.png")`
    }
    

    setSelectedTheme(element) {
        if(this.selectedTheme?.classList.contains("selected")) {
            this.selectedTheme.classList.remove("selected");
        }
        element.classList.add("selected");
        this.selectedTheme = element;
    }

    setSpeed(SPEED) {
        let speed = this.speeds[SPEED]

        if(!speed) {
            return;
        }

        this.gameManager.setGameSpeed(speed);
    }

    setSelectedSpeed(element) {
        if(this.selectedSpeed?.classList.contains("selected")) {
            this.selectedSpeed.classList.remove("selected");
        }
        element.classList.add("selected");
        this.selectedSpeed = element;
    }

    setSnakeColor(COLOR) {
        let color = this.snake_colors[COLOR]

        if(!color) {
            return;
        }

        this.setRootProperty(this.snake_color, color.color);
        this.setRootProperty(this.snake_tongue_color, color.tongue);
    }

    setSelectedSnakeColor(element) {
        if(this.selectedSnakeColor?.classList.contains("selected")) {
            this.selectedSnakeColor.classList.remove("selected");
        }
        element.classList.add("selected");
        this.selectedSnakeColor = element;
    }

    setAppleSVG(SVG) {
        let svg = this.apple_svgs[SVG];

        if(!svg) {
            return;
        }

        this.apple_div.innerHTML = svg;
    }

    setSelectedAppleSVG(element) {
        if(this.selectedAppleSVG?.classList.contains("selected")) {
            this.selectedAppleSVG.classList.remove("selected");
        }
        element.classList.add("selected");
        this.selectedAppleSVG = element;
    }

    initializeSettingsListeners(beginTHEME, beginSPEED, beginCOLOR, beginAppleSVG) {
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

        // SPEEDS
        let SLOW_SPEED = document.getElementById("SLOW_SPEED");
        let NORMAL_SPEED = document.getElementById("NORMAL_SPEED");
        let FAST_SPEED = document.getElementById("FAST_SPEED");

        let SPEEDS = [
            {ELEMENT: SLOW_SPEED , value: "SLOW"},
            {ELEMENT: NORMAL_SPEED, value: "NORMAL"}, 
            {ELEMENT: FAST_SPEED, value: "FAST"}
        ];

        SPEEDS.forEach(SPEED => {
            if(SPEED.value == beginSPEED) {
                this.setSelectedSpeed(SPEED.ELEMENT);
                this.setSpeed(SPEED.value); 
            }

            SPEED.ELEMENT.addEventListener(("click"), () => {
                this.setSelectedSpeed(SPEED.ELEMENT);
                this.setSpeed(SPEED.value); 
            })
        })

        // SNAKE COLORS
        let LIGHTGREEN_COLOR = document.getElementById("LIGHTGREEN_COLOR");
        let YELLOW_COLOR = document.getElementById("YELLOW_COLOR");
        let WHITE_COLOR = document.getElementById("WHITE_COLOR");
        let PINK_COLOR = document.getElementById("PINK_COLOR");
        let ORANGE_COLOR = document.getElementById("ORANGE_COLOR");

        let COLORS = [
            {ELEMENT: LIGHTGREEN_COLOR, value: "LIGHTGREEN"},
            {ELEMENT: YELLOW_COLOR, value: "YELLOW"}, 
            {ELEMENT: WHITE_COLOR, value: "WHITE"},
            {ELEMENT: PINK_COLOR, value: "PINK"},
            {ELEMENT: ORANGE_COLOR, value: "ORANGE"}
        ];

        COLORS.forEach(COLOR => {
            if(COLOR.value == beginCOLOR) {
                this.setSelectedSnakeColor(COLOR.ELEMENT);
                this.setSnakeColor(COLOR.value); 
            }

            COLOR.ELEMENT.addEventListener(("click"), () => {
                this.setSelectedSnakeColor(COLOR.ELEMENT);
                this.setSnakeColor(COLOR.value); 
            })
        })

        //APPLE SVGS
        let APPLE_SVG = document.getElementById("APPLE_SVG");
        let MOUSE_SVG = document.getElementById("MOUSE_SVG");

        let SVGS = [
            {ELEMENT: APPLE_SVG, value: "APPLE"},
            {ELEMENT: MOUSE_SVG, value: "MOUSE"}, 
        ];

        SVGS.forEach(SVG => {
            if(SVG.value == beginAppleSVG) {
                this.setSelectedAppleSVG(SVG.ELEMENT);
                this.setAppleSVG(SVG.value); 
            }

            SVG.ELEMENT.addEventListener(("click"), () => {
                this.setSelectedAppleSVG(SVG.ELEMENT);
                this.setAppleSVG(SVG.value); 
            })
        })
    }
}