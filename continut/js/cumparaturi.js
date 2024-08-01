const worker = new Worker('js/worker.js');
worker.addEventListener('message', function(event) {
  console.log('Main script received message:', event.data);
});

let produsCount = 1;
let storageMethod;

function isStorageLoaded() {
  return typeof LocalStorageStore !== 'undefined' && typeof IndexedDBStore !== 'undefined';
}

function adaugaProdus() {
  if (!isStorageLoaded()) {
    console.log('Storage classes are not loaded yet. Waiting...');
    setTimeout(adaugaProdus, 100); 
    return;
  }
  const numeProdusSelect = document.getElementById("numeProdus");
  const numeProdus = numeProdusSelect.options[numeProdusSelect.selectedIndex].text;
  const cantitate = document.getElementById("cantitate").value;
  const stocareSelect = document.getElementById("stocare");
  const stocareMetoda = stocareSelect.options[stocareSelect.selectedIndex].value;

  if (numeProdus && cantitate) {
    const listaProduse = document.getElementById("lista-produse").getElementsByTagName("tbody")[0];
    const row = document.createElement("tr");
    const id = Date.now();
    const produs = { id, numeProdus, cantitate };

    const nrCell = document.createElement("td");
    nrCell.textContent = produsCount;
    row.appendChild(nrCell);

    const numeProdusCell = document.createElement("td");
    numeProdusCell.textContent = numeProdus;
    row.appendChild(numeProdusCell);

    const cantitateCell = document.createElement("td");
    cantitateCell.textContent = cantitate;
    row.appendChild(cantitateCell);

    listaProduse.appendChild(row);
    produsCount++;

    if (!storageMethod || storageMethod.type !== stocareMetoda) {
      storageMethod = stocareMetoda === "localStorage" ? new LocalStorageStore() : new IndexedDBStore();
    }
    storageMethod.salveaza(produs);

    worker.postMessage('Button pressed');

    document.getElementById("numeProdus").selectedIndex = 0;
    document.getElementById("cantitate").value = "";
  } else {
    alert("Vă rugăm să completați atât numele produsului, cât și cantitatea.");
  }
}