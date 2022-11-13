import { setupRows } from "./rows.js";
export { autocomplete }

function autocomplete(inp, game) {

    let addRow = setupRows(game);

    let players = game.players;

    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    let currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        let a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) {
            return false;
        }
        currentFocus = -2;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        let lista;
        let valor;
        let matches;
        let parts;
        let result;

        /*for each item in the array...*/
        for (i = 0; i < players.length; i++) {
            lista = players[i].name.substr(0, players[i].name.length).toUpperCase();
            valor = val.toUpperCase()
            matches = match(lista, valor);
            parts = parse(lista, matches)
            result = parts.map(
                part => (part.highlight ? part.text : `<b>${part.text}</b>`)
            )
            /*check if the item starts with the same letters as the text field value:*/
            if (result.length > 1) {

                b = document.createElement("DIV");
                b.classList.add('flex', 'items-start', 'gap-x-3', 'leading-tight', 'uppercase', 'text-sm');
                b.innerHTML = `<img src="https://cdn.sportmonks.com/images/soccer/teams/${players[i].teamId % 32}/${players[i].teamId}.png"  width="28" height="28">`;

                /*make the matching letters bold:*/
                b.innerHTML += `<div class='self-center'>
                                    <span class='font-bold'>${players[i].name.toUpperCase()}</span>
                                    <input type='hidden' name='name' value='${players[i].name}'>
                                    <input type='hidden' name='id' value='${players[i].id}'>
                                </div>`;

                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;

                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                    let playerID = players.filter(player => player.name == inp.value)[0].id;
                    addRow(playerID)
                });
                a.appendChild(b);
            }
        }
    });

    inp.addEventListener("keydown", function (e) {
        let x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus += 2;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus -= 2;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });

    // players.find ( p => { return p.id == 47323 })

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active", "bg-slate-200", "pointer");
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active", "bg-slate-200", "pointer");
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        let x = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}





//MATCH

//const removeDiacritics = require('remove-accents').remove;

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_special_characters
const specialCharsRegex = /[.*+?^${}()|[\]\\]/g;

// http://www.ecma-international.org/ecma-262/5.1/#sec-15.10.2.6
const wordCharacterRegex = /[a-z0-9_]/i;

const whitespacesRegex = /\s+/;

function escapeRegexCharacters(str) {
    return str.replace(specialCharsRegex, '\\$&');
}

function extend(subject, baseObject) {
    subject = subject || {};
    Object.keys(subject).forEach((key) => {
        baseObject[key] = !!subject[key];
    });
    return baseObject;
}

function match(text, query, options) {
    options = extend(options, {
        insideWords: false,
        findAllOccurrences: false,
        requireMatchAll: false
    });

    const cleanedTextArray = Array.from(text).map((x) => x.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
    let cleanedText = cleanedTextArray.join('');

    query = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    return (
        query
            .trim()
            .split(whitespacesRegex)
            // If query is blank, we'll get empty string here, so let's filter it out.
            .filter((word) => word.length > 0)
            .reduce((result, word) => {
                const wordLen = word.length;
                const prefix =
                    !options.insideWords && wordCharacterRegex.test(word[0]) ? '\\b' : '';
                const regex = new RegExp(prefix + escapeRegexCharacters(word), 'i');
                let occurrence;
                let index;

                occurrence = regex.exec(cleanedText);
                if (options.requireMatchAll && occurrence === null) {
                    cleanedText = '';
                    return [];
                }

                while (occurrence) {
                    index = occurrence.index;

                    const cleanedLength = cleanedTextArray
                        .slice(index, index + wordLen)
                        .join('').length;
                    const offset = wordLen - cleanedLength;

                    const initialOffset =
                        index - cleanedTextArray.slice(0, index).join('').length;

                    const indexes = [
                        index + initialOffset,
                        index + wordLen + initialOffset + offset
                    ];

                    if (indexes[0] !== indexes[1]) {
                        result.push(indexes);
                    }

                    // Replace what we just found with spaces so we don't find it again.
                    cleanedText =
                        cleanedText.slice(0, index) +
                        new Array(wordLen + 1).join(' ') +
                        cleanedText.slice(index + wordLen);

                    if (!options.findAllOccurrences) {
                        break;
                    }

                    occurrence = regex.exec(cleanedText);
                }

                return result;
            }, [])
            .sort((match1, match2) => match1[0] - match2[0])
    );
};

//PARSE

function parse(text, matches) {
    const result = [];

    if (matches.length === 0) {
        result.push({
            text,
            highlight: false
        });
    } else if (matches[0][0] > 0) {
        result.push({
            text: text.slice(0, matches[0][0]),
            highlight: false
        });
    }

    matches.forEach((match, i) => {
        const startIndex = match[0];
        const endIndex = match[1];

        result.push({
            text: text.slice(startIndex, endIndex),
            highlight: true
        });

        if (i === matches.length - 1) {
            if (endIndex < text.length) {
                result.push({
                    text: text.slice(endIndex, text.length),
                    highlight: false
                });
            }
        } else if (endIndex < matches[i + 1][0]) {
            result.push({
                text: text.slice(endIndex, matches[i + 1][0]),
                highlight: false
            });
        }
    });

    return result;
};
