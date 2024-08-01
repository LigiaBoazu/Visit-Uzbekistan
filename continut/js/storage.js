class StorageBase {
    constructor(type) {
      this.type = type;
    }
  
    salveaza(produs) {
      throw new Error("Eroare!!!");
    }
  }
  
  class LocalStorageStore extends StorageBase {
    salveaza(produs) {
      let produse = JSON.parse(localStorage.getItem("produse")) || [];
      produse.push(produs);
      localStorage.setItem("produse", JSON.stringify(produse));
    }
  }
  
  class IndexedDBStore extends StorageBase {
    constructor(callback) {
      super("indexedDB");
      this.request = window.indexedDB.open("produseDB", 1);
      this.request.onerror = (event) => {
        console.error("IndexedDB error:", event.target.errorCode);
        callback();
      };
      this.request.onsuccess = (event) => {
        this.db = event.target.result;
        callback();
      };
      this.request.onupgradeneeded = (event) => {
        const db = event.target.result;
        const objectStore = db.createObjectStore("produse", { keyPath: "id" });
        callback();
      };
    }

  
    salveaza(produs) {
      const transaction = this.db.transaction(["produse"], "readwrite");
      const objectStore = transaction.objectStore("produse");
      objectStore.add(produs);
    }
  }
