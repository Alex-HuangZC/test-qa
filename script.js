// 页面加载动画
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});

// 时钟功能
function updateClock() {
    const now = new Date();
    
    // 获取时间
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    // 计算角度
    const hourAngle = (hours % 12) * 30 + minutes * 0.5;
    const minuteAngle = minutes * 6;
    const secondAngle = seconds * 6;
    
    // 更新指针
    const hourHand = document.getElementById('hourHand');
    const minuteHand = document.getElementById('minuteHand');
    const secondHand = document.getElementById('secondHand');
    
    if (hourHand) {
        hourHand.style.transform = `translateX(-50%) rotate(${hourAngle}deg)`;
    }
    if (minuteHand) {
        minuteHand.style.transform = `translateX(-50%) rotate(${minuteAngle}deg)`;
    }
    if (secondHand) {
        secondHand.style.transform = `translateX(-50%) rotate(${secondAngle}deg)`;
    }
    
    // 更新数字时间
    const timeDisplay = document.getElementById('timeDisplay');
    const dateDisplay = document.getElementById('dateDisplay');
    
    if (timeDisplay) {
        const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        timeDisplay.textContent = timeString;
    }
    
    if (dateDisplay) {
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
        const weekday = weekdays[now.getDay()];
        dateDisplay.textContent = `${year}-${month}-${day} 星期${weekday}`;
    }
}

// 每秒更新时钟
setInterval(updateClock, 1000);
updateClock();

// 留言功能
const messageForm = document.getElementById('messageForm');
const messageList = document.getElementById('messageList');

// 从本地存储加载留言
function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    if (messageList) {
        messageList.innerHTML = '';
        messages.forEach(msg => {
            addMessageToDOM(msg.author, msg.content, msg.time);
        });
    }
}

// 添加留言到DOM
function addMessageToDOM(author, content, time) {
    if (!messageList) return;
    
    const messageItem = document.createElement('div');
    messageItem.className = 'message-item';
    messageItem.innerHTML = `
        <div class="message-header">
            <span class="message-author">${author}</span>
            <span class="message-time">${time}</span>
        </div>
        <p class="message-content">${content}</p>
    `;
    messageList.appendChild(messageItem);
    
    // 滚动到底部
    messageList.scrollTop = messageList.scrollHeight;
}

// 格式化时间
function formatTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// 处理表单提交
if (messageForm) {
    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const authorInput = document.getElementById('messageAuthor');
        const contentInput = document.getElementById('messageContent');
        
        if (!authorInput || !contentInput) return;
        
        const author = authorInput.value.trim();
        const content = contentInput.value.trim();
        
        if (!author || !content) {
            alert('请填写完整信息');
            return;
        }
        
        // 创建留言对象
        const message = {
            author: author,
            content: content,
            time: formatTime(new Date())
        };
        
        // 保存到本地存储
        const messages = JSON.parse(localStorage.getItem('messages') || '[]');
        messages.push(message);
        localStorage.setItem('messages', JSON.stringify(messages));
        
        // 添加到DOM
        addMessageToDOM(message.author, message.content, message.time);
        
        // 清空表单
        messageForm.reset();
    });
}

// 页面加载时加载留言
loadMessages();

// 登录功能
let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const closeModal = document.querySelector('.close-modal');

// 编辑模式状态
let blogEditMode = false;
let noteEditMode = false;

// 更新登录状态
function updateLoginState() {
    if (isLoggedIn) {
        loginBtn.textContent = '已登录';
        loginBtn.classList.add('logged-in');
        // 显示编辑按钮和写博客/写笔记按钮
        const blogEditModeBtn = document.getElementById('blogEditModeBtn');
        const blogAddBtn = document.getElementById('blogAddBtn');
        const noteEditModeBtn = document.getElementById('noteEditModeBtn');
        const noteAddBtn = document.getElementById('noteAddBtn');
        if (blogEditModeBtn) blogEditModeBtn.style.display = 'block';
        if (blogAddBtn) blogAddBtn.style.display = 'block';
        if (noteEditModeBtn) noteEditModeBtn.style.display = 'block';
        if (noteAddBtn) noteAddBtn.style.display = 'block';
    } else {
        loginBtn.textContent = '登录';
        loginBtn.classList.remove('logged-in');
        // 隐藏编辑按钮和写博客/写笔记按钮
        const blogEditModeBtn = document.getElementById('blogEditModeBtn');
        const blogAddBtn = document.getElementById('blogAddBtn');
        const noteEditModeBtn = document.getElementById('noteEditModeBtn');
        const noteAddBtn = document.getElementById('noteAddBtn');
        if (blogEditModeBtn) blogEditModeBtn.style.display = 'none';
        if (blogAddBtn) blogAddBtn.style.display = 'none';
        if (noteEditModeBtn) noteEditModeBtn.style.display = 'none';
        if (noteAddBtn) noteAddBtn.style.display = 'none';
        // 退出编辑模式
        blogEditMode = false;
        noteEditMode = false;
        updateEditMode();
    }
}

// 更新编辑模式显示
function updateEditMode() {
    // 博客删除按钮
    document.querySelectorAll('.blog-delete-btn').forEach(btn => {
        btn.style.display = blogEditMode ? 'flex' : 'none';
    });
    
    // 笔记删除按钮
    document.querySelectorAll('.note-delete-btn').forEach(btn => {
        btn.style.display = noteEditMode ? 'flex' : 'none';
    });
    
    // 更新编辑按钮状态
    const blogEditModeBtn = document.getElementById('blogEditModeBtn');
    const noteEditModeBtn = document.getElementById('noteEditModeBtn');
    if (blogEditModeBtn) {
        blogEditModeBtn.textContent = blogEditMode ? '完成' : '编辑';
        blogEditModeBtn.classList.toggle('active', blogEditMode);
    }
    if (noteEditModeBtn) {
        noteEditModeBtn.textContent = noteEditMode ? '完成' : '编辑';
        noteEditModeBtn.classList.toggle('active', noteEditMode);
    }
}

// 打开登录弹窗
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        if (!isLoggedIn) {
            loginModal.classList.add('show');
        } else {
            // 退出登录
            isLoggedIn = false;
            localStorage.removeItem('isLoggedIn');
            updateLoginState();
        }
    });
}

// 关闭登录弹窗
if (closeModal) {
    closeModal.addEventListener('click', () => {
        loginModal.classList.remove('show');
    });
}

// 点击弹窗外部关闭
loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.classList.remove('show');
    }
});

// 处理登录表单
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        if (username === 'hzc' && password === 'hzc') {
            isLoggedIn = true;
            localStorage.setItem('isLoggedIn', 'true');
            loginModal.classList.remove('show');
            updateLoginState();
            loginForm.reset();
        } else {
            alert('账号或密码错误！');
        }
    });
}

// 初始化登录状态
updateLoginState();
updateEditMode();

// 博客编辑模式切换
const blogEditModeBtn = document.getElementById('blogEditModeBtn');
if (blogEditModeBtn) {
    blogEditModeBtn.addEventListener('click', () => {
        blogEditMode = !blogEditMode;
        updateEditMode();
    });
}

// 笔记编辑模式切换
const noteEditModeBtn = document.getElementById('noteEditModeBtn');
if (noteEditModeBtn) {
    noteEditModeBtn.addEventListener('click', () => {
        noteEditMode = !noteEditMode;
        updateEditMode();
    });
}

// 写博客功能
const blogAddBtn = document.getElementById('blogAddBtn');
if (blogAddBtn) {
    blogAddBtn.addEventListener('click', () => {
        const title = prompt('请输入博客标题：');
        if (!title) return;
        
        const excerpt = prompt('请输入博客摘要：');
        if (!excerpt) return;
        
        const date = new Date().toISOString().split('T')[0];
        const blogList = document.getElementById('blogList');
        const maxId = Math.max(...Array.from(blogList.querySelectorAll('.blog-item')).map(item => parseInt(item.dataset.id) || 0), 0);
        const newId = maxId + 1;
        
        const blogItem = document.createElement('div');
        blogItem.className = 'blog-item';
        blogItem.dataset.id = newId;
        blogItem.innerHTML = `
            <div class="blog-item-content">
                <h4 class="blog-title">${title}</h4>
                <p class="blog-excerpt">${excerpt}</p>
                <span class="blog-date">${date}</span>
            </div>
            <button class="delete-btn blog-delete-btn" style="display: ${blogEditMode ? 'flex' : 'none'};">×</button>
        `;
        
        blogList.insertBefore(blogItem, blogList.firstChild);
        
        // 添加删除功能
        const deleteBtn = blogItem.querySelector('.blog-delete-btn');
        deleteBtn.addEventListener('click', () => {
            if (confirm('确定要删除这篇博客吗？')) {
                blogItem.remove();
            }
        });
    });
}

// 写笔记功能
const noteAddBtn = document.getElementById('noteAddBtn');
if (noteAddBtn) {
    noteAddBtn.addEventListener('click', () => {
        const title = prompt('请输入笔记标题：');
        if (!title) return;
        
        const tag = prompt('请输入标签（如：JavaScript、CSS等）：') || '其他';
        const excerpt = prompt('请输入笔记摘要：');
        if (!excerpt) return;
        
        const date = new Date().toISOString().split('T')[0];
        const notesList = document.getElementById('notesList');
        const maxId = Math.max(...Array.from(notesList.querySelectorAll('.note-item')).map(item => parseInt(item.dataset.id) || 0), 0);
        const newId = maxId + 1;
        
        const noteItem = document.createElement('div');
        noteItem.className = 'note-item';
        noteItem.dataset.id = newId;
        noteItem.innerHTML = `
            <div class="note-item-content">
                <div class="note-header">
                    <h4 class="note-title">${title}</h4>
                    <span class="note-tag">${tag}</span>
                </div>
                <p class="note-excerpt">${excerpt}</p>
                <span class="note-date">${date}</span>
            </div>
            <button class="delete-btn note-delete-btn" style="display: ${noteEditMode ? 'flex' : 'none'};">×</button>
        `;
        
        notesList.insertBefore(noteItem, notesList.firstChild);
        
        // 添加删除功能
        const deleteBtn = noteItem.querySelector('.note-delete-btn');
        deleteBtn.addEventListener('click', () => {
            if (confirm('确定要删除这条笔记吗？')) {
                noteItem.remove();
            }
        });
    });
}

// 删除功能 - 为现有的删除按钮添加事件
document.querySelectorAll('.blog-delete-btn, .note-delete-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (!isLoggedIn) return;
        
        const item = this.closest('.blog-item, .note-item');
        if (item && confirm('确定要删除吗？')) {
            item.remove();
        }
    });
});
