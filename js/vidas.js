class Vidas {
    constructor(vidas) {
        this.vidas = vidas;
        this.loadFromLocalStorage();
    }

    loadFromLocalStorage() {
        const storedVidas = localStorage.getItem('vidas');
        if (storedVidas) {
            this.vidas = parseInt(storedVidas, 10);
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('vidas', this.vidas);
    }

    decrement() {
        this.vidas--;
        this.saveToLocalStorage();
    }

    hasVidas() {
        return this.vidas > 0;
    }

    resetVidas(vidas) {
        this.vidas = vidas;
        this.saveToLocalStorage();
    }
}
