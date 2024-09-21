function flipForm() {
    const container = document.querySelector('.login-container');
    container.classList.toggle('flipped');
}

function showProgress(event, lang) {
    event.preventDefault();
    document.querySelector('.login-container').style.display = 'none';
    document.getElementById('progress-container').style.display = 'flex';
    let progressMessage = document.getElementById('progress-message');
    progressMessage.textContent = lang === 'en' ? 'Logging in... Please wait.' : 'Connexion... Veuillez patienter.';
    let progress = document.getElementById('progress');
    let width = 0;
    let interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            // Redirect to the language selection interface
            window.location.href = 'select_language.html';
        } else {
            width++;
            progress.style.width = width + '%';
        }
    }, 50);
}