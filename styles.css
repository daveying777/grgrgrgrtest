document.getElementById('calculateButton').addEventListener('click', calculateGradients);

function hexToRgb(hex) {
    console.log('hexToRgb called with hex:', hex);
    if (hex.startsWith('#')) {
        hex = hex.slice(1);
    }
    if (hex.length === 3) {
        hex = hex.split('').map(x => x + x).join('');
    }
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    console.log('hexToRgb result:', [r, g, b]);
    return [r, g, b];
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function calculateGradients() {
    console.log('calculateGradients called');
    const hexInput = document.getElementById('hexInput').value;
    const scalingFactor = parseFloat(document.getElementById('scalingFactor').value);
    console.log('hexInput:', hexInput);
    console.log('scalingFactor:', scalingFactor);

    if (!/^#([0-9A-F]{3}){1,2}$/i.test(hexInput)) {
        alert("Please enter a valid hex color code.");
        return;
    }

    const [r, g, b] = hexToRgb(hexInput);
    console.log('RGB values:', [r, g, b]);

    const avgRgb = (r + g + b) / 3;
    const baseChangeValue = avgRgb * scalingFactor;
    console.log('avgRgb:', avgRgb);
    console.log('baseChangeValue:', baseChangeValue);

    const dominanceR = r / 255;
    const dominanceG = g / 255;
    const dominanceB = b / 255;
    console.log('dominance:', [dominanceR, dominanceG, dominanceB]);

    const inverseDominanceR = 1 - dominanceR;
    const inverseDominanceG = 1 - dominanceG;
    const inverseDominanceB = 1 - dominanceB;
    console.log('inverseDominance:', [inverseDominanceR, inverseDominanceG, inverseDominanceB]);

    const changeR = baseChangeValue * inverseDominanceR;
    const changeG = baseChangeValue * inverseDominanceG;
    const changeB = baseChangeValue * inverseDominanceB;
    console.log('change values:', [changeR, changeG, changeB]);

    const permutations = [
        {R: changeR, G: changeG, B: changeB},
        {R: changeR, G: changeG, B: -changeB},
        {R: changeR, G: -changeG, B: changeB},
        {R: changeR, G: -changeG, B: -changeB},
        {R: -changeR, G: changeG, B: changeB},
        {R: -changeR, G: changeG, B: -changeB},
        {R: -changeR, G: -changeG, B: changeB},
        {R: -changeR, G: -changeG, B: -changeB}
    ];
    console.log('permutations:', permutations);

    const gradientResults = document.getElementById('gradientResults');
    gradientResults.innerHTML = '';

    permutations.forEach((perm, index) => {
        const endR = clamp(r + perm.R, 0, 255);
        const endG = clamp(g + perm.G, 0, 255);
        const endB = clamp(b + perm.B, 0, 255);
        console.log('ending RGB values:', [endR, endG, endB]);

        const table = document.createElement('table');
        table.className = 'gradient-table';

        const header = document.createElement('thead');
        header.innerHTML = `
            <tr>
                <th colspan="4">Permutation ${index + 1}: {'R': ${perm.R.toFixed(2)}, 'G': ${perm.G.toFixed(2)}, 'B': ${perm.B.toFixed(2)}}</th>
            </tr>
            <tr>
                <th>Percentage</th>
                <th>Hex</th>
                <th>R G B</th>
                <th>ΔR ΔG ΔB</th>
            </tr>`;
        table.appendChild(header);

        const body = document.createElement('tbody');

        const steps = 7;
        const stepPercentage = 100 / steps;
        const deltaR = (endR - r) / steps;
        const deltaG = (endG - g) / steps;
        const deltaB = (endB - b) / steps;

        for (let i = 0; i <= steps; i++) {
            const stepR = Math.round(r + deltaR * i);
            const stepG = Math.round(g + deltaG * i);
            const stepB = Math.round(b + deltaB * i);
            const hex = rgbToHex(stepR, stepG, stepB);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${Math.round(stepPercentage * i)}%</td>
                <td>${hex}</td>
                <td>${stepR} ${stepG} ${stepB}</td>
                <td>${(deltaR * i).toFixed(2)} ${(deltaG * i).toFixed(2)} ${(deltaB * i).toFixed(2)}</td>`;
            body.appendChild(row);
        }

        table.appendChild(body);
        gradientResults.appendChild(table);
    });

    console.log('Gradients calculated and displayed.');
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
