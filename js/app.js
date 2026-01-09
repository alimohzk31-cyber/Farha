/**
 * Farha App - Main Logic
 * Target: Kids 3-9 years old
 */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

const CONSTANTS = {
    COLORS: ['#FF9F9F', '#9FD3FF', '#FFF59F', '#A5F8CE', '#E0C3FC', '#FFB7B2', '#B5EAD7', '#C7CEEA', '#000000', '#FFFFFF'],
    LETTERS: [
        { char: 'أ', word: 'أرنب', img: 'rabbit' },
        { char: 'ب', word: 'بطة', img: 'duck' },
        { char: 'ت', word: 'تفاحة', img: 'apple' },
        { char: 'ث', word: 'ثعلب', img: 'fox' },
        { char: 'ج', word: 'جمل', img: 'camel' },
        { char: 'ح', word: 'حصان', img: 'horse' },
        { char: 'خ', word: 'خروف', img: 'sheep' },
        { char: 'د', word: 'دب', img: 'bear' },
        { char: 'ذ', word: 'ذئب', img: 'wolf' },
        { char: 'ر', word: 'رمان', img: 'pomegranate' },
        { char: 'ز', word: 'زرافة', img: 'giraffe' },
        { char: 'س', word: 'سمكة', img: 'fish' },
        { char: 'ش', word: 'شمس', img: 'sun' },
    ],
    STORIES: [
        { id: 'rabbit-kind', title: 'الأرنب الطيب 🐰', icon: '⭐', cover: '#A5F8CE', slides: ['أنا أحب مساعدة أصدقائي', 'أشارك اللعب بكل حب', 'أقول كلامًا لطيفًا', 'أحافظ على نظافة المكان', 'أساعد من يحتاجني', 'نحن سعداء معًا'] },
        { id: 'cat-order', title: 'القطة التي تحب النظام 🐱', icon: '❤️', cover: '#E0C3FC', slides: ['أنظف غرفتي', 'أرتب كتبي', 'أضع لعبي في صندوقها', 'أغسل يدي قبل الطعام', 'أحب النظام', 'النظام يجعلني سعيدًا'] },
        { id: 'true-friend', title: 'الصديق الصادق 👫', icon: '🌙', cover: '#9FD3FF', slides: ['أقول الحقيقة دائمًا', 'أعتذر عند الخطأ', 'أحترم أصدقائي', 'أتحدث بلطف', 'الصدق طريق الخير', 'كلنا نحب الصدق'] },
        { id: 'brave-bird', title: 'العصفور الشجاع 🐦', icon: '⭐', cover: '#FFF59F', slides: ['أحاول من جديد', 'لا أخاف من المحاولة', 'أتعلم من أخطائي', 'أحافظ على أصدقائي', 'الشجاعة جميلة', 'أنا قوي'] },
        { id: 'school-day', title: 'يوم في المدرسة 🏫', icon: '❤️', cover: '#FFB7B2', slides: ['أستمع للمعلمة', 'أرفع يدي قبل الكلام', 'ألعب بأدب', 'أساعد زميلي', 'أحب مدرستي', 'اليوم جميل'] },
        { id: 'love-family', title: 'أنا أحب عائلتي 👨‍👩‍👧', icon: '🌙', cover: '#B5EAD7', slides: ['أحترم بابا وماما', 'ألعب مع إخوتي', 'أقول شكرًا', 'أعانق عائلتي', 'البيت دافئ', 'العائلة كنز'] },
        { id: 'kind-word', title: 'الكلمة الطيبة 🌸', icon: '⭐', cover: '#C7CEEA', slides: ['أقول من فضلك', 'أقول شكرًا', 'أقول عفوًا', 'أبتسم للآخرين', 'الكلمة الطيبة جميلة', 'أنا لطيف'] },
        { id: 'lion-help', title: 'الأسد المتعاون 🦁', icon: '❤️', cover: '#A5F8CE', slides: ['أساعد فريقي', 'ننجح معًا', 'نحترم بعضنا', 'نستمع لبعضنا', 'التعاون قوة', 'نحن أبطال'] },
        { id: 'clean-hands', title: 'نظافة يدي سر صحتي 🧼', icon: '🌙', cover: '#9FD3FF', slides: ['أغسل يدي بالماء والصابون', 'أجفف يدي جيدًا', 'أبتعد عن الجراثيم', 'أكون نظيفًا', 'النظافة سعادة', 'أنا صحي وقوي'] },
        { id: 'little-moon', title: 'القمر الصغير 🌙', icon: '⭐', cover: '#E0C3FC', slides: ['أنا مضيء في السماء', 'أحب الليل الهادئ', 'أزور الأطفال في أحلامهم', 'أنشر الهدوء', 'الليل جميل', 'تصبحون على خير'] }
    ]
};

let currentTool = 'brush';
let currentColor = '#000000';
let isDrawing = false;
let ctxColoring, ctxDrawing, ctxColoringBg;
let brushSize = 8;
let coloringHistory = [];
let coloringRedo = [];
let coloringBgImage = null;
let drawingAutoSaveTimer = null;
let drawingLastChangeTs = 0;
let drawingTouches = new Map();
let adminOverrides = {};

function initApp() {
    setupNavigation();
    setupWelcomeScreen();
    setupColoring();
    setupDrawing();
    setupLetters();
    setupStories();
    setupGames();
    // Global Error Handling for Kids App (No crashes visible)
    window.onerror = function() { return true; };
}

// --- Navigation ---
function setupNavigation() {
    window.navigateTo = (screenId) => {
        playSound('pop');
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
        
        // Resize canvas if entering drawing/coloring
        if(screenId === 'coloring-section') resizeColoring();
        if(screenId === 'drawing-section') resizeCanvas('drawing-canvas');
        if(screenId === 'games-section') resetGames();
        if(screenId === 'letters-section') resizeTraceCanvasIfVisible();
    };
    
    document.getElementById('start-btn').addEventListener('click', () => {
        navigateTo('home-screen');
        playSound('bg-music'); 
    });
    window.addEventListener('resize', () => {
        const active = document.querySelector('.screen.active');
        const id = active ? active.id : '';
        if (id === 'coloring-section') resizeColoring();
        if (id === 'drawing-section') resizeCanvas('drawing-canvas');
        if (id === 'letters-section') resizeTraceCanvasIfVisible();
    });
}

function setupWelcomeScreen() {
    // Optional: Auto-redirect functionality or animations
}

// --- Audio Manager (Simple) ---
function playSound(type) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        if (type === 'sfx-success') o.frequency.value = 880;
        else if (type === 'error') o.frequency.value = 220;
        else o.frequency.value = 440;
        g.gain.setValueAtTime(0.001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        o.connect(g);
        g.connect(ctx.destination);
        o.start();
        o.stop(ctx.currentTime + 0.22);
    } catch(e) {}
}

// --- Coloring & Drawing Logic ---
function setupColoring() {
    const overlay = document.getElementById('coloring-canvas');
    const bg = document.getElementById('coloring-bg');
    ctxColoring = overlay.getContext('2d');
    ctxColoringBg = bg.getContext('2d');
    generateColorPalette('coloring-colors', (color) => {
        currentColor = color;
        currentTool = 'brush';
    });
    setupColoringImages();
    
    setupCanvasEvents(overlay, ctxColoring);
    
    document.getElementById('clear-tool').addEventListener('click', () => clearCanvas(overlay));
    document.getElementById('eraser-tool').addEventListener('click', () => { currentTool = 'eraser'; });
    document.getElementById('brush-tool').addEventListener('click', () => { currentTool = 'brush'; });
    const sizeInput = document.getElementById('coloring-size');
    const sizeDisplay = document.getElementById('size-display');
    if (sizeInput && sizeDisplay) {
        sizeInput.addEventListener('input', () => {
            brushSize = parseInt(sizeInput.value, 10) || 8;
            sizeDisplay.textContent = String(brushSize);
        });
    }
    const saveBtn = document.getElementById('save-tool');
    if (saveBtn) {
        saveBtn.addEventListener('click', () => exportColoringImage());
    }
    const undoBtn = document.getElementById('coloring-undo');
    const redoBtn = document.getElementById('coloring-redo');
    if (undoBtn) undoBtn.addEventListener('click', undoColoring);
    if (redoBtn) redoBtn.addEventListener('click', redoColoring);
    const uploadInput = document.getElementById('coloring-upload');
    if (uploadInput) {
        uploadInput.addEventListener('change', (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.onload = () => {
                    coloringBgImage = img;
                    drawBgImage();
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
            e.target.value = '';
        });
    }
    const eyedropper = document.getElementById('eyedropper-tool');
    if (eyedropper) {
        eyedropper.addEventListener('click', () => { currentTool = 'eyedropper'; });
    }
}

function setupColoringImages() {
    const container = document.getElementById('coloring-images');
    if (!container) return;
    container.innerHTML = '';
    const list = coloringImageList();
    list.forEach(item => {
        const img = document.createElement('img');
        img.className = 'img-thumb';
        img.alt = item.label;
        img.crossOrigin = 'anonymous';
        img.src = item.url;
        img.onclick = () => loadColoringImage(item.url);
        container.appendChild(img);
    });
}
function loadColoringImage(url) {
    if (/\\.svg(\\?|$)/i.test(url)) {
        fetch(url)
            .then(r => r.text())
            .then(txt => {
                const outlined = outlineSvg(txt);
                const blob = new Blob([outlined], { type: 'image/svg+xml' });
                const obj = URL.createObjectURL(blob);
                const img = new Image();
                img.onload = () => {
                    coloringBgImage = img;
                    drawBgImage();
                    const overlay = document.getElementById('coloring-canvas');
                    clearCanvas(overlay);
                    URL.revokeObjectURL(obj);
                    playSound('pop');
                };
                img.src = obj;
            })
            .catch(() => loadRaster(url));
    } else {
        loadRaster(url);
    }
}
function loadRaster(url) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
        coloringBgImage = img;
        drawBgImage();
        const overlay = document.getElementById('coloring-canvas');
        clearCanvas(overlay);
        playSound('pop');
    };
    img.src = url;
}
function outlineSvg(svgText) {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, 'image/svg+xml');
        const svg = doc.documentElement;
        const nodes = svg.querySelectorAll('*');
        nodes.forEach(n => {
            const tag = n.tagName.toLowerCase();
            if (['path','circle','ellipse','rect','polygon','polyline'].includes(tag)) {
                n.setAttribute('fill', 'none');
                n.setAttribute('stroke', '#000');
                if (!n.getAttribute('stroke-width')) n.setAttribute('stroke-width', '3');
                n.setAttribute('stroke-linejoin', 'round');
                n.setAttribute('stroke-linecap', 'round');
            }
            const style = n.getAttribute('style');
            if (style) {
                const s = style
                    .replace(/fill\\s*:\\s*[^;]+/gi, 'fill:none')
                    .replace(/stroke\\s*:\\s*[^;]+/gi, 'stroke:#000')
                    .replace(/stroke-width\\s*:\\s*[^;]+/gi, 'stroke-width:3');
                n.setAttribute('style', s);
            }
        });
        const serializer = new XMLSerializer();
        return serializer.serializeToString(doc);
    } catch(e) {
        return svgText;
    }
}
function coloringImageList() {
    const animals = [
        { label: 'أسد', cp: '1f981' },
        { label: 'قطة', cp: '1f431' },
        { label: 'دب', cp: '1f43b' },
        { label: 'زرافة', cp: '1f992' },
        { label: 'كلب', cp: '1f436' },
        { label: 'فيل', cp: '1f418' },
        { label: 'قرد', cp: '1f412' },
        { label: 'حمار وحشي', cp: '1f993' }
    ];
    const kids = [
        { label: 'دمية', cp: '1f9f8' },
        { label: 'بالون', cp: '1f388' },
        { label: 'حلوى', cp: '1f36d' },
        { label: 'قلب', cp: '2764' },
        { label: 'نجمة', cp: '1f31f' },
        { label: 'بيت', cp: '1f3e0' },
        { label: 'وردة', cp: '1f33a' },
        { label: 'شجرة', cp: '1f333' }
    ];
    const vehicles = [
        { label: 'سيارة', cp: '1f699' },
        { label: 'دراجة', cp: '1f6b2' },
        { label: 'قطار', cp: '1f686' },
        { label: 'هليكوبتر', cp: '1f681' },
        { label: 'طائرة', cp: '1f6e9' },
        { label: 'قارب', cp: '1f6a2' },
        { label: 'صاروخ', cp: '1f680' }
    ];
    const sports = [
        { label: 'كرة قدم', cp: '26bd' },
        { label: 'كرة سلة', cp: '1f3c0' },
        { label: 'نرد', cp: '1f3b2' },
        { label: 'روبوت', cp: '1f916' }
    ];
    const all = [...animals, ...kids, ...vehicles, ...sports];
    return all.map(a => ({
        label: a.label,
        url: `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${a.cp}.svg`
    }));
}

function setupDrawing() {
    const canvas = document.getElementById('drawing-canvas');
    ctxDrawing = canvas.getContext('2d');
    generateColorPalette('drawing-colors', (color) => {
        currentColor = color;
        currentTool = 'brush';
    });
    setupDrawingCanvasEvents(canvas, ctxDrawing);
    const sizeInput = document.getElementById('draw-size');
    const sizeDisplay = document.getElementById('draw-size-display');
    const sizeVertical = document.getElementById('draw-size-vertical');
    const setSize = (v) => {
        brushSize = parseInt(v, 10) || 6;
        if (sizeDisplay) sizeDisplay.textContent = String(brushSize);
        if (sizeInput && sizeInput.value !== String(brushSize)) sizeInput.value = String(brushSize);
        if (sizeVertical && sizeVertical.value !== String(brushSize)) sizeVertical.value = String(brushSize);
    };
    if (sizeInput) sizeInput.addEventListener('input', () => setSize(sizeInput.value));
    if (sizeVertical) sizeVertical.addEventListener('input', () => setSize(sizeVertical.value));
    setSize(sizeInput ? sizeInput.value : '6');
    const clearBtn = document.getElementById('draw-clear');
    if (clearBtn) clearBtn.addEventListener('click', () => clearCanvas(canvas));
    const brushBtn = document.getElementById('draw-brush');
    const penBtn = document.getElementById('draw-pen');
    const eraserBtn = document.getElementById('draw-eraser');
    if (brushBtn) brushBtn.addEventListener('click', () => { currentTool = 'brush'; setActiveToolBtn(brushBtn); });
    if (penBtn) penBtn.addEventListener('click', () => { currentTool = 'pen'; setActiveToolBtn(penBtn); });
    if (eraserBtn) eraserBtn.addEventListener('click', () => { currentTool = 'eraser'; setActiveToolBtn(eraserBtn); });
    const saveBtn = document.getElementById('draw-save');
    if (saveBtn) saveBtn.addEventListener('click', saveDrawing);
    const finishBtn = document.getElementById('draw-finish');
    if (finishBtn) finishBtn.addEventListener('click', triggerFinishEffect);
    const auto = localStorage.getItem('farha_drawing_autosave');
    if (auto) restoreToCanvas(canvas, auto);
}

function setupCanvasEvents(canvas, ctx) {
    // Mouse & Touch Events
    const start = (e) => {
        if (currentTool === 'eyedropper') {
            pickColor(e, canvas);
            return;
        }
        isDrawing = true;
        if (canvas.id === 'coloring-canvas') pushColoringHistory();
        draw(e, canvas, ctx);
    };
    const move = (e) => {
        if (!isDrawing) return;
        draw(e, canvas, ctx);
        e.preventDefault(); // Prevent scrolling
    };
    const end = () => {
        isDrawing = false;
        ctx.beginPath();
    };

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    canvas.addEventListener('mouseup', end);
    
    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchmove', move, { passive: false });
    canvas.addEventListener('touchend', end);
}

function draw(e, canvas, ctx) {
    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if (e.touches) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
    } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
    }

    ctx.lineWidth = currentTool === 'eraser' ? Math.max(brushSize * 2, 8) : brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = currentTool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = currentColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function resizeCanvas(id) {
    const canvas = document.getElementById(id);
    const parent = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = parent.clientWidth * dpr;
    canvas.height = parent.clientHeight * dpr;
    const ctx = canvas.getContext('2d');
    if (ctx && ctx.setTransform) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function setupDrawingCanvasEvents(canvas, ctx) {
    let pendingStartTime = 0;
    const delayMs = 40;
    const start = (e) => {
        pendingStartTime = Date.now();
        isDrawing = true;
        drawingLastChangeTs = Date.now();
        if (e.touches && e.touches.length) {
            drawingTouches.clear();
            for (let i = 0; i < e.touches.length; i++) {
                const t = e.touches[i];
                const p = getCanvasPoint(canvas, t.clientX, t.clientY);
                drawingTouches.set(t.identifier, p);
            }
        }
    };
    const move = (e) => {
        if (!isDrawing) return;
        const now = Date.now();
        if (now - pendingStartTime < delayMs && !e.touches) return;
        drawingLastChangeTs = now;
        if (e.touches && e.touches.length) {
            for (let i = 0; i < e.touches.length; i++) {
                const t = e.touches[i];
                const p = getCanvasPoint(canvas, t.clientX, t.clientY);
                const last = drawingTouches.get(t.identifier);
                strokeBetween(ctx, last || p, p);
                drawingTouches.set(t.identifier, p);
            }
        } else {
            const p = getCanvasPoint(canvas, e.clientX, e.clientY);
            strokeTo(ctx, p);
        }
        e.preventDefault();
        scheduleAutoSaveDrawing(canvas);
    };
    const end = () => {
        isDrawing = false;
        ctx.beginPath();
        drawingTouches.clear();
    };
    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    canvas.addEventListener('mouseup', end);
    canvas.addEventListener('mouseleave', end);
    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchmove', move, { passive: false });
    canvas.addEventListener('touchend', end);
    canvas.addEventListener('touchcancel', end);
}

function getCanvasPoint(canvas, clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    return { x, y };
}

function strokeTo(ctx, p) {
    const lw = currentTool === 'eraser' ? Math.max(brushSize * 2, 10) : (currentTool === 'pen' ? Math.min(brushSize, 4) : brushSize);
    ctx.lineWidth = lw;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = currentTool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = currentColor;
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
}

function strokeBetween(ctx, a, b) {
    if (!a || !b) return;
    const lw = currentTool === 'eraser' ? Math.max(brushSize * 2, 10) : (currentTool === 'pen' ? Math.min(brushSize, 4) : brushSize);
    ctx.lineWidth = lw;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = currentTool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = currentColor;
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(b.x, b.y);
}

function setActiveToolBtn(btn) {
    document.querySelectorAll('#drawing-section .tool-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

function scheduleAutoSaveDrawing(canvas) {
    if (drawingAutoSaveTimer) clearTimeout(drawingAutoSaveTimer);
    drawingAutoSaveTimer = setTimeout(() => {
        const url = canvas.toDataURL('image/png');
        localStorage.setItem('farha_drawing_autosave', url);
    }, 3000);
}

function saveDrawing() {
    const canvas = document.getElementById('drawing-canvas');
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'farha-drawing.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    playSound('sfx-success');
}

function triggerFinishEffect() {
    const area = document.getElementById('drawing-area');
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.inset = '0';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '20';
    overlay.style.animation = 'popIn 0.3s';
    const star = document.createElement('div');
    star.textContent = '✨';
    star.style.fontSize = '6rem';
    area.appendChild(overlay);
    overlay.appendChild(star);
    setTimeout(() => { overlay.remove(); }, 2000);
    playSound('sfx-success');
}

function restoreToCanvas(canvas, dataUrl) {
    const img = new Image();
    img.onload = () => {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
    };
    img.src = dataUrl;
}
function clearCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    playSound('pop'); 
}

function generateColorPalette(containerId, onClick) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    CONSTANTS.COLORS.forEach(color => {
        const div = document.createElement('div');
        div.className = 'color-swatch';
        div.style.backgroundColor = color;
        div.onclick = () => {
            document.querySelectorAll('.color-swatch').forEach(e => e.classList.remove('active'));
            div.classList.add('active');
            onClick(color);
            playSound('pop');
        };
        container.appendChild(div);
    });
}

function resizeColoring() {
    const overlay = document.getElementById('coloring-canvas');
    const bg = document.getElementById('coloring-bg');
    const parent = overlay.parentElement;
    const dpr = window.devicePixelRatio || 1;
    overlay.width = parent.clientWidth * dpr;
    overlay.height = parent.clientHeight * dpr;
    bg.width = parent.clientWidth * dpr;
    bg.height = parent.clientHeight * dpr;
    if (ctxColoring && ctxColoring.setTransform) ctxColoring.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (ctxColoringBg && ctxColoringBg.setTransform) ctxColoringBg.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (coloringBgImage) drawBgImage();
}

function drawBgImage() {
    if (!coloringBgImage || !ctxColoringBg) return;
    const canvas = document.getElementById('coloring-bg');
    const cw = canvas.width;
    const ch = canvas.height;
    ctxColoringBg.clearRect(0, 0, cw, ch);
    const iw = coloringBgImage.width;
    const ih = coloringBgImage.height;
    const scale = Math.min(cw / iw, ch / ih);
    const tw = iw * scale;
    const th = ih * scale;
    const dx = (cw - tw) / 2;
    const dy = (ch - th) / 2;
    ctxColoringBg.drawImage(coloringBgImage, dx, dy, tw, th);
}

function exportColoringImage() {
    const overlay = document.getElementById('coloring-canvas');
    const bg = document.getElementById('coloring-bg');
    const out = document.createElement('canvas');
    out.width = overlay.width;
    out.height = overlay.height;
    const octx = out.getContext('2d');
    octx.drawImage(bg, 0, 0);
    octx.drawImage(overlay, 0, 0);
    const url = out.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'farha-coloring.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    playSound('sfx-success');
}

function pushColoringHistory() {
    const overlay = document.getElementById('coloring-canvas');
    coloringHistory.push(overlay.toDataURL('image/png'));
    if (coloringHistory.length > 50) coloringHistory.shift();
    coloringRedo = [];
}

function undoColoring() {
    const overlay = document.getElementById('coloring-canvas');
    if (coloringHistory.length === 0) return;
    coloringRedo.push(overlay.toDataURL('image/png'));
    const prev = coloringHistory.pop();
    restoreOverlay(prev);
}

function redoColoring() {
    if (coloringRedo.length === 0) return;
    const overlay = document.getElementById('coloring-canvas');
    coloringHistory.push(overlay.toDataURL('image/png'));
    const next = coloringRedo.pop();
    restoreOverlay(next);
}

function restoreOverlay(dataUrl) {
    const overlay = document.getElementById('coloring-canvas');
    const img = new Image();
    img.onload = () => {
        ctxColoring.clearRect(0, 0, overlay.width, overlay.height);
        ctxColoring.drawImage(img, 0, 0);
    };
    img.src = dataUrl;
}

function pickColor(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    let x, y;
    if (e.touches) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
    } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
    }
    const cx = Math.floor(x * dpr);
    const cy = Math.floor(y * dpr);
    let data = ctxColoring.getImageData(cx, cy, 1, 1).data;
    if (data[3] === 0 && ctxColoringBg) {
        data = ctxColoringBg.getImageData(cx, cy, 1, 1).data;
    }
    const r = data[0], g = data[1], b = data[2], a = data[3];
    if (a > 0) {
        currentColor = `rgb(${r}, ${g}, ${b})`;
        playSound('pop');
    }
}
// --- Letters Logic ---
function setupLetters() {
    const grid = document.getElementById('letters-grid');
    grid.innerHTML = '';
    const letters = getAllLetters();
    letters.forEach(item => {
        const div = document.createElement('div');
        div.className = 'letter-card';
        div.textContent = item.char;
        div.onclick = () => openLetterTrace(item);
        grid.appendChild(div);
    });
    bindTraceControls();
}

function getAllLetters() {
    return [
        { char: 'أ', word: 'أسد' }, { char: 'ب', word: 'بطة' }, { char: 'ت', word: 'تفاحة' }, { char: 'ث', word: 'ثعلب' },
        { char: 'ج', word: 'جمل' }, { char: 'ح', word: 'حصان' }, { char: 'خ', word: 'خروف' }, { char: 'د', word: 'دب' },
        { char: 'ذ', word: 'ذئب' }, { char: 'ر', word: 'رمان' }, { char: 'ز', word: 'زرافة' }, { char: 'س', word: 'سمكة' },
        { char: 'ش', word: 'شمس' }, { char: 'ص', word: 'صقر' }, { char: 'ض', word: 'ضفدع' }, { char: 'ط', word: 'طيارة' },
        { char: 'ظ', word: 'ظرف' }, { char: 'ع', word: 'عنب' }, { char: 'غ', word: 'غزال' }, { char: 'ف', word: 'فراشة' },
        { char: 'ق', word: 'قمر' }, { char: 'ك', word: 'كتاب' }, { char: 'ل', word: 'ليمون' }, { char: 'م', word: 'موز' },
        { char: 'ن', word: 'نجم' }, { char: 'ه', word: 'هدية' }, { char: 'و', word: 'وردة' }, { char: 'ي', word: 'يد' }
    ];
}
function letterExampleUrl(item) {
    const text = encodeURIComponent(item.word);
    return `https://picsum.photos/seed/${encodeURIComponent(item.char + '-' + text)}/300/300`;
}
function openLetterTrace(item) {
    const grid = document.getElementById('letters-grid');
    const panel = document.getElementById('letters-trace');
    const img = document.getElementById('trace-img');
    const big = document.getElementById('trace-letter');
    big.textContent = item.char;
    img.src = letterExampleUrl(item);
    grid.classList.add('hidden');
    panel.classList.remove('hidden');
    speakLetter(item);
    resetTraceCanvas();
}
function resizeTraceCanvasIfVisible() {
    const panel = document.getElementById('letters-trace');
    if (panel && !panel.classList.contains('hidden')) resetTraceCanvas();
}
function bindTraceControls() {
    const back = document.getElementById('trace-back');
    const clearBtn = document.getElementById('trace-clear');
    const speakBtn = document.getElementById('trace-speak');
    if (back) back.onclick = backToLetters;
    if (clearBtn) clearBtn.onclick = () => clearTrace();
    if (speakBtn) speakBtn.onclick = () => {
        const letters = getAllLetters();
        const ch = document.getElementById('trace-letter').textContent;
        const item = letters.find(l => l.char === ch);
        if (item) speakLetter(item);
    };
    setupTraceDrawing();
}
function backToLetters() {
    const grid = document.getElementById('letters-grid');
    const panel = document.getElementById('letters-trace');
    panel.classList.add('hidden');
    grid.classList.remove('hidden');
}
let TRACE_STATE = { drawing: false, lastX: 0, lastY: 0, len: 0 };
function setupTraceDrawing() {
    const c = document.getElementById('trace-canvas');
    const ctx = c.getContext('2d');
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#ff6b6b';
    const start = (e) => {
        TRACE_STATE.drawing = true;
        const p = getCanvasPoint(c, e.clientX ?? (e.touches && e.touches[0].clientX), e.clientY ?? (e.touches && e.touches[0].clientY));
        TRACE_STATE.lastX = p.x; TRACE_STATE.lastY = p.y;
        ctx.beginPath(); ctx.moveTo(p.x, p.y);
        e.preventDefault();
    };
    const move = (e) => {
        if (!TRACE_STATE.drawing) return;
        const p = getCanvasPoint(c, e.clientX ?? (e.touches && e.touches[0].clientX), e.clientY ?? (e.touches && e.touches[0].clientY));
        const dx = p.x - TRACE_STATE.lastX, dy = p.y - TRACE_STATE.lastY;
        TRACE_STATE.len += Math.sqrt(dx*dx + dy*dy);
        ctx.lineTo(p.x, p.y); ctx.stroke();
        TRACE_STATE.lastX = p.x; TRACE_STATE.lastY = p.y;
        e.preventDefault();
    };
    const end = () => {
        TRACE_STATE.drawing = false;
        ctx.beginPath();
        if (TRACE_STATE.len > 400) {
            showTraceSuccess();
            TRACE_STATE.len = 0;
        }
    };
    c.addEventListener('pointerdown', start);
    c.addEventListener('pointermove', move);
    c.addEventListener('pointerup', end);
    c.addEventListener('pointerleave', end);
    c.addEventListener('touchstart', start, { passive: false });
    c.addEventListener('touchmove', move, { passive: false });
    c.addEventListener('touchend', end);
}
function resetTraceCanvas() {
    const c = document.getElementById('trace-canvas');
    const ctx = c.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = c.getBoundingClientRect();
    c.width = Math.max(1, Math.floor(rect.width * dpr));
    c.height = Math.max(1, Math.floor(rect.height * dpr));
    if (ctx && ctx.setTransform) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, c.width, c.height);
    TRACE_STATE.len = 0;
}
function clearTrace() {
    resetTraceCanvas();
    playSound('pop');
}
function showTraceSuccess() {
    const panel = document.getElementById('letters-trace');
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.inset = '0';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '20';
    const star = document.createElement('div');
    star.textContent = '✨';
    star.style.fontSize = '6rem';
    panel.appendChild(overlay);
    overlay.appendChild(star);
    setTimeout(() => { overlay.remove(); }, 1500);
    playSound('sfx-success');
    if (navigator.vibrate) navigator.vibrate(40);
}
function speakLetter(item) {
    speechSynthesis.cancel();
    const text = `${item.char}, مثل ${item.word}`;
    const u = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();
    const arabic = voices.find(v => /ar/i.test(v.lang));
    if (arabic) u.voice = arabic;
    u.lang = arabic ? arabic.lang : 'ar-SA';
    u.rate = 0.9;
    speechSynthesis.speak(u);
}

window.closeLetter = () => {};

function letterEmoji(name) {
    const map = {
        rabbit: '🐰',
        duck: '🦆',
        apple: '🍎',
        fox: '🦊',
        camel: '🐪',
        horse: '🐴',
        sheep: '🐑',
        bear: '🐻',
        wolf: '🐺',
        pomegranate: '🍎',
        giraffe: '🦒',
        fish: '🐟',
        sun: '☀️'
    };
    return map[name] || '⭐';
}

function letterImageDataUrl(item) {
    loadOverrides();
    const ov = adminOverrides.letters && adminOverrides.letters[item.img];
    if (ov) return ov;
    const cp = letterCodepoint(item.img);
    if (!cp) return '';
    return `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${cp}.svg`;
}

function letterCodepoint(name) {
    const map = {
        rabbit: '1f430',
        duck: '1f986',
        apple: '1f34e',
        fox: '1f98a',
        camel: '1f42b',
        horse: '1f434',
        sheep: '1f411',
        bear: '1f43b',
        wolf: '1f43a',
        pomegranate: '1f347',
        giraffe: '1f992',
        fish: '1f41f',
        sun: '2600'
    };
    return map[name] || '';
}

// --- Stories Logic ---
function setupStories() {
    const list = document.getElementById('stories-list');
    list.innerHTML = '';
    loadOverrides();
    CONSTANTS.STORIES.forEach(story => {
        const ov = adminOverrides.stories && adminOverrides.stories[story.id];
        if (ov && ov.deleted) return;
        const card = document.createElement('div');
        card.className = 'story-card';
        card.innerHTML = `
            <div class="story-thumb"></div>
            <div class="story-info">
                <h3>${(ov && ov.title) ? ov.title : story.title}</h3>
                <div>${story.icon}</div>
            </div>
        `;
        const thumb = card.querySelector('.story-thumb');
        const url = (ov && ov.thumbUrl) ? ov.thumbUrl : storyImageUrl(story, 0, 600, 300);
        thumb.style.backgroundImage = `url("${url}")`;
        thumb.style.backgroundSize = 'cover';
        thumb.style.backgroundPosition = 'center';
        card.dataset.storyId = story.id;
        card.onclick = () => openStory(story);
        list.appendChild(card);
    });
}

function openStory(story) {
    window.currentStory = story;
    window.currentSlideIndex = 0;
    const reader = document.getElementById('story-reader');
    renderStorySlide();
    reader.classList.remove('hidden');
    bindStoryControls();
}

window.closeStory = () => {
    document.getElementById('story-reader').classList.add('hidden');
    stopSpeech();
};

function bindStoryControls() {
    const prev = document.getElementById('story-prev');
    const next = document.getElementById('story-next');
    const play = document.getElementById('story-play');
    const replay = document.getElementById('story-replay');
    if (prev) prev.onclick = prevStory;
    if (next) next.onclick = nextStory;
    if (play) play.onclick = speakCurrent;
    if (replay) replay.onclick = speakCurrent;
}

function renderStorySlide() {
    const scene = document.getElementById('story-scene');
    const bubble = document.getElementById('story-bubble');
    const s = window.currentStory;
    const i = window.currentSlideIndex || 0;
    loadOverrides();
    const ov = adminOverrides.stories && adminOverrides.stories[s.id];
    const text = (ov && ov.slides && ov.slides[i] !== undefined) ? ov.slides[i] : s.slides[i];
    const ovImg = ov && ov.slidesImages && ov.slidesImages[i];
    const url = ovImg ? ovImg : storyImageUrl(s, i, 1280, 720);
    scene.style.backgroundImage = `url("${url}")`;
    scene.style.backgroundSize = 'cover';
    scene.style.backgroundPosition = 'center';
    bubble.textContent = text;
    updateStoryDots();
    stopSpeech();
}

function updateStoryDots() {
    const dots = document.getElementById('story-dots');
    dots.innerHTML = '';
    const s = window.currentStory;
    s.slides.forEach((_, idx) => {
        const d = document.createElement('div');
        d.className = 'dot' + (idx === window.currentSlideIndex ? ' active' : '');
        dots.appendChild(d);
    });
}

function nextStory() {
    const s = window.currentStory;
    if (!s) return;
    if (window.currentSlideIndex < s.slides.length - 1) {
        window.currentSlideIndex++;
        renderStorySlide();
    } else {
        showStoryFinish();
    }
}

function prevStory() {
    const s = window.currentStory;
    if (!s) return;
    if (window.currentSlideIndex > 0) {
        window.currentSlideIndex--;
        renderStorySlide();
    }
}

let currentUtterance = null;
function speakCurrent() {
    const s = window.currentStory;
    if (!s) return;
    const text = s.slides[window.currentSlideIndex || 0];
    stopSpeech();
    const u = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();
    const arabic = voices.find(v => /ar/i.test(v.lang));
    if (arabic) u.voice = arabic;
    u.lang = arabic ? arabic.lang : 'ar-SA';
    currentUtterance = u;
    speechSynthesis.speak(u);
}
function stopSpeech() {
    if (speechSynthesis.speaking) speechSynthesis.cancel();
    currentUtterance = null;
}

function showStoryFinish() {
    const fin = document.getElementById('story-finish');
    fin.classList.remove('hidden');
    setTimeout(() => { fin.classList.add('hidden'); }, 2500);
    playSound('sfx-success');
}

function storyImageUrl(story, index, w, h) {
    const seed = encodeURIComponent(`${story.id}-${index}`);
    const width = w || 1280;
    const height = h || 720;
    return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}
// --- Games: Math (Add/Sub/Mul) ---
let GAMES_STATE = { x1: 0, y1: 0, x2: 0, y2: 0, x3: 0, y3: 0 };
let GAMES_LEVEL = 'easy';
let GAMES_STARS = 0;
function setupGames() {
    resetGames();
    const i1 = document.getElementById('ans1');
    const i2 = document.getElementById('ans2');
    const i3 = document.getElementById('ans3');
    if (i1) i1.addEventListener('keydown', (e) => { if (e.key === 'Enter') window.checkAdd(); });
    if (i2) i2.addEventListener('keydown', (e) => { if (e.key === 'Enter') window.checkSub(); });
    if (i3) i3.addEventListener('keydown', (e) => { if (e.key === 'Enter') window.checkMul(); });
    const sel = document.getElementById('games-level');
    if (sel) {
        const saved = localStorage.getItem('farha_games_level');
        if (saved) sel.value = saved;
        GAMES_LEVEL = sel.value || 'easy';
        sel.addEventListener('change', () => {
            GAMES_LEVEL = sel.value || 'easy';
            localStorage.setItem('farha_games_level', GAMES_LEVEL);
            resetGames();
            resetChoiceGame();
            resetNumberPuzzle();
            resetImagePuzzle(true);
            resetMatchGame(true);
        });
    }
    try {
        const sSaved = parseInt(localStorage.getItem('farha_games_stars') || '0', 10);
        if (!isNaN(sSaved)) GAMES_STARS = sSaved;
    } catch(e) {}
    updateStars();
    bindChoiceGame();
    setupSmartGames();
    setupMatchGame();
    window.scrollToGame = (id) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    setupGamesCategories();
    showGamesHome();
    const back = document.getElementById('games-back-home');
    if (back) back.onclick = showGamesHome;
}
function rand() {
    if (GAMES_LEVEL === 'medium') return Math.floor(Math.random() * 11) + 5;
    if (GAMES_LEVEL === 'hard') return Math.floor(Math.random() * 11) + 10;
    return Math.floor(Math.random() * 9) + 1;
}
function resetGames() {
    const x1 = rand(), y1 = rand();
    let x2 = rand(), y2 = rand();
    if (y2 > x2) { const t = x2; x2 = y2; y2 = t; }
    const x3 = rand(), y3 = rand();
    GAMES_STATE = { x1, y1, x2, y2, x3, y3 };
    const a1 = document.getElementById('a1'); const b1 = document.getElementById('b1');
    const a2 = document.getElementById('a2'); const b2 = document.getElementById('b2');
    const a3 = document.getElementById('a3'); const b3 = document.getElementById('b3');
    if (a1) a1.textContent = String(x1); if (b1) b1.textContent = String(y1);
    if (a2) a2.textContent = String(x2); if (b2) b2.textContent = String(y2);
    if (a3) a3.textContent = String(x3); if (b3) b3.textContent = String(y3);
    const ans1 = document.getElementById('ans1'); const ans2 = document.getElementById('ans2'); const ans3 = document.getElementById('ans3');
    const res1 = document.getElementById('res1'); const res2 = document.getElementById('res2'); const res3 = document.getElementById('res3');
    if (ans1) ans1.value = ''; if (ans2) ans2.value = ''; if (ans3) ans3.value = '';
    if (res1) res1.textContent = ''; if (res2) res2.textContent = ''; if (res3) res3.textContent = '';
}
function updateStars() {
    const el = document.getElementById('games-stars');
    if (el) el.textContent = String(GAMES_STARS);
    const total = document.getElementById('stars-total');
    if (total) total.textContent = String(GAMES_STARS);
    localStorage.setItem('farha_games_stars', String(GAMES_STARS));
    maybeShowMilestone();
}
function addStar(n) {
    GAMES_STARS += n || 1;
    updateStars();
}
window.checkAdd = () => {
    const v = Number(document.getElementById('ans1')?.value || '');
    const ok = v === (GAMES_STATE.x1 + GAMES_STATE.y1);
    const res = document.getElementById('res1'); if (!res) return;
    res.textContent = ok ? '🌟 ممتاز!' : '❌ حاول مرة أخرى';
    res.style.color = ok ? 'green' : 'red';
    if (ok) { addStar(1); playSound('sfx-success'); setTimeout(resetGames, 1000); if (navigator.vibrate) navigator.vibrate(40); } else { playSound('error'); if (navigator.vibrate) navigator.vibrate(80); }
};
window.checkSub = () => {
    const v = Number(document.getElementById('ans2')?.value || '');
    const ok = v === (GAMES_STATE.x2 - GAMES_STATE.y2);
    const res = document.getElementById('res2'); if (!res) return;
    res.textContent = ok ? '🌟 أحسنت!' : '❌ حاول مرة أخرى';
    res.style.color = ok ? 'green' : 'red';
    if (ok) { addStar(1); playSound('sfx-success'); setTimeout(resetGames, 1000); if (navigator.vibrate) navigator.vibrate(40); } else { playSound('error'); if (navigator.vibrate) navigator.vibrate(80); }
};
window.checkMul = () => {
    const v = Number(document.getElementById('ans3')?.value || '');
    const ok = v === (GAMES_STATE.x3 * GAMES_STATE.y3);
    const res = document.getElementById('res3'); if (!res) return;
    res.textContent = ok ? '🏆 رائع!' : '❌ حاول مرة أخرى';
    res.style.color = ok ? 'green' : 'red';
    if (ok) { addStar(1); playSound('sfx-success'); setTimeout(resetGames, 1000); if (navigator.vibrate) navigator.vibrate(40); } else { playSound('error'); if (navigator.vibrate) navigator.vibrate(80); }
};
let CHOICE_STATE = { a: 0, b: 0, op: '+', ans: 0, opts: [] };
function bindChoiceGame() {
    const o1 = document.getElementById('opt1');
    const o2 = document.getElementById('opt2');
    const o3 = document.getElementById('opt3');
    [o1, o2, o3].forEach((b) => {
        if (b) b.onclick = () => chooseOption(b);
    });
    resetChoiceGame();
}
function resetChoiceGame() {
    const ops = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a = rand(), b = rand();
    if (op === '-' && b > a) { const t = a; a = b; b = t; }
    const ans = op === '+' ? a + b : (op === '-' ? a - b : a * b);
    const d1 = ans + (Math.random() < 0.5 ? 1 : -1) * (GAMES_LEVEL === 'hard' ? 2 : 1);
    const d2 = ans + (Math.random() < 0.5 ? 2 : -2) * (GAMES_LEVEL === 'hard' ? 3 : 1);
    const set = new Set([ans, d1, d2].map(x => Math.max(0, x)));
    const opts = Array.from(set);
    while (opts.length < 3) opts.push(ans + Math.floor(Math.random() * 3) + 1);
    for (let i = opts.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = opts[i]; opts[i] = opts[j]; opts[j] = t; }
    CHOICE_STATE = { a, b, op, ans, opts };
    const qA = document.getElementById('qA'); const qB = document.getElementById('qB'); const qOp = document.getElementById('qOp');
    if (qA) qA.textContent = String(a);
    if (qB) qB.textContent = String(b);
    if (qOp) qOp.textContent = op;
    const o1 = document.getElementById('opt1'); const o2 = document.getElementById('opt2'); const o3 = document.getElementById('opt3');
    const res = document.getElementById('resChoice');
    [o1, o2, o3].forEach((b, i) => {
        if (!b) return;
        b.textContent = String(opts[i]);
        b.dataset.val = String(opts[i]);
        b.classList.remove('correct', 'wrong');
    });
    if (res) { res.textContent = ''; res.style.color = ''; }
}
function chooseOption(btn) {
    const val = Number(btn.dataset.val || '');
    const ok = val === CHOICE_STATE.ans;
    const res = document.getElementById('resChoice');
    if (ok) {
        btn.classList.add('correct');
        if (res) { res.textContent = '🌟 ممتاز!'; res.style.color = 'green'; }
        addStar(1);
        playSound('sfx-success');
        if (navigator.vibrate) navigator.vibrate(40);
        setTimeout(resetChoiceGame, 1000);
    } else {
        btn.classList.add('wrong');
        if (res) { res.textContent = '❌ حاول مرة أخرى'; res.style.color = 'red'; }
        playSound('error');
        if (navigator.vibrate) navigator.vibrate(80);
    }
}
let PUZZLE_STATE = { size: 3, tiles: [] };
let PUZZLE_TICK = null;
let PUZZLE_T0 = 0;
function setupSmartGames() {
    const ps = document.getElementById('puzzle-size');
    const pr = document.getElementById('puzzle-reset');
    if (ps) {
        ps.addEventListener('change', () => {
            PUZZLE_STATE.size = parseInt(ps.value || '3', 10);
            resetNumberPuzzle();
        });
        PUZZLE_STATE.size = parseInt(ps.value || '3', 10);
    }
    if (pr) pr.addEventListener('click', resetNumberPuzzle);
    resetNumberPuzzle();
    const isel = document.getElementById('imgp-size');
    const inew = document.getElementById('imgp-new');
    if (isel) {
        isel.addEventListener('change', () => resetImagePuzzle(true));
    }
    if (inew) inew.addEventListener('click', () => resetImagePuzzle(true, true));
    resetImagePuzzle(true);
}
function categoriesData() {
    return [
        { id: 'puzzle', title: 'ألغاز ذكية', thumb: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f9e9.svg' },
        { id: 'match', title: 'مطابقة الصور', thumb: `https://picsum.photos/seed/match-${Date.now()}/600/400` },
        { id: 'animals', title: 'حديقة الحيوانات', thumb: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f992.svg' }
    ];
}
function setupGamesCategories() {
    const grid = document.getElementById('games-home-grid');
    if (!grid) return;
    grid.innerHTML = '';
    categoriesData().forEach(cat => {
        const card = document.createElement('div');
        card.className = 'game-card';
        const thumb = document.createElement('div');
        thumb.className = 'thumb';
        thumb.style.backgroundImage = `url("${cat.thumb}")`;
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        const title = document.createElement('div');
        title.className = 'title';
        title.textContent = cat.title;
        card.appendChild(thumb);
        card.appendChild(overlay);
        card.appendChild(title);
        card.onclick = () => showGamesCategory(cat.id);
        grid.appendChild(card);
    });
}
function showGamesHome() {
    const home = document.getElementById('games-home');
    const content = document.getElementById('games-content');
    if (home) home.classList.remove('hidden');
    if (content) content.classList.add('hidden');
}
function showGamesCategory(id) {
    showGamesHome();
}
let MATCH_STATE = { deck: [], flipped: [], matched: 0, cols: 3 };
let MATCH_TICK = null;
let MATCH_T0 = 0;
function setupMatchGame() {
    const btn = document.getElementById('match-reset');
    if (btn) btn.addEventListener('click', () => resetMatchGame(true));
    resetMatchGame(true);
}
function matchPairsByLevel() {
    if (GAMES_LEVEL === 'medium') return 4;
    if (GAMES_LEVEL === 'hard') return 6;
    return 3;
}
function resetMatchGame(init) {
    const grid = document.getElementById('match-grid');
    if (!grid) return;
    const pairs = matchPairsByLevel();
    const list = coloringImageList();
    const picks = [];
    for (let i = 0; i < pairs && i < list.length; i++) picks.push(list[i].url);
    const deck = [];
    picks.forEach(u => { deck.push(u); deck.push(u); });
    for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = deck[i]; deck[i] = deck[j]; deck[j] = t; }
    MATCH_STATE.deck = deck;
    MATCH_STATE.flipped = [];
    MATCH_STATE.matched = 0;
    MATCH_STATE.cols = Math.max(3, Math.ceil(Math.sqrt(deck.length)));
    renderMatchGrid();
    startMatchTimer();
    const msg = document.getElementById('match-msg');
    if (msg) { msg.textContent = ''; msg.style.color = ''; }
}
function renderMatchGrid() {
    const grid = document.getElementById('match-grid');
    if (!grid) return;
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${MATCH_STATE.cols}, 1fr)`;
    MATCH_STATE.deck.forEach((url, idx) => {
        const d = document.createElement('div');
        d.className = 'match-card';
        const face = document.createElement('div');
        face.className = 'face';
        face.style.backgroundImage = `url("${url}")`;
        const cover = document.createElement('div');
        cover.className = 'face cover';
        d.appendChild(face);
        d.appendChild(cover);
        d.dataset.index = String(idx);
        d.addEventListener('click', () => flipMatchCard(d, idx));
        grid.appendChild(d);
    });
}
function flipMatchCard(card, idx) {
    if (card.classList.contains('matched')) return;
    if (MATCH_STATE.flipped.length === 2) return;
    card.classList.add('flipped');
    MATCH_STATE.flipped.push(idx);
    if (MATCH_STATE.flipped.length === 2) {
        setTimeout(checkMatchPair, 450);
    }
}
function checkMatchPair() {
    const [a, b] = MATCH_STATE.flipped;
    const ok = a !== b && MATCH_STATE.deck[a] === MATCH_STATE.deck[b];
    const grid = document.getElementById('match-grid');
    if (!grid) return;
    const cards = grid.querySelectorAll('.match-card');
    if (ok) {
        cards[a].classList.add('matched');
        cards[b].classList.add('matched');
        MATCH_STATE.matched += 1;
        playSound('sfx-success');
        if (navigator.vibrate) navigator.vibrate(40);
    } else {
        cards[a].classList.remove('flipped');
        cards[b].classList.remove('flipped');
        playSound('error');
        if (navigator.vibrate) navigator.vibrate(80);
    }
    MATCH_STATE.flipped = [];
    if (MATCH_STATE.matched * 2 === MATCH_STATE.deck.length) finishMatchGame();
}
function matchTimeLimit() {
    const n = MATCH_STATE.deck.length;
    if (n <= 6) { if (GAMES_LEVEL === 'easy') return 25000; if (GAMES_LEVEL === 'medium') return 20000; return 15000; }
    if (n <= 8) { if (GAMES_LEVEL === 'easy') return 40000; if (GAMES_LEVEL === 'medium') return 30000; return 25000; }
    if (GAMES_LEVEL === 'easy') return 70000;
    if (GAMES_LEVEL === 'medium') return 60000;
    return 50000;
}
function startMatchTimer() {
    const el = document.getElementById('match-time');
    if (!el) return;
    if (MATCH_TICK) { clearInterval(MATCH_TICK); MATCH_TICK = null; }
    MATCH_T0 = Date.now();
    const limit = matchTimeLimit();
    el.textContent = '00:00';
    MATCH_TICK = setInterval(() => {
        const elapsed = Date.now() - MATCH_T0;
        const remain = Math.max(0, limit - elapsed);
        const m = Math.floor(remain / 60000);
        const s = Math.floor((remain % 60000) / 1000);
        el.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        if (remain <= 0) {
            clearInterval(MATCH_TICK);
            MATCH_TICK = null;
            matchTimeExpired();
        }
    }, 250);
}
function stopMatchTimer() {
    const ms = Date.now() - MATCH_T0;
    if (MATCH_TICK) { clearInterval(MATCH_TICK); MATCH_TICK = null; }
    return ms;
}
function matchTimeExpired() {
    const msg = document.getElementById('match-msg');
    if (msg) { msg.textContent = '⏱ انتهى الوقت! حاول مرة أخرى'; msg.style.color = 'red'; }
    playSound('error');
    if (navigator.vibrate) navigator.vibrate(100);
    setTimeout(() => resetMatchGame(false), 900);
}
function finishMatchGame() {
    const msg = document.getElementById('match-msg');
    if (msg) { msg.textContent = '🎉 رائع! كل الأزواج متطابقة'; msg.style.color = 'green'; }
    const elapsed = stopMatchTimer();
    addStar(2);
    playSound('sfx-success');
    if (navigator.vibrate) navigator.vibrate(60);
    const fast = GAMES_LEVEL === 'easy' ? 25000 : (GAMES_LEVEL === 'medium' ? 20000 : 16000);
    if (elapsed <= fast) addStar(1);
}
function maybeShowMilestone() {
    let shown = {};
    try { shown = JSON.parse(localStorage.getItem('farha_milestones') || '{}'); } catch(e) { shown = {}; }
    const v = GAMES_STARS;
    const thresholds = [10, 25, 50];
    for (let i = 0; i < thresholds.length; i++) {
        const th = thresholds[i];
        if (v >= th && !shown[th]) {
            shown[th] = true;
            localStorage.setItem('farha_milestones', JSON.stringify(shown));
            showCongrats(th);
            break;
        }
    }
}
function showCongrats(th) {
    const sec = document.getElementById('games-section');
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.background = 'rgba(0,0,0,0.5)';
    overlay.style.zIndex = '2000';
    const box = document.createElement('div');
    box.style.background = '#ffffff';
    box.style.borderRadius = '20px';
    box.style.padding = '20px';
    box.style.textAlign = 'center';
    box.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
    const emoji = document.createElement('div');
    emoji.textContent = '🎉';
    emoji.style.fontSize = '4rem';
    const text = document.createElement('div');
    text.textContent = `أحسنت! وصلت إلى ${th} نجوم`;
    text.style.fontSize = '1.6rem';
    const btn = document.createElement('button');
    btn.className = 'tool-btn';
    btn.textContent = 'استمر';
    btn.onclick = () => overlay.remove();
    box.appendChild(emoji);
    box.appendChild(text);
    box.appendChild(btn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    playSound('sfx-success');
}
function resetNumberPuzzle() {
    const size = PUZZLE_STATE.size || 3;
    const solved = [];
    for (let i = 1; i < size * size; i++) solved.push(i);
    solved.push(0);
    PUZZLE_STATE.tiles = solved.slice();
    for (let k = 0; k < 200; k++) {
        const e = PUZZLE_STATE.tiles.indexOf(0);
        const r = Math.floor(e / size);
        const c = e % size;
        const moves = [];
        if (c > 0) moves.push(e - 1);
        if (c < size - 1) moves.push(e + 1);
        if (r > 0) moves.push(e - size);
        if (r < size - 1) moves.push(e + size);
        const m = moves[Math.floor(Math.random() * moves.length)];
        const t = PUZZLE_STATE.tiles[e];
        PUZZLE_STATE.tiles[e] = PUZZLE_STATE.tiles[m];
        PUZZLE_STATE.tiles[m] = t;
    }
    renderNumberPuzzle();
    startPuzzleTimer();
}
function renderNumberPuzzle() {
    const size = PUZZLE_STATE.size || 3;
    const grid = document.getElementById('puzzle-grid');
    const msg = document.getElementById('puzzle-msg');
    if (!grid) return;
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    PUZZLE_STATE.tiles.forEach((val, idx) => {
        const d = document.createElement('div');
        d.className = 'puzzle-tile' + (val === 0 ? ' empty' : '');
        d.textContent = val === 0 ? '' : String(val);
        d.dataset.index = String(idx);
        d.onclick = () => moveNumberTile(idx);
        grid.appendChild(d);
    });
    if (msg) { msg.textContent = ''; msg.style.color = ''; }
}
function puzzleTimeLimit(size) {
    if (size === 2) {
        if (GAMES_LEVEL === 'easy') return 25000;
        if (GAMES_LEVEL === 'medium') return 20000;
        return 15000;
    } else {
        if (GAMES_LEVEL === 'easy') return 60000;
        if (GAMES_LEVEL === 'medium') return 50000;
        return 40000;
    }
}
function startPuzzleTimer() {
    const el = document.getElementById('puzzle-time');
    if (!el) return;
    if (PUZZLE_TICK) { clearInterval(PUZZLE_TICK); PUZZLE_TICK = null; }
    PUZZLE_T0 = Date.now();
    const limit = puzzleTimeLimit(PUZZLE_STATE.size || 3);
    el.textContent = '00:00';
    PUZZLE_TICK = setInterval(() => {
        const elapsed = Date.now() - PUZZLE_T0;
        const remain = Math.max(0, limit - elapsed);
        const m = Math.floor(remain / 60000);
        const s = Math.floor((remain % 60000) / 1000);
        el.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        if (remain <= 0) {
            clearInterval(PUZZLE_TICK);
            PUZZLE_TICK = null;
            puzzleTimeExpired();
        }
    }, 250);
}
function stopPuzzleTimer() {
    const ms = Date.now() - PUZZLE_T0;
    if (PUZZLE_TICK) { clearInterval(PUZZLE_TICK); PUZZLE_TICK = null; }
    return ms;
}
function puzzleTimeExpired() {
    const msg = document.getElementById('puzzle-msg');
    if (msg) { msg.textContent = '⏱ انتهى الوقت! حاول مرة أخرى'; msg.style.color = 'red'; }
    playSound('error');
    if (navigator.vibrate) navigator.vibrate(100);
    setTimeout(resetNumberPuzzle, 900);
}
function moveNumberTile(i) {
    const size = PUZZLE_STATE.size || 3;
    const e = PUZZLE_STATE.tiles.indexOf(0);
    const er = Math.floor(e / size), ec = e % size;
    const ir = Math.floor(i / size), ic = i % size;
    const ok = (Math.abs(er - ir) + Math.abs(ec - ic)) === 1;
    if (!ok) return;
    const t = PUZZLE_STATE.tiles[e];
    PUZZLE_STATE.tiles[e] = PUZZLE_STATE.tiles[i];
    PUZZLE_STATE.tiles[i] = t;
    renderNumberPuzzle();
    checkNumberPuzzle();
}
function checkNumberPuzzle() {
    const size = PUZZLE_STATE.size || 3;
    const msg = document.getElementById('puzzle-msg');
    for (let i = 0; i < size * size - 1; i++) {
        if (PUZZLE_STATE.tiles[i] !== i + 1) return;
    }
    if (msg) { msg.textContent = '🎉 رائع! أنت ذكي جدًا'; msg.style.color = 'green'; }
    const elapsed = stopPuzzleTimer();
    addStar(2);
    playSound('sfx-success');
    if (navigator.vibrate) navigator.vibrate(60);
    const fast2 = GAMES_LEVEL === 'easy' ? 15000 : (GAMES_LEVEL === 'medium' ? 12000 : 9000);
    const fast3 = GAMES_LEVEL === 'easy' ? 30000 : (GAMES_LEVEL === 'medium' ? 25000 : 20000);
    const th = size === 2 ? fast2 : fast3;
    if (elapsed <= th) addStar(1);
}
// Admin features removed
function loadOverrides() {
    try {
        adminOverrides = JSON.parse(localStorage.getItem('farha_overrides') || '{}');
    } catch(e) {
        adminOverrides = {};
    }
    adminOverrides.stories = adminOverrides.stories || {};
    adminOverrides.letters = adminOverrides.letters || {};
}
// Admin editing code removed

// --- Games Logic (Placeholder) ---
window.startGame = (type) => {
    alert('قريباً: ' + type); // Placeholder for game startup
};
window.stopGame = () => {
    document.getElementById('game-stage').classList.add('hidden');
};
