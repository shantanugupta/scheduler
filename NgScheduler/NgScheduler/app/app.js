var app = angular.module('appModule', ['angularMoment']);

app.constant("moment", moment);

app.directive('scheduler', function () {
    return {
        restrict: 'E',
        templateUrl: "app/view/scheduler.html",
		controller: "scheduleController"
    };
});

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

