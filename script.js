// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');
const navItems = document.querySelectorAll('.nav-item');
const toolSections = document.querySelectorAll('.tool-section');
const tooltip = document.getElementById('tooltip');

// Color Palette Generator
const paletteGrid = document.getElementById('paletteGrid');
const generatePaletteBtn = document.getElementById('generatePalette');
const exportPNGBtn = document.getElementById('exportPNG');
const exportJSONBtn = document.getElementById('exportJSON');

// Hex to RGB Converter
const hexInput = document.getElementById('hexInput');
const rgbInput = document.getElementById('rgbInput');
const hslInput = document.getElementById('hslInput');
const converterPreview = document.getElementById('converterPreview');
const copyConverterBtn = document.getElementById('copyConverter');

// Color Mixer
const color1Input = document.getElementById('color1');
const color2Input = document.getElementById('color2');
const color1Hex = document.getElementById('color1Hex');
const color2Hex = document.getElementById('color2Hex');
const mixedPreview = document.getElementById('mixedPreview');
const mixedInfo = document.getElementById('mixedInfo');
const copyMixedBtn = document.getElementById('copyMixed');

// Contrast Checker
const foreground = document.getElementById('foreground');
const background = document.getElementById('background');
const foregroundHex = document.getElementById('foregroundHex');
const backgroundHex = document.getElementById('backgroundHex');
const contrastPreview = document.getElementById('contrastPreview');
const contrastRatio = document.getElementById('contrastRatio');
const wcagCompliance = document.getElementById('wcagCompliance');

// Shade Generator
const baseColor = document.getElementById('baseColor');
const baseColorHex = document.getElementById('baseColorHex');
const shadesGrid = document.getElementById('shadesGrid');
const generateShadesBtn = document.getElementById('generateShades');

// Random Color Picker
const randomPreview = document.getElementById('randomPreview');
const randomInfo = document.getElementById('randomInfo');
const generateRandomBtn = document.getElementById('generateRandom');
const copyRandomBtn = document.getElementById('copyRandom');

// Color History
const colorHistory = [];
const MAX_HISTORY = 20;

// Color Blindness Simulator
const baseColorPreview = document.getElementById('baseColorPreview');
const simulationTypes = document.querySelectorAll('.simulation-type');
const mockupButton = document.querySelector('.mockup-button');
const mockupCard = document.querySelector('.mockup-card');
const textContrast = document.getElementById('textContrast');
const buttonContrast = document.getElementById('buttonContrast');

// Color Converter Functionality
document.addEventListener('DOMContentLoaded', function() {
    const colorConverter = {
        // Color input elements
        hexInput: document.getElementById('hex-input'),
        rgbInput: document.getElementById('rgb-input'),
        hslInput: document.getElementById('hsl-input'),
        cmykInput: document.getElementById('cmyk-input'),
        colorPicker: document.getElementById('color-picker'),
        colorPreview: document.getElementById('color-preview'),
        
        // Result elements
        hexResult: document.getElementById('hex-result'),
        rgbResult: document.getElementById('rgb-result'),
        hslResult: document.getElementById('hsl-result'),
        cmykResult: document.getElementById('cmyk-result'),
        pantoneResult: document.getElementById('pantone-result'),
        colorNameResult: document.getElementById('color-name-result'),
        
        // Color details elements
        luminanceResult: document.getElementById('luminance-result'),
        contrastResult: document.getElementById('contrast-result'),
        temperatureResult: document.getElementById('temperature-result'),
        
        // Bulk converter elements
        bulkInput: document.getElementById('bulk-input'),
        bulkResults: document.getElementById('bulk-results'),
        bulkConvertBtn: document.getElementById('bulk-convert-btn'),
        
        // Initialize the converter
        init() {
            // Add event listeners
            this.hexInput.addEventListener('input', () => this.convertFromHex(this.hexInput.value));
            this.rgbInput.addEventListener('input', () => this.convertFromRGB(this.rgbInput.value));
            this.hslInput.addEventListener('input', () => this.convertFromHSL(this.hslInput.value));
            this.cmykInput.addEventListener('input', () => this.convertFromCMYK(this.cmykInput.value));
            this.colorPicker.addEventListener('input', () => this.convertFromPicker(this.colorPicker.value));
            this.bulkConvertBtn.addEventListener('click', () => this.convertBulkColors());
            
            // Initialize with default color
            this.convertFromHex('#4A90E2');
        },
        
        // Convert from HEX
        convertFromHex(hex) {
            if (!this.isValidHex(hex)) return;
            
            const rgb = this.hexToRgb(hex);
            const hsl = this.rgbToHsl(rgb);
            const cmyk = this.rgbToCmyk(rgb);
            
            this.updateResults(hex, rgb, hsl, cmyk);
            this.updateColorPreview(hex);
        },
        
        // Convert from RGB
        convertFromRGB(rgbStr) {
            const rgb = this.parseRgb(rgbStr);
            if (!rgb) return;
            
            const hex = this.rgbToHex(rgb);
            const hsl = this.rgbToHsl(rgb);
            const cmyk = this.rgbToCmyk(rgb);
            
            this.updateResults(hex, rgb, hsl, cmyk);
            this.updateColorPreview(hex);
        },
        
        // Convert from HSL
        convertFromHSL(hslStr) {
            const hsl = this.parseHsl(hslStr);
            if (!hsl) return;
            
            const rgb = this.hslToRgb(hsl);
            const hex = this.rgbToHex(rgb);
            const cmyk = this.rgbToCmyk(rgb);
            
            this.updateResults(hex, rgb, hsl, cmyk);
            this.updateColorPreview(hex);
        },
        
        // Convert from CMYK
        convertFromCMYK(cmykStr) {
            const cmyk = this.parseCmyk(cmykStr);
            if (!cmyk) return;
            
            const rgb = this.cmykToRgb(cmyk);
            const hex = this.rgbToHex(rgb);
            const hsl = this.rgbToHsl(rgb);
            
            this.updateResults(hex, rgb, hsl, cmyk);
            this.updateColorPreview(hex);
        },
        
        // Convert from color picker
        convertFromPicker(hex) {
            this.convertFromHex(hex);
        },
        
        // Update all results
        updateResults(hex, rgb, hsl, cmyk) {
            this.hexResult.textContent = hex;
            this.rgbResult.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
            this.hslResult.textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
            this.cmykResult.textContent = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
            
            // Update color details
            this.updateColorDetails(rgb);
            
            // Update Pantone and color name
            this.updateColorInfo(hex);
        },
        
        // Update color preview
        updateColorPreview(hex) {
            this.colorPreview.style.backgroundColor = hex;
        },
        
        // Update color details
        updateColorDetails(rgb) {
            const luminance = this.calculateLuminance(rgb);
            const contrast = this.calculateContrast(rgb);
            const temperature = this.calculateTemperature(rgb);
            
            this.luminanceResult.textContent = `${(luminance * 100).toFixed(1)}%`;
            this.contrastResult.textContent = contrast.toFixed(2);
            this.temperatureResult.textContent = temperature;
        },
        
        // Update Pantone and color name
        updateColorInfo(hex) {
            // This would typically involve an API call to a color database
            // For now, we'll use a simple lookup table
            const colorInfo = this.findClosestColor(hex);
            this.pantoneResult.textContent = colorInfo.pantone || 'N/A';
            this.colorNameResult.textContent = colorInfo.name || 'N/A';
        },
        
        // Convert bulk colors
        convertBulkColors() {
            const input = this.bulkInput.value.trim();
            if (!input) return;
            
            const colors = input.split('\n').filter(line => line.trim());
            this.bulkResults.innerHTML = '';
            
            colors.forEach(color => {
                const result = this.convertSingleBulkColor(color);
                const resultElement = document.createElement('div');
                resultElement.className = `bulk-result-item ${result.error ? 'error' : ''}`;
                resultElement.textContent = result.text;
                this.bulkResults.appendChild(resultElement);
            });
        },
        
        // Convert a single bulk color
        convertSingleBulkColor(color) {
            try {
                // Try different formats
                if (this.isValidHex(color)) {
                    const rgb = this.hexToRgb(color);
                    return {
                        text: `HEX: ${color} → RGB: ${rgb.r}, ${rgb.g}, ${rgb.b}`,
                        error: false
                    };
                }
                
                const rgb = this.parseRgb(color);
                if (rgb) {
                    const hex = this.rgbToHex(rgb);
                    return {
                        text: `RGB: ${color} → HEX: ${hex}`,
                        error: false
                    };
                }
                
                throw new Error('Invalid color format');
            } catch (error) {
                return {
                    text: `Error: ${color} - ${error.message}`,
                    error: true
                };
            }
        },
        
        // Color conversion utilities
        hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },
        
        rgbToHex(rgb) {
            return '#' + [rgb.r, rgb.g, rgb.b].map(x => {
                const hex = x.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('');
        },
        
        rgbToHsl(rgb) {
            const r = rgb.r / 255;
            const g = rgb.g / 255;
            const b = rgb.b / 255;
            
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
            
            return {
                h: Math.round(h * 360),
                s: Math.round(s * 100),
                l: Math.round(l * 100)
            };
        },
        
        hslToRgb(hsl) {
            const h = hsl.h / 360;
            const s = hsl.s / 100;
            const l = hsl.l / 100;
            
            let r, g, b;
            
            if (s === 0) {
                r = g = b = l;
            } else {
                const hue2rgb = (p, q, t) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1/6) return p + (q - p) * 6 * t;
                    if (t < 1/2) return q;
                    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                    return p;
                };
                
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }
            
            return {
                r: Math.round(r * 255),
                g: Math.round(g * 255),
                b: Math.round(b * 255)
            };
        },
        
        rgbToCmyk(rgb) {
            const r = rgb.r / 255;
            const g = rgb.g / 255;
            const b = rgb.b / 255;
            
            const k = 1 - Math.max(r, g, b);
            const c = (1 - r - k) / (1 - k) || 0;
            const m = (1 - g - k) / (1 - k) || 0;
            const y = (1 - b - k) / (1 - k) || 0;
            
            return {
                c: Math.round(c * 100),
                m: Math.round(m * 100),
                y: Math.round(y * 100),
                k: Math.round(k * 100)
            };
        },
        
        cmykToRgb(cmyk) {
            const c = cmyk.c / 100;
            const m = cmyk.m / 100;
            const y = cmyk.y / 100;
            const k = cmyk.k / 100;
            
            const r = 255 * (1 - c) * (1 - k);
            const g = 255 * (1 - m) * (1 - k);
            const b = 255 * (1 - y) * (1 - k);
            
            return {
                r: Math.round(r),
                g: Math.round(g),
                b: Math.round(b)
            };
        },
        
        // Color analysis utilities
        calculateLuminance(rgb) {
            const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
                c = c / 255;
                return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        },
        
        calculateContrast(rgb) {
            const luminance = this.calculateLuminance(rgb);
            return (luminance + 0.05) / 0.05;
        },
        
        calculateTemperature(rgb) {
            const r = rgb.r;
            const g = rgb.g;
            const b = rgb.b;
            
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const delta = max - min;
            
            if (delta === 0) return 'Neutral';
            
            const hue = (() => {
                if (max === r) return (g - b) / delta;
                if (max === g) return 2 + (b - r) / delta;
                return 4 + (r - g) / delta;
            })() * 60;
            
            if (hue < 0) hue += 360;
            
            if (hue < 15) return 'Warm';
            if (hue < 45) return 'Warm';
            if (hue < 75) return 'Warm';
            if (hue < 105) return 'Cool';
            if (hue < 135) return 'Cool';
            if (hue < 165) return 'Cool';
            if (hue < 195) return 'Cool';
            if (hue < 225) return 'Cool';
            if (hue < 255) return 'Warm';
            if (hue < 285) return 'Warm';
            if (hue < 315) return 'Warm';
            return 'Warm';
        },
        
        // Validation utilities
        isValidHex(hex) {
            return /^#?([a-f\d]{3}|[a-f\d]{6})$/i.test(hex);
        },
        
        parseRgb(rgbStr) {
            const match = rgbStr.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            if (!match) return null;
            
            const [r, g, b] = match.slice(1).map(Number);
            if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) return null;
            
            return { r, g, b };
        },
        
        parseHsl(hslStr) {
            const match = hslStr.match(/^hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)$/);
            if (!match) return null;
            
            const [h, s, l] = match.slice(1).map(Number);
            if (h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) return null;
            
            return { h, s, l };
        },
        
        parseCmyk(cmykStr) {
            const match = cmykStr.match(/^cmyk\((\d+)%,\s*(\d+)%,\s*(\d+)%,\s*(\d+)%\)$/);
            if (!match) return null;
            
            const [c, m, y, k] = match.slice(1).map(Number);
            if (c < 0 || c > 100 || m < 0 || m > 100 || y < 0 || y > 100 || k < 0 || k > 100) return null;
            
            return { c, m, y, k };
        },
        
        // Simple color database (would typically be an API call)
        findClosestColor(hex) {
            const colors = [
                { hex: '#FF0000', name: 'Red', pantone: 'PMS 485' },
                { hex: '#00FF00', name: 'Green', pantone: 'PMS 354' },
                { hex: '#0000FF', name: 'Blue', pantone: 'PMS 286' },
                { hex: '#FFFF00', name: 'Yellow', pantone: 'PMS 102' },
                { hex: '#FF00FF', name: 'Magenta', pantone: 'PMS 2385' },
                { hex: '#00FFFF', name: 'Cyan', pantone: 'PMS 3125' },
                { hex: '#000000', name: 'Black', pantone: 'PMS Black' },
                { hex: '#FFFFFF', name: 'White', pantone: 'PMS White' }
            ];
            
            const targetRgb = this.hexToRgb(hex);
            let closestColor = null;
            let minDistance = Infinity;
            
            colors.forEach(color => {
                const rgb = this.hexToRgb(color.hex);
                const distance = Math.sqrt(
                    Math.pow(targetRgb.r - rgb.r, 2) +
                    Math.pow(targetRgb.g - rgb.g, 2) +
                    Math.pow(targetRgb.b - rgb.b, 2)
                );
                
                if (distance < minDistance) {
                    minDistance = distance;
                    closestColor = color;
                }
            });
            
            return closestColor;
        }
    };
    
    // Initialize the color converter
    colorConverter.init();
});

function updateThemeIcon(isDark) {
    themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme === 'dark');
});

// Initialize theme from localStorage
const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme === 'dark');

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && 
        !sidebar.contains(e.target) && 
        !menuToggle.contains(e.target)) {
        sidebar.classList.remove('active');
    }
});

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const tool = item.getAttribute('data-tool');
        
        // Update active states
        navItems.forEach(nav => nav.classList.remove('active'));
        toolSections.forEach(section => section.classList.remove('active'));
        
        item.classList.add('active');
        document.getElementById(tool).classList.add('active');
        
        // Close sidebar on mobile after selection
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
        }
    });
});

function showTooltip(text, element) {
    const rect = element.getBoundingClientRect();
    tooltip.textContent = text;
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top - 40}px`;
    tooltip.style.opacity = '1';
    
    setTimeout(() => {
        tooltip.style.opacity = '0';
    }, 2000);
}

async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showTooltip('Copied!', event.target);
    } catch (err) {
        console.error('Failed to copy text: ', err);
        showTooltip('Failed to copy', event.target);
    }
}

// Color Palette Generator
function generateRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

function rgbToHex(rgb) {
    const [r, g, b] = rgb.match(/\d+/g);
    return '#' + [r, g, b].map(x => {
        const hex = parseInt(x).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

function createColorCard(color) {
    const card = document.createElement('div');
    card.className = 'color-card';
    card.style.backgroundColor = color;
    
    const hex = rgbToHex(color);
    const info = document.createElement('div');
    info.className = 'color-info';
    info.textContent = hex;
    
    const lockBtn = document.createElement('button');
    lockBtn.className = 'lock-btn';
    lockBtn.innerHTML = '<i class="fas fa-lock"></i>';
    lockBtn.setAttribute('aria-label', 'Lock color');
    
    card.appendChild(info);
    card.appendChild(lockBtn);
    return card;
}

function generatePalette() {
    paletteGrid.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const color = generateRandomColor();
        const card = createColorCard(color);
        paletteGrid.appendChild(card);
    }
}

generatePaletteBtn.addEventListener('click', generatePalette);

// Export as PNG
exportPNGBtn.addEventListener('click', async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const cards = document.querySelectorAll('.color-card');
    
    canvas.width = 500;
    canvas.height = 100;
    
    cards.forEach((card, index) => {
        const color = card.style.backgroundColor;
        ctx.fillStyle = color;
        ctx.fillRect(index * 100, 0, 100, 100);
        
        // Add hex code
        ctx.fillStyle = 'white';
        ctx.font = '12px Inter';
        ctx.fillText(card.querySelector('.color-info').textContent, index * 100 + 5, 90);
    });
    
    const link = document.createElement('a');
    link.download = 'color-palette.png';
    link.href = canvas.toDataURL();
    link.click();
    showTooltip('PNG exported!', exportPNGBtn);
});

// Export as JSON
exportJSONBtn.addEventListener('click', () => {
    const cards = document.querySelectorAll('.color-card');
    const palette = Array.from(cards).map(card => ({
        hex: card.querySelector('.color-info').textContent,
        rgb: card.style.backgroundColor
    }));
    
    const json = JSON.stringify(palette, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = 'color-palette.json';
    link.href = url;
    link.click();
    
    URL.revokeObjectURL(url);
    showTooltip('JSON exported!', exportJSONBtn);
});

// Initialize first palette
generatePalette();

// Add click handlers to color cards
document.addEventListener('click', (e) => {
    if (e.target.closest('.color-card')) {
        const card = e.target.closest('.color-card');
        const hex = card.querySelector('.color-info').textContent;
        copyToClipboard(hex);
    }
    
    if (e.target.closest('.lock-btn')) {
        const card = e.target.closest('.color-card');
        card.classList.toggle('locked');
        const icon = card.querySelector('.lock-btn i');
        icon.className = card.classList.contains('locked') ? 'fas fa-lock' : 'fas fa-lock-open';
    }
});

// Accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Hex to RGB Converter
function hexToRgb(hex) {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Handle 3-digit hex
    if (hex.length === 3) {
        hex = hex.split('').map(h => h + h).join('');
    }
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return { r, g, b };
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
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
    
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

function updateConverter() {
    const hex = hexInput.value;
    const isValidHex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    
    if (isValidHex) {
        const rgb = hexToRgb(hex);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        
        rgbInput.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        hslInput.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        converterPreview.style.backgroundColor = hex;
        
        hexInput.classList.remove('error');
    } else {
        hexInput.classList.add('error');
    }
}

hexInput.addEventListener('input', (e) => {
    let value = e.target.value;
    if (value.startsWith('#')) {
        value = value.substring(1);
    }
    if (value.length <= 6) {
        hexInput.value = '#' + value.toUpperCase();
        updateConverter();
    }
});

// Initialize converter
updateConverter();

// Color Mixer
function mixColors(color1, color2) {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    
    return {
        r: Math.round((rgb1.r + rgb2.r) / 2),
        g: Math.round((rgb1.g + rgb2.g) / 2),
        b: Math.round((rgb1.b + rgb2.b) / 2)
    };
}

function updateMixer() {
    const mixed = mixColors(color1Input.value, color2Input.value);
    const hex = `#${mixed.r.toString(16).padStart(2, '0')}${mixed.g.toString(16).padStart(2, '0')}${mixed.b.toString(16).padStart(2, '0')}`;
    
    mixedPreview.style.backgroundColor = hex;
    mixedInfo.textContent = `Hex: ${hex} | RGB: rgb(${mixed.r}, ${mixed.g}, ${mixed.b})`;
}

color1Input.addEventListener('input', () => {
    color1Hex.value = color1Input.value;
    updateMixer();
});

color2Input.addEventListener('input', () => {
    color2Hex.value = color2Input.value;
    updateMixer();
});

color1Hex.addEventListener('input', () => {
    if (/^#[0-9A-Fa-f]{6}$/.test(color1Hex.value)) {
        color1Input.value = color1Hex.value;
        updateMixer();
    }
});

color2Hex.addEventListener('input', () => {
    if (/^#[0-9A-Fa-f]{6}$/.test(color2Hex.value)) {
        color2Input.value = color2Hex.value;
        updateMixer();
    }
});

copyMixedBtn.addEventListener('click', () => copyToClipboard(mixedInfo.textContent));

// Contrast Checker
function getLuminance(r, g, b) {
    const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function calculateContrast(hex1, hex2) {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    
    const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
}

function updateContrast() {
    contrastPreview.style.color = foreground.value;
    contrastPreview.style.backgroundColor = background.value;
    
    const ratio = calculateContrast(foreground.value, background.value);
    const ratioText = ratio.toFixed(2);
    
    contrastRatio.textContent = `Contrast Ratio: ${ratioText}:1`;
    
    let compliance = [];
    if (ratio >= 7) {
        compliance.push('AAA (Large Text)');
        compliance.push('AAA (Normal Text)');
    } else if (ratio >= 4.5) {
        compliance.push('AA (Large Text)');
        compliance.push('AA (Normal Text)');
    } else if (ratio >= 3) {
        compliance.push('AA (Large Text)');
    }
    
    wcagCompliance.textContent = compliance.length ? 
        `WCAG Compliance: ${compliance.join(', ')}` : 
        'Does not meet WCAG standards';
}

foreground.addEventListener('input', () => {
    foregroundHex.value = foreground.value;
    updateContrast();
});

background.addEventListener('input', () => {
    backgroundHex.value = background.value;
    updateContrast();
});

// Shade Generator
function generateShades() {
    const base = hexToRgb(baseColor.value);
    shadesGrid.innerHTML = '';
    
    for (let i = -4; i <= 4; i++) {
        const factor = 1 + (i * 0.1);
        const shade = {
            r: Math.min(255, Math.max(0, Math.round(base.r * factor))),
            g: Math.min(255, Math.max(0, Math.round(base.g * factor))),
            b: Math.min(255, Math.max(0, Math.round(base.b * factor)))
        };
        
        const hex = `#${shade.r.toString(16).padStart(2, '0')}${shade.g.toString(16).padStart(2, '0')}${shade.b.toString(16).padStart(2, '0')}`;
        
        const card = document.createElement('div');
        card.className = 'shade-card';
        card.style.backgroundColor = hex;
        
        const info = document.createElement('div');
        info.className = 'color-info';
        info.textContent = hex;
        
        card.appendChild(info);
        shadesGrid.appendChild(card);
    }
}

baseColor.addEventListener('input', () => {
    baseColorHex.value = baseColor.value;
    generateShades();
});

generateShadesBtn.addEventListener('click', generateShades);

// Random Color Picker
function generateRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    
    randomPreview.style.backgroundColor = hex;
    randomInfo.textContent = `Hex: ${hex} | RGB: rgb(${r}, ${g}, ${b})`;
}

generateRandomBtn.addEventListener('click', generateRandomColor);
copyRandomBtn.addEventListener('click', () => copyToClipboard(randomInfo.textContent));

// Initialize tools
updateConverter();
updateMixer();
updateContrast();
generateShades();
generateRandomColor();

// Color Sharing System
function addToHistory(color, sourceTool) {
    colorHistory.unshift({
        color,
        sourceTool,
        timestamp: new Date().toISOString()
    });
    
    if (colorHistory.length > MAX_HISTORY) {
        colorHistory.pop();
    }
    
    // Update history UI if it exists
    updateHistoryUI();
}

function updateHistoryUI() {
    const historyContainer = document.getElementById('colorHistory');
    if (!historyContainer) return;
    
    historyContainer.innerHTML = colorHistory.map((item, index) => `
        <div class="history-item" data-index="${index}">
            <div class="color-preview" style="background-color: ${item.color}"></div>
            <div class="history-info">
                <div class="color-value">${item.color}</div>
                <div class="source-tool">From ${item.sourceTool}</div>
            </div>
            <button class="use-color-btn" onclick="useColorFromHistory(${index})">
                <i class="fas fa-arrow-right"></i>
            </button>
        </div>
    `).join('');
}

function useColorFromHistory(index) {
    const color = colorHistory[index].color;
    const currentTool = document.querySelector('.tool-section.active').id;
    
    switch (currentTool) {
        case 'mixer':
            document.getElementById('color1').value = color;
            document.getElementById('color1Hex').value = color;
            updateMixer();
            break;
        case 'contrast':
            document.getElementById('foreground').value = color;
            document.getElementById('foregroundHex').value = color;
            updateContrast();
            break;
        case 'shades':
            document.getElementById('baseColor').value = color;
            document.getElementById('baseColorHex').value = color;
            generateShades();
            break;
        case 'palette':
            // Add color to palette
            const card = createColorCard(color);
            document.getElementById('paletteGrid').appendChild(card);
            break;
    }
}

// Dropdown functionality
document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = toggle.closest('.dropdown');
        dropdown.classList.toggle('active');
    });
});

// Close dropdowns when clicking outside
document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown.active').forEach(dropdown => {
        dropdown.classList.remove('active');
    });
});

// Handle color sharing
document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetTool = item.getAttribute('data-tool');
        const currentTool = document.querySelector('.tool-section.active').id;
        const currentColor = getCurrentColor(currentTool);
        
        if (currentColor) {
            // Switch to target tool
            document.querySelector(`.nav-item[data-tool="${targetTool}"]`).click();
            
            // Set color in target tool
            setTimeout(() => {
                setColorInTool(targetTool, currentColor);
                addToHistory(currentColor, currentTool);
            }, 100);
        }
    });
});

function getCurrentColor(toolId) {
    switch (toolId) {
        case 'converter':
            return document.getElementById('hexInput').value;
        case 'mixer':
            return document.getElementById('mixedPreview').style.backgroundColor;
        case 'contrast':
            return document.getElementById('foreground').value;
        case 'shades':
            return document.getElementById('baseColor').value;
        case 'random':
            return document.getElementById('randomPreview').style.backgroundColor;
        default:
            return null;
    }
}

function setColorInTool(toolId, color) {
    switch (toolId) {
        case 'mixer':
            document.getElementById('color1').value = color;
            document.getElementById('color1Hex').value = color;
            updateMixer();
            break;
        case 'contrast':
            document.getElementById('foreground').value = color;
            document.getElementById('foregroundHex').value = color;
            updateContrast();
            break;
        case 'shades':
            document.getElementById('baseColor').value = color;
            document.getElementById('baseColorHex').value = color;
            generateShades();
            break;
        case 'palette':
            const card = createColorCard(color);
            document.getElementById('paletteGrid').appendChild(card);
            break;
    }
}

// Color Blindness Simulator
function updateColorBlindnessSimulator() {
    const color = baseColor.value;
    baseColorHex.value = color;
    baseColorPreview.style.backgroundColor = color;
    
    // Update mockup colors
    mockupButton.style.backgroundColor = color;
    mockupCard.style.backgroundColor = color;
    
    // Calculate contrast ratios
    const textContrastRatio = calculateContrast(color, '#FFFFFF');
    const buttonContrastRatio = calculateContrast(color, '#000000');
    
    // Update contrast results
    textContrast.textContent = `${textContrastRatio.toFixed(1)}:1`;
    buttonContrast.textContent = `${buttonContrastRatio.toFixed(1)}:1`;
    
    // Update status indicators
    updateContrastStatus(textContrast, textContrastRatio, 'text');
    updateContrastStatus(buttonContrast, buttonContrastRatio, 'button');
    
    // Update WCAG compliance
    updateWCAGCompliance(textContrastRatio, buttonContrastRatio);
}

function updateContrastStatus(element, ratio, type) {
    const parent = element.closest('.result-item');
    const status = parent.querySelector('.result-status');
    
    let statusClass = 'error';
    let statusText = 'Fail';
    
    if (type === 'text') {
        if (ratio >= 7) {
            statusClass = 'success';
            statusText = 'AAA';
        } else if (ratio >= 4.5) {
            statusClass = 'success';
            statusText = 'AA';
        } else if (ratio >= 3) {
            statusClass = 'warning';
            statusText = 'Large Text Only';
        }
    } else if (type === 'button') {
        if (ratio >= 3) {
            statusClass = 'success';
            statusText = 'Pass';
        }
    }
    
    status.className = `result-status ${statusClass}`;
    status.textContent = statusText;
}

function updateWCAGCompliance(textRatio, buttonRatio) {
    const status = wcagCompliance.closest('.result-status');
    
    if (textRatio >= 7 && buttonRatio >= 3) {
        status.className = 'result-status success';
        status.textContent = 'AAA';
    } else if (textRatio >= 4.5 && buttonRatio >= 3) {
        status.className = 'result-status success';
        status.textContent = 'AA';
    } else {
        status.className = 'result-status warning';
        status.textContent = 'Partial';
    }
}

// Event Listeners
baseColor.addEventListener('input', updateColorBlindnessSimulator);
baseColorHex.addEventListener('input', () => {
    if (/^#[0-9A-Fa-f]{6}$/i.test(baseColorHex.value)) {
        baseColor.value = baseColorHex.value;
        updateColorBlindnessSimulator();
    }
});

simulationTypes.forEach(type => {
    type.addEventListener('click', () => {
        simulationTypes.forEach(t => t.classList.remove('active'));
        type.classList.add('active');
        
        const mockupPreview = document.querySelector('.mockup-preview');
        mockupPreview.setAttribute('data-type', type.getAttribute('data-type'));
    });
});

// Initialize simulator
updateColorBlindnessSimulator();

// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            // Validate form data
            if (!validateContactForm(formData)) {
                return;
            }

            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;

            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Reset form
                contactForm.reset();
                
                // Show success message
                showTooltip('Message sent successfully!', 'success');
                
                // Reset button
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }, 1500);
        });
    }
});

function validateContactForm(formData) {
    // Validate name
    if (!formData.name.trim()) {
        showTooltip('Please enter your name', 'error');
        return false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showTooltip('Please enter a valid email address', 'error');
        return false;
    }

    // Validate subject
    if (!formData.subject.trim()) {
        showTooltip('Please enter a subject', 'error');
        return false;
    }

    // Validate message
    if (!formData.message.trim()) {
        showTooltip('Please enter your message', 'error');
        return false;
    }

    return true;
}

function showTooltip(message, type = 'info') {
    const tooltip = document.getElementById('tooltip');
    if (!tooltip) return;

    tooltip.textContent = message;
    tooltip.className = `tooltip ${type}`;
    tooltip.setAttribute('aria-hidden', 'false');

    // Position tooltip
    const form = document.querySelector('.contact-form');
    if (form) {
        const formRect = form.getBoundingClientRect();
        tooltip.style.top = `${formRect.top - 50}px`;
        tooltip.style.left = `${formRect.left + (formRect.width / 2)}px`;
        tooltip.style.transform = 'translateX(-50%)';
    }

    // Show tooltip
    tooltip.style.opacity = '1';
    tooltip.style.visibility = 'visible';

    // Hide tooltip after 3 seconds
    setTimeout(() => {
        tooltip.style.opacity = '0';
        tooltip.style.visibility = 'hidden';
        tooltip.setAttribute('aria-hidden', 'true');
    }, 3000);
}

// FAQ Accordion Functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            
            // Close all other questions
            faqQuestions.forEach(q => {
                if (q !== question) {
                    q.setAttribute('aria-expanded', 'false');
                    q.nextElementSibling.setAttribute('aria-hidden', 'true');
                }
            });
            
            // Toggle current question
            question.setAttribute('aria-expanded', !isExpanded);
            answer.setAttribute('aria-hidden', isExpanded);
            
            // Focus management
            if (!isExpanded) {
                answer.focus();
            }
        });
        
        // Keyboard navigation
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
    });
});

// Add smooth scroll behavior for the "Get Started" button
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add hover animations for tool cards
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 20px 40px rgba(74, 0, 224, 0.15)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 10px 20px rgba(74, 0, 224, 0.1)';
        });
    });

    // Add parallax effect to header
    let header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        let scrolled = window.pageYOffset;
        header.style.backgroundPositionY = scrolled * 0.5 + 'px';
    });

    // Add intersection observer for fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.tool-card').forEach(card => {
        card.classList.add('fade-in');
        observer.observe(card);
    });

    // Add loading animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });
});

// Tool Card Navigation
document.addEventListener('DOMContentLoaded', () => {
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        card.addEventListener('click', function() {
            const toolPath = this.getAttribute('data-tool-path');
            if (toolPath) {
                window.location.href = toolPath;
            }
        });

        // Add hover effect
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 20px 40px rgba(74, 0, 224, 0.15)';
            card.style.cursor = 'pointer';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 10px 20px rgba(74, 0, 224, 0.1)';
        });
    });
}); 