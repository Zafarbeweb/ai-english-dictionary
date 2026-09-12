export default async function handler(req, res) {
    const word = req.query.word;

    if (!word) {
        return res.status(400).json({
            error: "Please provide a word."
        });
    }

    try {
        const api =
            "https://api.dictionaryapi.dev/api/v2/entries/en/" +
            encodeURIComponent(word);

        const response = await fetch(api);

        if (!response.ok) {
            return res.status(response.status).json({
                error: "Word not found."
            });
        }

        const data = await response.json();

        return res.status(200).json(data);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Dictionary service failed."
        });
    }
}
