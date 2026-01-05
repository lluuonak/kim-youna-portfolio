const button = document.querySelector('#menu-btn');

button.addEventListener('click', (e) => {
    e.preventDefault();

    if (button.classList.contains('open')) {
        button.classList.remove('open');
        button.classList.add('close');
    } else {
        button.classList.remove('close');
        button.classList.add('open');
    }
});