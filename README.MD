# Cuberto Mouse Follower

<a href="https://www.npmjs.com/package/mouse-follower"><img src="https://img.shields.io/npm/v/mouse-follower?color=red" alt="NPM Version"></a>
<a href="LICENCE"><img src="https://img.shields.io/github/license/Cuberto/mouse-follower?color=orange" alt="Licence"></a>
<img src="https://img.shields.io/bundlephobia/min/mouse-follower?color=green" alt="Bundle file size">
<img src="https://img.shields.io/bundlephobia/minzip/mouse-follower?color=yellow&label=gzip%20size" alt="Bundle file size (gzip)">
<a href="https://npmcharts.com/compare/mouse-follower?minimal=true"><img src="https://img.shields.io/npm/dm/mouse-follower?color=blue" alt="NPM Downloads"></a>
<img src="https://img.shields.io/github/actions/workflow/status/Cuberto/mouse-follower/build.yml?branch=dev" alt="GitHub Workflow Status">

A powerful javascript library to create amazing and smooth effects for the mouse cursor on your website.

![demo](https://user-images.githubusercontent.com/11841379/162477170-5dd33ecd-0e72-4fe4-9053-53d7b5557637.gif)

## Dependencies

GSAP v3 (https://greensock.com/gsap/)

## Quick start

### Install from NPM

Mouse Follower requires GSAP library to work.

```
npm install gsap --save
npm install mouse-follower --save
```

Import GSAP and Mouse Follower and initialize it:

```js
import MouseFollower from "mouse-follower";
import gsap from "gsap";

MouseFollower.registerGSAP(gsap);

const cursor = new MouseFollower();
```

Don't forget to import the cursor styles from `/src/scss/index.scss` into your main scss file:

```scss
@import "cursor";
```

### Use from CDN

If you don't want to include Mouse Follower files in your project, you can use it from CDN.

The following files are available:

```html
<link rel="stylesheet" href="https://unpkg.com/mouse-follower@1/dist/mouse-follower.min.css">

<script src="https://unpkg.com/mouse-follower@1/dist/mouse-follower.min.js"></script>
```

Mouse Follower requires GSAP library to work. You need to import it before the Mouse Follower if you didn't have it before:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.10.4/gsap.min.js"></script>
<script src="https://unpkg.com/mouse-follower@1/dist/mouse-follower.min.js"></script>
<script>
    var cursor = new MouseFollower();
</script>
```

## Options

You can configure Mouse Follower via options:

```js
const cursor = new MouseFollower({
    container: '.mf-container',
    speed: 0.3
});
```

The following options with defaults are available:

```js
const cursor = new MouseFollower({
    el: null,
    container: document.body,
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
        '-hidden': 'iframe'
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
    showTimeout: 20,
    hideOnLeave: true,
    hideTimeout: 300,
    hideMediaTimeout: 300
});
```

| Name | Type | Description |
| :--- | :---: | :--- |
| `el` | `string` &vert; `HTMLElement` | Existed cursor element. If not specified, the cursor will be created automatically. |
| `container` |  `string` &vert; `HTMLElement` | Cursor container. Body by default. |
| `className` |  `string` | Cursor root element class name. |
| `innerClassName` |  `string` | Inner element class name. |
| `textClassName` |  `string` | Text element class name. |
| `mediaClassName` |  `string` | Media element class name. |
| `mediaBoxClassName` |  `string` | Media inner element class name. |
| `iconSvgClassName` |  `string` | SVG sprite class name. |
| `iconSvgNamePrefix` |  `string` | SVG sprite class name prefix of icon. |
| `iconSvgSrc` |  `string` | SVG sprite source. If you are not using SVG sprites leave this blank. |
| `dataAttr` |  `string` &vert; `null` | Name of data attribute for changing cursor state directly in HTML markdown. Uses an event delegation. |
| `hiddenState` |  `string` | Hidden class name state. |
| `textState` |  `string` | Text class name state. |
| `iconState` |  `string` | Icon class name state. |
| `activeState` |  `string` &vert; `null` | Active (mousedown) class name state. Set `false` to disable. |
| `mediaState` |  `string` | Media (image/video) class name state. |
| `visible` | `boolean` | Is cursor visible by default. |
| `visibleOnState` | `boolean` | Automatically show/hide cursor when state added. Can be useful when implementing a hidden cursor follower. |
| `stateDetection` |  `object` &vert; `null` | Allow to set predefined states for different elements on page. Uses an event delegation. |
| `speed` |  `number` | Cursor movement speed. |
| `ease` |  `string` | Timing function of cursor movement. See [gsap easing](https://greensock.com/docs/v3/Eases). |
| `overwrite` |  `boolean` | Overwrite or remain cursor position when `mousemove` event happened. See [gsap overwrite modes](https://greensock.com/conflict/). |
| `skewing` | `number` | Default "skewing" factor. |
| `skewingText` | `number` | Skew effect factor in a text state. Set `0` to disable skew in this mode. |
| `skewingIcon` | `number` | Skew effect factor in a icon state. Set `0` to disable skew in this mode. |
| `skewingMedia` | `number` | Skew effect factor in a media (image/video) state. Set `0` to disable skew in this mode. |
| `skewingDelta` | `number` | Skew effect base delta. Set `0` to disable skew in this mode. |
| `skewingDeltaMax` | `number` | Skew effect max delta. Set `0` to disable skew in this mode. |
| `stickDelta` | `number` | Stick effect delta. |
| `showTimeout` | `number` | Delay before show. May be useful for the spawn animation to work properly. |
| `hideOnLeave` | `boolean` | Hide the cursor when mouse leave container. |
| `hideTimeout` | `number` | Hiding delay. Should be equal to the CSS hide animation time. |
| `initialPos` | `array` | Array (x, y) of initial cursor position. |

## Advanced usage

### Show or hide cursor

These basic methods allow you to show and hide the cursor:

```js
const cursor = new MouseFollower();
const el = document.querySelector('.my-element');

el.addEventListener('mouseenter', () => {
    cursor.hide();
});

el.addEventListener('mouseleave', () => {
    cursor.show();
});
```

or via data attribute:

```html
<div data-cursor="-hidden">Hover me to hide cursor!</div>
```

### Toggle cursor state

A state is essentially a class that applies to the root element of the cursor. You can change the appearance of the
cursor using CSS (see `cursor.scss`).

To set/unset state use methods:

```js
const cursor = new MouseFollower();
const el = document.querySelector('.my-element');

el.addEventListener('mouseenter', () => {
    cursor.addState('-inverse'); // you can pass multiple states separated by whitespace
});

el.addEventListener('mouseleave', () => {
    cursor.removeState('-inverse');
});
```

or via data attribute:

```html
<div data-cursor="-inverse">Hover me to inverse cursor!</div>
```

### State detection

You can customize the list of states for all elements on the page:

```js
const cursor = new MouseFollower({
    stateDetection: {
        '-pointer': 'a,button',
        '-opaque': '.my-image',
        '-hidden': '.my-input'
    }
});
```

```html
<a>On this element cursor will be in pointer state</a>
<div class="my-image">On this element cursor will be in opaque state</div>
<div class="my-input">On this element cursor will be hidden</div>
```

Note: State detection feature uses an event delegation. Do not create large amount rules and complex selectors to avoid
performance problems. It is recommended to disable this in projects with a large number of nested DOM elements. This
also applies to binding via data attribute.

To fully disable event delegation:

```js
const cursor = new MouseFollower({
    stateDetection: false,
    dataAttr: false
});
```

### Text mode

To display text in the cursor use this method:

```js
const cursor = new MouseFollower();
const el = document.querySelector('.my-element');

el.addEventListener('mouseenter', () => {
    cursor.setText('Hello!');
});

el.addEventListener('mouseleave', () => {
    cursor.removeText();
});
```

or via data attribute:

```html
<div data-cursor-text="Hello!">Hover me!</div>
```

### Icon mode

If you use SVG spritesheet in your project and want to display them in the cursor, then you can use this method. In this
case, you need to specify the path to the SVG sprite in the options and set class names.

```js
const cursor = new MouseFollower({
    iconSvgSrc: '/assets/img/sprites/svgsprites.svg',
    iconSvgClassName: 'my-spritesheet',
    iconSvgNamePrefix: '-',
});
const el = document.querySelector('.my-element');

el.addEventListener('mouseenter', () => {
    cursor.setIcon('arrow-left');
});

el.addEventListener('mouseleave', () => {
    cursor.removeIcon();
});
```

or via data attribute:

```html
<div data-cursor-icon="arrow-left">Hover me!</div>
```

### Image mode

This method allows you to show any picture in the cursor:

```js
const cursor = new MouseFollower();
const el = document.querySelector('.my-element');

el.addEventListener('mouseenter', () => {
    cursor.setImg('/img/example.png')
});

el.addEventListener('mouseleave', () => {
    cursor.removeImg()
});
```

or via data attribute:

```html
<div data-cursor-img="/img/example.png">Hover me to show image!</div>
```

### Video mode

You can also play videos:

```js
const cursor = new MouseFollower();
const el = document.querySelector('.my-element');

el.addEventListener('mouseenter', () => {
    cursor.setVideo('/video/example.mp4');
});

el.addEventListener('mouseleave', () => {
    cursor.removeVideo();
});
```

or via data attribute:

```html
<div data-cursor-video="/video/example.mp4">Hover me to show movie!</div>
```

### Sticky effect

This method allows you to attach the cursor to an element with a magnet effect. This only works correctly with fixed
elements on the page.

```js
const cursor = new MouseFollower();
const box = document.querySelector('.my-fixed-box');
const el = document.querySelector('.my-fixed-element');

box.addEventListener('mouseenter', () => {
    cursor.setStick(el);
});

box.addEventListener('mouseleave', () => {
    cursor.removeStick();
});
```

or via data attribute:

```html
<div data-cursor-stick>Hover me to stick cursor!</div>
```

You can also pass element selector to data attribute:

```html
<div data-cursor-stick="#stick-me">Hover <div id="stick-me">me</div> to stick cursor!</div>
```

### Skewing effect

The skew effect is the distortion of the cursor when moving. It looks good with round cursors.

```js
const cursor = new MouseFollower();
const el = document.querySelector('.my-element');

el.addEventListener('mouseenter', () => {
    cursor.setSkewing(3);
});

el.addEventListener('mouseleave', () => {
    cursor.removeSkewing();
});
```

### Hidden cursor

In this example, the cursor is initialized hidden by default and only appears on the desired element.

```js
const cursor = new MouseFollower({
    visible: false
});
const el = document.querySelector('.my-element');

el.addEventListener('mouseenter', () => {
    cursor.show();
    cursor.setText('Surprise!');
});

el.addEventListener('mouseleave', () => {
    cursor.removeText();
    cursor.hide();
});
```

or via data attribute:

```html
<div data-cursor-show data-cursor-text="Surprise!">Hover me to show cursor!</div>
```

### Destroy cursor instance

Destroy the cursor completely and remove all event listeners.

```js
const cursor = new MouseFollower();

cursor.destroy();
```

## Events

Mouse Follower comes with a useful events you can listen. Events can be assigned in this way:

```js
const cursor = new MouseFollower();

cursor.on('show', () => {
    console.log('cursor appear');
});
```

You can also delete an event that you no longer want to listen in these ways:

```js
cursor.off('show');
cursor.off('show', myHandler);
```

| Name | Arguments | Description |
| :--- | :--- | :--- |
| `show` | `(cursor)` | Event will be fired when the show state is entered. |
| `hide` | `(cursor)` | Event will be fired when the hidden state is entered. |
| `addState` | `(cursor, state)` | Event will be fired when the state is added. |
| `removeState` | `(cursor, state)` | Event will be fired when the state is removed. |
| `render` | `(cursor)` | Event will be fired on each render tick. |
| `destroy` | `(cursor)` | Event will be fired when the instance is destroyed. |

## Examples of use

- [Cuberto](https://cuberto.com/): Leading digital agency.
- [Potion](https://www.sendpotion.com/): Video email for top sales professionals.
- [Wickret](https://wickret.cuberto.com/): 100% digital bank designed for you.
- [Papumba](https://www.papumba.com/): Educational platform for kids.
- [Safe Security](https://www.safe.security/): Cyber Risk Quantification For Enterprises.

## License

[The MIT License (MIT)](LICENSE)
