;(function(angular, debug, localStorage) {
  'use strict';
  var log;

  if (!angular)
    throw new Error('Angular.js is required');
  if (debug)
    log = debug('tuchong-daily:Controller:Collection');

  angular
    .module('tuchong-daily')
    .controller('collection', [
      '$scope',
      'Store',
      'UI',
      '$ionicSlideBoxDelegate',
      '$stateParams',
      '$state',
      'imageLoader',
      '$ionicSideMenuDelegate',
      'share',
      collection
    ])
    .controller('collection-single', [
      '$scope',
      '$stateParams',
      '$state',
      single
    ])

  function collection(scope, Store, UI, $ionicSlideBoxDelegate, $stateParams, $state, imageLoader, $ionicSideMenuDelegate, share) {
    scope.toggle = toggle;
    scope.share = share.popup;
    scope.viewLarge = viewLarge;
    scope.updateSlides = updateSlides;
    scope.backgrounds = imageLoader.loadCache($stateParams.id);

    var collection = Store.findById($stateParams.id);

    if (!collection) {
      Store.post.get({
        postId: $stateParams.id
      }, function(result){
        if (log) log(result);
        collection = result;
        setup(result);
      }, function(err) {
        if (log) log(err);
        $state.go('home');
      });
      return;
    }

    setup(collection);

    function setup(collection) {
      scope.collection = collection;
      scope.post = collection.post;

      // if (collection.images && collection.images.length > 3)
      //   scope.images = [collection.images[0], collection.images[1], collection.images[2]];
      // else
      scope.images = collection.images;

      imageLoader.load(1, scope, 'collection', $stateParams.id);
      $ionicSlideBoxDelegate.update();
    }

    function updateSlides(index) {
      if (log) log('Switching to slide index: [%s]', index);

      imageLoader.load(index + 1, scope, 'collection', $stateParams.id);
      localStorage.lastSlideIndexCollection = index;

      // if (!scope.images[index + 2] && collection.images[index + 2])
      //   scope.images.push(collection.images[index + 2]);

      $ionicSlideBoxDelegate.update();
    }

    function toggle(side) {
      var method = side === 'right' ? 
        'toggleRight': 'toggleLeft';
      $ionicSideMenuDelegate[method]();
    }

    function viewLarge() {
      var index = localStorage.lastSlideIndexCollection ?
        parseInt(localStorage.lastSlideIndexCollection) : 0;
      // Find the image uri and go to single page
      $state.go('collection-single', {
        uri: scope.images[index].uri
      });
    }
  }

  function single(scope, $stateParams, $state) {
    if (!$stateParams.uri)
      return $state.go('home');

    scope.uri = $stateParams.uri;
  }

})(window.angular, window.debug, window.localStorage);
