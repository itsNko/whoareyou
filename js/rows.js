// YOUR CODE HERE :  
// .... stringToHTML ....
// .... setupRows .....
import {stringToHTML} from './fragments.js'
import {fetchJSON} from './loaders.js'
import {getSolution, differenceInDays} from './main.js'
export {setupRows}

const delay = 350;
const attribs = ['nationality', 'leagueId', 'teamId', 'position', 'birthdate']
let players = await fetch('../json/fullplayers.json').then(res => res.json())
let solutionArray = await fetch('../json/solution.json').then(res => res.json())

let setupRows = function (game) {

    let leagueToFlagJSON = [
        {
            "league" : "564",
            "flag" : "es1"
        },
        {
            "league" : "8",
            "flag" : "en1"
        },
        {
            "league" : "82",
            "flag" : "de1"
        },
        {
            "league" : "384",
            "flag" : "it1"
        },
        {
            "league" : "301",
            "flag" : "fr1"
        }
    ]

    function leagueToFlag(leagueId){
        return leagueToFlagJSON.filter(league => league.league == leagueId)[0].flag
    }

    function getAge(dateString) {
        var birthDate = new Date(dateString);
        var today = new Date();
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    let check = function (theKey, theValue) {
        let result = 'incorrect'
        let solution = getSolution(players, solutionArray, differenceInDays(new Date('08/18/2022')))
        if(theKey == 'birthdate')
            if(getAge(solution.birthdate) > getAge(theValue))
                result = 'higher'
            else if(getAge(solution.birthdate) < getAge(theValue))
                result = 'lower'
            else
                result = 'correct'
        else
        if(solution[theKey] == theValue)
            result = 'correct'
        return result
    }

    function setContent(guess) {
        return [
            `<img src="https://playfootball.games/who-are-ya/media/nations/${guess.nationality.toLowerCase()}.svg" alt="" style="width: 60%;">`,
            `<img src="https://playfootball.games/media/competitions/${leagueToFlag(guess.leagueId)}.png" alt="" style="width: 60%;">`,
            `<img src="https://cdn.sportmonks.com/images/soccer/teams/${guess.teamId % 32}/${guess.teamId}.png" alt="" style="width: 60%;">`,
            `${guess.position}`,
            `${getAge(guess.birthdate)}` /* YOUR CODE HERE */
        ]
    }

    function showContent(content, guess) {
        let fragments = '', s = '';
        for (let j = 0; j < content.length; j++) {
            s = "".concat(((j + 1) * delay).toString(), "ms")
            fragments += `<div class="w-1/5 shrink-0 flex justify-center ">
                            <div class="mx-1 overflow-hidden w-full max-w-2 shadowed font-bold text-xl flex aspect-square rounded-full justify-center items-center bg-slate-400 text-white ${check(attribs[j], guess[attribs[j]]) == 'correct' ? 'bg-green-500' : ''} opacity-0 fadeInDown" style="max-width: 60px; animation-delay: ${s};">
                                ${content[j]}
                            </div>
                         </div>`
        }

        let child = `<div class="flex w-full flex-wrap text-l py-2">
                        <div class=" w-full grow text-center pb-2">
                            <div class="mx-1 overflow-hidden h-full flex items-center justify-center sm:text-right px-4 uppercase font-bold text-lg opacity-0 fadeInDown " style="animation-delay: 0ms;">
                                ${guess.name}
                            </div>
                        </div>
                        ${fragments}`

        let playersNode = document.getElementById('players')
        playersNode.prepend(stringToHTML(child))
    }

    function getPlayer(playerId){
        return players.filter(player => player.id == playerId)[0]
    }

    return /* addRow */ function (playerId) {

        let guess = getPlayer(playerId)
        console.log(guess)

        let content = setContent(guess)
        showContent(content, guess)
    }
}
