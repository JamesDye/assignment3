(function() {
'use strict';

angular.module('NarrowItDownApp',[])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService',MenuSearchService)
.directive('foundItems', FoundItemsDirective)
.constant('ApiBasePath', "http://davids-restaurant.herokuapp.com");

function FoundItemsDirective() {
    var ddo = {
        templateUrl: 'foundItems.html',
        scope: {
            items: '<',
            onRemove: '&'
        },
        controller: NarrowItDownController,
        controllerAs: 'list',
        bindToController: true,
    };

    return ddo;
}
   NarrowItDownController.$inject = ['MenuSearchService'];
   function NarrowItDownController(MenuSearchService) {
       var menu = this;
       menu.hasError = false;
       menu.searchTerm = "";
       menu.getFound = function() {
           if (menu.searchTerm.trim().length !== 0) {
               menu.found = [];
               MenuSearchService
                   .getMatchedMenuItems(menu.searchTerm)
                   .then(function(data) {
                       menu.found = data;
                   });
           } else {
               menu.hasError = true;
           }
       };

       menu.removeItem = function(index) {
           menu.found.splice(index, 1);
       };
   }


   MenuSearchService.$inject = ['$http', 'ApiBasePath']
   function MenuSearchService($http, ApiBasePath) {
       var service = this;

       service.getMatchedMenuItems = function(searchTerm) {
           return $http({
               method: "GET",
               url: (ApiBasePath + "/menu_items.json")
           }).then(function(data) {
               var items = data.data.menu_items;
               var foundItems = [];
               for (let i = 0; i < items.length; i++) {
                   if (items[i].description.indexOf(searchTerm) !== -1) {
                       foundItems.push(items[i]);
                   }
               }
               return foundItems;
           });
       };
   }
})();
