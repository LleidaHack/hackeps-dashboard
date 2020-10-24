async function teamStats() {
    const users_url = 'https://hackeps-dashboard.herokuapp.com/teams';
    $.ajax({
        url: users_url,
        type: "GET",
        headers: {'token': getCookie('token')}
      }).done(function(data, status) {
        setTotalTeams(data.teams);
        setDetailTeams(data.teams);
      }).fail(function(cause){
        console.log(cause)
      });
}

function setTotalTeams(teams) {
    var completed = 0;
    var non_completed = 0;
    for (const team of teams) {
        if(team.members.length === 4) {
            completed++;
        } else {
            non_completed++;
        } 
    }
    document.getElementById("teams-total").innerHTML = "Total: " + (completed+non_completed).toString();
    document.getElementById("complete-teams").innerHTML = "Completed: " + completed.toString();
    document.getElementById("non-complete-teams").innerHTML = "Non-Completed: " + non_completed.toString();
}

async function setDetailTeams(teams) {
    var teamsCount = 0;
    var team_row = "";
    team_row = team_row.concat(`<div class="row mt-3">`);
    for(const team of teams) {
        count = 0;
        var row="";
        if(teamsCount%3 === 0 && teamsCount !== 0) {
            team_row = team_row.concat(`</div>`);
            team_row = team_row.concat(`<div class="row mt-3">`);
        }
        for(const member of team.members) {
            if(member !== undefined) {
                var photo = member.photoURL !== null ? member.photo_url : "assets/no-user.png";
                var name = member.full_name;
                
                var col = `<div class="col-6">
                    <div class="row justify-content-center">
                        <img src="${photo}" alt="${name}" class="rounded-circle" style="max-height:7rem!important; max-width:7rem!important;">
                    </div>
                    <div class="row justify-content-center">
                        <p>${name}</p>
                    </div>
                </div>`

                if (count === 0  || count === 2 ) {
                    row = row.concat(`<div class="row justify-content-center">`);
                    row = row.concat(col);
                    if(count === team.members.length-1) {
                        row = row.concat(`</div>`);
                    }
                } else if(count === 1 || count === 3) {
                    row = row.concat(col);
                    row = row.concat(`</div>`);
                };
                count++;
            }else {
                if(count === team.members.length-1) {
                    row = row.concat(`</div>`);
                }
                count++;
            }
        }
        team_row = team_row.concat(
            `<div class="col-4">
                <div class="card card-box">
                    <div class="card-body" style="padding-bottom: 0">
                        <div class="row justify-content-center">
                            <p>${team.name}</p>
                        </div>
                    </div>
                    ${row}
                </div>
            </div>`
        );
        if(teamsCount === teams.length-1){
            row = row.concat(`</div>`);
        }
        teamsCount++;        
    }
    $("#teams-screen").append(team_row);
}

async function showTeams(teams) {
    var count = 0;
    var membersWTeam = 0;
    for (const team of teams) {
        $("#teamsList tbody").append(
            `<tr>
                <th scope=${count}>${count}</th>
                <td>${team.name}</td>
                <td>${team.members.map(m => m.full_name).join(", ")}</td>
                <td>${team.members.length}/4</td>
            </tr>`);
        count++;
        membersWTeam += team.members.length;
    }

    $("#teamsMiscList tbody").append(
        `<tr>
            <th scope=${count}>${count}</th>
            <td>Teams</td>
            <td>${count}</td>
        </tr>`);
    $("#teamsMiscList tbody").append(
        `<tr>
            <th scope=${count}>${count}</th>
            <td>Members w/ Team</td>
            <td>${membersWTeam}</td>
        </tr>`);
}