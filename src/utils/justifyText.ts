const LINE_LENGTH = 80;

/**
 * Justifie un texte brut pour que chaque ligne fasse exactement LINE_LENGTH caractères,
 * en répartissant les espaces entre les mots (sauf la dernière ligne qui reste alignée à gauche).
 *
 * @param text - Le texte brut à justifier (type string).
 * @returns Le texte justifié avec des lignes de LINE_LENGTH caractères.
 *
*/

export const justifyText = (text: string): string => {
    const words = text.split(/\s+/).filter(Boolean); // Sépare le texte en mots, en supprimant les espaces multiples.
    if (words.length === 0) return "";

    const lines: string[] = [];
    let currentLine: string[] = [];
    let currentLength = 0;


    // Parcourt tous les mots pour remplir les lignes jusqu’à (80 caractères).
    for (const word of words) {

        if (currentLength + word.length + currentLine.length > LINE_LENGTH) {
            // Si on dépasse, on justifie la ligne actuelle et on en démarre une nouvelle.
            lines.push(justifyLine(currentLine, currentLength));
            currentLine = [];
            currentLength = 0;
        }

        // Ajoute le mot courant à la ligne et met à jour la longueur.
        currentLine.push(word);
        currentLength += word.length;
    }

    // Dernière ligne (non justifiée)
    if (currentLine.length > 0) {
        lines.push(currentLine.join(" "));
    }

    // Retourne toutes les lignes séparées par des retours à la ligne.
    return lines.join("\n");
};

/**
 * Justifie une ligne en répartissant les espaces pour atteindre la longueur définie (80 caractères).
 *
 * @param words - Les mots de la ligne à justifier.
 * @param length - La somme des longueurs des mots sans les espaces.
 * @returns La ligne justifiée à 80 caractères.
 *
 * @example
 * justifyLine(["Lorem", "ipsum", "dolor"], 15);
 * // → "Lorem     ipsum     dolor" (espaces répartis uniformément)
 */
const justifyLine = (words: string[], length: number): string => {
    if (words.length === 1) return words[0]; // une seule word → pas de justification

    // Calcul du nombre total d'espaces à insérer.
    const totalSpaces = LINE_LENGTH - length;
    const gaps = words.length - 1;

    // Nombre d'espaces minimum entre chaque mot.
    const evenSpace = Math.floor(totalSpaces / gaps);

    // Espaces restants à distribuer (un par un) sur les premières positions.
    let extraSpace = totalSpaces % gaps;

    // Construit la ligne justifiée en répartissant les espaces.
    return words.reduce((line, word, i) => {
        if (i === words.length - 1) return line + word; // Pas d’espace après le dernier mot.

        // Calcule le nombre d'espaces à insérer pour ce gap.
        const spaces = evenSpace + (extraSpace-- > 0 ? 1 : 0);
        return line + word + " ".repeat(spaces);
    }, "");
};