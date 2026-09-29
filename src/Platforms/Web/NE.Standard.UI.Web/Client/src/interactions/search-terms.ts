// One matching rule for every list the reader narrows by typing — a menu's search and a search field's static options: every typed
// word, in any order, case and accents aside in the page's language, must appear in the words an entry shows.

const Marks = /\p{M}/gu;

/** The typed words, folded as an entry's words are, in the language of the element they were typed into. */
export function searchTerms(query: string, context: Element): string[] {
    return foldWords(query, context).split(/\s+/).filter(term => term.length !== 0);
}

/** An entry's words folded for matching, in the language of the element that shows them. */
export function foldWords(text: string, context: Element): string {
    return fold(text, languageOf(context));
}

/** Whether every term appears somewhere in the folded words. */
export function matchesTerms(words: string, terms: readonly string[]): boolean {
    return terms.every(term => words.includes(term));
}

function languageOf(element: Element): string | undefined {
    return element.closest("[lang]")?.getAttribute("lang") || undefined;
}

/** Lower case in the page's language, accents dropped — `é` finds `e`, `ё` finds `е`. */
function fold(text: string, language: string | undefined): string {
    const bare = text.normalize("NFD").replace(Marks, "");

    try {
        return bare.toLocaleLowerCase(language);
    }
    catch {
        // A language tag the browser does not know: its own lower case is the best left.
        return bare.toLowerCase();
    }
}
