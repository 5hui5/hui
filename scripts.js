// 检查是否已登录并显示用户名或提供注销链接
function checkLoginStatus() {
    const username = localStorage.getItem('username');
    if (username) {
        document.querySelector('.container').innerHTML = `
        <p>欢迎回来, ${username}！</p>
        <p><a href="modify_password.html">修改密码</a> | <a href="#" id="logoutLink">注销</a></p>
        <p><a href="index.html">返回首页</a></p>
      `;
        document.getElementById('logoutLink')?.addEventListener('click', logout);
    }
}

// 注销函数
function logout(event) {
    event.preventDefault();
    localStorage.removeItem('username');
    window.location.href = 'register_login.html';
}

// 切换注册/登录表单
document.getElementById('toggleLink')?.addEventListener('click', function (event) {
    event.preventDefault();
    const isRegister = document.getElementById('submitButton').innerText === '注册';
    document.getElementById('pageTitle').innerText = isRegister ? '小米 - 用户登录' : '小米 - 用户注册';
    document.getElementById('submitButton').innerText = isRegister ? '登录' : '注册';
    document.getElementById('toggleLink').innerHTML = isRegister ? '没有账号？<a href="#">注册</a>' : '已有账号？<a href="#">登录</a>';
});

// 忘记密码链接点击事件
document.getElementById('forgotPasswordLink')?.addEventListener('click', function (event) {
    event.preventDefault();
    setTimeout(() => window.location.href = 'modify_password.html', 1000); // 实际应用中应引导用户到一个密码重置页面
});

// 注册/登录表单提交事件处理
document.getElementById('userForm')?.addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];

    if (document.getElementById('submitButton').innerText === '注册') {
        // 注册逻辑
        if (users.find(user => user.username === username)) {
            showMessage('该用户名已被注册');
            return;
        }

        users.push({ username, password });
        localStorage.setItem('users', JSON.stringify(users));

        // 设置当前登录状态
        localStorage.setItem('username', username);

        // 显示成功消息并跳转到首页
        showMessage('注册成功！');
        setTimeout(() => window.location.href = 'index.html', 1000);
    } else {
        // 登录逻辑
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            // 设置当前登录状态
            localStorage.setItem('username', username);

            // 显示成功消息并跳转到首页
            showMessage('登录成功！');
            setTimeout(() => window.location.href = 'index.html', 1000);
        } else {
            showMessage('用户名或密码错误');
        }
    }
});

// 修改密码表单提交事件处理
document.getElementById('modifyPasswordForm')?.addEventListener('submit', function (event) {
    event.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const username = localStorage.getItem('username');

    // 查找当前用户
    const userIndex = users.findIndex(u => u.username === username && u.password === currentPassword);

    if (userIndex !== -1) {
        if (newPassword !== confirmPassword) {
            showMessage('新密码与确认密码不匹配');
            return;
        }

        // 更新密码
        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));

        // 显示成功消息并跳转到首页
        showMessage('密码修改成功！');
        setTimeout(() => window.location.href = 'index.html', 1000);
    } else {
        showMessage('当前密码错误');
    }
});

// 显示消息
function showMessage(message) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
}

// 页面加载时检查登录状态
window.onload = checkLoginStatus;