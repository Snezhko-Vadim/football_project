let DoubleLinkedList = function () {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }
  DoubleLinkedList.prototype.createNode = function(key=null, value, next = null, prev = null){
    return{
      key,
      value,
      next,
      prev,
    }
  }
  DoubleLinkedList.prototype.addNodeToHead = function(node){
    if(this.size === 0){
      this.head = node;
      this.tail = node;
      this.size++;
    }
    else if(this.size === 1){
      this.head = node;
      this.head.next = this.tail;
      this.tail.prev = this.head;
      this.size++;
    }
    else{
      this.head.prev = node;
      node.prev = null;
      node.next = this.head;
      this.head = node;
      this.size++;
    }
  }
  DoubleLinkedList.prototype.addNodeToTail = function(node){
    if(this.size === 0){
      this.head = node;
      this.tail = node;
      this.size++;
    }
    else if(this.size === 1){
      this.tail = node;
      this.tail.prev = this.head;
      this.head.next = this.tail;
      this.size++;
    }
    else{
      this.tail.next = node;
      node.prev = this.tail;
      node.next = null;
      this.tail = node;
      this.size++;
    }
  }
  DoubleLinkedList.prototype.removeNode = function(node){
      currentNode = this.head;
      while(currentNode.next){
          currentNode = currentNode.next;
          if(node.key === currentNode.key){
              let prev = node.prev;
              let next = node.next;
              if(prev && next){
                prev.next = next;
                next.prev = prev;
                this.size--;
                return node;
              }
              if(!prev && !next){
                this.head = null;
                this.tail = null;
                this.size--;
                return node;
              }
              if(prev === null){
                this.head = next;
                next.prev = prev;
              }
              if(next === null){
                this.tail = prev;
                prev.next = next;
              }
              this.size--;
          }
      }
      return node;
  }


  const CacheWithRecentActions = function (maxActions){
    this._cache = {};
    this._maxActions = maxActions;
    this._doubleLL = new DoubleLinkedList();
}

CacheWithRecentActions.prototype.add = function (key,value){
    if(this._doubleLL.size < this._maxActions){
        if(this._cache[key]){
            let node = this._cache[key];
            node.value = value;
            this._cache[key] = node;
            this._doubleLL.removeNode(node);
            this._doubleLL.addNodeToTail(node);
        }
        else{
          let node = this._doubleLL.createNode(key,value);
          this._doubleLL.addNodeToTail(node);
          this._cache[key] = node;
        }
      }
    else{
        if(this._cache[key]){
            let node = this._cache[key];
            node.value = value;
            this._cache[key] = node;
            this._doubleLL.removeNode(node);
            this._doubleLL.addNodeToTail(node);
        }
        else{
          let deletingNode = this._doubleLL.removeNode(this._doubleLL.head);
          let node = this._doubleLL.createNode(key,value);
          this._doubleLL.addNodeToTail(node);
          this._cache[key] = node;
        }
    }
}

CacheWithRecentActions.prototype.returnToThePreviousAction = function(){
    currentNode = this._doubleLL.tail;
    prevNode = currentNode.prev;
    if(!prevNode){
        return false;
    }
    this._doubleLL.removeNode(currentNode);
    return prevNode.value;
}
CacheWithRecentActions.prototype.clearCache = function(){
    this._cache = {};
    this._doubleLL = new DoubleLinkedList();
}

CacheWithRecentActions.prototype.get = function(key) {
    let gettingNode = this._cache[key];
    if(gettingNode){
      return gettingNode.value;
    }
    else{
      return false;
    }
};


const request = async function(url,token){
    try {
        let response = await fetch(url,{
            headers:{
                "X-Auth-Token":token,
            }
        })
        return await response.json();
    } catch (error) {
        console.log(error);
    }
}
const createHtmlElement = function(objOfAttributes = undefined,tagName){
    let htmlElement = document.createElement(tagName);
    if(objOfAttributes !== undefined){
        for(let key in objOfAttributes){
            htmlElement[key] = objOfAttributes[key];
        }
    }
    return htmlElement;
}

const makeListOfCompetitions = function(arrayOfCompetitions, arrayOfAvailableCompetitionsId){
    let availableCompetitionsArray = [];
    for(let i = 0; i < arrayOfAvailableCompetitionsId.length; i++){
        availableCompetitionsArray.push(arrayOfCompetitions.find((competition)=>competition.id === arrayOfAvailableCompetitionsId[i]));
    }
    let list = createHtmlElement({
        className:'competitions-list',
    },'ul');
    for(let i = 0; i<availableCompetitionsArray.length; i++){
        let li = createHtmlElement({
            className:'competitions-list__item',
            innerText:availableCompetitionsArray[i].name,
        },'li');
        li.setAttribute('idOfCompetition', availableCompetitionsArray[i].id)
        list.append(li);
    }
    return list;
}

const makeTableOfStanding = function(standingOfCompetitionObj){
    let tableStanding = createHtmlElement({
        className:'standing-table',
    },'table');
    let headOfTable =['position','team','G','W','D','L','B','D','P','Last matches']
    for(let str = 0; str<standingOfCompetitionObj.table.length; str++){
        let tr = createHtmlElement({
            className:'standing-table__string',
        },'tr');
        if(str === 0){
            let tr = createHtmlElement({
                className:'standing-table__string',
            },'tr');
            for(let i = 0; i<headOfTable.length; i++){
                let td = createHtmlElement({
                    className:'standing-table__cell',
                },'td');
                td.innerText=headOfTable[i];
                tr.append(td);
            }
            tableStanding.append(tr);
        }
        let currentTeam = standingOfCompetitionObj.table[str];
        let name = createHtmlElement({
            className:'standing-table__team-name',
        },'div');
        let iconOfTeam = createHtmlElement({
            className: 'team-icon',
        },'img');
        if(currentTeam.team.crestUrl){
            iconOfTeam.src = currentTeam.team.crestUrl;
        }
        let nameOfTeam = createHtmlElement({
            className: 'team-name',
            innerText:currentTeam.team.name,
            href:'#',
        },'a');
        nameOfTeam.setAttribute('idOfTeam',currentTeam.team.id);
        name.append(iconOfTeam,nameOfTeam);
        let position = currentTeam.position;
        let games = currentTeam.playedGames;
        let wins = currentTeam.won;
        let draw = currentTeam.draw;
        let lost = currentTeam.lost;
        let goals = `${currentTeam.goalsFor}/${currentTeam.goalsAgainst}`;
        let goalDifference = currentTeam.goalDifference;
        let points = currentTeam.points;
        let lastMatches = createHtmlElement({
            className:'standing-table__last-matches',
        },'div');
        if(currentTeam['form']){
            let lastMatchesResults = currentTeam['form'].split(',');
            for(let i = 0; i<lastMatchesResults.length;i++){
                let result;
                if(lastMatchesResults[i]==='D'){
                    result = 'draw';
                }
                else if(lastMatchesResults[i]==='W'){
                    result = 'win';
                }
                else{
                    result = 'lost';
                }
                let lastMatchesIndecator = createHtmlElement({
                    className:`standing-table__last-matches-indecator indecator-${result} fas fa-circle`,
                },'i');
                lastMatches.append(lastMatchesIndecator);
            }
        }
        for(let cell = 0; cell<10; cell++){
            let td = createHtmlElement({
                className:'standing-table__cell',
            },'td');
            switch(cell){
                case(0):
                td.innerText=position;
                break;
                case(1):
                td.append(name);
                break;
                case(2):
                td.innerText=games;
                break;
                case(3):
                td.innerText=wins;
                break;
                case(4):
                td.innerText=draw;
                break;
                case(5):
                td.innerText=lost;
                break;
                case(6):
                td.innerText=goals;
                break;
                case(7):
                td.innerText=goalDifference;
                break;
                case(8):
                td.innerText=points;
                break;
                case(9):
                td.append(lastMatches);
                break;
            }
            tr.append(td);
        }
        tableStanding.append(tr);
    }
    return tableStanding;
};
const makeStandingOfCompetition = function(competitionStandingsObj){
    let standingElem = createHtmlElement({
        className: 'standing',
    },'div');
    standingElem.setAttribute('idOfCompetition',competitionStandingsObj.competition.id);
    let titleElem = createHtmlElement({
        className: 'standing__title',
        innerText: competitionStandingsObj.competition.name,
    },'h2');
    let standingInfoElem = createHtmlElement({
        className: 'standing__info'
    },'div');
    let standingTablesElem = createHtmlElement({
        className: 'standing__tables',
    },'div');
    let currentMatchdayElem = createHtmlElement({
        className: 'standing__current-day',
        innerText: `Current matchday: ${competitionStandingsObj.season.currentMatchday}`,
    },'p');
    let standingNavElem = createHtmlElement({
        className: 'standing__nav'
    },'div');

    standingElem.append(titleElem);
    standingElem.append(standingInfoElem);
    standingElem.append(standingTablesElem);

    const standingTypes = ['TOTAL','HOME','AWAY'];

    let cacheOfTables = {
        'TOTAL':[],
        'HOME':[],
        'AWAY':[],
    };

    for(let j = 0; j<competitionStandingsObj.standings.length; j++){
        let standingTable = makeTableOfStanding(competitionStandingsObj.standings[j]);
        if(competitionStandingsObj.standings[j].group){
            let standingTableWrapper = createHtmlElement({
                className:'standing-table__wrapper',
            },'div')
            let groupNameArr = competitionStandingsObj.standings[j].group.split('_');
            let groupName = `${groupNameArr[0]} ${groupNameArr[1]}`;
            let standingTableTitle = createHtmlElement({
                className:'standing-table__title',
                innerText: groupName,
            },'h3')
            standingTableWrapper.append(standingTableTitle);
            standingTableWrapper.append(standingTable);
            cacheOfTables[competitionStandingsObj.standings[j].type].push(standingTableWrapper);
        }
        else{
            cacheOfTables[competitionStandingsObj.standings[j].type].push(standingTable);
        }
    }

    for(let i = 0; i<cacheOfTables[standingTypes[0]].length; i++){
        standingTablesElem.append(cacheOfTables[standingTypes[0]][i]);
    }

    for(let i = 0; i<3; i++){
        let standingNavItemElem = createHtmlElement({
            innerText: standingTypes[i],
            value: standingTypes[i],
        },'button');
        if(i===0){
            standingNavItemElem.className = 'standing__nav-item standing__nav-item_active';
        }
        else{
            standingNavItemElem.className = 'standing__nav-item';
        }
        standingNavItemElem.addEventListener('click',function(){
            let standingNavItems = document.getElementsByClassName('standing__nav-item');
            for(let i = 0; i<standingNavItems.length; i++){
                standingNavItems[i].className = 'standing__nav-item';
            }
            this.className = 'standing__nav-item standing__nav-item_active';
            let requiredStandings = cacheOfTables[this.value];
            while(standingTablesElem.childNodes.length){
                standingTablesElem.childNodes[0].remove();
            }
            for(let i = 0; i<requiredStandings.length; i++){
                standingTablesElem.append(requiredStandings[i]);
            }
        });
        standingNavElem.append(standingNavItemElem);
    }
    standingInfoElem.append(currentMatchdayElem);
    standingInfoElem.append(standingNavElem);
    return(standingElem);
}
const makeTeamInformation = function(teamObj,matchesObj){
    let teamElem = createHtmlElement({
        className: 'team',
    },'div')
    let teamContentElem = createHtmlElement({
        className: 'team__content',
    },'div')
    let teamTitleElem = createHtmlElement({
        className: 'team__title',
    },'div')
    let teamTitleIconElem = createHtmlElement({
        className: 'team__title-icon',
    },'img')
    if(teamObj.crestUrl){
        teamTitleIconElem.src = teamObj.crestUrl;
    }
    let teamTitleTextElem = createHtmlElement({
        className: 'team__title-text',
        innerText:teamObj.name,
    },'h2')
    let teamInformationElem = createHtmlElement({
        className: 'team__information',
    },'div')
    let teamInformationTitleElem = createHtmlElement({
        className: 'team__information-title',
        innerText:'information',
    },'h3')
    let teamInformationContentElem = createHtmlElement({
        className: 'team__information-content',
    },'div')
    let teamMatchesElem = createHtmlElement({
        className: 'team__matches',
    },'div')
    let teamMatchesTitleElem = createHtmlElement({
        className: 'team__matches-title',
        innerText:'matches',
    },'h3')
    let teamMatchesContentElem = createHtmlElement({
        className: 'team__matches-content',
    },'div')

    teamElem.append(teamTitleElem,teamContentElem);
    teamTitleElem.append(teamTitleIconElem,teamTitleTextElem);
    teamContentElem.append(teamInformationElem,teamMatchesElem);
    teamInformationElem.append(teamInformationTitleElem,teamInformationContentElem);
    for(let i = 0; i<6; i++){
        let teamInformationItemElem = createHtmlElement({
            className: 'team__information-item',
        },'div')
        let teamInformationTextElem = createHtmlElement({
            className: 'team__information-text',
        },'p')
        let teamInformationNameElem = createHtmlElement({
            className: 'team__information-name',
        },'p')
        switch(i){
            case(0):
            let teamInformationListElem = createHtmlElement({
                className: 'team__information-list',
            },'ul')
            for(let j = 0; j<teamObj.activeCompetitions.length; j++){
                let teamInformationListItemElem = createHtmlElement({
                    className: 'team__information-list-item',
                    innerText: teamObj.activeCompetitions[j].name,
                },'li')
                teamInformationListElem.append(teamInformationListItemElem);
            }
            teamInformationNameElem.innerText = 'Takes part in competitions:';
            teamInformationItemElem.append(teamInformationNameElem,teamInformationListElem);
            break;
            case(1):
            teamInformationNameElem.innerText = 'Founded in:';
            teamInformationTextElem.innerText = teamObj.founded;
            teamInformationItemElem.append(teamInformationNameElem,teamInformationTextElem);
            break;
            case(2):
            teamInformationNameElem.innerText = 'Short name:';
            teamInformationTextElem.innerText = teamObj.shortName;
            teamInformationItemElem.append(teamInformationNameElem,teamInformationTextElem);
            break;
            case(3):
            teamInformationNameElem.innerText = 'Address:';
            teamInformationTextElem.innerText = teamObj.address;
            teamInformationItemElem.append(teamInformationNameElem,teamInformationTextElem);
            break;
            case(4):
            teamInformationNameElem.innerText = 'Email:';
            teamInformationTextElem.innerText = teamObj.email;
            teamInformationItemElem.append(teamInformationNameElem,teamInformationTextElem);
            break;
            case(5):
            teamInformationNameElem.innerText = 'Phone:';
            teamInformationTextElem.innerText = teamObj.phone;
            teamInformationItemElem.append(teamInformationNameElem,teamInformationTextElem);
            break;
        }
        teamInformationContentElem.append(teamInformationItemElem);
    }
    teamMatchesElem.append(teamMatchesTitleElem,teamMatchesContentElem);
    let listScheduledGames = matchesObj.matches.filter((match)=>match.status === 'SCHEDULED');
    if(listScheduledGames.length !== 0){
        let teamMatchesListElem = createHtmlElement({
            className: 'team__matches-list',
        },'ul')
        for(let i = 0; i<listScheduledGames.length;i++){
            let teamMatchesListItemElem = createHtmlElement({
                className: 'team__matches-list-item',
            },'li')
            let teamMatchesListInfoElem = createHtmlElement({
                className: 'team__matches-list-info',
            },'div')
            let teamMatchesListTitleElem = createHtmlElement({
                className: 'team__matches-list-title',
            },'h4')
            let teamMatchesListVersusElem = createHtmlElement({
                className: 'team__matches-list-versus',
            },'p')
            let teamMatchesListDateElem = createHtmlElement({
                className: 'team__matches-list-date',
            },'p')
            let teamMatchesListTimeElem = createHtmlElement({
                className: 'team__matches-list-time',
            },'p')
            teamMatchesListItemElem.append(teamMatchesListInfoElem);
            teamMatchesListInfoElem.append(teamMatchesListTitleElem,teamMatchesListVersusElem,teamMatchesListDateElem,teamMatchesListTimeElem);
            teamMatchesListTitleElem.innerText = listScheduledGames[i].competition.name;
            teamMatchesListVersusElem.innerText = `${listScheduledGames[i].awayTeam.name} VS ${listScheduledGames[i].homeTeam.name}`;
            let arrOfDate = listScheduledGames[i].utcDate.split('Z')[0].split('T');
            teamMatchesListDateElem.innerText = `Date: ${arrOfDate[0]}`;
            teamMatchesListTimeElem.innerText = `Time: ${arrOfDate[1]}`;
            teamMatchesListElem.append(teamMatchesListItemElem);
            teamMatchesContentElem.append(teamMatchesListElem);
        }
    }
    else{
        let teamMatchesEmptyElem = createHtmlElement({
            className: 'team__matches-empty',
            innerText: 'No scheduled matches',
        },'p')
        teamMatchesContentElem.append(teamMatchesEmptyElem);
    }
    return teamElem;
}

async function mainContentMaker(url,token,availableCompetitions,mainContent,cache){
    let competitionsDataUrl = url+'/competitions';
    let competitionsData = await request(competitionsDataUrl,token);
    let competitionsList = makeListOfCompetitions(competitionsData.competitions,availableCompetitions);
    cache.add('competitionsList',competitionsList);
    mainContent.append(competitionsList);
    let competitionsList__items = competitionsList.getElementsByClassName('competitions-list__item');
    for(let i = 0; i<competitionsList__items.length; i++){
        competitionsList__items[i].addEventListener('click',(event) => (async function(url,token){
            let standing;
            let idOfCompetition = event.target.getAttribute('idOfCompetition');
            if(cache.get(`standing_${idOfCompetition}`)){
                standing = cache.get(`standing_${idOfCompetition}`);
                cache.add(`standing_${idOfCompetition}`,standing);
            }
            else{
                let standingDataUrl = url+`competitions/${idOfCompetition}/standings`;
                let standingData = await request(standingDataUrl,token);
                standing = makeStandingOfCompetition(standingData);
                let teamNameCollection = standing.getElementsByClassName('team-name');
                for(let j = 0; j<teamNameCollection.length; j++){
                    teamNameCollection[j].addEventListener('click',(event) => (async function(url,token){
                        let teamInformation;
                        let teamId = event.target.getAttribute('idOfTeam');
                        if(cache.get(`team_${teamId}`)){
                            teamInformation = cache.get(`team_${teamId}`);
                            cache.add(`team_${teamId}`,teamInformation);
                        }
                        else{
                            let teamDataUrl = url+`teams/${teamId}`;
                            let matchesDataUrl = teamDataUrl+'/matches/';
                            let teamData = await request(teamDataUrl,token);
                            let matchesData = await request(matchesDataUrl,token);
                            teamInformation = makeTeamInformation(teamData,matchesData);
                            cache.add(`team_${teamId}`,teamInformation);
                        }
                        let replaceableElem = document.getElementsByClassName('standing')[0];
                        replaceableElem.insertAdjacentElement('afterend',teamInformation)
                        replaceableElem.remove();
                    })(url,token));
                }
                cache.add(`standing_${idOfCompetition}`,standing);
            }
            let replaceableElem = document.getElementsByClassName('competitions-list')[0];
            replaceableElem.insertAdjacentElement('afterend',standing);
            replaceableElem.remove();
        })(url,token))
    }
}

/* const makePreloader = function(src,text){
    let preloaderElem = createHtmlElement({
        className:'preloader',
    },'div')
    let preloaderImage = createHtmlElement({
        className:'preloader__image',
    },'img')
    if(src){
        preloaderImage.src = src;
    }
    let preloaderText = createHtmlElement({
        className:'preloader__text',
    },'p')
    preloaderElem.append(preloaderImage,preloaderText);
    return preloaderElem;
} */


let url = 'https://api.football-data.org/v2/';
let token = '7d9c12f5860048e2b3a48176691a5ece';
let availableCompetitions = [2000,2001,2002,2003,2013,2014,2015,2016,2017,2018,2019,2021];
let cache = new CacheWithRecentActions(5);
let mainContent = document.getElementsByClassName('main__content')[0];
mainContentMaker(url,token,availableCompetitions,mainContent,cache)

let main__backBtn = createHtmlElement({
    className: 'main__back-btn',
},'button');
let main__backBtnInner = createHtmlElement({
    className: 'fas fa-arrow-left',
},'i');
main__backBtn.append(main__backBtnInner);
main__backBtn.addEventListener('click', (event)=> (function(cache,changingBlock){
    let prevAction = cache.returnToThePreviousAction();
    if(prevAction){
        let deletingElems = changingBlock.childNodes;
        for(let i = 0; i<deletingElems.length; i++){
            deletingElems[i].remove();
        }
        changingBlock.append(prevAction);
    }
})(cache,mainContent))
let main__refresh = createHtmlElement({
    className: 'main__refresh',
},'button');
let main__refreshInner = createHtmlElement({
    className: 'fas fa-sync-alt',
},'i');
main__refresh.append(main__refreshInner);
main__refresh.addEventListener('click',function(){
    cache.clearCache();
    let deletingElems = mainContent.childNodes;
    for(let i = 0; i<deletingElems.length; i++){
        deletingElems[i].remove();
    }
    mainContentMaker(url,token,availableCompetitions,mainContent,cache);
});
let main = document.getElementsByClassName('main')[0];
main.append(main__backBtn,main__refresh);


const parallax = function (event){
    topDistance = window.pageYOffset;
    let speed = 0.3;
    bg = document.getElementsByClassName('parallax')[0];
    move = -(topDistance * speed);
    bg.style.transform = `translateY(${move}px)`;
}
window.addEventListener ('scroll',parallax);
window.addEventListener('resize',function(){
    if(document.body.offsetWidth<=1050 && document.body.offsetWidth>=760){
        let tables = document.getElementsByClassName('standing-table');
        for(let j = 0; j<tables.length; j++){
            let tableRows = tables[j].getElementsByClassName('standing-table__string');
            if(tableRows){
                for(let i = 0; i<tableRows.length; i++){
                    let tableCells = tableRows[i].childNodes;
                    if(i!==0){
                        tableCells[1].firstChild.firstChild.classList.add('hide');
                    }
                    tableCells[2].classList.add('hide');
                    tableCells[3].classList.add('hide');
                    tableCells[4].classList.add('hide');
                    tableCells[5].classList.add('hide');
                    tableCells[9].classList.add('hide');
                }
            }
        }
    }
    else if(document.body.offsetWidth<=760){
        let tables = document.getElementsByClassName('standing-table');
        for(let j = 0; j<tables.length; j++){
            let tableRows = tables[j].getElementsByClassName('standing-table__string');
            if(tableRows){
                for(let i = 0; i<tableRows.length; i++){
                    let tableCells = tableRows[i].childNodes;
                    if(i!==0){
                        tableCells[1].firstChild.firstChild.classList.add('hide');
                    }
                    tableCells[2].classList.add('hide');
                    tableCells[3].classList.add('hide');
                    tableCells[4].classList.add('hide');
                    tableCells[5].classList.add('hide');
                    tableCells[6].classList.add('hide');
                    tableCells[7].classList.add('hide');
                    tableCells[8].classList.add('hide');
                    tableCells[9].classList.add('hide');
                }
            }
        }
    }
    else{
        let tables = document.getElementsByClassName('standing-table');
        for(let j = 0; j<tables.length; j++){
            let tableRows = tables[j].getElementsByClassName('standing-table__string');
            if(tableRows){
                for(let i = 0; i<tableRows.length; i++){
                    let tableCells = tableRows[i].childNodes;
                    if(i!==0){
                        tableCells[1].firstChild.firstChild.classList.remove('hide');
                    }
                    tableCells[2].classList.remove('hide');
                    tableCells[3].classList.remove('hide');
                    tableCells[4].classList.remove('hide');
                    tableCells[5].classList.remove('hide');
                    tableCells[6].classList.remove('hide');
                    tableCells[7].classList.remove('hide');
                    tableCells[8].classList.remove('hide');
                    tableCells[9].classList.remove('hide');
                }
            }
        }
    }
})