function single(url, stat) {
fetch(url)
.then(response => response.json())
.then(json => {
  let players = json.players
  findMost(players, stat)
})
}

function displayResult(arr, stat) {
  $('#results').empty()
  if (arr.length===1) {
    $('#results').append(arr[0].name + ': ' + arr[0].stats[stat] + ' ' + statsKey[stat])
  }
  else {
    $('#results').append(arr[0].stats[stat] + ' ' + statsKey[stat] + ':')
    for (i = 0; i < arr.length; i++) {
      $('#results').append('<br>' + arr[i].name)
  }
  }
}

function findMost(arr, stat) {
  let nonZero = arr.filter(obj =>{
    return obj.stats[stat]
  })
  if (nonZero.length===0) {
    alert('No players were found who match your search criteria.')
  }
  else {
  let sorted = nonZero.sort(function sortBy(a, b) {
    return b.stats[stat] - a.stats[stat]
  })
  let most = sorted[0].stats[stat]
  let result = sorted.filter(player => player.stats[stat] === most)
  displayResult(result, stat)
}
}

function rangeOnce(url, stat){
  let empty = url.map(async url => { let data = await fetch(url) 
    let jsonData = await data.json() 
    return jsonData })

Promise.all(empty) .then(data => { let arr = [] 
  data = data.forEach(player => { arr.push(...player.players) }) 
  findMost(arr, stat) })
  /*let empty = url.map(async url => {
    let data = await fetch(url)
    let jsonData = await data.json()
    return jsonData
  })
  Promise.all(empty)
  .then(data =>{
    let arr = []
    data.forEach(player => {
      arr.push(...player.players)
    })
    console.log(arr)
  )

  let empty = []
  for (i=0; i<url.length; i++) {
    fetch(url[i])
    .then(response => response.json())
    .then(json => {
      let nonZero = json.players.filter (obj => {
        return obj.stats[stat]
      })
      let sorted = nonZero.sort(function sortBy(a, b) {
        console.log('sorting')
        return b.stats[stat] - a.stats[stat]
      })
      let most = sorted[0].stats[stat]
      let result = sorted.filter(player => player.stats[stat] === most)
      console.log(result)
    })
  }*/
}

function watchSuperlative() {
  $('#superlative').submit(event => {
    event.preventDefault();
    let position = $('#superlative-position').val();
    let stat = $('#superlative-stat').val();
    let range = $('#superlative-range-type').val()
    if (range === 'one-season') {
      let season = $('#superlative-season').val();
      let url = 'https://api.fantasy.nfl.com/v1/players/stats?statType=seasonStats&season=' + season + '&position=' + position + '&format=json';
      single(url, stat)}
    else if (range === 'one-game') {
      let season = $('#superlative-season').val();
      let week = $('#superlative-week').val();
      let url = 'https://api.fantasy.nfl.com/v1/players/stats?statType=weekStats&season=' + season + '&week=' + week + '&position=' + position + '&format=json';
      single(url, stat)
    }
    else if (range === 'multiple-games') {
      let season = $('#superlative-season').val();
      let week = $('#superlative-week').val();
      let week2 = $('#superlative-week-end').val();
      let weekRange = []
      if (week < week2) {
        for (i=week; i<=week2; i++) {
          weekRange.push(i)
        }
      }
      else {
        for (i=week2; i<=week; i++) {
          weekRange.push(i)
        }
      }
      let url = []
      for (i=0; i<weekRange.length; i++) {
        url.push('https://api.fantasy.nfl.com/v1/players/stats?statType=weekStats&season=' + season + '&week=' + weekRange[i] + '&position=' + position + '&format=json')
      }
      rangeOnce(url, stat)
    }
    else if (range === 'multiple-seasons') {
      let season = $('#superlative-season').val();
      let season2 = $('#superlative-season-end').val();  
      let seasonRange = []
      if (season < season2) {
        for (i=season; i<=season2; i++) {
          seasonRange.push(i)
        }
      }
      else {
        for (i=season2; i<=season; i++) {
          seasonRange.push(i)
        }
      }
      let url = []
      for (i=0; i<seasonRange.length; i++) {
        url.push('https://api.fantasy.nfl.com/v1/players/stats?statType=seasonStats&season=' + seasonRange[i] + '&position=' + position + '&format=json')
      }
      rangeOnce(url, stat)
    }
  })
}

function watchForSelect () {
  $('#superlative-range-type').change(function name() {
    $('#superlative-range').empty()
    opt = $('#superlative-range-type').val()
    if (opt === 'one-game') {
      $('#superlative-range').html('Season: <input type="number" id="superlative-season" value="2018"><br>Week: <input type="number" id="superlative-week" value="1">').attr('class', 'one-game')
    }
    if (opt === 'one-season') {
      $('#superlative-range').html('Season: <input type="number" id="superlative-season" value="2018">').attr('class', 'one-season')
    }
    if (opt === 'multiple-games') {
      $('#superlative-range').html('Season: <input type="number" id="superlative-season" value="2018"><br>Weeks: <input type="number" id="superlative-week" value="1">&ndash;<input type="number" id="superlative-week-end" value="17">').attr('class', 'multiple-games')
    }
    if (opt === 'multiple-seasons') {
      $('#superlative-range').html('Seasons: <input type="number" id="superlative-season" value="2009">&ndash;<input type="number" id="superlative-season-end" value="2018">').attr('class', 'multiple-seasons')
    }
  })
}

function watchMostRecent() {
  $('#most-recent').submit(event => {
    event.preventDefault();
    let playerTeam = $('#most-recent-player-team').val()
    let number = $('#most-recent-number').val()
    let stat = $('#most-recent-stat').val()
    let gameSeason = $('#most-recent-game-season').val()
    let url = "https://api.fantasy.nfl.com/v1/"
    console.log(playerTeam + number + stat + gameSeason)
  })
}

function gidderDone() {
  watchForSelect()
  watchMostRecent()
  watchSuperlative()
}

gidderDone()
//The endpoint "https://api.fantasy.nfl.com/v1/docs/service?serviceName=gameStats" contains a key for all of the stats returned by the other endpoints. Unfortunately, that specific endpoint doesn't support CORS, and as such I have reproduced the key in an abridged form here.
let statsKey = {
    1: 'Games played',
    2: 'Passing Attempts',
    3: 'Passing Completions',
    4: 'Incomplete Passes',
    5: 'Passing Yards',
    6: 'Passing Touchdowns',
    7: 'Interceptions Thrown',
    8: 'Every Time Sacked',
    9: '300-399 Passing Yard Bonus',
    10: '400+ Passing Yard Bonus',
    11: '40+ Passing Yard TD Bonus',
    12: '50+ Passing Yard TD Bonus',
    13: 'Rushing Attempts',
    14: 'Rushing Yards',
    15: 'Rushing Touchdowns',
    16: '40+ Rushing Yard TD Bonus',
    17: '50+ Rushing Yard TD Bonus',
    18: '100-199 Rushing Yards Bonus',
    19: '200+ Rushing Yards Bonus',
    20: 'Receptions',
    21: 'Receiving Yards',
    22: 'Receiving Touchdowns',
    23: '40+ Receiving Yard TD Bonus',
    24: '50+ Receiving Yard TD Bonus',
    25: '100-199 Receiving Yards Bonus',
    26: '200+ Receiving Yard Bonus',
    27: 'Kickoff and Punt Return Yards',
    28: 'Kickoff and Punt Return Touchdowns',
    29: 'Fumble Recovered for TD',
    30: 'Fumbles Lost',
    31: 'Fumble',
    32: '2-Point Conversions',
    33: 'PAT Made',
    34: 'PAT Missed',
    35: 'FG Made 0-19',
    36: 'FG Made 20-29',
    37: 'FG Made 30-39',
    38: 'FG Made 40-49',
    39: 'FG Made 50+',
    40: 'FG Missed 0-19',
    41: 'FG Missed 20-29',
    42: 'FG Missed 30-39',
    43: 'FG Missed 40-49',
    44: 'FG Missed 50+',
    45: 'Sacks',
    46: 'Interceptions',
    47: 'Fumbles Recovered',
    48: 'Fumbles Forced',
    49: 'Safeties',
    50: 'Touchdowns',
    51: 'Blocked Kicks',
    52: 'Kickoff and Punt Return Yards',
    53: 'Kickoff and Punt Return Touchdowns',
    54: 'Points Allowed',
    55: 'Points Allowed 0',
    56: 'Points Allowed 1-6',
    57: 'Points Allowed 7-13',
    58: 'Points Allowed 14-20',
    59: 'Points Allowed 21-27',
    60: 'Points Allowed 28-34',
    61: 'Points Allowed 35+',
    62: 'Yards Allowed',
    63: 'Less than 100 Total Yards Allowed',
    64: '100-199 Yards Allowed',
    65: '200-299 Yards Allowed',
    66: '300-399 Yards Allowed',
    67: '400-449 Yards Allowed',
    68: '450-499 Yards Allowed',
    69: '500+ Yards Allowed',
    70: 'Tackle',
    71: 'Assisted Tackles',
    72: 'Sack',
    73: 'Defense Interception',
    74: 'Forced Fumble',
    75: 'Fumbles Recovery',
    76: 'Touchdown (Interception Return)',
    77: 'Touchdown (Fumble Return)',
    78: 'Touchdown (Blocked Kick)',
    79: 'Blocked Kick (punt, FG, PAT)',
    80: 'Safety',
    81: 'Pass Defended',
    82: 'Interception Return Yards',
    83: 'Fumble Return Yards',
    84: 'Tackles for Loss Bonus',
    85: 'QB Hit',
    86: 'Sack Yards',
    87: '10+ Tackles Bonus',
    88: '2+ Sacks Bonus',
    89: '3+ Passes Defended Bonus',
    90: '50+ Yard INT Return TD Bonus',
    91: '50+ Yard Fumble Return TD Bonus'
}


