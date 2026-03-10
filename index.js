document.addEventListener("DOMContentLoaded", function () { 
    const dropdown = document.getElementById("distributions")
    const normal_switch = document.getElementById("normal-switch").querySelector("input[type='checkbox']");
    dropdown.addEventListener("change", function () {

        document.querySelectorAll(".content").forEach(div => {
            div.style.display = "none";
            div.querySelectorAll("input").forEach(input => {
                input.value="";
            })
        });

        document.getElementById("warning").textContent = "";
        document.getElementById("normal-switch").style.display = "none";

        const selected = this.value;
        if (selected) {
            document.getElementById(selected).style.display = "block";
        }
        if (selected == "normal") {
            document.getElementById("normal-switch").style.display = "block";
        }
    });

    normal_switch.addEventListener("change", function() {
        if (this.checked) {
            document.querySelector("#normal-z input").value = 0;
            document.getElementById("normal-z").style.display = "block";
            document.querySelector("#normal-mean input").value = 0;
            document.getElementById("normal-mean").style.display = "none";
            document.querySelector("#normal-sd input").value = 0;
            document.getElementById("normal-sd").style.display = "none";
            document.querySelector("#normal-x input").value = 0;
            document.getElementById("normal-x").style.display = "none";
            document.getElementById("normal-probability").textContent = 0;

        } else {
            document.querySelector("#normal-z input").value = 0;
            document.getElementById("normal-z").style.display = "none";
            document.querySelector("#normal-mean input").value = 0;
            document.getElementById("normal-mean").style.display = "block";
            document.querySelector("#normal-sd input").value = 0;
            document.getElementById("normal-sd").style.display = "block";
            document.querySelector("#normal-x input").value = 0;
            document.getElementById("normal-x").style.display = "block";
            document.getElementById("normal-probability").textContent = 0;
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
        document.getElementById("warning").textContent = "n cannot be negative";
        document.getElementById("binomial-mean").textContent = 0;
        document.getElementById("binomial-variance").textContent = 0;
        document.getElementById("binomial-sd").textContent = 0;
        return;
        }

        if (x < 0 || (x > n && n != 0)) {
        document.getElementById("warning").textContent = "x must be between 0 and n";
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

        const mean = (n*p);
        const variance = (n*p*(1-p));
        const sd = (Math.sqrt(variance));
        const aux = binomialProbability(n, p);
        const probability = aux(x);
        const cumulative = discreteCumulative(aux, x);

        document.getElementById("binomial-mean").textContent = mean.toFixed(4);
        document.getElementById("binomial-variance").textContent = variance.toFixed(4);
        document.getElementById("binomial-sd").textContent = sd.toFixed(4);
        document.getElementById("binomial-probability").textContent = probability.toFixed(5);
        document.getElementById("binomial-cumulative").textContent = cumulative.toFixed(5);
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
        document.getElementById("warning").textContent = "λ cannot be negative";
        document.getElementById("binomial-mean").textContent = 0;
        document.getElementById("binomial-variance").textContent = 0;
        document.getElementById("binomial-sd").textContent = 0;
        return;
        }

        if (x < 0) {
        document.getElementById("warning").textContent = "x cannot be negative";
        document.getElementById("binomial-probability").textContent = 0;
        document.getElementById("binomial-cumulative").textContent = 0;
        return;
        }

        if (x > 1000){
            document.getElementById("warning").textContent = "x too large. Please use values below 1000";
            return;
        }

        const mean = l;
        const variance = l;
        const sd = Math.sqrt(variance);
        const aux = poissonProbability(l);
        const probability = aux(x);
        const cumulative = discreteCumulative(aux, x);

        document.getElementById("poisson-mean").textContent = mean.toFixed(4);
        document.getElementById("poisson-variance").textContent = variance.toFixed(4);
        document.getElementById("poisson-sd").textContent = sd.toFixed(4);
        document.getElementById("poisson-probability").textContent = probability.toFixed(5);
        document.getElementById("poisson-cumulative").textContent = cumulative.toFixed(5);

        document.getElementById("warning").textContent = "";
    }
    poisson_l.addEventListener("input", updatePoisson);
    poisson_x.addEventListener("input", updatePoisson);
    // #endregion
    // #region Degenerate
    const degenerate_c = document.getElementById("degenerate-c");
    const degenerate_x = document.getElementById("degenerate-x");

    function updateDegenerate() {
        const c = Number(degenerate_c.value);
        const x = Number(degenerate_x.value);

        if (x < 0) {
        document.getElementById("warning").textContent = "x must be ≥ 0";
        document.getElementById("degenerate-probability").textContent = 0;
        return;
        }

        document.getElementById("warning").textContent = "";

        const mean = c;
        const probability = (c == x) ? 1 : 0;

        document.getElementById("degenerate-mean").textContent = mean;
        document.getElementById("degenerate-probability").textContent = probability;
    }
    degenerate_c.addEventListener("input", updateDegenerate);
    degenerate_x.addEventListener("input", updateDegenerate);
    // #endregion
    // #region Hypergeometric
    function hypergeometricProbability(n, k, sample_n) {
        return function(x) {
            return Number((combination(k, x) * combination((n-k), (sample_n-x))))/Number(combination(n, sample_n));
        }
    }

    const hypergeometric_n = document.getElementById("hypergeometric-n");
    const hypergeometric_k = document.getElementById("hypergeometric-k");
    const hypergeometric_sample_n = document.getElementById("hypergeometric-sample-n");
    const hypergeometric_x = document.getElementById("hypergeometric-x");

    function updateHypergeometric() {
        const n = Number(hypergeometric_n.value);
        const k = Number(hypergeometric_k.value);
        const sample_n = Number(hypergeometric_sample_n.value);
        const x = Number(hypergeometric_x.value);

        if (n <= 1) {
            document.getElementById("warning").textContent = "N must be larger than 1";
            document.getElementById("hypergeometric-mean").textContent = 0;
            document.getElementById("hypergeometric-variance").textContent = 0;
            document.getElementById("hypergeometric-sd").textContent = 0;
            return;
        }

        if (0 > k || k > n) {
            document.getElementById("warning").textContent = "K must be between 0 and N";
            document.getElementById("hypergeometric-mean").textContent = 0;
            document.getElementById("hypergeometric-variance").textContent = 0;
            document.getElementById("hypergeometric-sd").textContent = 0;
            return;
        }

        if (0 > sample_n || sample_n > n) {
            document.getElementById("warning").textContent = "n must be between 0 and N";
            document.getElementById("hypergeometric-mean").textContent = 0;
            document.getElementById("hypergeometric-variance").textContent = 0;
            document.getElementById("hypergeometric-sd").textContent = 0;
            return;
        }

        if (x > k || x < 0 || x > sample_n) {
            document.getElementById("warning").textContent = "x must be between 0 and n, and be smaller than K";
            document.getElementById("hypergeometric-probability").textContent = 0;
            document.getElementById("hypergeometric-cumulative").textContent = 0;
            return;
        }

        if ((sample_n - x) > (n-k)) {
            document.getElementById("warning").textContent = "n-x must be N-K or smaller";
            document.getElementById("hypergeometric-probability").textContent = 0;
            document.getElementById("hypergeometric-cumulative").textContent = 0;
            return;
        }

        document.getElementById("warning").textContent = "";

        const mean = sample_n*(k/n);
        const variance = (sample_n*(k/n))*((n-k)/n)*((n-sample_n)/(n-1));
        const sd = Math.sqrt(variance);
        const aux = hypergeometricProbability(n,k,sample_n);
        const probability = aux(x);
        const cumulative = discreteCumulative(aux, x);

        document.getElementById("hypergeometric-mean").textContent = mean.toFixed(4);
        document.getElementById("hypergeometric-variance").textContent = variance.toFixed(4);
        document.getElementById("hypergeometric-sd").textContent = sd.toFixed(4);
        document.getElementById("hypergeometric-probability").textContent = probability.toFixed(5);
        document.getElementById("hypergeometric-cumulative").textContent = cumulative.toFixed(5);
    }

    hypergeometric_n.addEventListener("input", updateHypergeometric);
    hypergeometric_k.addEventListener("input", updateHypergeometric);
    hypergeometric_sample_n.addEventListener("input", updateHypergeometric);
    hypergeometric_x.addEventListener("input", updateHypergeometric);
    // #endregion
    // #region Binomial negative
    function negativeBinomialProbability(r, p) {
        return function(x) {
            return Number((combination((x+r-1), x)))*((1-p)**x)*(p**r);
        }
    }

    const negative_binomial_r = document.getElementById("negative-binomial-r")
    const negative_binomial_p = document.getElementById("negative-binomial-p")
    const negative_binomial_x = document.getElementById("negative-binomial-x")

    function updateNegativeBinomial() {
        const r = Number(negative_binomial_r.value);
        const p = Number(negative_binomial_p.value);
        const x = Number(negative_binomial_x.value);

        if(p > 1 || p < 0) {
            document.getElementById("warning").textContent = "p must be between 0 and 1";
            document.getElementById("negative-binomial-mean").textContent = 0;
            document.getElementById("negative-binomial-variance").textContent = 0;
            document.getElementById("negative-binomial-sd").textContent = 0;
            document.getElementById("negative-binomial-probability").textContent = 0;
            document.getElementById("negative-binomial-cumulative").textContent = 0;
            return;
        }

        if(r <= 0) {
            document.getElementById("warning").textContent = "r must be greater than 0";
            document.getElementById("negative-binomial-mean").textContent = 0;
            document.getElementById("negative-binomial-variance").textContent = 0;
            document.getElementById("negative-binomial-sd").textContent = 0;
            document.getElementById("negative-binomial-probability").textContent = 0;
            document.getElementById("negative-binomial-cumulative").textContent = 0;
            return;
        }

        if(x < 0) {
            document.getElementById("warning").textContent = "x must be 0 or greater";
            document.getElementById("negative-binomial-mean").textContent = 0;
            document.getElementById("negative-binomial-variance").textContent = 0;
            document.getElementById("negative-binomial-sd").textContent = 0;
            document.getElementById("negative-binomial-probability").textContent = 0;
            document.getElementById("negative-binomial-cumulative").textContent = 0;
            return;
        }

        document.getElementById("warning").textContent = "";

        const mean = r*((1-p)/p);
        const variance = r*((1-p)/p**2);
        const sd = Math.sqrt(variance);
        const aux = negativeBinomialProbability(r, p);
        const probability = aux(x);
        const cumulative = discreteCumulative(aux, x);

        document.getElementById("negative-binomial-mean").textContent = mean.toFixed(4);
        document.getElementById("negative-binomial-variance").textContent = variance.toFixed(4);
        document.getElementById("negative-binomial-sd").textContent = sd.toFixed(4);
        document.getElementById("negative-binomial-probability").textContent = probability.toFixed(5);
        document.getElementById("negative-binomial-cumulative").textContent = cumulative.toFixed(5);
    }

    negative_binomial_r.addEventListener("input", updateNegativeBinomial);
    negative_binomial_p.addEventListener("input", updateNegativeBinomial);
    negative_binomial_x.addEventListener("input", updateNegativeBinomial);
    // #endregion
    // #endregion

    // #region Continuous
    // #region Normal
    function erf(x) {
        const sign = x >= 0 ? 1 : -1;
        x = Math.abs(x);

        const a1 = 0.254829592;
        const a2 = -0.284496736;
        const a3 = 1.421413741;
        const a4 = -1.453152027;
        const a5 = 1.061405429;
        const p = 0.3275911;

        const t = 1 / (1 + p * x);
        const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

        return sign * y;
    }

    function normalProbability(z) {
        return 0.5 * (1 + erf(z / Math.sqrt(2)));
    }

    const normal_mean = document.querySelector("#normal-mean input");
    const normal_sd = document.querySelector("#normal-sd input");
    const normal_x = document.querySelector("#normal-x input");
    const normal_z = document.querySelector("#normal-z input");

    function updateNormal() {
        const mean = Number(normal_mean.value);
        const sd = Number(normal_sd.value);
        const x = Number(normal_x.value);
        let z = Number(normal_z.value);

        if (!(normal_switch.checked)) {
            z = (x - mean)/sd;
        }

        const probability = normalProbability(z);

        document.getElementById("normal-probability").textContent = probability.toFixed(4);

    }
    normal_mean.addEventListener("input", updateNormal);
    normal_sd.addEventListener("input", updateNormal);
    normal_x.addEventListener("input", updateNormal);
    normal_z.addEventListener("input", updateNormal);
    // #endregion
    // #region Exponential
    function exponentialProbability(x, l) {
        return 1 - Math.exp(-l * x);
    }

    const exponential_l = document.getElementById("exponential-l");
    const exponential_x = document.getElementById("exponential-x");

    function updateExponential() {
        const l = Number(exponential_l.value);
        const x = Number(exponential_x.value);

        if (x < 0) {
        document.getElementById("warning").textContent = "x must be ≥ 0";
        document.getElementById("exponential-probability").textContent = 0;
        return;
        }

        if (l < 0) {
        document.getElementById("warning").textContent = "λ must be ≥ 0";
        document.getElementById("exponential-probability").textContent = 0;
        return;
        }

        document.getElementById("warning").textContent = "";

        const probability = exponentialProbability(x, l);

        document.getElementById("exponential-probability").textContent = probability;
    }
    exponential_l.addEventListener("input", updateExponential);
    exponential_x.addEventListener("input", updateExponential);
    // #endregion
    // #endregion

});