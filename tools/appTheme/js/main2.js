const inputPicker = document.getElementById("inputPicker");
//const inputCamadas = document.getElementById("inputCamadas");
const inputStep = document.getElementById("inputStep");
const inputTipos = document.getElementById("tipoPalleta");
const paletteContainer = document.getElementById('palette');

let inputCor = document.getElementById("inputCor");
let row_id = 0

mudarPalleta()
inputPicker.addEventListener("change", function (event) {
    inputCor.value = event.target.value
})

inputTipos.addEventListener("change", mudarPalleta)
inputCor.addEventListener("change", mudarPalleta)
//inputCamadas.addEventListener("change", mudarPalleta)
inputStep.addEventListener("change", mudarPalleta)

function mudarPalleta() {
    paletteContainer.innerHTML = ''
    inputPicker.value = inputCor.value

    const baseColorHSL = hexToHSL(inputCor.value)
    const tipo = inputTipos.value
    const step = inputStep.value

    paletteContainer.innerHTML += `<h2 class="mt-5 mb-4">Paleta Original</h2>`
    generatePalette(baseColorHSL, 64, step)

    if (tipo !== "") {
        paletteContainer.innerHTML += `<h2 class="mt-5 mb-4">Paleta ${tipo}</h2>`

        let lista = []
        switch (tipo) {
            case "Complement":
                lista = harmonize(baseColorHSL, 180, 180, 1)
                break;
            case "Split":
                lista = harmonize(baseColorHSL, 150, 210, 60)
                break;
            case "Triad":
                lista = harmonize(baseColorHSL, 120, 240, 120)
                break;
            case "Tetrad":
                lista = harmonize(baseColorHSL, 90, 270, 90)
                break;
            case "Analogous":
                lista = harmonize(baseColorHSL, 30, 90, 30)
                break;
            default:
        }

        for (const arrayKey in lista) {
            generatePalette(lista[arrayKey], 64, step)
        }
    }
}

function generatePalette(baseColorHSL, size, step = 10) {
    const darkPalette = []
    const lightPalette = []

    for (let i = 0; i < size; i++) {
        let lighterLightness = baseColorHSL.l + i * step;
        let darkerLightness = baseColorHSL.l - i * step;

        if (lighterLightness < 100) {
            const lightModifiedColor = `hsl(${baseColorHSL.h}, ${baseColorHSL.s}%, ${baseColorHSL.l + i * step}%)`;
            lightPalette.push(lightModifiedColor)
        }
        if (darkerLightness > 0) {
            const darkModifiedColor = `hsl(${baseColorHSL.h}, ${baseColorHSL.s}%, ${baseColorHSL.l - i * step}%)`;
            darkPalette.push(darkModifiedColor);
        }
    }

    lightPalette.reverse()
    lightPalette.pop()

    displayPalette(lightPalette.concat(darkPalette))
}

function harmonize(hslColor, start, end, interval) {
    const colors = [] //hslColor
    const [h, s, l] = [hslColor.h, hslColor.s, hslColor.l]

    for (let i = start; i <= end; i += interval) {
        const h1 = (h + i) % 360
        colors.push({"h": h1, "s": s, "l": l})
    }
    let colors_hsl = []
    colors.forEach((item) => {
        colors_hsl.push(item)
    });

    return colors_hsl
}

function hexToHSL(hex) {
    let r = parseInt(hex.substring(1, 3), 16) / 255;
    let g = parseInt(hex.substring(3, 5), 16) / 255;
    let b = parseInt(hex.substring(5, 7), 16) / 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);

    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);

    return {h, s, l};
}

function hslToHex(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
        r = g = b = l; // Achromatic
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (x) => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    const rHex = toHex(r);
    const gHex = toHex(g);
    const bHex = toHex(b);

    return `#${rHex}${gHex}${bHex}`;
}

function displayPalette(palette) {

    paletteContainer.innerHTML += `<div class="row p-1 gap-0 rounded-3" id="lista_mono${row_id}"></div><hr class="my-5">`

    palette.forEach((color, j) => {
        let hsl_array = color.replace("hsl", "").replace("(", "").replace(")", "").replaceAll("%", "").split(",")
        let hex_color = hslToHex(hsl_array[0], hsl_array[1], hsl_array[2])

        document.getElementById(`lista_mono${row_id}`).innerHTML += `
            <div class="col-2 d-flex flex-column p-0">
                <div class="col py-4 " style="background-color: ${color};">
                    <p class="fw-bold fs-3 mt-2 mb-0 text-center" style="color: ${palette[palette.length - 1 - j]};">
                        ${hex_color.toUpperCase()}
                     </p>
                </div>
            </div>`;
    })

    row_id++
}
