function incarcaPersoane() {
    console.log("incarcaPersoane called");
    fetch('resurse/persoane.xml')
        .then(response => {
            console.log("Fetch response received");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(str => {
            console.log("XML received and converted to text");
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(str, "application/xml");

            if (xmlDoc.getElementsByTagName("parsererror").length) {
                throw new Error("Error while parsing XML");
            }

            const persoane = xmlDoc.getElementsByTagName("persoana");
            if (persoane.length === 0) {
                throw new Error("No <persoana> elements found");
            }

            let tabel = "<table><tr><th>Nume</th><th>Prenume</th><th>Vârstă</th></tr>";
            for (let i = 0; i < persoane.length; i++) {
                let nume = persoane[i].getElementsByTagName("nume")[0].childNodes[0].nodeValue;
                let prenume = persoane[i].getElementsByTagName("prenume")[0].childNodes[0].nodeValue;
                let varsta = persoane[i].getElementsByTagName("varsta")[0].childNodes[0].nodeValue;
                tabel += `<tr><td>${nume}</td><td>${prenume}</td><td>${varsta}</td></tr>`;
            }
            tabel += "</table>";
            console.log("Table generated");
            document.querySelector('.article-background').innerHTML = tabel;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}