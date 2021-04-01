
//Create LCG class
module.exports = class LCG {
    constructor(a, c, m, seed){
        
        //Setup LCG either with custom parameters, or with default ones
        this.a = typeof a === "number" ? a : 12836191;
        this.c = typeof c === "number" ? c : 11;
        this.m = typeof m === "number" ? m : 33554393;
        this.seed = typeof seed === "number" ? seed : Date.now();
    }

    //Function, that allows you to set seed of the LCG
    set_seed(seed){
        this.seed = seed;
    }

    //Function, that returns a random integer
    next(){
        return this.seed = (this.a * this.seed + this.c) % this.m;
    }

    //Function, that returns a random value between 0 and 1
    next_double(){
        this.seed = (this.a * this.seed + this.c) % this.m;
        return this.seed / this.m;
    }
}