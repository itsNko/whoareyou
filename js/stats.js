import {game} from './main.js'
export {initState}

let initState = function(what, solutionId) {
    let WAYgameState = JSON.parse(localStorage.getItem('WAYgameState'))
    if(WAYgameState == null){
        localStorage.setItem('WAYgameState', JSON.stringify({
            "guesses" : [],
            "solution" : solutionId
        }))
        WAYgameState = JSON.parse(localStorage.getItem('WAYgameState'))
    }
    if(game.guesses.length < 1)
        WAYgameState.guesses.map(playerID => game.guesses.push(playerID))

    let state = WAYgameState.guesses.find(player => player == what)
    let anonymousFunction = function(guess){
        WAYgameState.guesses.push(guess)
        localStorage.setItem('WAYgameState', JSON.stringify(WAYgameState))
    }
    return [state, anonymousFunction]
}



