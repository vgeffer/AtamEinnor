module.exports = class LCG {
    constructor(a, c, m, seed){
        this.a = typeof a === "number" ? a : 25214903917;
        this.c = typeof c === "number" ? c : 11;
        this.m = typeof m === "number" ? m : 281474976710656;
        this.seed = typeof seed === "number" ? seed : Date.now();
    }

    set_seed(seed){
        this.seed = seed;
    }

    next(){
        return this.seed = (this.a * this.seed + this.c) % this.m;
    }

    next_double(){
        this.seed = (this.a * this.seed + this.c) % this.m;
        return this.seed / this.m;
    }
}