/* DARK MODE TOGGLE */
function toggleDark() {
    document.body.classList.toggle("dark");
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        if (document.body.classList.contains("dark")) {
            themeBtn.innerText = "Light Mode";
        } else {
            themeBtn.innerText = "Dark Mode";
        }
    }
}

/* MOBILE MENU TOGGLE */
function toggleMenu() {
    // Only toggle if we are on a mobile screen (menu-btn is visible)
    if (window.innerWidth <= 768) {
        const navLinks = document.querySelector('.nav-links');
        const body = document.body;

        navLinks.classList.toggle('active');

        // Prevent scrolling when menu is open
        if (navLinks.classList.contains('active')) {
            body.style.overflow = "hidden";
        } else {
            body.style.overflow = "auto";
        }
    }
}

/* SCROLL REVEAL ANIMATION */
document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        observer.observe(section);
    });

    // Sub-observer for cinematic staggered card cascading
    const cardObserver = new IntersectionObserver(entries => {
        let delayCount = 0;
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add("visible");
                }, delayCount * 120); // Stagger by 120ms
                delayCount++;
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card').forEach(card => {
        card.classList.add('stagger-item');
        cardObserver.observe(card);
    });

    // Initialize Typing Effect for Main Title
    const typingElement = document.getElementById('typing-text');
    if (typingElement) {
        new TextType(typingElement, ["Freelance Full-Stack Developer."], {
            typingSpeed: 50,
            deletingSpeed: 30,
            pauseDuration: 2000,
            loop: false, // Disabled loop as requested
            hideCursorOnComplete: true // Auto hide cursor when finished
        });
    }

    // Initialize Typing Effect for Section Headings
    const headings = document.querySelectorAll('section h2');

    const headingObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const h2 = entry.target;
                const text = h2.getAttribute('data-text');

                // Clear existing content if any (though we clear it initially)
                h2.textContent = '';

                new TextType(h2, [text], {
                    typingSpeed: 50,
                    deletingSpeed: 30,
                    pauseDuration: 2000,
                    loop: false,
                    initialDelay: 200 // Slight delay after section appears
                });

                observer.unobserve(h2);
            }
        });
    }, { threshold: 0.5 });

    headings.forEach(h2 => {
        // Store original text and clear it immediately so it doesn't flash
        h2.setAttribute('data-text', h2.textContent.trim());
        h2.textContent = '';
        h2.style.minHeight = '1.2em'; // Prevent layout shift
        headingObserver.observe(h2);
    });

    // Initialize Cubes Animation
    const cubesContainer = document.getElementById('cubes-container');
    if (cubesContainer) {
        new CubesAnimation(cubesContainer, {
            gridSize: 8,
            cubeSize: undefined, // undefined means 1fr
            maxAngle: 45,
            radius: 3,
            easing: 'power3.out',
            duration: { enter: 0.3, leave: 0.6 },
            cellGap: { col: '5%', row: '5%' }, // 5% gap
            borderStyle: 'var(--cube-border-color)', // Responsive border color
            faceColor: 'transparent', // Transparent
            shadow: false,
            autoAnimate: true,
            rippleOnClick: true,
            rippleColor: '#ff6b6b', // Ripple color from reference
            rippleSpeed: 1.5
        });
    }
    // Initialize Antigravity Background
    const bgCanvas = document.getElementById('bg-canvas');
    if (bgCanvas) {
        new Antigravity(bgCanvas, {
            count: 1000,
            magnetRadius: 10,
            ringRadius: 10,
            waveSpeed: 0.4,
            waveAmplitude: 1,
            particleSize: 2,
            lerpSpeed: 0.1,
            color: '#5227FF',
            autoAnimate: true,
            particleVariance: 1,
            rotationSpeed: 0,
            depthFactor: 1,
            pulseSpeed: 3,
            particleShape: 'capsule',
            fieldStrength: 10,
            connectParticles: true,
            connectionDistance: 12, // Adjusted distance threshold for strings
            lineColor: '#5227FF'
        });
    }
});

/* TYPING EFFECT CLASS */
class TextType {
    constructor(element, text, options = {}) {
        this.element = element;
        this.textArray = Array.isArray(text) ? text : [text];
        this.options = Object.assign({
            typingSpeed: 50,
            deletingSpeed: 30,
            pauseDuration: 2000,
            loop: true,
            cursorCharacter: '|',
            cursorBlinkDuration: 0.5,
            initialDelay: 0
        }, options);

        this.displayedText = '';
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.timeout = null;

        // Setup DOM structure
        this.contentSpan = document.createElement('span');
        this.contentSpan.className = 'text-type__content';
        this.element.appendChild(this.contentSpan);

        this.cursorSpan = document.createElement('span');
        this.cursorSpan.className = 'text-type__cursor';
        this.cursorSpan.textContent = this.options.cursorCharacter;
        this.element.appendChild(this.cursorSpan);

        // Ensure cursor is visible initially
        this.cursorSpan.style.opacity = '1';

        this.initCursorBlink();

        // Start typing
        if (this.options.initialDelay > 0) {
            setTimeout(() => this.type(), this.options.initialDelay);
        } else {
            this.type();
        }
    }

    initCursorBlink() {
        // Blinking is now handled beautifully by CSS in style.css (.text-type__cursor)
        // No JS overhead required for this anymore.
    }

    type() {
        const currentText = this.textArray[this.currentTextIndex];

        if (this.isDeleting) {
            this.displayedText = currentText.substring(0, this.displayedText.length - 1);
        } else {
            this.displayedText = currentText.substring(0, this.displayedText.length + 1);
        }

        this.contentSpan.textContent = this.displayedText;

        let typeSpeed = this.options.typingSpeed;

        if (this.isDeleting) {
            typeSpeed = this.options.deletingSpeed;
        }

        if (!this.isDeleting && this.displayedText === currentText) {
            // Finished typing sentence
            typeSpeed = this.options.pauseDuration;

            // Check if we should delete or stop
            if (!this.options.loop && this.currentTextIndex === this.textArray.length - 1) {
                // If requested, hide the cursor exactly when the last sentence finishes
                if (this.options.hideCursorOnComplete) {
                    this.cursorSpan.classList.add('text-type__cursor--hidden');
                }
                return; // Stop here
            }

            this.isDeleting = true;

        } else if (this.isDeleting && this.displayedText === '') {
            // Finished deleting
            this.isDeleting = false;
            this.currentTextIndex = (this.currentTextIndex + 1) % this.textArray.length;
            typeSpeed = 500; // Small pause before typing new sentence
        }

        this.timeout = setTimeout(() => this.type(), typeSpeed);
    }
}

/* CUBES ANIMATION CLASS */
class CubesAnimation {
    constructor(container, options = {}) {
        this.container = container;
        this.options = Object.assign({
            gridSize: 10,
            cubeSize: undefined,
            maxAngle: 45,
            radius: 3,
            easing: 'power3.out',
            duration: { enter: 0.3, leave: 0.6 },
            cellGap: { col: 5, row: 5 },
            borderStyle: '1px solid #fff',
            faceColor: '#060010',
            shadow: false,
            autoAnimate: true,
            rippleOnClick: true,
            rippleColor: '#fff',
            rippleSpeed: 2
        }, options);

        this.sceneRef = null;
        this.rafRef = null;
        this.idleTimerRef = null;
        this.userActive = false;
        this.simPos = { x: 0, y: 0 };
        this.simTarget = { x: 0, y: 0 };
        this.simRAF = null;

        this.init();
    }

    init() {
        // Create Structure
        const wrapper = document.createElement('div');
        wrapper.className = 'default-animation';

        // Apply wrapper styles (CSS variables)
        wrapper.style.setProperty('--cube-face-border', this.options.borderStyle);
        wrapper.style.setProperty('--cube-face-bg', this.options.faceColor);
        wrapper.style.setProperty('--cube-face-shadow', this.options.shadow === true ? '0 0 6px rgba(0,0,0,.5)' : (this.options.shadow || 'none'));

        if (this.options.cubeSize) {
            wrapper.style.width = `${this.options.gridSize * this.options.cubeSize}px`;
            wrapper.style.height = `${this.options.gridSize * this.options.cubeSize}px`;
        }

        const scene = document.createElement('div');
        scene.className = 'default-animation--scene';
        this.sceneRef = scene;

        // Apply grid styles
        const cubeSizeStyle = this.options.cubeSize ? `${this.options.cubeSize}px` : '1fr';
        scene.style.gridTemplateColumns = `repeat(${this.options.gridSize}, ${cubeSizeStyle})`;
        scene.style.gridTemplateRows = `repeat(${this.options.gridSize}, ${cubeSizeStyle})`;

        // Handle gap options (number or object)
        const colGap = typeof this.options.cellGap === 'number' ? `${this.options.cellGap}px` : (this.options.cellGap.col !== undefined ? (typeof this.options.cellGap.col === 'number' ? `${this.options.cellGap.col}px` : this.options.cellGap.col) : '5%');
        const rowGap = typeof this.options.cellGap === 'number' ? `${this.options.cellGap}px` : (this.options.cellGap.row !== undefined ? (typeof this.options.cellGap.row === 'number' ? `${this.options.cellGap.row}px` : this.options.cellGap.row) : '5%');

        scene.style.columnGap = colGap;
        scene.style.rowGap = rowGap;

        // Create Cubes
        for (let r = 0; r < this.options.gridSize; r++) {
            for (let c = 0; c < this.options.gridSize; c++) {
                const cube = document.createElement('div');
                cube.className = 'cube';
                cube.dataset.row = r;
                cube.dataset.col = c;

                const faces = ['top', 'bottom', 'left', 'right', 'front', 'back'];
                faces.forEach(face => {
                    const div = document.createElement('div');
                    div.className = `cube-face cube-face--${face}`;
                    cube.appendChild(div);
                });

                scene.appendChild(cube);
            }
        }

        wrapper.appendChild(scene);
        this.container.appendChild(wrapper);

        // Bind Events
        this.bindEvents();

        // Start Auto Animation
        if (this.options.autoAnimate) {
            this.startAutoAnimate();
        }
    }

    bindEvents() {
        const el = this.sceneRef;
        if (!el) return;

        // Use arrow functions or bind to preserve 'this'
        this.onPointerMove = this.onPointerMove.bind(this);
        this.resetAll = this.resetAll.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);

        el.addEventListener('pointermove', this.onPointerMove);
        el.addEventListener('pointerleave', this.resetAll);
        el.addEventListener('click', this.onClick);
        el.addEventListener('touchmove', this.onTouchMove, { passive: false });
        el.addEventListener('touchstart', this.onTouchStart, { passive: true });
        el.addEventListener('touchend', this.onTouchEnd, { passive: true });
    }

    tiltAt(rowCenter, colCenter) {
        if (!this.sceneRef) return;

        const cubes = this.sceneRef.querySelectorAll('.cube');
        cubes.forEach(cube => {
            const r = +cube.dataset.row;
            const c = +cube.dataset.col;
            const dist = Math.hypot(r - rowCenter, c - colCenter);

            if (dist <= this.options.radius) {
                const pct = 1 - dist / this.options.radius;
                const angle = pct * this.options.maxAngle;

                // Use GSAP directly
                gsap.to(cube, {
                    duration: this.options.duration.enter,
                    ease: this.options.easing,
                    overwrite: true,
                    rotateX: -angle,
                    rotateY: angle
                });
            } else {
                gsap.to(cube, {
                    duration: this.options.duration.leave,
                    ease: 'power3.out',
                    overwrite: true,
                    rotateX: 0,
                    rotateY: 0
                });
            }
        });
    }

    onPointerMove(e) {
        this.userActive = true;
        if (this.idleTimerRef) clearTimeout(this.idleTimerRef);

        const rect = this.sceneRef.getBoundingClientRect();
        // Avoid division by zero
        const cellW = (rect.width / this.options.gridSize) || 1;
        const cellH = (rect.height / this.options.gridSize) || 1;

        const colCenter = (e.clientX - rect.left) / cellW;
        const rowCenter = (e.clientY - rect.top) / cellH;

        if (this.rafRef) cancelAnimationFrame(this.rafRef);
        this.rafRef = requestAnimationFrame(() => this.tiltAt(rowCenter, colCenter));

        this.idleTimerRef = setTimeout(() => {
            this.userActive = false;
        }, 3000);
    }

    resetAll() {
        if (!this.sceneRef) return;
        const cubes = this.sceneRef.querySelectorAll('.cube');
        cubes.forEach(cube =>
            gsap.to(cube, {
                duration: this.options.duration.leave,
                rotateX: 0,
                rotateY: 0,
                ease: 'power3.out'
            })
        );
    }

    onTouchMove(e) {
        e.preventDefault();
        this.userActive = true;
        if (this.idleTimerRef) clearTimeout(this.idleTimerRef);

        const rect = this.sceneRef.getBoundingClientRect();
        const cellW = rect.width / this.options.gridSize;
        const cellH = rect.height / this.options.gridSize;

        const touch = e.touches[0];
        const colCenter = (touch.clientX - rect.left) / cellW;
        const rowCenter = (touch.clientY - rect.top) / cellH;

        if (this.rafRef) cancelAnimationFrame(this.rafRef);
        this.rafRef = requestAnimationFrame(() => this.tiltAt(rowCenter, colCenter));

        this.idleTimerRef = setTimeout(() => {
            this.userActive = false;
        }, 3000);
    }

    onTouchStart() {
        this.userActive = true;
    }

    onTouchEnd() {
        this.resetAll();
    }

    onClick(e) {
        if (!this.options.rippleOnClick || !this.sceneRef) return;

        const rect = this.sceneRef.getBoundingClientRect();
        const cellW = rect.width / this.options.gridSize;
        const cellH = rect.height / this.options.gridSize;

        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);

        const colHit = Math.floor((clientX - rect.left) / cellW);
        const rowHit = Math.floor((clientY - rect.top) / cellH);

        const baseRingDelay = 0.15;
        const baseAnimDur = 0.3;
        const baseHold = 0.6;

        const spreadDelay = baseRingDelay / this.options.rippleSpeed;
        const animDuration = baseAnimDur / this.options.rippleSpeed;
        const holdTime = baseHold / this.options.rippleSpeed;

        const rings = {};
        const cubes = this.sceneRef.querySelectorAll('.cube');

        cubes.forEach(cube => {
            const r = +cube.dataset.row;
            const c = +cube.dataset.col;
            const dist = Math.hypot(r - rowHit, c - colHit);
            const ring = Math.round(dist);
            if (!rings[ring]) rings[ring] = [];
            rings[ring].push(cube);
        });

        Object.keys(rings)
            .map(Number)
            .sort((a, b) => a - b)
            .forEach(ring => {
                const delay = ring * spreadDelay;
                const faces = rings[ring].flatMap(cube => Array.from(cube.querySelectorAll('.cube-face')));

                gsap.to(faces, {
                    backgroundColor: this.options.rippleColor,
                    duration: animDuration,
                    delay: delay,
                    ease: 'power3.out'
                });
                gsap.to(faces, {
                    backgroundColor: this.options.faceColor,
                    duration: animDuration,
                    delay: delay + animDuration + holdTime,
                    ease: 'power3.out'
                });
            });
    }

    startAutoAnimate() {
        this.simPos = {
            x: Math.random() * this.options.gridSize,
            y: Math.random() * this.options.gridSize
        };
        this.simTarget = {
            x: Math.random() * this.options.gridSize,
            y: Math.random() * this.options.gridSize
        };

        const speed = 0.02;

        const loop = () => {
            if (!this.userActive) {
                const pos = this.simPos;
                const tgt = this.simTarget;

                pos.x += (tgt.x - pos.x) * speed;
                pos.y += (tgt.y - pos.y) * speed;

                this.tiltAt(pos.y, pos.x);

                if (Math.hypot(pos.x - tgt.x, pos.y - tgt.y) < 0.1) {
                    this.simTarget = {
                        x: Math.random() * this.options.gridSize,
                        y: Math.random() * this.options.gridSize
                    };
                }
            }
            this.simRAF = requestAnimationFrame(loop);
        };

        this.simRAF = requestAnimationFrame(loop);
    }
}

/* ANTIGRAVITY CLASS (Three.js) */
class Antigravity {
    constructor(container, options = {}) {
        this.container = container;
        this.options = Object.assign({
            count: 300,
            magnetRadius: 10,
            ringRadius: 10,
            waveSpeed: 0.4,
            waveAmplitude: 1,
            particleSize: 2,
            lerpSpeed: 0.1,
            color: '#FF9FFC',
            autoAnimate: false,
            particleVariance: 1,
            rotationSpeed: 0,
            depthFactor: 1,
            pulseSpeed: 3,
            particleShape: 'capsule',
            fieldStrength: 10,
            connectParticles: false,
            connectionDistance: 15,
            lineColor: '#FF9FFC'
        }, options);

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.mesh = null;
        this.dummy = new THREE.Object3D();
        this.particles = [];

        this.viewport = { width: 0, height: 0 };
        this.mouse = { x: 0, y: 0 };
        this.lastMousePos = { x: 0, y: 0 };
        this.lastMouseMoveTime = 0;
        this.virtualMouse = { x: 0, y: 0 };

        this.clock = new THREE.Clock();
        this.rafId = null;

        this.init();
    }

    init() {
        // Initialize Scene
        this.scene = new THREE.Scene();

        // Initialize Camera
        this.viewport.width = window.innerWidth;
        this.viewport.height = window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(35, this.viewport.width / this.viewport.height, 0.1, 1000);
        this.camera.position.z = 50;

        // Initialize Renderer
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(this.viewport.width, this.viewport.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // Initialize Particles & Mesh
        this.initParticles();
        this.initMesh();

        // Initialize Lines (Physics Strings)
        if (this.options.connectParticles) {
            this.initLines();
        }

        // Bind Events
        window.addEventListener('resize', this.onResize.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));

        // Start Animation
        this.animate();
    }

    initParticles() {
        const count = this.options.count;
        const width = 100; // Arbitrary units for spawn area
        const height = 100;

        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const xFactor = -50 + Math.random() * 100;
            const yFactor = -50 + Math.random() * 100;
            const zFactor = -50 + Math.random() * 100;

            const x = (Math.random() - 0.5) * width;
            const y = (Math.random() - 0.5) * height;
            const z = (Math.random() - 0.5) * 20;

            const randomRadiusOffset = (Math.random() - 0.5) * 2;

            this.particles.push({
                t,
                factor,
                speed,
                xFactor,
                yFactor,
                zFactor,
                mx: x,
                my: y,
                mz: z,
                cx: x,
                cy: y,
                cz: z,
                vx: 0,
                vy: 0,
                vz: 0,
                randomRadiusOffset
            });
        }
    }

    initLines() {
        this.lineMaterial = new THREE.LineBasicMaterial({
            color: this.options.lineColor,
            transparent: true,
            opacity: 0.25,
            blending: THREE.AdditiveBlending
        });

        this.lineGeometry = new THREE.BufferGeometry();
        this.maxLines = 4000;
        this.positions = new Float32Array(this.maxLines * 6);
        this.lineGeometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        this.lineGeometry.setDrawRange(0, 0);

        this.lineMesh = new THREE.LineSegments(this.lineGeometry, this.lineMaterial);
        this.scene.add(this.lineMesh);
    }

    initMesh() {
        let geometry;
        switch (this.options.particleShape) {
            case 'sphere':
                geometry = new THREE.SphereGeometry(0.2, 16, 16);
                break;
            case 'box':
                geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
                break;
            case 'tetrahedron':
                geometry = new THREE.TetrahedronGeometry(0.3);
                break;
            case 'capsule':
            default:
                geometry = new THREE.CapsuleGeometry(0.1, 0.4, 4, 8);
                break;
        }

        const material = new THREE.MeshBasicMaterial({ color: this.options.color });
        this.mesh = new THREE.InstancedMesh(geometry, material, this.options.count);
        this.scene.add(this.mesh);
    }

    onResize() {
        this.viewport.width = window.innerWidth;
        this.viewport.height = window.innerHeight;
        this.camera.aspect = this.viewport.width / this.viewport.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.viewport.width, this.viewport.height);
    }

    onMouseMove(event) {
        // Normalize mouse coordinates to -1 to 1
        const x = (event.clientX / window.innerWidth) * 2 - 1;
        const y = -(event.clientY / window.innerHeight) * 2 + 1;

        const mouseDist = Math.hypot(x - this.lastMousePos.x, y - this.lastMousePos.y);

        if (mouseDist > 0.001) {
            this.lastMouseMoveTime = Date.now();
            this.lastMousePos = { x, y };
        }

        this.mouse = { x, y };
    }

    animate() {
        this.rafId = requestAnimationFrame(this.animate.bind(this));

        const time = this.clock.getElapsedTime();
        const { viewport } = this;

        // Calculate Viewport Dimensions in 3D Units at z=0 (approx)
        // For PerspectiveCamera: height = 2 * Math.tan(vFOV / 2) * distance
        const vFOV = THREE.MathUtils.degToRad(this.camera.fov);
        const height = 2 * Math.tan(vFOV / 2) * this.camera.position.z;
        const width = height * this.camera.aspect;

        const vWidth = width;
        const vHeight = height;

        let destX = (this.mouse.x * vWidth) / 2;
        let destY = (this.mouse.y * vHeight) / 2;

        if (this.options.autoAnimate && Date.now() - this.lastMouseMoveTime > 2000) {
            destX = Math.sin(time * 0.5) * (vWidth / 4);
            destY = Math.cos(time * 0.5 * 2) * (vHeight / 4);
        }

        const smoothFactor = 0.05;
        this.virtualMouse.x += (destX - this.virtualMouse.x) * smoothFactor;
        this.virtualMouse.y += (destY - this.virtualMouse.y) * smoothFactor;

        const targetX = this.virtualMouse.x;
        const targetY = this.virtualMouse.y;

        const globalRotation = time * this.options.rotationSpeed;

        this.particles.forEach((particle, i) => {
            let { t, speed, mx, my, mz, cz, randomRadiusOffset } = particle;

            particle.t += speed / 2;
            t = particle.t;

            const projectionFactor = 1 - cz / 50;
            const projectedTargetX = targetX * projectionFactor;
            const projectedTargetY = targetY * projectionFactor;

            const dx = mx - projectedTargetX;
            const dy = my - projectedTargetY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            let targetPos = { x: mx, y: my, z: mz * this.options.depthFactor };

            if (dist < this.options.magnetRadius) {
                const angle = Math.atan2(dy, dx) + globalRotation;

                const wave = Math.sin(t * this.options.waveSpeed + angle) * (0.5 * this.options.waveAmplitude);
                const deviation = randomRadiusOffset * (5 / (this.options.fieldStrength + 0.1));

                const currentRingRadius = this.options.ringRadius + wave + deviation;

                targetPos.x = projectedTargetX + currentRingRadius * Math.cos(angle);
                targetPos.y = projectedTargetY + currentRingRadius * Math.sin(angle);
                targetPos.z = mz * this.options.depthFactor + Math.sin(t) * (1 * this.options.waveAmplitude * this.options.depthFactor);
            }

            particle.cx += (targetPos.x - particle.cx) * this.options.lerpSpeed;
            particle.cy += (targetPos.y - particle.cy) * this.options.lerpSpeed;
            particle.cz += (targetPos.z - particle.cz) * this.options.lerpSpeed;

            this.dummy.position.set(particle.cx, particle.cy, particle.cz);
            this.dummy.lookAt(projectedTargetX, projectedTargetY, particle.cz);
            this.dummy.rotateX(Math.PI / 2);

            const currentDistToMouse = Math.sqrt(
                Math.pow(particle.cx - projectedTargetX, 2) + Math.pow(particle.cy - projectedTargetY, 2)
            );

            const distFromRing = Math.abs(currentDistToMouse - this.options.ringRadius);
            let scaleFactor = 1 - distFromRing / 10;
            scaleFactor = Math.max(0, Math.min(1, scaleFactor));

            const finalScale = scaleFactor * (0.8 + Math.sin(t * this.options.pulseSpeed) * 0.2 * this.options.particleVariance) * this.options.particleSize;

            this.dummy.scale.set(finalScale, finalScale, finalScale);
            this.dummy.updateMatrix();

            this.mesh.setMatrixAt(i, this.dummy.matrix);
        });

        this.mesh.instanceMatrix.needsUpdate = true;

        // Compute Physics Strings
        if (this.options.connectParticles && this.lineGeometry) {
            let lineCount = 0;
            const p = this.particles;
            const len = p.length;
            const maxDistSq = this.options.connectionDistance * this.options.connectionDistance;
            const posArray = this.lineGeometry.attributes.position.array;

            for (let i = 0; i < len; i++) {
                for (let j = i + 1; j < len; j++) {
                    const dx = p[i].cx - p[j].cx;
                    const dy = p[i].cy - p[j].cy;
                    const dz = p[i].cz - p[j].cz;
                    if (dx * dx + dy * dy + dz * dz < maxDistSq) {
                        const idx = lineCount * 6;
                        posArray[idx] = p[i].cx;
                        posArray[idx + 1] = p[i].cy;
                        posArray[idx + 2] = p[i].cz;
                        posArray[idx + 3] = p[j].cx;
                        posArray[idx + 4] = p[j].cy;
                        posArray[idx + 5] = p[j].cz;
                        lineCount++;
                        if (lineCount >= this.maxLines) break;
                    }
                }
                if (lineCount >= this.maxLines) break;
            }
            this.lineGeometry.setDrawRange(0, lineCount * 2);
            this.lineGeometry.attributes.position.needsUpdate = true;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// --- Custom Scroll Progress Bar ---
const scrollProgress = document.getElementById('scroll-progress');
if (scrollProgress) {
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
    });
}

// --- Magnetic Button Hover Effects ---
const magneticElements = document.querySelectorAll('.nav-links a, .toggle-btn');
magneticElements.forEach(elem => {
    elem.addEventListener('mousemove', (e) => {
        const rect = elem.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        elem.style.transition = 'none';

        // Intensity of the magnetic pull
        const pull = 0.3;
        elem.style.transform = `translate(${x * pull}px, ${y * pull}px)`;
    });

    elem.addEventListener('mouseleave', () => {
        // Restore smooth transition
        elem.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s ease';
        elem.style.transform = `translate(0px, 0px)`;
    });
});

// --- Tech Stack Project Filter ---
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.projects-grid .card');

if (filterBtns && projectCards) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden-project');
                } else {
                    card.classList.add('hidden-project');
                }
            });
        });
    });
}

// --- Web Audio API UI Sounds ---
class UIAudioController {
    constructor() {
        this.ctx = null;
    }
    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }
    playTick() {
        if (!this.ctx || this.ctx.state !== 'running') return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        // Quick high-tech beep sweep
        osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime); // Soft volume
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }
    // Removed playWoosh as requested
}

const uiAudio = new UIAudioController();

// Browsers require a gesture to unlock audio
window.addEventListener('click', () => uiAudio.init(), { once: true });
window.addEventListener('scroll', () => uiAudio.init(), { once: true });

// --- Scroll Spy Nav ---
const scrollDots = document.querySelectorAll('.scroll-dot');
const spySections = document.querySelectorAll('.hero, section');

let previousSection = '';

window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.scrollY;

    spySections.forEach(section => {
        // Adjust threshold so sections trigger earlier when scrolling down
        const sectionTop = section.offsetTop - (window.innerHeight / 3);
        const sectionHeight = section.clientHeight;

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id') || 'home';
        }
    });

    // Special case for hitting the absolute bottom of the page
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
        current = 'contact';
    }

    // Only play sound and update DOM if the actual target changed
    if (current && current !== previousSection) {
        uiAudio.playTick();
        previousSection = current;
    }

    scrollDots.forEach(dot => {
        dot.classList.remove('active');
        if (dot.getAttribute('data-target') === current) {
            dot.classList.add('active');
        }
    });
});

// --- Spotify Panel Toggle ---
function toggleSpotifyPanel() {
    const panel = document.getElementById('spotify-panel');
    if (panel) {
        panel.classList.toggle('active');
    }
}
