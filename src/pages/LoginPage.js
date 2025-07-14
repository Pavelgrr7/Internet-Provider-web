// script.js

document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.querySelector('.input-group input[type="password"]');
    const togglePasswordButton = document.querySelector('.toggle-password');
    const loginButton = document.getElementById('normal_user');
    const adminLoginButton = document.getElementById('admin_user');

    // Переключение видимости пароля
    togglePasswordButton.addEventListener("click", () => {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePasswordButton.textContent = "🙈"; // Иконка "глаз закрыт"
            console.log("Пароль раскрыт");
        } else {
            passwordInput.type = "password";
            togglePasswordButton.textContent = "👁"; // Иконка "глаз открыт"
            console.log("Пароль скрыт");
        }
    });

    // Переход на другую страницу
    loginButton.addEventListener("click", (event) => {
        console.log('Отправляю данные');
        event.preventDefault(); // Отменяем стандартное поведение формы
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        let success = false;
        postCredenitals(username, password);
    });

    if (adminLoginButton) {
        adminLoginButton.addEventListener("click", (event) => {
            console.log('Отправляю данные');
            event.preventDefault(); // Отменяем стандартное поведение формы
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            postCredenitals(username, password);
        });
    }
});

async function postCredenitals(username, password) {
    // let json = JSON.stringify({ "name":"Стандарт",
    //     "declaredSpeed":100,
    //     "installationFee":1000,
    //     "ipAddressType":"Статический",
    //     "startDate":"2019-03-27"})
    let json = JSON.stringify({"login":username.toString(), "passwordHash":password.toString()});
    console.log("Отправляю JSON:    " + json);
    let url = "http://127.0.0.1:8080/api/auth/login";
    // let url = "http://127.0.0.1:8080/api/tariffs";

    const response = await fetch(url, {
        method:"POST",
        headers: {
            'Content-Type': 'application/json',
        },
        // body: JSON.stringify({ "username":username, "password":password, "isGuest":isGuest }),
        body: json,

    });
    const data = await response.json();
    console.log(data)
    // const success = data["success"];
    // if (success == true) {
    //     // Сбрасываем гостевой режим при обычном входе
    //     localStorage.removeItem('isGuestMode');
    //     if (isGuest == true) {
    //         location.href = "service_mode.html";
    //     } else {
    //         location.href = "main.html";
    //     }
    // } else {
    //     if (isGuest == true) {
    //         console.log("Неверное имя пользователя или пароль. Возможно у вас нет прав администратора.");
    //         alert("Неверное имя пользователя или пароль. Возможно у вас нет прав администратора.");
    //     } else {
    //         console.log("Неверное имя пользователя или пароль");
    //         alert("Неверное имя пользователя или пароль");
    //     }
    // }
}