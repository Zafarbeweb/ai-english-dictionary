async function searchWord() {
    const input = document.getElementById("wordInput");
    const word = input.value.trim();
    const card = document.getElementById("resultCard");

    if (!word) {
        alert("Please enter an English word.");
        return;
    }

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
        const meaning = result.meanings?.[0];
        const definition = meaning?.definitions?.[0];

        if (!meaning || !definition) {
            throw new Error("No definition found");
        }

        const synonyms =
            definition.synonyms?.length
                ? definition.synonyms
                : meaning.synonyms || [];

        const synonymHTML = synonyms.length
            ? synonyms
                .slice(0, 5)
                .map(word => `<button>${word}</button>`)
                .join("")
            : "<button>No synonyms</button>";

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
                    ${definition.example ||
                    "No example sentence available."}
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
                <h3>Word not found 😕</h3>

                <p>
                    ${error.message ||
                    "Something went wrong. Please try again."}
                </p>
            </div>
        `;
    }
            }
