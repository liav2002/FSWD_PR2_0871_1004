function check_password(password, confirm_password){
    if(password != '' && confirm_password !=''){
        if (password == confirm_password){
            return true;
        }
    }
    return false;
}

function check_validity(field){
    if(field.length < 4) {
        return false;
    }
    return true;
}

function check_mail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function register(){
    const username = document.getElementById('username').value;
    const username_check = check_validity(username);
    if (!username_check){
        alert("Username must be at least 5 characters long.");
        return;
    }

    const email = document.getElementById('email').value;
    const email_check = check_validity(email);
    if(!(email_check && check_mail(email))){
        alert("Email address is not valid.");
        return;
    }

    const password = document.getElementById("password").value;
    const  confirm_password = document.getElementById("confirm-password").value;
    const check = check_password(password,confirm_password);
    if (!check) {alert('Passwords do not match');return;}
    console.log('success');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    let user = users.find(u => u.username === username && u.email === email);
    if (user===undefined ){
        let uid = users.length;
        user= {"user_id":uid,"username":username,"email":email,"password":password,"block":"false","admin":"false", "date-last-login":new Date().toISOString()};
        users.push(user);
        localStorage.setItem('users',JSON.stringify(users));
        alert(`${username} registration completed !`);
        window.location.href='../index.html';
    }
    else{
        alert('User already exists! Please login instead of creating a new account.');
    }


}