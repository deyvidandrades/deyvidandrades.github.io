const inputPicker = document.getElementById("inputPicker");
const inputTipos = document.getElementById("tipoPalleta");
const inputCamadas = document.getElementById("inputCamadas");
let lista = document.getElementById("lista");
let inputCor = document.getElementById("inputCor");

mudarPalleta();
//gerarPalleta("#A9DED8", 8, 30, 90, 30);
//gerarPalleta("#211C2E", 10);

inputPicker.addEventListener("change", function (event) {
    inputCor.value = event.target.value
})

inputTipos.addEventListener("change", mudarPalleta)
inputCor.addEventListener("change", mudarPalleta)
inputCamadas.addEventListener("change", mudarPalleta)


function mudarPalleta() {
    //inputCor.value = inputCor.value;
    lista.innerHTML = "";

    switch (inputTipos.value) {
        case "Complement":
            gerarPalleta(inputCor.value, parseInt(inputCamadas.value), 180, 180, 1)
            break;
        case "Split":
            gerarPalleta(inputCor.value, parseInt(inputCamadas.value), 150, 210, 60)
            break;
        case "Triad":
            gerarPalleta(inputCor.value, parseInt(inputCamadas.value), 120, 240, 120)
            break;
        case "Tetrad":
            gerarPalleta(inputCor.value, parseInt(inputCamadas.value), 90, 270, 90)
            break;
        case "Analogous":
            gerarPalleta(inputCor.value, parseInt(inputCamadas.value), 30, 90, 30)
            break;
        default:
    }
}


function gerarPalleta(cor, tamanho_paleta, start, end, interval) {
    let listaCores = {
        "cor_base": cor,
        "cores_analogas": []
    }

    //Add cor base
    listaCores.cores_analogas.push({
        "cor_analoga": cor,
        "palleta_monocromaticas": createMonochromaticPalette(`${cor}`, tamanho_paleta)
    })

    //lista de cores analogas
    harmonize(cor, start, end, interval).forEach((item) => {
        listaCores.cores_analogas.push({
            "cor_analoga": item,
            "palleta_monocromaticas": createMonochromaticPalette(`${item}`, tamanho_paleta)
        })
    });

    //let cor_bg_dark = listaCores.cores_analogas[0].palleta_monocromaticas[0]
    //let cor_bg_light = listaCores.cores_analogas[0].palleta_monocromaticas[1]
    //let cor_textos = listaCores.cores_analogas[0].palleta_monocromaticas[5]


    listaCores.cores_analogas.forEach((item, i) => {
        lista.innerHTML += `<div class="row p-1 gap-2 rounded-3" id="lista_${i}"></div>`

        item.palleta_monocromaticas.forEach((mono, j) => {
            document.getElementById(`lista_${i}`).innerHTML += `
      <div class="col d-flex flex-column p-0">
      <div class="col py-4 rounded-4 shadow-sm" style="background-color: ${mono};">
      <p class="fw-bold fs-4 mt-2 mb-0 text-center" style="color: ${item.palleta_monocromaticas[item.palleta_monocromaticas.length - 1 - j]};">
      ${mono.toUpperCase()}
      </p>
      </div>
      </div>`;
        });

    });
}

function getAAAResoult(cor_textos, cor_bg_light) {
    fetch(`https://webaim.org/resources/contrastchecker/?fcolor=${cor_textos.replace("#", "")}&bcolor=${cor_bg_light.replace("#", "")}&api`,
        {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        })
        .then(response => response.json())
        .then(json => {
                console.log({
                    "ratio": json.ratio,
                    "componentes": json.ratio >= 3.0,
                    "texto_pequeno": json.ratio >= 7.0,
                    "texto_grande": json.ratio >= 4.5
                })
            }
        )
}

function harmonize(color, start, end, interval) {
    // Convert the base color to RGB
    const rgbColor = hexToRgb(color);

    // Convert the RGB values to HSL
    const hslColor = rgbToHsl(rgbColor.r, rgbColor.g, rgbColor.b);

    const colors = [hslColor]
    const [h, s, l] = [hslColor.h, hslColor.s, hslColor.l]

    for (let i = start; i <= end; i += interval) {
        const h1 = (h + i) % 360
        colors.push({"h": h1, "s": s, "l": l})
    }
    let colors_rgb = []
    colors.forEach((item) => {
        let corrgb = hslToRgb(item.h, item.s, item.l)

        colors_rgb.push(rgbToHex(corrgb.r, corrgb.g, corrgb.b))
    });

    return colors_rgb
}

/*
https://dev.to/benjaminadk/make-color-math-great-again--45of
const rp = '#66B032'
const complement = harmonize(rp, 180, 180, 1)
const split = harmonize(rp, 150, 210, 60)
const triad = harmonize(rp, 120, 240, 120)
const tetrad = harmonize(rp, 90, 270, 90)
const analogous = harmonize(rp, 30, 90, 30)
*/

function createMonochromaticPalette(baseColor, numOfShades) {
    const palette = [];

    // Convert the base color to RGB
    const rgbColor = hexToRgb(baseColor);

    // Convert the RGB values to HSL
    const hslColor = rgbToHsl(rgbColor.r, rgbColor.g, rgbColor.b);

    // Calculate the step size for generating shades
    const lightnessStep = 100 / (numOfShades + 1);

    // Generate the shades
    for (let i = 1; i <= numOfShades; i++) {
        // Calculate the lightness value for the current shade
        const lightness = Math.round(lightnessStep * i);

        // Convert the HSL values back to RGB
        const rgbShade = hslToRgb(hslColor.h, hslColor.s, lightness);

        // Convert the RGB values to hexadecimal
        const hexShade = rgbToHex(rgbShade.r, rgbShade.g, rgbShade.b);

        // Add the shade to the palette
        palette.push(hexShade.toUpperCase());
    }

    return palette;
}

// Helper function to convert hexadecimal to RGB
function hexToRgb(hex) {
    if (typeof hex === 'number') {
        hex = hex.toString(16);
    }

    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
}

// Helper function to convert RGB to HSL
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
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

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
    };
}

// Helper function to convert HSL to RGB
function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
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

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255),
    };
}

// Helper function to convert RGB to hexadecimal
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(c) {
    const hex = c.toString();
    return hex.length === 1 ? "0" + hex : hex;
}
