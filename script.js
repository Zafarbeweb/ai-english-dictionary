async function searchWord() {
    const input = document.getElementById("wordInput");
    const word = input.value.trim();

    if (!word) {
        alert("Please enter an English word.");
        return;
    }

    const card = document.getElementById("resultCard");

    card.innerHTML = `
        <div class="loading">
            <p>🔎 Finding "${word}"...</p>
        </div>
    `;

    try {
        const proxy =
            "https://api.allorigins.win/raw?url=";

        const api =
            "https://api.dictionaryapi.dev/api/v2/entries/en/" +
            encodeURIComponent(word);

        const response = await fetch(
            proxy + encodeURIComponent(api)
        );

        if (!response.ok) {
            throw new Error("API error");
        }

        const data = await response.json();

        const result = data[0];
        const meaning = result.meanings[0];
        const definition = meaning.definitions[0];

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
                        ${result.phonetic ? " • " + result.phonetic : ""}
                    </p>
                </div>

                <button class="favorite">☆</button>
            </div>

            <div class="meaning">
                <span>🇬🇧</span>

                <div>
                    <p class="meaning-title">
                        ${definition.definition}
