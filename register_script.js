function check_password(password, confirm_password){
    if(password != '' && confirm_password !=''){
        if (password == confirm_password){
            return true;
        }
    }
    return false;
}

function check_validity(field){
    if(field.length < 5) {
        return false;
    }
    return true;
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
    if(!email_check){
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
        user= {"username":username,"email":email,"password":password};
        users.push(user);
        localStorage.setItem('users',JSON.stringify(users));
        alert(`${username} registration completed !`);
        //window.location.href='./login.html';
    }
    else{
        alert('User already exists! Please login instead of creating a new account.');
    }


}