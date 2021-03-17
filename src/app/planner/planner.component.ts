import { Component, OnInit } from '@angular/core';
import { TournamentModel } from '../model/tournament-model';

@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.css']
})
export class PlannerComponent implements OnInit {
  totalPlayersArr: number[] = [4, 5, 6, 7, 8, 9, 10];
  results = ['Team 1', 'Team 2'];
  resultsMap = {};
  noOfPlayers: number;
  playerNames: string[] = [];
  playerPoints = {};
  playerRankings = [];
  pairs: string[] = [];
  tournament: TournamentModel[] = [];
  isPlayerInitialised: boolean = false;
  isTournamentGenerated: boolean = false;
  result = "";
  constructor() { }
  reinitialize(n) {
    this.noOfPlayers = n;
    this.playerNames = new Array(n);
    this.tournament = [];
    this.isTournamentGenerated = false;
    this.isPlayerInitialised = false;
    this.pairs = [];
    this.playerPoints = {};
  }
  initializeNoOfPlayers(n: number) {
    this.reinitialize(n);
    for (let i = 0; i < n; i++) {
      this.playerNames[i] = "Player " + (i + 1);
      this.playerPoints[this.playerNames[i]] = 0;
    }
    this.isPlayerInitialised = true;
    this.submitData();
  }
  modifiedNames() {
    this.tournament = [];
    this.isTournamentGenerated = false;
    this.pairs = [];
    this.playerPoints = {};
    for (let i = 0; i < this.noOfPlayers; i++) {
      this.playerPoints[this.playerNames[i]] = 0;
    }
    this.submitData();
  }
  submitData() {
    for (let i = 0; i < this.playerNames.length; i++) {
      for (let j = i + 1; j < this.playerNames.length; j++) {
        this.pairs.push(this.playerNames[i] + "," + this.playerNames[j]);
      }
    }
    let tempPairs = [...this.pairs];
    let serial = 1;
    while (tempPairs.length > 0) {
      let selectedPair = tempPairs[0];
      tempPairs.shift();
      let selectedList = selectedPair.split(",");
      for (let opponent of tempPairs) {
        let opponentList = opponent.split(",");
        let flag = 0;
        for (let player of selectedList) {
          for (let opp of opponentList) {
            if (player == opp)
              flag = 1;
          }
        }
        if (flag == 0) {
          let team1 = selectedPair.replace(',', ' & ');
          let team2 = opponent.replace(',', ' & ');
          let tournamentObject: TournamentModel = new TournamentModel();
          tournamentObject.team1 = team1;
          tournamentObject.team2 = team2;
          tournamentObject.sno = serial;
          serial += 1;
          this.tournament.push(tournamentObject);
          let obj = { 'result': 'Who won?' };
          this.resultsMap[tournamentObject.sno] = obj;
        }
      }
    }
    this.tournament.sort(function (a, b) { return 0.5 - Math.random() })
    this.isTournamentGenerated = true;
  }
  ngOnInit() {
  }
  trackByFn(index: any, item: any) {
    return index;
  }
  updateResult(x, y) {
    this.resultsMap[x + 1].result = y;
    this.calculateRanking(x, y);
  }

  calculateRanking(x, y) {
    let tnmt = this.tournament[x];
    if (y == 'Team 1') {
      let players = tnmt.team1;
      let playersArr = players.split("&");
      this.playerPoints[playersArr[0].trim()] += 1;
      this.playerPoints[playersArr[1].trim()] += 1;
    }
    else {
      let players = tnmt.team2;
      let playersArr = players.split("&");
      this.playerPoints[playersArr[0].trim()] += 1;
      this.playerPoints[playersArr[1].trim()] += 1;
    }
    let pointsArr = [];
    let keys = Object.keys(this.playerPoints)
    for (let i = 0; i < keys.length; i++) {
      pointsArr.push(this.playerPoints[keys[i]]);
    }
    pointsArr.sort((a, b) => { return b - a });
    console.log(this.playerNames);
    this.playerNames = [];
    for(let j=0;j<pointsArr.length;j++){
      for(let k=0;k<keys.length;k++) {
        if(pointsArr[j] == this.playerPoints[keys[k]] && !this.playerNames.includes(keys[k])){
          this.playerNames.push(keys[k]);
        }
      }
    }
    console.log(this.playerNames);

  }

}
