function verificaUtilizator() {
    const utilizatorInput = document.getElementById("utilizator").value;
    const parolaInput = document.getElementById("parola").value;

    fetch('resurse/utilizatori.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(utilizatori => {
            let isValid = false;
            for (let i = 0; i < utilizatori.length; i++) {
                if (utilizatori[i].utilizator === utilizatorInput && utilizatori[i].parola === parolaInput) {
                    isValid = true;
                    break;
                }
            }
            document.getElementById("rezultat").textContent = isValid ? "Utilizator și parolă corecte!" : "Utilizator sau parolă incorecte!";
        })
        .catch(error => {
            console.error('Check user:', error);
        });
}
