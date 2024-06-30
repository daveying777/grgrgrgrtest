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
        [changeR, changeG, changeB],
        [changeR, changeG, -changeB],
        [changeR, -changeG, changeB],
        [changeR, -changeG, -changeB],
        [-changeR, changeG, changeB],
        [-changeR, changeG, -changeB],
        [-changeR, -changeG, changeB],
        [-changeR, -changeG, -changeB]
    ];
    console.log('permutations:', permutations);

    const gradientResults = document.getElementById('gradientResults');
    gradientResults.innerHTML = '';

    permutations.forEach((perm, index) => {
        const endR = clamp(r + perm[0], 0, 255);
        const endG = clamp(g + perm[1], 0, 255);
        const endB = clamp(b + perm[2], 0, 255);
        console.log('ending RGB values:', [endR, endG, endB]);

        const gradientDiv = document.createElement('div');
        gradientDiv.className = 'gradient';
        gradientDiv.style.background = `linear-gradient(to right, rgb(${r},${g},${b}), rgb(${endR},${endG},${endB}))`;

        const label = document.createElement('div');
        label.textContent = `Permutation ${index + 1}`;

        gradientResults.appendChild(label);
        gradientResults.appendChild(gradientDiv);
        
        console.log(`Gradient ${index + 1} added with background: linear-gradient(to right, rgb(${r},${g},${b}), rgb(${endR},${endG},${endB}))`);
    });

    console.log('Gradients calculated and displayed.');
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
