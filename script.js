// All the DOM elements
const colorPreview = document.getElementById('color-preview');
const hexInput = document.getElementById('hex-input');
const rgbRInput = document.getElementById('rgb-r');
const rgbGInput = document.getElementById('rgb-g');
const rgbBInput = document.getElementById('rgb-b');
const hslHInput = document.getElementById('hsl-h');
const hslSInput = document.getElementById('hsl-s');
const hslLInput = document.getElementById('hsl-l');

const inputs = [hexInput, rgbRInput, rgbGInput, rgbBInput, hslHInput, hslSInput, hslLInput];

// Event Listeners
hexInput.addEventListener('input', () => {
    const hex = hexInput.value.trim();
    if (/^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex)) {
        const fullHex = hex.startsWith('#') ? hex : `#${hex}`;
        let r, g, b;
        if (fullHex.length === 4) {
            r = parseInt(fullHex[1] + fullHex[1], 16);
            g = parseInt(fullHex[2] + fullHex[2], 16);
            b = parseInt(fullHex[3] + fullHex[3], 16);
        } else {
            r = parseInt(fullHex.substring(1, 3), 16);
            g = parseInt(fullHex.substring(3, 5), 16);
            b = parseInt(fullHex.substring(5, 7), 16);
        }

        updateColorFromInput({ r, g, b }, hexInput);
    }
});

[rgbRInput, rgbGInput, rgbBInput].forEach(input => {
    input.addEventListener('input', () => {
        const r = parseInt(rgbRInput.value || 0);
        const g = parseInt(rgbGInput.value || 0);
        const b = parseInt(rgbBInput.value || 0);

        if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
            updateColorFromInput({ r, g, b }, input);
        }
    });
});

[hslHInput, hslSInput, hslLInput].forEach(input => {
    input.addEventListener('input', () => {
        const h = parseInt(hslHInput.value || 0);
        const s = parseInt(hslSInput.value || 0);
        const l = parseInt(hslLInput.value || 0);

        if (!isNaN(h) && !isNaN(s) && !isNaN(l)) {
            const { r, g, b } = hslToRgb(h, s, l);
            updateColorFromInput({ r, g, b }, input);
        }
    });
});

function updateColorFromInput(rgb, sourceElement) {
    let { r, g, b } = rgb;
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));

    const hex = rgbToHex(r, g, b);
    const hsl = rgbToHsl(r, g, b);

    colorPreview.style.backgroundColor = hex;

    const activeElement = document.activeElement;

    if (activeElement !== hexInput) hexInput.value = hex;
    if (activeElement !== rgbRInput) rgbRInput.value = r;
    if (activeElement !== rgbGInput) rgbGInput.value = g;
    if (activeElement !== rgbBInput) rgbBInput.value = b;
    if (activeElement !== hslHInput) hslHInput.value = Math.round(hsl.h);
    if (activeElement !== hslSInput) hslSInput.value = Math.round(hsl.s);
    if (activeElement !== hslLInput) hslLInput.value = Math.round(hsl.l);
}

function setInitialColor(rgb) {
    let { r, g, b } = rgb;
    const hex = rgbToHex(r, g, b);
    const hsl = rgbToHsl(r, g, b);
    colorPreview.style.backgroundColor = hex;
    hexInput.value = hex;
    rgbRInput.value = r;
    rgbGInput.value = g;
    rgbBInput.value = b;
    hslHInput.value = Math.round(hsl.h);
    hslSInput.value = Math.round(hsl.s);
    hslLInput.value = Math.round(hsl.l);
}


// --- Conversion Functions ---

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r, g, b;

    if (h >= 0 && h < 60) { [r, g, b] = [c, x, 0]; }
    else if (h >= 60 && h < 120) { [r, g, b] = [x, c, 0]; }
    else if (h >= 120 && h < 180) { [r, g, b] = [0, c, x]; }
    else if (h >= 180 && h < 240) { [r, g, b] = [0, x, c]; }
    else if (h >= 240 && h < 300) { [r, g, b] = [x, 0, c]; }
    else { [r, g, b] = [c, 0, x]; }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return { r, g, b };
}

// Initial color on page load
setInitialColor({ r: 22, g: 160, b: 133 });
