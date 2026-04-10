const app = angular.module('walletApp', ['ngRoute']);

// Config Routing
app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: 'login.html',
            controller: 'LoginController'
        })
        .when('/register', {
            templateUrl: 'register.html',
            controller: 'RegisterController'
        })
        .when('/dashboard', {
            templateUrl: 'dashboard.html',
            controller: 'DashboardController'
        })
        .when('/send', {
            templateUrl: 'send.html',
            controller: 'SendController'
        })
        .when('/transactions', {
            templateUrl: 'transactions.html',
            controller: 'TransactionController'
        })
        .otherwise({
            redirectTo: '/login'
        });
}]);

// Main Controller for global variables like logged-in user
app.run(['$rootScope', '$location', function($rootScope, $location) {
    $rootScope.currentUser = JSON.parse(localStorage.getItem('user'));

    $rootScope.logout = function() {
        localStorage.removeItem('user');
        $rootScope.currentUser = null;
        $location.path('/login');
    };
}]);

// --- Controllers ---

// Login Controller
app.controller('LoginController', ['$scope', '$http', '$location', '$rootScope', function($scope, $http, $location, $rootScope) {
    $scope.user = {};
    $scope.errorMessage = '';

    $scope.login = function() {
        $http.post('http://localhost:5000/api/login', $scope.user)
            .then(function(response) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                $rootScope.currentUser = response.data.user;
                $location.path('/dashboard');
            }, function(error) {
                $scope.errorMessage = (error.data && error.data.message) || 'Login failed. Please check if the server is running.';
            });
    };
}]);

// Register Controller
app.controller('RegisterController', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.user = {};
    $scope.errorMessage = '';

    $scope.register = function() {
        $http.post('http://localhost:5000/api/register', $scope.user)
            .then(function(response) {
                alert('Registration successful! Please login.');
                $location.path('/login');
            }, function(error) {
                $scope.errorMessage = (error.data && error.data.message) || 'Registration failed. Please check if the server is running.';
            });
    };
}]);

// Dashboard Controller
app.controller('DashboardController', ['$scope', '$http', '$rootScope', '$location', function($scope, $http, $rootScope, $location) {
    if (!$rootScope.currentUser) return $location.path('/login');

    $scope.balance = 0;

    $scope.getBalance = function() {
        $http.get('http://localhost:5000/api/balance/' + $rootScope.currentUser.email)
            .then(function(response) {
                $scope.balance = response.data.balance;
            });
    };

    $scope.getBalance();
}]);

// Send Coins Controller
app.controller('SendController', ['$scope', '$http', '$rootScope', '$location', function($scope, $http, $rootScope, $location) {
    if (!$rootScope.currentUser) return $location.path('/login');

    $scope.transaction = {
        senderEmail: $rootScope.currentUser.email,
        receiverEmail: '',
        amount: 0
    };
    $scope.errorMessage = '';

    $scope.sendMoney = function() {
        $http.post('http://localhost:5000/api/sendMoney', $scope.transaction)
            .then(function(response) {
                alert('Coins sent successfully!');
                $location.path('/dashboard');
            }, function(error) {
                $scope.errorMessage = (error.data && error.data.message) || 'Transaction failed. Please check if the server is running.';
            });
    };
}]);

// Transaction History Controller
app.controller('TransactionController', ['$scope', '$http', '$rootScope', '$location', function($scope, $http, $rootScope, $location) {
    if (!$rootScope.currentUser) return $location.path('/login');

    $scope.transactions = [];

    $scope.getTransactions = function() {
        $http.get('http://localhost:5000/api/transactions/' + $rootScope.currentUser.email)
            .then(function(response) {
                $scope.transactions = response.data;
            });
    };

    $scope.getTransactions();
}]);
