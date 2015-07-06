﻿'use strict';
app.controller('scheduleController', function scheduleController($scope) {
    $scope.scheduler =
        {
            freqType:
                [{ key: 1, value: 'One time' }
                , { key: 4, value: 'Daily' }
                , { key: 8, value: 'Weekly' }
                , { key: 16, value: 'Monthly' }
                , { key: 32, value: 'Monthly Relative' }
                , { key: 64, value: 'Yearly' }
                , { key: 128, value: 'Year long' }],

            freqIntervalWeekly:
                    [{ key: 1, value: 'Monday' }
                    , { key: 2, value: 'Tuesday' }
                    , { key: 4, value: 'Wednesday' }
                    , { key: 8, value: 'Thursday' }
                    , { key: 16, value: 'Friday' }
                    , { key: 32, value: 'Saturday' }
                    , { key: 64, value: 'Sunday' }],

            freqRelativeInterval:
                    [{ key: 0, value: 'Not applicable' }
                    , { key: 1, value: 'First' }
                    , { key: 2, value: 'Second' }
                    , { key: 4, value: 'Third' }
                    , { key: 8, value: 'Fourth' }
                    , { key: 16, value: 'Last' }],

            freqSubdayType:
                    [{ key: 1, value: 'At specified time' }
                    , { key: 2, value: 'Hour(s)' }
                    , { key: 4, value: 'Minute(s)' }
                    , { key: 8, value: 'Second(s)' }],

            freqIntervalMonthlyRelative:
                    [{ key: 1, value: 'Monday' }
                    , { key: 2, value: 'Tuesday' }
                    , { key: 3, value: 'Wednesday' }
                    , { key: 4, value: 'Thursday' }
                    , { key: 5, value: 'Friday' }
                    , { key: 6, value: 'Saturday' }
                    , { key: 7, value: 'Sunday' }
                    , { key: 8, value: 'Day' }
                    , { key: 9, value: 'Weekday' }
                    , { key: 10, value: 'Weekend day' }]
        };//eof scheduler

});