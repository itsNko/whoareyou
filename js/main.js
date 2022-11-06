import { folder, leftArrow } from "./fragments.js";
import { fetchJSON } from "./loaders.js";

function differenceInDays(date1) {
    let today = new Date()
    let diffTime = Math.abs(today - date1)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

let difference_In_Days = differenceInDays(new Date("08/18/2022"))

window.onload = function () {
  document.getElementById(
    "gamenumber"
  ).innerText = difference_In_Days.toString();
  document.getElementById("back-icon").innerHTML = folder + leftArrow;
};

let game = {
  guesses: [],
  solution: {},
  players: [],
  leagues: []
};

function getSolution(players, solutionArray, difference_In_Days) {
    let solutionArraySize = Object.keys(solutionArray).length
    let index = (difference_In_Days == 0)? 0 : ((difference_In_Days - 1) % solutionArraySize)
    let key = solutionArray[index].id
    let result = players.filter(player => player.id == key)[0]
    console.log(result)
    return result
}

Promise.all([fetchJSON("fullplayers"), fetchJSON("solution")]).then(
  (values) => {

    let solution;
    
    [game.players, solution] = values;

    game.solution = getSolution(game.players, solution, difference_In_Days);
    
    console.log(game.solution);

    document.getElementById(
      "mistery"
    ).src = `https://playfootball.games/media/players/${
      game.solution.id % 32
    }/${game.solution.id}.png`;


      // YOUR CODE HERE
    let addRow = setupRows( /* THIS NEEDS A PARAMETER */ );
    // get myInput object...
      // when the user types a number an press the Enter key:
        addRow( /* the ID of the player, where is it? */);
    //  


  }
);
