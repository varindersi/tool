document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const baseColorInput = document.getElementById('baseColor');
    const colorPicker = document.getElementById('colorPicker');
    const paletteSizeSelect = document.getElementById('paletteSize');
    const generateBtn = document.getElementById('generateBtn');
    const randomBtn = document.getElementById('randomBtn');
    const paletteContainer = document.getElementById('paletteContainer');
    const saveBtn = document.getElementById('saveBtn');
    const favoriteBtn = document.getElementById('favoriteBtn');
    const exportPNGBtn = document.getElementById('exportPNGBtn');
    const exportJSONBtn = document.getElementById('exportJSONBtn');
    const historyContainer = document.getElementById('historyContainer');
    const favoritesContainer = document.getElementById('favoritesContainer');
    const colorSuggestions = document.getElementById('colorSuggestions');
    const tooltip = document.getElementById('tooltip');

    // Constants
    const MAX_HISTORY = 10;
    const PREDEFINED_COLORS = [
        '#4A00E0', '#FF2E93', '#00C9A7', '#FFC700', '#845EC2',
        '#FF6B6B', '#4D8076', '#C34A36', '#008B8B', '#FF8066'
    ];

    // State
    let currentPalette = [];
    let history = JSON.parse(localStorage.getItem('colorHistory') || '[]');
    let favorites = JSON.parse(localStorage.getItem('colorFavorites') || '[]');

    // Initialize color suggestions
    function initColorSuggestions() {
        PREDEFINED_COLORS.forEach(color => {
            const suggestion = document.createElement('div');
            suggestion.className = 'color-suggestion';
            suggestion.style.backgroundColor = color;
            suggestion.setAttribute('data-color', color);
            suggestion.addEventListener('click', () => {
                baseColorInput.value = color;
                colorPicker.value = color;
                generatePalette();
            });
            colorSuggestions.appendChild(suggestion);
        });
    }

    // Color Conversion Utilities
    function hexToHSL(hex) {
        let r = parseInt(hex.slice(1, 3), 16) / 255;
        let g = parseInt(hex.slice(3, 5), 16) / 255;
        let b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
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

    function HSLToHex(h, s, l) {
        s /= 100;
        l /= 100;
        const a = s * Math.min(l, 1 - l);
        const f = (n) => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }

    // Generate Palette
    function generatePalette(isRandom = false) {
        const size = parseInt(paletteSizeSelect.value);
        let baseColor = isRandom ? generateRandomColor() : baseColorInput.value;
        
        if (!isRandom && !isValidHex(baseColor)) {
            showTooltip('Please enter a valid hex color', 'error');
            return;
        }

        if (isRandom) {
            baseColorInput.value = baseColor;
            colorPicker.value = baseColor;
        }

        const hsl = hexToHSL(baseColor);
        currentPalette = generateColors(hsl, size);
        renderPalette();
    }

    function generateColors(baseHSL, count) {
        const colors = [];
        const hueStep = 360 / count;
        const saturationRange = [70, 95];
        const lightnessRange = [45, 65];

        for (let i = 0; i < count; i++) {
            const hue = (baseHSL.h + hueStep * i) % 360;
            const saturation = Math.random() * (saturationRange[1] - saturationRange[0]) + saturationRange[0];
            const lightness = Math.random() * (lightnessRange[1] - lightnessRange[0]) + lightnessRange[0];
            colors.push(HSLToHex(hue, saturation, lightness));
        }

        return colors;
    }

    function generateRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Render Functions
    function renderPalette() {
        paletteContainer.innerHTML = '';
        currentPalette.forEach((color, index) => {
            const colorBox = createColorBox(color, index);
            paletteContainer.appendChild(colorBox);
        });
    }

    function createColorBox(color, index) {
        const box = document.createElement('div');
        box.className = 'color-box';
        box.style.backgroundColor = color;
        box.setAttribute('draggable', true);
        box.setAttribute('data-index', index);

        const info = document.createElement('div');
        info.className = 'color-info';
        info.textContent = color.toUpperCase();
        box.appendChild(info);

        // Drag and Drop
        box.addEventListener('dragstart', handleDragStart);
        box.addEventListener('dragend', handleDragEnd);
        box.addEventListener('dragover', handleDragOver);
        box.addEventListener('drop', handleDrop);

        // Click to copy
        box.addEventListener('click', () => copyToClipboard(color));

        return box;
    }

    function renderHistory() {
        historyContainer.innerHTML = '';
        history.forEach(palette => {
            const preview = createPalettePreview(palette);
            historyContainer.appendChild(preview);
        });
    }

    function renderFavorites() {
        favoritesContainer.innerHTML = '';
        favorites.forEach(palette => {
            const preview = createPalettePreview(palette);
            favoritesContainer.appendChild(preview);
        });
    }

    function createPalettePreview(palette) {
        const preview = document.createElement('div');
        preview.className = 'palette-preview';
        
        palette.forEach(color => {
            const colorStrip = document.createElement('div');
            colorStrip.className = 'palette-preview-color';
            colorStrip.style.backgroundColor = color;
            preview.appendChild(colorStrip);
        });

        preview.addEventListener('click', () => {
            currentPalette = [...palette];
            renderPalette();
        });

        return preview;
    }

    // Drag and Drop Handlers
    function handleDragStart(e) {
        e.target.classList.add('dragging');
        e.dataTransfer.setData('text/plain', e.target.getAttribute('data-index'));
    }

    function handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleDrop(e) {
        e.preventDefault();
        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
        const toIndex = parseInt(e.target.closest('.color-box').getAttribute('data-index'));
        
        if (fromIndex !== toIndex) {
            const temp = currentPalette[fromIndex];
            currentPalette[fromIndex] = currentPalette[toIndex];
            currentPalette[toIndex] = temp;
            renderPalette();
        }
    }

    // Save and Export Functions
    function savePalette() {
        if (currentPalette.length === 0) return;
        
        history.unshift(currentPalette);
        if (history.length > MAX_HISTORY) {
            history.pop();
        }
        
        localStorage.setItem('colorHistory', JSON.stringify(history));
        renderHistory();
        showTooltip('Palette saved to history!', 'success');
    }

    function addToFavorites() {
        if (currentPalette.length === 0) return;
        
        if (!favorites.some(p => JSON.stringify(p) === JSON.stringify(currentPalette))) {
            favorites.unshift(currentPalette);
            localStorage.setItem('colorFavorites', JSON.stringify(favorites));
            renderFavorites();
            showTooltip('Added to favorites!', 'success');
        } else {
            showTooltip('Palette already in favorites', 'info');
        }
    }

    function exportAsPNG() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const width = 1000;
        const height = 200;
        const colorWidth = width / currentPalette.length;

        canvas.width = width;
        canvas.height = height;

        currentPalette.forEach((color, i) => {
            ctx.fillStyle = color;
            ctx.fillRect(i * colorWidth, 0, colorWidth, height);
            
            // Add color code
            ctx.fillStyle = '#FFFFFF';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(color, (i * colorWidth) + (colorWidth / 2), height - 20);
        });

        const link = document.createElement('a');
        link.download = 'color-palette.png';
        link.href = canvas.toDataURL();
        link.click();
        showTooltip('PNG exported!', 'success');
    }

    function exportAsJSON() {
        const data = {
            palette: currentPalette,
            timestamp: new Date().toISOString(),
            metadata: {
                tool: 'Color Design Toolkit',
                baseColor: baseColorInput.value
            }
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'color-palette.json';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        showTooltip('JSON exported!', 'success');
    }

    // Utility Functions
    function isValidHex(hex) {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    }

    async function copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            showTooltip('Color copied!', 'success');
        } catch (err) {
            showTooltip('Failed to copy color', 'error');
        }
    }

    function showTooltip(message, type = 'info') {
        tooltip.textContent = message;
        tooltip.className = `tooltip visible ${type}`;
        
        const rect = event.target.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 40}px`;

        setTimeout(() => {
            tooltip.classList.remove('visible');
        }, 2000);
    }

    // Event Listeners
    baseColorInput.addEventListener('input', (e) => {
        let value = e.target.value;
        if (!value.startsWith('#')) {
            value = '#' + value;
        }
        if (isValidHex(value)) {
            colorPicker.value = value;
            generatePalette();
        }
    });

    colorPicker.addEventListener('input', (e) => {
        baseColorInput.value = e.target.value;
        generatePalette();
    });

    generateBtn.addEventListener('click', () => generatePalette(false));
    randomBtn.addEventListener('click', () => generatePalette(true));
    saveBtn.addEventListener('click', savePalette);
    favoriteBtn.addEventListener('click', addToFavorites);
    exportPNGBtn.addEventListener('click', exportAsPNG);
    exportJSONBtn.addEventListener('click', exportAsJSON);

    // Initialize
    initColorSuggestions();
    renderHistory();
    renderFavorites();
    generatePalette(true);
}); 