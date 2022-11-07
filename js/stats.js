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

    let state = WAYgameState.find(player => player == what)
    let anonymousFunction = function(guess){
        WAYgameState.guesses.push(guess)
        localStorage.setItem('WAYgameState', JSON.stringify(WAYgameState))
    }
    return [state, anonymousFunction]
}



