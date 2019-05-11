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
    $('#results').append('<h2>Results</h2>' + arr[0].name + ': ' + arr[0].stats[stat] + ' ' + statsKey[stat])
  }
  else {
    $('#results').append('<h2>Results</h2>' + arr[0].stats[stat] + ' ' + statsKey[stat] + ':')
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
    $('#results').html('<h2>Results</h2>No players were found who match your search criteria.')
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
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    let position = $('#position').val();
    let stat = $('#stat').val();
    let range = $('#range-type').val()
    if (range === 'one-season') {
      let season = $('#season').val();
      let url = 'https://api.fantasy.nfl.com/v1/players/stats?statType=seasonStats&season=' + season + '&position=' + position + '&format=json';
      single(url, stat)}
    else if (range === 'one-game') {
      let season = $('#season').val();
      let week = $('#week').val();
      let url = 'https://api.fantasy.nfl.com/v1/players/stats?statType=weekStats&season=' + season + '&week=' + week + '&position=' + position + '&format=json';
      single(url, stat)
    }
    else if (range === 'multiple-games') {
      let season = $('#season').val();
      let week = $('#week').val();
      let week2 = $('#week-end').val();
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
      let season = $('#season').val();
      let season2 = $('#season-end').val();  
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

function watchPositionSelect() {
  $('#position').change(function posName() {
    pos = $('#position').val()
    if (pos === 'QB' || pos === 'RB' || pos === 'WR' || pos === 'TE') {
      $('#stat').html('<option hidden disabled selected value>statistic</option><option value="2">Passing Attempts</option><option value="3">Passing Completions</option><option value="4">Incomplete Passes</option><option value="5">Passing Yards</option><option value="6">Passing Touchdowns</option><option value="7">Interceptions Thrown</option><option value="8">Sacks against</option><option value="13">Rushing Attempts</option><option value="14">Rushing Yards</option><option value="15">Rushing Touchdowns</option><option value="20">Receptions</option><option value="21">Receiving Yards</option><option value="22">Receiving Touchdowns</option><option value="31">Fumbles</option><option value="30">Fumbles Lost</option><option value="29">Fumbles Recovered for an Offensive Touchdown</option><option value="32">2-Point Conversions</option><option value="27">Return Yards</option><option value="28">Return Touchdowns</option><option value="9">Games of 300-399 Passing Yards</option><option value="10">Games of 400+ Passing Yards</option><option value="18">Games of 100-199 Rushing Yards</option><option value="19">Games of 200+ Rushing Yards</option><option value="25">Games of 100-199 Receiving Yards</option><option value="26">Games of 200+ Receiving Yards</option><option value="11">Passing TDs of 40-49 Yards</option><option value="12">Passing TDs of 50+ Yards</option><option value="16">Rushing TDs of 40-49 Yards</option><option value="17">Rushing TDs of 50+ Yards</option><option value="23">Receiving TDs of 40-49 Yards</option><option value="24 Receiving TDs of 50+ Yards"></option>')
    }
    else if (pos === 'K') {
      $('#stat').html('<option hidden disabled selected value>statistic</option><option value="33">PAT Made</option><option value="34">PAT Missed</option><option value="35">FG of 0-19 Yards Made</option><option value="40">FG of 0-19 Yards Missed</option><option value="36">FG of 20-29 Yards Made</option><option value="41">FG of 20-29 Yards Missed</option><option value="37">FG of 30-39 Yards Made</option><option value="42">FG of 30-39 Yards Missed</option><option value="38">FG of 40-49 Yards Made</option><option value="43">FG of 40-49 Yards Missed</option><option value="39">FG of 50+ Yards Made</option><option value="44">FG of 50+ Yards Missed</option>')
      console.log('kicker')
    }
    else if (pos === 'DEF') {
      $('#stat').html('<option hidden disabled selected value>statistic</option><option value="45">Sacks</option><option value="46">Interceptions</option><option value="48">Fumbles Forced</option><option value="47">Fumbles Recovered</option><option value="49">Safeties</option><option value="50">Touchdowns</option><option value="51">Blocked Kicks</option><option value="54">Total Points Allowed</option><option value="62">Total Yards Allowed</option><option value="55">Games Allowing 0 Points</option><option value="56">Games Allowing 1-6 Points</option><option value="57">Games Allowing 7-13 Points</option><option value="58">Games Allowing 14-20 Points</option><option value="59">Games Allowing 21-27 Points</option><option value="60">Games Allowing 28-34 Points</option><option value="61">Games Allowing 35+ Points</option><option value="63">Games Allowing &lt; 100 Yards</option><option value="64">Games Allowing 100-199 Yards</option><option value="65">Games Allowing 200-299 Yards</option><option value="66">Games Allowing 300-399 Yards</option><option value="67">Games Allowing 400-449 Yards</option><option value="68">Games Allowing 450-499 Yards</option><option value="69">Games Allowing 500+ Yards</option>')
      console.log('team defense')
    }
    else if (pos === 'DL' || pos === 'LB' || pos === 'DB') {
      $('#stat').html('<option hidden disabled selected value>statistic</option><option value="70">Solo Tackles</option><option value="71">Assisted Tackles</option><option value="72">Sacks</option><option value="73">Interceptions</option><option value="74">Forced Fumbles</option><option value="75">Fumble Recoveries</option><option value="76">Interception Return Touchdowns</option><option value="77">Fumble Return Touchdowns</option><option value="78">Blocked Kick Return Touchdowns</option><option value="79">Blocked Kicks</option><option value="80">Safeties</option><option value="81">Passes Defensed</option><option value="82">Interception Return Yards</option><option value="83">Fumble Return Yards</option><option value="84">Tackles for a Loss</option><option value="85">QB Hits</option><option value="86">Sack Yards</option><option value="87">Games of 10+ Tackles</option><option value="88">Games of 2+ Sacks</option><option value="89">Games of 3+ Passes Defensed</option><option value="90">Interception Return Touchdonws of 50+ Yards</option><option value="91">Fumble Return Touchdowns of 50+ Yards</option>')
      console.log('defensive player')
    }
  })
}

function watchRangeSelect () {
  $('#range-type').change(function name() {
    opt = $('#range-type').val()
    if (opt === 'one-game') {
      $('#range').html('Season: <input type="number" id="season" value="2018"><br>Week: <input type="number" id="week" value="1">').attr('class', 'one-game')
    }
    if (opt === 'one-season') {
      $('#range').html('Season: <input type="number" id="season" value="2018">').attr('class', 'one-season')
    }
    if (opt === 'multiple-games') {
      $('#range').html('Season: <input type="number" id="season" value="2018"><br>Weeks: <input type="number" id="week" value="1">&ndash;<input type="number" id="week-end" value="17">').attr('class', 'multiple-games')
    }
    if (opt === 'multiple-seasons') {
      $('#range').html('Seasons: <input type="number" id="season" value="2009">&ndash;<input type="number" id="season-end" value="2018">').attr('class', 'multiple-seasons')
    }
  })
}

function gidderDone() {
  watchPositionSelect()
  watchRangeSelect()
  watchForm()
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
    8: 'Times Sacked',
    9: 'Games of 300-399 Passing Yards',
    10: 'Games of 400+ Passing Yards',
    11: 'Passing TDs of 40+ Yards',
    12: 'Passing TDs of 50+ Yards',
    13: 'Rushing Attempts',
    14: 'Rushing Yards',
    15: 'Rushing Touchdowns',
    16: 'Rushing TDs of 40+ Yards',
    17: 'Rushing TDs of 50+ Yards',
    18: 'Games of 100-199 Rushing Yards',
    19: 'Games of 200+ Rushing Yards',
    20: 'Receptions',
    21: 'Receiving Yards',
    22: 'Receiving Touchdowns',
    23: 'Receiving TDs of 40+ Yards',
    24: 'Receiving TDs of 50+ Yards',
    25: 'Games of 100-199 Receiving Yards',
    26: 'Games of 200+ Receiving Yards',
    27: 'Kickoff and Punt Return Yards',
    28: 'Kickoff and Punt Return Touchdowns',
    29: 'Fumbles Recovered for TD',
    30: 'Fumbles Lost',
    31: 'Fumbles',
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
    54: 'Total Points Allowed',
    55: 'Games of 0 Points Allowed',
    56: 'Games of 1-6 Points Allowed',
    57: 'Games of 7-13 Points Allowed',
    58: 'Games of 14-20 Points Allowed',
    59: 'Games of 21-27 Points Allowed',
    60: 'Games of 28-34 Points Allowed',
    61: 'Games of 35+ Points Allowed',
    62: 'Total Yards Allowed',
    63: 'Games of Less than 100 Total Yards Allowed',
    64: 'Games of 100-199 Yards Allowed',
    65: 'Games of 200-299 Yards Allowed',
    66: 'Games of 300-399 Yards Allowed',
    67: 'Games of 400-449 Yards Allowed',
    68: 'Games of 450-499 Yards Allowed',
    69: 'Games of 500+ Yards Allowed',
    70: 'Solo Tackles',
    71: 'Assisted Tackles',
    72: 'Sacks',
    73: 'Interceptions',
    74: 'Forced Fumbles',
    75: 'Fumble Recoveries',
    76: 'Interception Return Touchdowns',
    77: 'Fumble Return Touchdowns',
    78: 'Kick Return Touchdowns',
    79: 'Blocked Kicks (punt, FG, PAT)',
    80: 'Safeties',
    81: 'Passes Defensed',
    82: 'Interception Return Yards',
    83: 'Fumble Return Yards',
    84: 'Tackles for Loss',
    85: 'QB Hits',
    86: 'Sack Yards',
    87: 'Games of 10+ Tackles',
    88: 'Games of 2+ Sacks',
    89: 'Games of 3+ Passes Defensed',
    90: 'INT Return TDs of 50+ Yards',
    91: 'Fumble Return TDs of 50+ Yards'
}