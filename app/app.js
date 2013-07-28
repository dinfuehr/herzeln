var gameApp = angular.module( 'herzeln', [] );

gameApp.factory( 'playerService', function( ) {
  var service = {};
  var players = [];

  if( window.localStorage ) {
    var tmp;

    try {
      tmp = JSON.parse( window.localStorage.players );
    } catch( e ) {
      tmp = null;
    }

    if( angular.isArray( tmp ) ) {
      players = tmp;
      console.log( players );
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
      return true;
    }
  }

  service.removePlayer = function( name ) {
    var ind = players.indexOf( name );

    if( ind >= 0 ) {
      players.splice( ind, 1 );
    }
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
    console.log( "delete name = " + name );
  }
}

function GameCtrl( $scope, playerService ) {
  $scope.games = [];
  $scope.players = playerService.getPlayers( );

  $scope.addGame = function( ) {
    $scope.games.push( "hello" );
  }
}

gameApp.controller( 'PlayerCtrl', PlayerCtrl );
gameApp.controller( 'GameCtrl', GameCtrl );
