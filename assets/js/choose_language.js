angular
    .module('MyApp', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache'])
    .controller('SelectOptGroupController', function($scope) {
      $scope.languages = [
          "English",
          "Afrikaans",
          "Albanian",
          "Amharic",
          "Arabic",
          "Armenian",

      ];
    });
    function contactsChipController ($scope) {
            var self = this;
            self.querySearch = querySearch;
            self.allContacts = loadContacts();
            self.contacts = [self.allContacts[0]];
            self.filterSelected = true;

            function querySearch (query) {
               var results = query ?
               self.allContacts.filter(createFilterFor(query)) : [];
               return results;
            }

            function createFilterFor(query) {
               var lowercaseQuery = angular.lowercase(query);
               return function filterFn(contact) {
                  return (contact._lowername.indexOf(lowercaseQuery) != -1);;
               };
            }

            function loadContacts() {
               var contacts = [
                  'Roberto Karlos',
                  'Bob Crestor',
                  'Nigel Rick',
                  'Narayana Garner',
                  'Anita Gros',
                  'Megan Smith',
                  'Tsvetko Metzger',
                  'Hector Simek',
                  'James Roody'
               ];

               return contacts.map(function (c, index) {
                  var cParts = c.split(' ');
                  var contact = {
                     name: c,
                     email: cParts[0][0].toLowerCase() + '.' + cParts[1].toLowerCase()
                        + '@example.com',
                     image: 'http://lorempixel.com/50/50/people?' + index
                  };
                  contact._lowername = contact.name.toLowerCase();
                  return contact;
               });
            }
         }                 


/**
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that can be foundin the LICENSE file at http://material.angularjs.org/HEAD/license.
**/
