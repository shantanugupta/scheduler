'use strict';
app.controller('scheduleController', ['$scope', '$filter', function scheduleController($scope, $filter) {
	$scope.description = 'Description goes here';
	$scope.name = 'Default schedule name'; //schedule name
	$scope.freq_type = 4;
	
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

	$scope.freqSubdayTypeMinMax = {
		'1': { min: 1, max: 100 },
		'2': { min: 1, max: 24 },
		'4': { min: 1, max: 60 },
		'8': { min: 1, max: 60 },
	};		
	
	$scope.getGetOrdinal =  function(n) {
		if(n==undefined){
			return "Nth"			
		}
    var s=["th","st","nd","rd"],
    v=n%100;
    return n+(s[(v-20)%10]||s[v]||s[0]);
 }

 //$scope.active_start_date = "20170818"; //Note that 'Z' means UTC 0
 //$scope.active_start_time = "210900"; //Note that 'Z' means UTC 0
 //$scope.active_end_time = "235900"; //Note that 'Z' means UTC 0
 
// $scope.results = $filter('date')($scope.active_start_date, "yyyyMMdd");
	
 $scope.schedule = {
		name : 'Default schedule name'
		, description : 'Description goes here'
		, freq_type : 1 //onetime, daily, weekly, monthly, monthly relative
				
		, freq_interval : 0 
		, freq_relative_interval : 0
		, freq_recurrence_factor : 0
		
		, active_start_date : 20170818
		, active_end_date : 99991231
		, active_start_time : 210900
		, active_end_time : 235959		
		
		, freq_subday_type : 0
		, freq_subday_interval : 0
		
		, duration_subday_type : 1 //duration in (hour, min, sec)		
		, duration_interval : 0 //duration value
};

$scope.$watch('schedule',function(newForm, oldForm) {
				console.log(newForm.name);				
             }, true	);
			 
function GenerateScheduleDescription()
        {
            var desc = "Occurs";            
            
            switch ($scope.freq_type)
            {
                case 1://FreqType.OneTimeOnly:
                    desc = desc + " on " + $scope.active_start_date.getDate() + " at " 
                        + $scope.active_start_time.getTime();
                    break;
                case 4://FreqType.Daily:
                    desc = desc + " every " + $scope.freq_interval + " day(s)";
                    break;
                case 8://FreqType.Weekly:
                    desc += " every " + $scope.freq_recurrence_factor + " week(s) ";
                    var selectedWeekdays = '';
                    var loop = 1;
                    while (loop <= 7)
                    {
                        int power = (int)System.Math.Pow(2, loop - 1);
                        if (($scope.freq_interval & power) == power)
                        {
                            selectedWeekdays += DateTime.Parse("1996/12/0" + loop.ToString()).DayOfWeek.ToString() + ", ";
                        }
                        
                        loop++;
                    }
                    desc += "on " + selectedWeekdays;
                    if (desc.EndsWith(", ") == true)
                    {
                        desc = desc.Substring(0, desc.Length - 2);
                    }
                    break;
                case 16://FreqType.Monthly:
                    desc += " every " + $scope.freq_recurrence_factor + " month(s) on day " + $scope.freq_interval + " of that month";
                    break;
                case 32://FreqType.MonthlyRelativeToFreqInterval:
                    desc += " every " + $scope.freq_recurrence_factor + " month(s) on the ";

                    var freq_rel_intv = '';
                    var fri = $scope.freq_relative_interval;
                    switch (fri)
                    {
                        case 1://FreqRelativeInterval.First:
                            $scope.freq_rel_intv += "first";
                            break;
                        case 2://FreqRelativeInterval.Second:
                            $scope.freq_rel_intv += "second";
                            break;
                        case 4://FreqRelativeInterval.Third:
                            $scope.freq_rel_intv += "third";
                            break;
                        case 8://FreqRelativeInterval.Fourth:
                            $scope.freq_rel_intv += "fourth";
                            break;
                        case 16://FreqRelativeInterval.Last:
                            $scope.freq_rel_intv += "last";
                            break;
                    }

                    var freq_intv_str = string.Empty;
                    var fimr = (FreqIntervalMonthlyRelative)$scope.freq_interval;

					if (fimr >= 7 && fimr < 8)
                    //if (fimr >= FreqIntervalMonthlyRelative.Sunday && fimr < FreqIntervalMonthlyRelative.Day)
                    {
                        $scope.freq_intv_str = DateTime.Parse("1996/12/0" + $scope.freq_interval).DayOfWeek.ToString();
                    }
                    else if (fimr == 8)//FreqIntervalMonthlyRelative.Day)
                    {
                        $scope.freq_intv_str = "day";
                    }
                    else if (fimr == 9)//FreqIntervalMonthlyRelative.Weekday)
                    {
                        $scope.freq_intv_str = "week day";
                    }
                    else if (fimr == 10)//FreqIntervalMonthlyRelative.WeekendDay)
                    {
                        $scope.freq_intv_str = "weekend day";
                    }
                    desc += $scope.freq_rel_intv + " " + $scope.freq_intv_str + " of that month";
                    break;
            }//END SWITCH FreqType variations

            var freq_subday_type_str = '';
            var s = $scope.freq_subday_type;
            switch (s)
            {
                case 1://FreqSubdayType.AtTheSpecifiedTime:
                    $scope.freq_subday_type_str = " at " +$scope.active_start_time.getTime();
                    break;
                case 2://FreqSubdayType.Seconds:
                    $scope.freq_subday_type_str = " every " + $scope.freq_subday_interval + " second(s)";
                    break;
                case 4://FreqSubdayType.Minutes:
                    $scope.freq_subday_type_str = " every " + $scope.freq_subday_interval + " minute(s)";
                    break;
                case 8://FreqSubdayType.Hours:
                    $scope.freq_subday_type_str = " every " + $scope.freq_subday_interval + " hour(s)";
                    break;
            }

            desc = desc + $scope.freq_subday_type_str;
            if (s == 8 || s == 4 || s == 2)//if (s == FreqSubdayType.Hours || s == FreqSubdayType.Minutes || s == FreqSubdayType.Seconds)
                desc = desc + " between " + $scope.active_start_time.getTime()
                    + " and " + $scope.active_end_time.getTime();

            var d = $scope.duration_subday_type;            
			if (d == 8 || d == 4 || d == 2)//if (d == FreqSubdayType.Hours || d == FreqSubdayType.Minutes || d == FreqSubdayType.Seconds)
                desc = desc + " for " + $scope.duration_interval + " " + d;

            if (f != 1)//FreqType.OneTimeOnly)
            {
                desc += ". Schedule will be used";
                if ($scope.active_end_date ==null || $scope.active_end_date == 0)//if ($scope.active_end_date == Convert.ToInt32(Common.ConvertDateToInt(DateTime.MaxValue)) || active_end_date == 0)				
                {
                    desc += " starting on " + $scope.active_start_date.getDate() + " with no end date";
                }
                else
                {
                    desc += " between " + $scope.active_start_date.getDate()
                        + " and " + $scope.active_end_date.getDate();
                }
            }

            desc += ".";
            return desc;
        }			 
}]);