const emailInput = document.getElementById('emailInput');
const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');
const confirmPasswordInput = document.getElementById('confirmPassInput');
const submitButton = document.getElementById('submit-button');
const switchBtn = document.getElementById('switchBtn');
const formTitle = document.getElementById('formTitle');
const authForm = document.querySelector('.authForm').firstElementChild;
const submit = document.getElementById('confirmBtn');
const form = document.getElementById('authForm');

let mode = 'login';

switchBtn.addEventListener('click', () => {
    if (mode === 'login') {
        mode = 'register';
        //Form states modification
        form.action = '/register';

        //Animations
        gsap.to(formTitle, { duration: 0.5, text: 'Register' });
        gsap.to(authForm, { duration: 0.5, height: "35rem", ease:"back",});
        gsap.to(emailInput, { duration: 0.5, opacity: 1, height: "2.5rem" });
        gsap.to(confirmPasswordInput, { duration: 0.5, opacity: 1, height: "2.5rem"});
        gsap.to(submit, { duration: 0.5, text: 'Sign up' });



    } else {
        mode = 'login';
        //Form states modification
        form.action = '/login';

        //Animations
        gsap.to(formTitle, { duration: 0.5, text: 'Login' });
        gsap.to(emailInput, { duration: 0.5, opacity: 0 });
        gsap.to(confirmPasswordInput, { duration: 0.5, opacity: 0,});
        gsap.to(emailInput, { duration: 0.5, height: 0 });
        gsap.to(confirmPasswordInput, { duration: 0.5, height: 0 });
        gsap.to(authForm, { delay:0.1, duration: 0.5, height: "30rem" })
        gsap.to(submit, { duration: 0.5, text: 'Sign in' });

    }
});

const error = document.getElementById('error');
if (error) {
    error.style.opacity = 0;
    gsap.to(error, { delay:0.4, duration: 0.25, opacity: 1 });
    gsap.to(error, { delay:3, duration: 1, opacity: 0 });
    authForm.style.opacity = 1;
    gsap.to(authForm.parentElement, {duration: 0.05, x: 10, yoyo: true, repeat: 3 });
}else{
    gsap.fromTo(authForm.parentElement, {y: 50, opacity: 0 }, {duration: 1, y: 0, opacity: 1 }); 
}
