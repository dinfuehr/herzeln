var gameApp = angular.module( 'herzeln', [] );

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

function PlayerCtrl( $scope ) {
  $scope.players = [];

  $scope.addPlayer = function( name ) {
    $scope.players.push( $scope.name );
    $scope.name = "";
  }
}

function GameCtrl( $scope ) {

}

gameApp.controller( 'PlayerCtrl', PlayerCtrl );
gameApp.controller( 'GameCtrl', GameCtrl );
