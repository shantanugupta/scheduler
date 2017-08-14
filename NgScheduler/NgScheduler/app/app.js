var app = angular.module('appModule', []);

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
