var app = angular.module('appModule', ['angularMoment']);

app.constant("moment", moment);

app.directive('oneTimeOnly', function () {
    return {
        restrict: 'E',
        templateUrl: "app/view/OneTimeOnly.html"
    };
});

app.directive('dailySchedule', function () {
    return {
        restrict: 'E',
        templateUrl: "app/view/DailySchedule.html"
    };
});

app.directive('weeklySchedule', function () {
    return {
        restrict: 'E',
        templateUrl: "app/view/WeeklySchedule.html"
    };
});

app.directive('monthlySchedule', function () {
    return {
        restrict: 'E',
        templateUrl: "app/view/MonthlySchedule.html"
    };
});

app.directive('monthlyRelativeSchedule', function () {
    return {
        restrict: 'E',
        templateUrl: "app/view/MonthlyRelativeSchedule.html"
    };
});

app.directive('yearlySchedule', function () {
    return {
        restrict: 'E',
        templateUrl: "app/view/YearlySchedule.html"
    };
});

app.directive('yearLongSchedule', function () {
    return {
        restrict: 'E',
        templateUrl: "app/view/YearLongSchedule.html"
    };
});

app.directive('frequencySchedule', function () {
    return {
        restrict: 'E',
        templateUrl: "app/view/FrequencySchedule.html"
    };
});

// Converts value parameter from yyyyMMdd into yyyy/MM/dd format and vice versa
app.directive('dateConverter', function($filter) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attr, ngModel) {
			if (!ngModel) return; // do nothing if no ng-model
			
            function fromUser(text) {
				var value = $filter('date')(text, "yyyyMMdd");	                
				return value;
            }

            function toUser(text) {				
				var value = new Date();
				if(text != undefined && text!='' && text.length==8){
					var year        = text.substring(0,4);
					var month       = text.substring(4,6);
					var day         = text.substring(6,8);				
					var value        = new Date(year, month-1, day);
				}
                return value;				
            }
			
            ngModel.$parsers.push(fromUser);
            ngModel.$formatters.push(toUser);
        }
    };
});

// Converts value parameter from hhmmss into hh:/mm/ss format and vice versa
app.directive('timeConverter', function($filter) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attr, ngModel) {
			if (!ngModel) return; // do nothing if no ng-model
			
            function fromUser(text) {
				var value = $filter('date')(text, "hh:mm:ss");	
				return value;
            }

            function toUser(text) {				
				var value = new Date();
				
				if(text != undefined && text!='' && text.length==6){
					var hour        = text.substring(0,2);
					var minute       = text.substring(2,4);
					var second         = text.substring(4,6);				
					var value        = new Date(value.getYear(), value.getMonth()-1, value.getDate(), hour, minute, second);
				}
                return value;				
            }
			
            ngModel.$parsers.push(fromUser);
            ngModel.$formatters.push(toUser);
        }
    };
});

