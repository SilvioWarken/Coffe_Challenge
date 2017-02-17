angular.module('coffeChallenge', ['LocalStorageModule'])
.config(function (localStorageServiceProvider) {
	localStorageServiceProvider
	.setPrefix('coffeChallenge')
	.setNotify(true, true)
 });
