async function searchWord() {
    const input = document.getElementById("wordInput");
    const card = document.getElementById("resultCard");

    const word = input.value.trim();

    if (!word) {
        alert("Please enter an English word.");
        return;
    }

    // Loading
    card.innerHTML = `
        <div class="loading">
            <p>🔎 Finding "${word}"...</p>
        </div>
    `;

    try {
        const response = await fetch(
            `/api/dictionary?word=${encodeURIComponent(word)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Word not found");
        }

        const result = data[0];

        if (!result || !result.meanings || !result.meanings.length) {
            throw new Error("No definition found");
        }

        const meaning = result.meanings[0];
        const definition = meaning.definitions[0];

const example =
    meaning.definitions.find(item => item.example)?.example ||
    result.meanings
        .flatMap(m => m.definitions)
        .find(item => item.example)?.example ||
    "No example sentence available.";

        // Synonyms
        const synonyms = [
            ...(definition.synonyms || []),
            ...(meaning.synonyms || [])
        ];

        const uniqueSynonyms = [...new Set(synonyms)].slice(0, 5);

        const synonymHTML = uniqueSynonyms.length
            ? uniqueSynonyms
                .map(synonym => `<button>${synonym}</button>`)
                .join("")
            : "<span>No synonyms available</span>";

        // Result card
        card.innerHTML = `
            <div class="word-top">

                <div>
                    <h2>${result.word}</h2>

                    <p class="word-type">
                        ${meaning.partOfSpeech || "word"}
                        ${result.phonetic
                            ? " • " + result.phonetic
                            : ""}
                    </p>
                </div>

                <button class="favorite">☆</button>

            </div>


            <div class="meaning">

                <span>🇬🇧</span>

                <div>
                    <p class="meaning-title">
                        ${definition.definition}
                    </p>

                    <p class="definition">
                        English definition
                    </p>
                </div>

            </div>


            <div class="example">

                <div class="example-label">
                    EXAMPLE
                </div>

                <p>
                   ${example || "No example sentence available."} 
                </p>

            </div>


            <div class="synonyms">

                <span>Synonyms</span>

                <div>
                    ${synonymHTML}
                </div>

            </div>
        `;

    } catch (error) {

        console.error(error);

        card.innerHTML = `
            <div class="error">

                <h3>
                    Word search failed 😕
                </h3>

                <p>
                    ${error.message ||
                    "The dictionary service could not be reached."}
                </p>

            </div>
        `;
    }
}
