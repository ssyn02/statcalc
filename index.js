document.addEventListener("DOMContentLoaded", function () { 
    const dropdown = document.getElementById("distributions")

    dropdown.addEventListener("change", function () {

        document.querySelectorAll(".content").forEach(div => {
            div.style.display = "none";
            div.querySelectorAll("input").forEach(input => {
                input.value="";
            })
        });

        const selected = this.value;
        if (selected) {
            document.getElementById(selected).style.display = "block";
        }
    });

    // #region Discrete
    function combination(n, x) {
        if (x < 0 || x > n) return 0n;

        x = Math.min(x, n - x);

        let result = 1n;

        for (let i = 0; i < x; i++) {
            result = result * BigInt(n - i) / BigInt(i + 1);
        }

        return result;
    }

    function discreteCumulative(pmf, x) {
        let sum = 0;
        for (let i = 0; i <= x; i++){
            sum += pmf(i);
        }
        return sum;
    }

    
    // #region Binomial
    function binomialProbability (n, p) {
        return function(x) {
            return Number(combination(n,x))*(p**x)*((1-p)**(n-x));
        }
    }

    const binomial_n = document.getElementById("binomial-n");
    const binomial_p = document.getElementById("binomial-p");
    const binomial_x = document.getElementById("binomial-x");

    function updateBinomial() {
        const n = Number(binomial_n.value);
        const p = Number(binomial_p.value);
        const x = Number(binomial_x.value);

        if (isNaN(n) || isNaN(p)) return;

        if (n < 0) {
        document.getElementById("warning").textContent = "n must be ≥ 0";
        document.getElementById("binomial-mean").textContent = 0;
        document.getElementById("binomial-variance").textContent = 0;
        document.getElementById("binomial-sd").textContent = 0;
        return;
        }

        if (x < 0 || (x > n && n != 0)) {
        document.getElementById("warning").textContent = "x must be ≥ 0 and ≤ n";
        document.getElementById("binomial-probability").textContent = 0;
        document.getElementById("binomial-cumulative").textContent = 0;
        return;
        }

        if (p < 0 || p > 1) {
        document.getElementById("warning").textContent = "p must be between 0 and 1";
        document.getElementById("binomial-mean").textContent = 0;
        document.getElementById("binomial-variance").textContent = 0;
        document.getElementById("binomial-sd").textContent = 0;
        return;
        }
        
        document.getElementById("warning").textContent = "";

        const mean = Number((n*p).toFixed(4));
        const variance = Number((n*p*(1-p)).toFixed(4));
        const sd = Number((Math.sqrt(variance)).toFixed(4));
        const aux = binomialProbability(n, p);
        const probability = Number(aux(x)).toFixed(5);
        const cumulative = Number(discreteCumulative(aux, x)).toFixed(5);

        document.getElementById("binomial-mean").textContent = mean;
        document.getElementById("binomial-variance").textContent = variance;
        document.getElementById("binomial-sd").textContent = sd;
        document.getElementById("binomial-probability").textContent = probability;
        document.getElementById("binomial-cumulative").textContent = cumulative;
    }
    binomial_n.addEventListener("input", updateBinomial);
    binomial_p.addEventListener("input", updateBinomial);
    binomial_x.addEventListener("input", updateBinomial);
    // #endregion

    // #region Poisson
    function poissonProbability(l) {
        return function(x){
            let result = Math.exp(-l);
            for (let i = 1; i <= x; i++) {
                result *= l / i;
            }
            return result;
        }
    }

    const poisson_l = document.getElementById("poisson-l");
    const poisson_x = document.getElementById("poisson-x");

    function updatePoisson() {
        const l = Number(poisson_l.value);
        const x = Number(poisson_x.value);

        if (l < 0) {
        document.getElementById("warning").textContent = "λ must be ≥ 0";
        document.getElementById("binomial-mean").textContent = 0;
        document.getElementById("binomial-variance").textContent = 0;
        document.getElementById("binomial-sd").textContent = 0;
        return;
        }

        if (x < 0) {
        document.getElementById("warning").textContent = "x must be ≥ 0";
        document.getElementById("binomial-probability").textContent = 0;
        document.getElementById("binomial-cumulative").textContent = 0;
        return;
        }

        if (x > 1000){
            document.getElementById("warning").textContent = "x too large. Please use values below 1000";
            return;
        }

        const mean = Number(l.toFixed(4));
        const variance = Number(l.toFixed(4));
        const sd = Number((Math.sqrt(variance)).toFixed(4));
        const aux = poissonProbability(l);
        const probability = Number(aux(x)).toFixed(5);
        const cumulative = Number(discreteCumulative(aux, x)).toFixed(5);

        document.getElementById("poisson-mean").textContent = mean;
        document.getElementById("poisson-variance").textContent = variance;
        document.getElementById("poisson-sd").textContent = sd;
        document.getElementById("poisson-probability").textContent = probability;
        document.getElementById("poisson-cumulative").textContent = cumulative;

        document.getElementById("warning").textContent = "";
    }
    poisson_l.addEventListener("input", updatePoisson);
    poisson_x.addEventListener("input", updatePoisson);
    // #endregion
    // #endregion 

});