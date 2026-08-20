/*!
 * Cuberto Mouse Follower
 * https://cuberto.com/
 *
 * @version 1.1.2
 * @author Cuberto, Artem Dordzhiev (Draft)
 */

export default class MouseFollower {
    /**
     * @typedef {Object} MouseFollowerOptions
     * @property {string|HTMLElement|null} [el] Existing cursor element, created automatically if not specified.
     * @property {string|HTMLElement|null} [container] Cursor container. Body by default.
     * @property {string|HTMLElement|null} [eventsTarget] Target for cursor events. Body by default.
     * @property {string} [className] Cursor root element class name.
     * @property {string} [innerClassName] Inner element class name.
     * @property {string} [textClassName] Text element class name.
     * @property {string} [mediaClassName] Media element class name.
     * @property {string} [mediaBoxClassName] Media inner element class name.
     * @property {string} [iconSvgClassName] SVG sprite class name.
     * @property {string} [iconSvgNamePrefix] SVG sprite class name prefix for icons.
     * @property {string} [iconSvgSrc] SVG sprite source. If you are not using SVG sprites, leave this blank.
     * @property {string|null} [dataAttr] Data attribute name for changing cursor state in HTML. Uses event delegation.
     * @property {string} [hiddenState] Hidden class name state.
     * @property {string} [textState] Text class name state.
     * @property {string} [iconState] Icon class name state.
     * @property {string|null} [activeState] Active (mousedown) class name state. Set `false` to disable.
     * @property {string} [mediaState] Media (image/video) class name state.
     * @property {Object} [stateDetection] Predefined states for different page elements. Uses event delegation.
     * @property {boolean} [visible] Whether the cursor is visible by default.
     * @property {boolean} [visibleOnState] Automatically show/hide cursor when a state is added.
     * @property {number} [speed] Cursor movement speed.
     * @property {string} [ease] Timing function of cursor movement. See GSAP easing.
     * @property {boolean} [overwrite] Overwrite or preserve the cursor position when `mousemove` fires.
     * @property {number} [skewing] Default "skewing" factor.
     * @property {number} [skewingText] Skew effect factor in the text state. Set `0` to disable skew in this mode.
     * @property {number} [skewingIcon] Skew effect factor in the icon state. Set `0` to disable skew in this mode.
     * @property {number} [skewingMedia] Skew effect factor in the media state. Set `0` to disable.
     * @property {number} [skewingDelta] Skew effect base delta.
     * @property {number} [skewingDeltaMax] Skew effect max delta.
     * @property {number} [stickDelta] Stick effect delta.
     * @property {number} [showTimeout] Delay before showing. May be useful for the spawn animation to work properly.
     * @property {boolean} [hideOnLeave] Hide the cursor when the mouse leaves the event target.
     * @property {number} [hideTimeout] Hiding delay. Should be equal to the CSS hide animation time.
     * @property {number[]} [initialPos] Array (x, y) of the initial cursor position.
     */

    /**
     * Register the GSAP animation library.
     *
     * @param {gsap} gsap GSAP library.
     */
    static registerGSAP(gsap) {
        MouseFollower.gsap = gsap;
    }

    /**
     * Create a cursor instance.
     *
     * @param {MouseFollowerOptions} [options] Cursor options.
     */
    constructor(options = {}) {
        /** @type {MouseFollowerOptions} **/
        this.options = Object.assign({}, {
            el: null,
            container: document.body,
            eventsTarget: document.body,
            className: 'mf-cursor',
            innerClassName: 'mf-cursor-inner',
            textClassName: 'mf-cursor-text',
            mediaClassName: 'mf-cursor-media',
            mediaBoxClassName: 'mf-cursor-media-box',
            iconSvgClassName: 'mf-svgsprite',
            iconSvgNamePrefix: '-',
            iconSvgSrc: '',
            dataAttr: 'cursor',
            hiddenState: '-hidden',
            textState: '-text',
            iconState: '-icon',
            activeState: '-active',
            mediaState: '-media',
            stateDetection: {
                '-pointer': 'a,button',
            },
            visible: true,
            visibleOnState: false,
            speed: 0.55,
            ease: 'expo.out',
            overwrite: true,
            skewing: 0,
            skewingText: 2,
            skewingIcon: 2,
            skewingMedia: 2,
            skewingDelta: 0.001,
            skewingDeltaMax: 0.15,
            stickDelta: 0.15,
            showTimeout: 0,
            hideOnLeave: true,
            hideTimeout: 300,
            hideMediaTimeout: 300,
            initialPos: [-window.innerWidth, -window.innerHeight],
        }, options);

        if (this.options.visible && options.stateDetection == null) this.options.stateDetection['-hidden'] = 'iframe';

        this.gsap = MouseFollower.gsap || window.gsap;
        this.el = typeof (this.options.el) === 'string' ?
            document.querySelector(this.options.el) : this.options.el;
        this.container = typeof (this.options.container) === 'string' ?
            document.querySelector(this.options.container) : this.options.container;
        this.eventsTarget = typeof (this.options.eventsTarget) === 'string' ?
            document.querySelector(this.options.eventsTarget) : this.options.eventsTarget;
        this.skewing = this.options.skewing;
        this.pos = {x: this.options.initialPos[0], y: this.options.initialPos[1]};
        this.vel = {x: 0, y: 0};
        this.event = {};
        this.events = [];

        this.init();
    }

    /**
     * Initialize the cursor.
     */
    init() {
        this.create();
        this.createSetter();
        this.bind();
        this.render(true);
        this.ticker = this.render.bind(this, false);
        this.gsap.ticker.add(this.ticker);
    }

    /**
     * Create cursor DOM elements or get existing ones.
     */
    create() {
        this.el = this.el || this.createPart(this.options.className, this.container, false);
        this.inner = this.createPart(this.options.innerClassName, this.el);
        this.media = this.createPart(this.options.mediaClassName, this.inner);
        this.mediaBox = this.createPart(this.options.mediaBoxClassName, this.media);
        this.text = this.createPart(this.options.textClassName, this.inner);

        this.el.classList.add(this.options.hiddenState);
    }

    /**
     * Create a cursor DOM part or get an existing one.
     *
     * @param {string} className Element class name.
     * @param {HTMLElement} container Parent element.
     * @param {boolean} [reuse=true] Use existing element if found.
     * @return {HTMLElement} Cursor DOM part.
     */
    createPart(className, container, reuse = true) {
        const el = reuse && container.getElementsByClassName(className)[0] || document.createElement('div');
        el.className = el.className || className;
        if (!el.parentNode) container.appendChild(el);
        return el;
    }

    /**
     * Create the GSAP setters.
     */
    createSetter() {
        this.setter = {
            x: this.gsap.quickSetter(this.el, 'x', 'px'),
            y: this.gsap.quickSetter(this.el, 'y', 'px'),
            rotation: this.gsap.quickSetter(this.el, 'rotation', 'deg'),
            scaleX: this.gsap.quickSetter(this.el, 'scaleX'),
            scaleY: this.gsap.quickSetter(this.el, 'scaleY'),
            wc: this.gsap.quickSetter(this.el, 'willChange'),
            inner: {
                rotation: this.gsap.quickSetter(this.inner, 'rotation', 'deg'),
            },
        };
    }

    /**
     * Create and attach event listeners.
     */
    bind() {
        this.event.mouseleave = () => this.hide();
        this.event.mouseenter = () => this.show();
        this.event.mousedown = () => this.addState(this.options.activeState);
        this.event.mouseup = () => this.removeState(this.options.activeState);
        this.event.mousemoveOnce = () => this.show();
        this.event.mousemove = (e) => {
            this.gsap.to(this.pos, {
                x: this.stick ? this.stick.x - ((this.stick.x - e.clientX) * this.options.stickDelta) : e.clientX,
                y: this.stick ? this.stick.y - ((this.stick.y - e.clientY) * this.options.stickDelta) : e.clientY,
                overwrite: this.options.overwrite,
                ease: this.options.ease,
                duration: this.visible ? this.options.speed : 0,
                onUpdate: () => this.vel = {x: e.clientX - this.pos.x, y: e.clientY - this.pos.y},
            });
        };
        this.event.mouseover = (e) => {
            for (let target = e.target; target && target !== this.eventsTarget; target = target.parentNode) {
                if (e.relatedTarget && target.contains(e.relatedTarget)) break;

                for (let state in this.options.stateDetection) {
                    if (target.matches(this.options.stateDetection[state])) this.addState(state);
                }

                if (this.options.dataAttr) {
                    const params = this.getFromDataset(target);
                    if (params.state) this.addState(params.state);
                    if (params.text) this.setText(params.text);
                    if (params.icon) this.setIcon(params.icon);
                    if (params.img) this.setImg(params.img);
                    if (params.video) this.setVideo(params.video);
                    if (typeof (params.show) !== 'undefined') this.show();
                    if (typeof (params.stick) !== 'undefined') this.setStick(params.stick || target);
                }
            }
        };
        this.event.mouseout = (e) => {
            for (let target = e.target; target && target !== this.eventsTarget; target = target.parentNode) {
                if (e.relatedTarget && target.contains(e.relatedTarget)) break;

                for (let state in this.options.stateDetection) {
                    if (target.matches(this.options.stateDetection[state])) this.removeState(state);
                }

                if (this.options.dataAttr) {
                    const params = this.getFromDataset(target);
                    if (params.state) this.removeState(params.state);
                    if (params.text) this.removeText();
                    if (params.icon) this.removeIcon();
                    if (params.img) this.removeImg();
                    if (params.video) this.removeVideo();
                    if (typeof (params.show) !== 'undefined') this.hide();
                    if (typeof (params.stick) !== 'undefined') this.removeStick();
                }
            }
        };

        if (this.options.hideOnLeave) {
            this.eventsTarget.addEventListener('mouseleave', this.event.mouseleave, {passive: true});
        }
        if (this.options.visible) {
            this.eventsTarget.addEventListener('mouseenter', this.event.mouseenter, {passive: true});
        }
        if (this.options.activeState) {
            this.eventsTarget.addEventListener('mousedown', this.event.mousedown, {passive: true});
            this.eventsTarget.addEventListener('mouseup', this.event.mouseup, {passive: true});
        }
        this.eventsTarget.addEventListener('mousemove', this.event.mousemove, {passive: true});
        if (this.options.visible) {
            this.eventsTarget.addEventListener('mousemove', this.event.mousemoveOnce, {
                passive: true,
                once: true,
            });
        }
        if (this.options.stateDetection || this.options.dataAttr) {
            this.eventsTarget.addEventListener('mouseover', this.event.mouseover, {passive: true});
            this.eventsTarget.addEventListener('mouseout', this.event.mouseout, {passive: true});
        }
    }

    /**
     * Render the cursor at a new position.
     *
     * @param {boolean} [force=false] Force rendering.
     */
    render(force) {
        if (force !== true && (this.vel.y === 0 || this.vel.x === 0)) {
            this.setter.wc('auto');
            return;
        }

        this.trigger('render');
        this.setter.wc('transform');
        this.setter.x(this.pos.x);
        this.setter.y(this.pos.y);

        if (this.skewing) {
            const distance = Math.sqrt(Math.pow(this.vel.x, 2) + Math.pow(this.vel.y, 2));
            const scale = Math.min(distance * this.options.skewingDelta,
                this.options.skewingDeltaMax) * this.skewing;
            const angle = Math.atan2(this.vel.y, this.vel.x) * 180 / Math.PI;

            this.setter.rotation(angle);
            this.setter.scaleX(1 + scale);
            this.setter.scaleY(1 - scale);
            this.setter.inner.rotation(-angle);
        }
    }

    /**
     * Show the cursor.
     */
    show() {
        this.trigger('show');
        clearInterval(this.visibleInt);
        this.visibleInt = setTimeout(() => {
            this.el.classList.remove(this.options.hiddenState);
            this.visible = true;
            this.render(true);
        }, this.options.showTimeout);
    }

    /**
     * Hide the cursor.
     */
    hide() {
        this.trigger('hide');
        clearInterval(this.visibleInt);
        this.el.classList.add(this.options.hiddenState);
        this.visibleInt = setTimeout(() => this.visible = false, this.options.hideTimeout);
    }

    /**
     * Toggle the cursor.
     *
     * @param {boolean} [force] Force the visibility state.
     */
    toggle(force) {
        if (force === true || force !== false && !this.visible) {
            this.show();
        } else {
            this.hide();
        }
    }

    /**
     * Add one or more states to the cursor.
     *
     * @param {string} state State name.
     */
    addState(state) {
        this.trigger('addState', state);
        if (state === this.options.hiddenState) return this.hide();
        this.el.classList.add(...state.split(' '));
        if (this.options.visibleOnState) this.show();
    }

    /**
     * Remove one or more states from the cursor.
     *
     * @param {string} state State name.
     */
    removeState(state) {
        this.trigger('removeState', state);
        if (state === this.options.hiddenState) return this.show();
        this.el.classList.remove(...state.split(' '));
        if (this.options.visibleOnState && this.el.className === this.options.className) this.hide();
    }

    /**
     * Toggle the cursor state.
     *
     * @param {string} state State name.
     * @param {boolean} [force] Force the state.
     */
    toggleState(state, force) {
        if (force === true || force !== false && !this.el.classList.contains(state)) {
            this.addState(state);
        } else {
            this.removeState(state);
        }
    }

    /**
     * Set the skewing effect factor.
     *
     * @param {number} value Skewing factor.
     */
    setSkewing(value) {
        this.gsap.to(this, {skewing: value});
    }

    /**
     * Revert the skewing factor to the default.
     */
    removeSkewing() {
        this.gsap.to(this, {skewing: this.options.skewing});
    }

    /**
     * Stick the cursor to an element.
     *
     * @param {string|HTMLElement} element Element or selector.
     */
    setStick(element) {
        const el = typeof (element) === 'string' ? document.querySelector(element) : element;
        const rect = el.getBoundingClientRect();
        this.stick = {
            y: rect.top + (rect.height / 2),
            x: rect.left + (rect.width / 2),
        };
    }

    /**
     * Unstick the cursor from the element.
     */
    removeStick() {
        this.stick = false;
    }

    /**
     * Transform the cursor to text mode with the given string.
     *
     * @param {string} text Text.
     */
    setText(text) {
        this.text.innerHTML = text;
        this.addState(this.options.textState);
        this.setSkewing(this.options.skewingText);
    }

    /**
     * Revert the cursor from text mode.
     */
    removeText() {
        this.removeState(this.options.textState);
        this.removeSkewing();
    }

    /**
     * Transform the cursor to SVG icon mode.
     *
     * @param {string} name Icon identifier.
     * @param {string} [style=""] Additional SVG styles.
     */
    setIcon(name, style = '') {
        this.text.innerHTML = `<svg class='${this.options.iconSvgClassName} ${this.options.iconSvgNamePrefix}${name}'`
            + ` style='${style}'><use xlink:href='${this.options.iconSvgSrc}#${name}'></use></svg>`;
        this.addState(this.options.iconState);
        this.setSkewing(this.options.skewingIcon);
    }

    /**
     * Revert the cursor from icon mode.
     */
    removeIcon() {
        this.removeState(this.options.iconState);
        this.removeSkewing();
    }

    /**
     * Transform the cursor to media mode with the given element.
     *
     * @param {HTMLElement} element Element.
     */
    setMedia(element) {
        clearTimeout(this.mediaInt);
        if (element) {
            this.mediaBox.innerHTML = '';
            this.mediaBox.appendChild(element);
        }
        this.mediaInt = setTimeout(() => this.addState(this.options.mediaState), 20);
        this.setSkewing(this.options.skewingMedia);
    }

    /**
     * Revert the cursor from media mode.
     */
    removeMedia() {
        clearTimeout(this.mediaInt);
        this.removeState(this.options.mediaState);
        this.mediaInt = setTimeout(() => this.mediaBox.innerHTML = '', this.options.hideMediaTimeout);
        this.removeSkewing();
    }

    /**
     * Transform the cursor to image mode.
     *
     * @param {string} url Image URL.
     */
    setImg(url) {
        if (!this.mediaImg) this.mediaImg = new Image();
        if (this.mediaImg.src !== url) this.mediaImg.src = url;
        this.setMedia(this.mediaImg);
    }

    /**
     * Revert the cursor from image mode.
     */
    removeImg() {
        this.removeMedia();
    }

    /**
     * Transform the cursor to video mode.
     *
     * @param {string} url Video URL.
     */
    setVideo(url) {
        if (!this.mediaVideo) {
            this.mediaVideo = document.createElement('video');
            this.mediaVideo.muted = true;
            this.mediaVideo.loop = true;
            this.mediaVideo.autoplay = true;
        }
        if (this.mediaVideo.src !== url) {
            this.mediaVideo.src = url;
            this.mediaVideo.load();
        }
        this.mediaVideo.play();
        this.setMedia(this.mediaVideo);
    }

    /**
     * Revert the cursor from video mode.
     */
    removeVideo() {
        if (this.mediaVideo && this.mediaVideo.readyState > 2) this.mediaVideo.pause();
        this.removeMedia();
    }

    /**
     * Attach an event handler.
     *
     * @param {string} event Event name.
     * @param {function} callback Callback function.
     */
    on(event, callback) {
        if (!(this.events[event] instanceof Array)) this.off(event);
        this.events[event].push(callback);
    }

    /**
     * Remove an event handler.
     *
     * @param {string} event Event name.
     * @param {function} [callback] Callback function.
     */
    off(event, callback) {
        if (callback) {
            this.events[event] = this.events[event].filter((f) => f !== callback);
        } else {
            this.events[event] = [];
        }
    }

    /**
     * Execute all handlers for the given event type.
     *
     * @param {string} event Event name.
     * @param {...*} params Extra parameters.
     */
    trigger(event, ...params) {
        if (!this.events[event]) return;
        this.events[event].forEach((f) => f.call(this, this, ...params));
    }

    /**
     * Get cursor options from the data attributes of a given element.
     *
     * @param {HTMLElement} element Element.
     * @return {Object} Options.
     */
    getFromDataset(element) {
        const dataset = element.dataset;
        return {
            state: dataset[this.options.dataAttr],
            show: dataset[this.options.dataAttr + 'Show'],
            text: dataset[this.options.dataAttr + 'Text'],
            icon: dataset[this.options.dataAttr + 'Icon'],
            img: dataset[this.options.dataAttr + 'Img'],
            video: dataset[this.options.dataAttr + 'Video'],
            stick: dataset[this.options.dataAttr + 'Stick'],
        };
    }

    /**
     * Destroy the cursor instance.
     */
    destroy() {
        this.trigger('destroy');
        this.gsap.ticker.remove(this.ticker);
        this.eventsTarget.removeEventListener('mouseleave', this.event.mouseleave);
        this.eventsTarget.removeEventListener('mouseenter', this.event.mouseenter);
        this.eventsTarget.removeEventListener('mousedown', this.event.mousedown);
        this.eventsTarget.removeEventListener('mouseup', this.event.mouseup);
        this.eventsTarget.removeEventListener('mousemove', this.event.mousemove);
        this.eventsTarget.removeEventListener('mousemove', this.event.mousemoveOnce);
        this.eventsTarget.removeEventListener('mouseover', this.event.mouseover);
        this.eventsTarget.removeEventListener('mouseout', this.event.mouseout);
        if (this.el) {
            this.container.removeChild(this.el);
            this.el = null;
            this.mediaImg = null;
            this.mediaVideo = null;
        }
    }
}
