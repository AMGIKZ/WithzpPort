// ─── STATE MANAGEMENT (Using localStorage for persistence) ───
let state = JSON.parse(localStorage.getItem('portfolio_state')) || {
    profile: {
        greeting: "ยินดีต้อนรับสู่ Portfolio ของ",
        quote: "'เทคโนโลยีไม่ใช่แค่เครื่องมือ แต่คือสะพานเชื่อมต่อโลกให้ดีขึ้น'",
        dream: "มุ่งสู่การพัฒนาเทคโนโลยีที่เป็นประโยชน์ต่อผู้คน",
        photo: ""
    },
    creators: [],
    skills: ['HTML', 'CSS', 'JavaScript', 'Python', 'Blender'],
    categories: ['Competition', 'Award'],
    achievements: [],
    projects: [],
    activities: [],
    contacts: [
        { platform: 'Facebook', handle: 'Witchapol Phonlasut', link: '#', icon: 'FB' },
        { platform: 'Instagram', handle: 'wzp._', link: '#', icon: 'IG' }
    ]
};

const ADMIN_KEY = "ADMIN2024";
let isAdmin = false;

// ─── INITIALIZATION ───
document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    initScrollAnimations();
    renderAll();
    
    // Check if scrolled for navbar style
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
});

// ─── NAVIGATION ───
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${pageId}`).classList.add('active');
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.textContent.toLowerCase() === pageId) {
            item.classList.add('active');
        }
    });
    
    window.scrollTo(0, 0);
}

// ─── SCROLL ANIMATIONS ───
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .activity-item').forEach(el => {
        observer.observe(el);
    });
}

// ─── ADMIN SYSTEM ───
function openAdminModal() {
    document.getElementById('admin-modal-overlay').classList.add('active');
    if (isAdmin) {
        document.getElementById('admin-login-box').style.display = 'none';
        document.getElementById('admin-panel').classList.add('active');
        loadAdminData();
    } else {
        document.getElementById('admin-login-box').style.display = 'block';
        document.getElementById('admin-panel').classList.remove('active');
    }
}

function closeModal() {
    document.getElementById('admin-modal-overlay').classList.remove('active');
}

function closeAdminOverlay(e) {
    if (e.target.id === 'admin-modal-overlay') closeModal();
}

function verifyAdmin() {
    const key = document.getElementById('admin-key-input').value;
    if (key === ADMIN_KEY) {
        isAdmin = true;
        document.getElementById('admin-login-box').style.display = 'none';
        document.getElementById('admin-panel').classList.add('active');
        document.getElementById('admin-badge').classList.add('active');
        document.querySelectorAll('.admin-visible').forEach(el => el.style.display = 'block');
        loadAdminData();
    } else {
        const err = document.getElementById('admin-error');
        err.style.display = 'block';
        setTimeout(() => err.style.display = 'none', 2000);
    }
}

function switchAdminTab(tab) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-pane').forEach(p => p.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(`admin-tab-${tab}`).classList.add('active');
}

// ─── DATA RENDERING ───
function renderAll() {
    renderProfile();
    renderCreators();
    renderSkills();
    renderAchievements();
    renderProjects();
    renderActivities();
    renderContacts();
}

function renderProfile() {
    document.getElementById('hero-greeting-text').textContent = state.profile.greeting;
    document.getElementById('hero-quote-text').textContent = state.profile.quote;
    document.getElementById('hero-dream-text').querySelectorAll('span')[1].textContent = state.profile.dream;
    
    if (state.profile.photo) {
        document.getElementById('profile-photo-img').src = state.profile.photo;
        document.getElementById('profile-photo-img').style.display = 'block';
        document.getElementById('profile-photo-wrap').querySelector('.profile-photo-placeholder').style.display = 'none';
    }
}

function renderCreators() {
    const container = document.getElementById('creators-row');
    if (!container) return;
    container.innerHTML = state.creators.map(c => `
        <div class="creator-card reveal-scale">
            <div class="creator-avatar">
                ${c.photo ? `<img src="${c.photo}" style="display:block">` : `<svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`}
            </div>
            <div class="creator-name">${c.name}</div>
        </div>
    `).join('');
    if (state.creators.length === 0) {
        container.innerHTML = '<p class="empty-state">ยังไม่มีข้อมูล Creator</p>';
    }
}

function renderSkills() {
    const container = document.getElementById('skills-grid');
    if (!container) return;
    container.innerHTML = state.skills.map(s => `<div class="skill-tag">${s}</div>`).join('');
}

function renderAchievements() {
    const grid = document.getElementById('ach-grid');
    if (!grid) return;
    
    // Update categories sidebar
    const sidebar = document.getElementById('cat-sidebar');
    const categoriesHtml = `
        <div class="cat-item active" onclick="filterCat('all')" data-cat="all">
            <div class="cat-name">ทั้งหมด</div>
            <div class="cat-count">${state.achievements.length} รายการ</div>
        </div>
    ` + state.categories.map(cat => {
        const count = state.achievements.filter(a => a.category === cat).length;
        return `
            <div class="cat-item" onclick="filterCat('${cat}')" data-cat="${cat}">
                <div class="cat-name">${cat}</div>
                <div class="cat-count">${count} รายการ</div>
            </div>
        `;
    }).join('');
    sidebar.innerHTML = categoriesHtml + `<div class="cat-add-btn ${isAdmin ? 'admin-visible' : ''}" onclick="openAdminModal()"><span>+</span>เพิ่ม Category</div>`;

    // Stats
    document.getElementById('stat-total').textContent = state.achievements.length;
    document.getElementById('stat-comp').textContent = state.achievements.filter(a => a.category === 'Competition').length;
    document.getElementById('stat-award').textContent = state.achievements.filter(a => a.category === 'Award').length;

    // Grid
    if (state.achievements.length === 0) {
        grid.innerHTML = '<div class="empty-state"><p>ยังไม่มีผลงาน — Admin สามารถเพิ่มได้ ⚙️</p></div>';
        return;
    }

    grid.innerHTML = state.achievements.map((a, i) => `
        <div class="ach-card reveal" onclick="showDetail('ach', ${i})">
            <div class="ach-card-img">
                ${a.img ? `<img src="${a.img}" style="display:block">` : `<div class="ach-card-img-placeholder">🏆</div>`}
                <div class="ach-card-badge badge-${a.award}">${a.award.toUpperCase()}</div>
            </div>
            <div class="ach-card-body">
                <div class="ach-card-title">${a.title}</div>
                <div class="ach-card-host">${a.host}</div>
            </div>
        </div>
    `).join('');
}

function renderProjects() {
    const grid = document.getElementById('project-grid');
    if (!grid) return;
    if (state.projects.length === 0) {
        grid.innerHTML = '<div class="empty-state"><p>ยังไม่มีโปรเจกต์ — Admin สามารถเพิ่มได้ ⚙️</p></div>';
        return;
    }
    grid.innerHTML = state.projects.map((p, i) => `
        <div class="project-card reveal" onclick="showDetail('proj', ${i})">
            <div class="project-card-img">
                ${p.img ? `<img src="${p.img}" style="display:block">` : '💻'}
            </div>
            <div class="project-card-body">
                <div class="project-card-title">${p.title}</div>
                <div class="project-card-desc">${p.shortDesc}</div>
                <div class="project-tags">
                    ${p.tags.map(t => `<span class="project-tag">${t}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

function renderActivities() {
    const timeline = document.getElementById('activity-timeline');
    if (!timeline) return;
    if (state.activities.length === 0) {
        timeline.innerHTML = '<div class="empty-state"><p>ยังไม่มีกิจกรรม — Admin สามารถเพิ่มได้ ⚙️</p></div>';
        return;
    }
    timeline.innerHTML = state.activities.map(a => `
        <div class="activity-item">
            <div class="activity-dot"></div>
            <div class="activity-card">
                <div class="activity-title">${a.title}</div>
                <div class="activity-date">${a.date}</div>
                <div class="activity-desc">${a.desc}</div>
            </div>
        </div>
    `).join('');
}

function renderContacts() {
    const container = document.getElementById('contact-links');
    if (!container) return;
    container.innerHTML = state.contacts.map(c => `
        <a href="${c.link}" class="contact-link" target="_blank">
            <div class="contact-link-icon">${c.icon}</div>
            <div class="contact-link-content">
                <div class="contact-link-label">${c.platform}</div>
                <div class="contact-link-text">${c.handle}</div>
            </div>
        </a>
    `).join('');
}

// ─── ADMIN ACTIONS ───
function loadAdminData() {
    document.getElementById('ap-greeting').value = state.profile.greeting;
    document.getElementById('ap-quote').value = state.profile.quote;
    document.getElementById('ap-dream').value = state.profile.dream;
    document.getElementById('ap-photo').value = state.profile.photo;
    
    // Creators list
    const clist = document.getElementById('creator-list');
    clist.innerHTML = state.creators.map((c, i) => `
        <div class="admin-item">
            <span>${c.name}</span>
            <button class="admin-item-del" onclick="deleteItem('creators', ${i})">ลบ</button>
        </div>
    `).join('');

    // Skills list
    const slist = document.getElementById('skill-list');
    slist.innerHTML = state.skills.map((s, i) => `
        <div class="admin-item">
            <span>${s}</span>
            <button class="admin-item-del" onclick="deleteItem('skills', ${i})">ลบ</button>
        </div>
    `).join('');

    // Category select in Achievement tab
    const catSelect = document.getElementById('na-cat');
    catSelect.innerHTML = state.categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
}

function saveProfile() {
    state.profile.greeting = document.getElementById('ap-greeting').value;
    state.profile.quote = document.getElementById('ap-quote').value;
    state.profile.dream = document.getElementById('ap-dream').value;
    state.profile.photo = document.getElementById('ap-photo').value;
    saveState();
    renderProfile();
    alert('บันทึก Profile เรียบร้อย!');
}

function addCreator() {
    const name = document.getElementById('nc-name').value;
    const photo = document.getElementById('nc-url').value;
    if (!name) return;
    state.creators.push({ name, photo });
    saveState();
    loadAdminData();
    renderCreators();
}

function addSkill() {
    const skill = document.getElementById('new-skill').value;
    if (!skill) return;
    state.skills.push(skill);
    saveState();
    loadAdminData();
    renderSkills();
}

function addAchievement() {
    const title = document.getElementById('na-title').value;
    const work = document.getElementById('na-work').value;
    const category = document.getElementById('na-cat').value;
    const award = document.getElementById('na-award').value;
    const host = document.getElementById('na-host').value;
    const img = document.getElementById('na-img').value;
    const desc = document.getElementById('na-desc').value;
    const imgs2Str = document.getElementById('na-imgs2').value;
    
    if (!title) return;
    
    state.achievements.push({
        title, work, category, award, host, img, desc,
        imgs2: imgs2Str ? imgs2Str.split(',').map(s => s.trim()) : []
    });
    
    saveState();
    renderAchievements();
    alert('เพิ่ม Achievement เรียบร้อย!');
}

function addProject() {
    const title = document.getElementById('np-title').value;
    const img = document.getElementById('np-img').value;
    const shortDesc = document.getElementById('np-short').value;
    const desc = document.getElementById('np-desc').value;
    const tagsStr = document.getElementById('np-tags').value;
    
    if (!title) return;
    
    state.projects.push({
        title, img, shortDesc, desc,
        tags: tagsStr ? tagsStr.split(',').map(s => s.trim()) : []
    });
    
    saveState();
    renderProjects();
    alert('เพิ่ม Project เรียบร้อย!');
}

function addActivity() {
    const title = document.getElementById('nact-title').value;
    const date = document.getElementById('nact-date').value;
    const desc = document.getElementById('nact-desc').value;
    
    if (!title) return;
    
    state.activities.push({ title, date, desc });
    saveState();
    renderActivities();
    alert('เพิ่ม Activity เรียบร้อย!');
}

function deleteItem(key, index) {
    state[key].splice(index, 1);
    saveState();
    loadAdminData();
    renderAll();
}

function saveState() {
    localStorage.setItem('portfolio_state', JSON.stringify(state));
}

// ─── DETAIL POPUPS ───
function showDetail(type, index) {
    const item = type === 'ach' ? state.achievements[index] : state.projects[index];
    const overlay = document.getElementById('detail-overlay');
    
    document.getElementById('dp-title').textContent = item.title;
    document.getElementById('dp-desc').textContent = item.desc || item.shortDesc;
    
    const meta = document.getElementById('dp-meta');
    if (type === 'ach') {
        meta.innerHTML = `
            <span class="detail-meta-tag tag-blue">${item.category}</span>
            <span class="detail-meta-tag tag-cyan">${item.award.toUpperCase()}</span>
            <span style="font-size:0.8rem;color:var(--white-dim)">จัดโดย: ${item.host}</span>
        `;
        document.getElementById('dp-emoji').textContent = '🏆';
    } else {
        meta.innerHTML = item.tags.map(t => `<span class="detail-meta-tag tag-blue">${t}</span>`).join('');
        document.getElementById('dp-emoji').textContent = '💻';
    }
    
    const header = document.getElementById('dp-header');
    const img = document.getElementById('dp-img');
    if (item.img) {
        img.src = item.img;
        img.style.display = 'block';
        document.getElementById('dp-emoji').style.display = 'none';
    } else {
        img.style.display = 'none';
        document.getElementById('dp-emoji').style.display = 'block';
    }
    
    overlay.classList.add('active');
}

function closeDetail() {
    document.getElementById('detail-overlay').classList.remove('active');
}

function closeDetailOverlay(e) {
    if (e.target.id === 'detail-overlay') closeDetail();
}

function filterCat(cat) {
    document.querySelectorAll('.cat-item').forEach(el => {
        el.classList.remove('active');
        if (el.getAttribute('data-cat') === cat) el.classList.add('active');
    });
    
    const cards = document.querySelectorAll('.ach-card');
    cards.forEach((card, i) => {
        const item = state.achievements[i];
        if (cat === 'all' || item.category === cat) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ─── CANVAS BACKGROUND ───
function initCanvas() {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let width, height, particles;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        particles = [];
        for (let i = 0; i < 100; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 2,
                speed: Math.random() * 0.5 + 0.1
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#60a5fa';
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            p.y -= p.speed;
            if (p.y < 0) p.y = height;
        });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
}

function handleContactSend() {
    alert('ส่งข้อความเรียบร้อย! (Demo Only)');
}
