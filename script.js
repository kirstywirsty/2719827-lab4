async function searchCountry(countryName) {
    const spinner = document.getElementById("loading-spinner");
    const errorDiv = document.getElementById("error-message");
    const countryInfo = document.getElementById("country-info");
    const bordersDiv = document.getElementById("bordering-countries");

    
    errorDiv.classList.add("hidden");
    countryInfo.innerHTML = "";
    bordersDiv.innerHTML = "";
    spinner.classList.remove("hidden");

    try {
        
        //origin country
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if (!response.ok) {
            throw new Error("Country not found");
        }
        const data = await response.json();
        const country = data[0];

        // Update country info
        // countryInfo.innerHTML = `
        //     <h2>${country.name.common}</h2>
        //     <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
        //     <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        //     <p><strong>Region:</strong> ${country.region}</p>
        //     <img src="${country.flags.svg}" alt="${country.name.common} flag" width="150">
        // `;

        let countryCapital = "N/A" ; //if no capital
        if (country.capital && country.capital.length>0){
            countryCapital = country.capital[0];
        }

        let countryPopulation = 0;
        if (country.population){
            countryPopulation = country.population;
        }

        let countryRegion = "Unknown";
        if (country.region){
            countryRegion = country.region;
        }

        countryInfo.innerHTML = 
            "<h2>" + country.name.common + "</h2>" +
            "<p><strong>Capital:</strong> " + countryCapital + "</p>" +
            "<p><strong>Population:</strong> " + countryPopulation.toLocaleString() + "</p>" +
            "<p><strong>Region:</strong> " + countryRegion + "</p>" +
            "<img src='" + country.flags.svg + "' alt='" + country.name.common + " flag' width='150'>";

        // Fetch bordering countries
        // if (country.borders && country.borders.length > 0) {
        //     for (let code of country.borders) {
        //         const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
        //         const borderData = await borderResponse.json();
        //         const borderCountry = borderData[0];

        //         bordersDiv.innerHTML += `
        //             <div class="country-card">
        //                 <p>${borderCountry.name.common}</p>
        //                 <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.common} flag" width="100">
        //             </div>
        //         `;
        //     }
        // } else {
        //     bordersDiv.innerHTML = "<p>No bordering countries.</p>";
        // }

        if (country.borders && country.borders.length > 0){
            for (let i = 0; i <country.borders.lemngth; i++){
                const code = country.borders[i];

                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const borderData = await borderResponse.json();
                const borderCountry = borderData[0];

                bordersDiv.innerHTML +=
                    "<div class='country-card'>" +
                        "<p>" + borderCountry.name.common + "</p>" +
                        "<img src='" + borderCountry.flags.svg + "' alt='" + borderCountry.name.common + " flag' width='100'>" +
                    "</div>";
            }
        }
        else{
            bordersDiv.innerHTML = "<p>No bordering countries.</p>"
        }

    } catch (error) {
        errorDiv.textContent = "⚠ Could not find that country. Please try again.";
        errorDiv.classList.remove("hidden");
    } finally {
        spinner.classList.add("hidden");
    }
}

// Button click
document.getElementById("search-btn").addEventListener("click", () => {
    const country = document.getElementById("country-input").value.trim();
    if (country) searchCountry(country);
});

// Press Enter
document.getElementById("country-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const country = e.target.value.trim();
        if (country) searchCountry(country);
    }
});
