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
    // #region Binomial
    const binomial_n = document.getElementById("binomial-n");
    const binomial_p = document.getElementById("binomial-p");
    const binomial_x = document.getElementById("binomial-x");

    function updateBinomial() {
        const n = Number(binomial_n.value);
        const p = Number(binomial_p.value);
        const x = Number(binomial_x.value);

        if (isNaN(n) || isNaN(p)) return;

        const mean = Number((n*p).toFixed(4));
        const variance = Number((n*p*(1-p)).toFixed(4));
        const sd = Number((Math.sqrt(variance)).toFixed(4));

        document.getElementById("binomial-mean").textContent = mean;
        document.getElementById("binomial-variance").textContent = variance;
        document.getElementById("binomial-sd").textContent = sd;
    }
    binomial_n.addEventListener("input", updateBinomial);
    binomial_p.addEventListener("input", updateBinomial);
    binomial_x.addEventListener("input", updateBinomial);
    // #endregion

    // #region Poisson
    const poisson_l = document.getElementById("poisson-l");
    const poisson_x = document.getElementById("poisson-x");

    function updatePoisson() {
        const l = Number(poisson_l.value);
        const x = Number(poisson_x.value);

        if (isNaN(l)) return;

        const mean = Number(l.toFixed(4));
        const variance = Number(l.toFixed(4));
        const sd = Number((Math.sqrt(variance)).toFixed(4));

        document.getElementById("poisson-mean").textContent = mean;
        document.getElementById("poisson-variance").textContent = variance;
        document.getElementById("poisson-sd").textContent = sd;
    }
    poisson_l.addEventListener("input", updatePoisson);
    poisson_x.addEventListener("input", updatePoisson);
    // #endregion


});