var gameApp = angular.module( 'herzeln', [] );

gameApp.factory( 'playerService', function( ) {
  var service = {};
  var players = [];

  if( window.localStorage ) {
    var tmp = JSON.parse( window.localStorage.players );

    if( angular.isArray( tmp ) ) {
      players = tmp;
    }
  }

  function playersChanged( ) {
    window.localStorage.players = JSON.stringify( players );
  }

  service.getPlayers = function( ) {
    return players;
  }

  service.addPlayer = function( name ) {
    if( _.contains( players, name ) ) {
      return false;

    } else {
      players.push( name );
      playersChanged( );

      return true;
    }
  }

  service.removePlayer = function( name ) {
    var ind = players.indexOf( name );

    if( ind >= 0 ) {
      players.splice( ind, 1 );
    }

    playersChanged( );
  }

  return service;
} );

gameApp.config( function( $routeProvider ) {
  $routeProvider.when( '/', {
    templateUrl: 'app/player.html',
    controller: PlayerCtrl
  } );

  $routeProvider.when( '/game', {
    templateUrl: 'app/game.html',
    controller: GameCtrl
  } );

  $routeProvider.otherwise( { redirectTo: '/' } );
} );

function PlayerCtrl( $scope, playerService ) {
  $scope.players = playerService.getPlayers( );

  $scope.addPlayer = function( ) {
    if( playerService.addPlayer( $scope.name ) ) {
      $scope.name = "";
    } else {
      console.log( "error" );
    }
  }

  $scope.removePlayer = function( name ) {
    playerService.removePlayer( name );
  }
}

function cardsPerTypeFromPlayers( players ) {
  var cards = 8;

  var types = 4;
  var maxPerType = 13;

  var max = maxPerType * types; // 52 Karten hat ein Deck

  while( cards * players > max ) {
    cards--;
  }

  return cards;
}

function totalPoints( cardsPerType ) {
  return cardsPerType * 2 + // Stich + Herz
    8 + 8 + 8; // Buben + rote Damen + Herz Koenig
}

function Game( players ) {
  var rounds = [ 'stich', 'herz', 'buben', 'damen', 'koenig', 'anlegen' ];
  var _this = this;

  _.each( rounds, function( round ) {
    var points = {};

    _.each( players, function( player ) {
      points[ player ] = 0;
    } );

    _this[ round ] = points;
  } );
}

function GameCtrl( $scope, playerService ) {
  $scope.games = [];
  $scope.players = playerService.getPlayers( );
  $scope.cardsPerType = cardsPerTypeFromPlayers( $scope.players );
  $scope.totalCards = $scope.cardsPerType * 4;
  $scope.totalPoints = totalPoints( $scope.cardsPerType );

  $scope.rounds = [
    { round: 'stich', name: 'Stich' },
    { round: 'herz', name: 'Herz' },
    { round: 'buben', name: 'Buben' },
    { round: 'damen', name: 'Damen' },
    { round: 'koenig', name: 'Koenig' },
    { round: 'anlegen', name: 'Auslegen' }
  ];

  $scope.points = [ ];

  _.each( $scope.players, function( ) {
    $scope.points.push( { points: 0 } );
  } );

  $scope.addGame = function( ) {
    $scope.games.push( new Game( $scope.players ) );
  }

  $scope.restPoints = function( ) {
    var sum = 0;

    _.each( $scope.points, function( point ) {
      sum += point.points;
    } );

    return $scope.totalPoints - sum;
  }
}

gameApp.controller( 'PlayerCtrl', PlayerCtrl );
gameApp.controller( 'GameCtrl', GameCtrl );
