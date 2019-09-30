/*global firebase:true*/
/*global angular:true*/
/*global localStorage:true*/

var config = {
	apiKey: "AIzaSyCuTA2vlq5tYnXZDp3xzFU2RJnB82UAMP8",
	authDomain: "justiceforall-20ea4.firebaseapp.com",
	databaseURL: "https://justiceforall-20ea4.firebaseio.com",
	projectId: "justiceforall-20ea4",
	storageBucket: "justiceforall-20ea4.appspot.com",
	messagingSenderId: "198207540663",
	appId: "1:198207540663:web:dbd608a5566cb231"
  };
  firebase.initializeApp(config);

const mainRef = firebase.database().ref();//eslint-disable-line no-unused-vars
const headerTemplate = "app/modules/home/views/header.html";//eslint-disable-line no-unused-vars
(function() {
	"use strict";
	var metasVoiceRun = function($rootScope, $state, $firebaseAuth) {
		const listenRootScope = $rootScope.$on("$stateChangeStart", function(event, toState) {//eslint-disable-line no-unused-vars
			if (localStorage.authState == "1") {
				$firebaseAuth().$requireSignIn()
					.then(() => {
						if(toState.rolesAccepted.length > 0 && toState.rolesAccepted.indexOf(localStorage.roleUser) == -1){
							$state.go("login", {}, {location: "replace"});
							event.preventDefault();
						}
					})
					.catch(() => {
						$state.go("login", {}, {
							location: "replace"
						});
						event.preventDefault();
					});
			} else if (toState.requireAuth && !localStorage.authState) {
				$state.go("login", {}, {
					location: "replace"
				});
				event.preventDefault();
			}
		});
		/*eslint-enable no-unused-vars*/
	};
	metasVoiceRun.$inject = ["$rootScope", "$state", "$firebaseAuth"];
	angular
		.module("metasVoice", ["ui.router","ui.router.state.events",
			"firebase",
			"ui.bootstrap",
			"blockUI",
			"common",
			"home",
			"publisher",
			"user"
		])
		.run(metasVoiceRun);
})();
