document.getElementById('calculateButton').addEventListener('click', calculateGradients);

function hexToRgb(hex) {
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
    return [r, g, b];
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function calculateGradients() {
    const hexInput = document.getElementById('hexInput').value;
    const scalingFactor = parseFloat(document.getElementById('scalingFactor').value);

    if (!/^#([0-9A-F]{3}){1,2}$/i.test(hexInput)) {
        alert("Please enter a valid hex color code.");
        return;
    }

    const [r, g, b] = hexToRgb(hexInput);
    const avgRgb = (r + g + b) / 3;
    const baseChangeValue = avgRgb * scalingFactor;
    const dominanceR = r / 255;
    const dominanceG = g / 255;
    const dominanceB = b / 255;
    const inverseDominanceR = 1 - dominanceR;
    const inverseDominanceG = 1 - dominanceG;
    const inverseDominanceB = 1 - dominanceB;
    const changeR = baseChangeValue * inverseDominanceR;
    const changeG = baseChangeValue * inverseDominanceG;
    const changeB = baseChangeValue * inverseDominanceB;

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

    const gradientResults = document.getElementById('gradientResults');
    gradientResults.innerHTML = '';

    const calculationsDiv = document.createElement('div');
    calculationsDiv.innerHTML = `
        <h2>Calculations</h2>
        <p><strong>1. Convert the starting color from hex format to RGB values:</strong> ${hexInput} to RGB(${r}, ${g}, ${b})</p>
        <p><strong>2. Calculate the average RGB value:</strong> (R + G + B) / 3 = (${r} + ${g} + ${b}) / 3 = ${avgRgb}</p>
        <p><strong>3. Calculate Base Change Value:</strong> Average RGB × Scaling Factor = ${avgRgb} × ${scalingFactor} = ${baseChangeValue}</p>
        <p><strong>4. Calculate the dominance of each RGB component:</strong>
            <br> Dominance of R = R / 255 = ${r} / 255 = ${dominanceR}
            <br> Dominance of G = G / 255 = ${g} / 255 = ${dominanceG}
            <br> Dominance of B = B / 255 = ${b} / 255 = ${dominanceB}
        </p>
        <p><strong>5. Calculate the inverse dominance of each RGB component:</strong>
            <br> Inverse Dominance of R = 1 - Dominance of R = 1 - ${dominanceR} = ${inverseDominanceR}
            <br> Inverse Dominance of G = 1 - Dominance of G = 1 - ${dominanceG} = ${inverseDominanceG}
            <br> Inverse Dominance of B = 1 - Dominance of B = 1 - ${dominanceB} = ${inverseDominanceB}
        </p>
        <p><strong>6. Calculate the change in each RGB component:</strong>
            <br> Change in R = Base Change Value × Inverse Dominance of R = ${baseChangeValue} × ${inverseDominanceR} = ${changeR}
            <br> Change in G = Base Change Value × Inverse Dominance of G = ${baseChangeValue} × ${inverseDominanceG} = ${changeG}
            <br> Change in B = Base Change Value × Inverse Dominance of B = ${baseChangeValue} × ${inverseDominanceB} = ${changeB}
        </p>
        <p><strong>7. Calculate the ending color for all 8 possible permutations:</strong></p>
    `;

    gradientResults.appendChild(calculationsDiv);

    permutations.forEach((perm, index) => {
        const endR = clamp(r + perm.R, 0, 255);
        const endG = clamp(g + perm.G, 0, 255);
        const endB = clamp(b + perm.B, 0, 255);

        const gradientText = `
            Permutation ${index + 1}: {'R': ${perm.R.toFixed(2)}, 'G': ${perm.G.toFixed(2)}, 'B': ${perm.B.toFixed(2)}}
            Gradient: linear-gradient(to right, rgb(${r}, ${g}, ${b}), rgb(${endR}, ${endG}, ${endB}))
        `;

        const gradientTextDiv = document.createElement('div');
        gradientTextDiv.className = 'gradient-text';
        gradientTextDiv.textContent = gradientText;
        gradientResults.appendChild(gradientTextDiv);

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
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
