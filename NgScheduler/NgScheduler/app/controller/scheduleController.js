'use strict';
app.controller('scheduleController', ['$scope', '$filter', function scheduleController($scope, $filter) {
	$scope.freq_type = 4;
	$scope.weeks = new Array(7);

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
	
 $scope.schedule = {
		name : 'Default schedule name'
		, description : 'Description goes here'
		, freq_type : 1 //onetime, daily, weekly, monthly, monthly relative
				
		, freq_interval : 0 
		, freq_relative_interval : 0
		, freq_recurrence_factor : 0
		
		, active_start_date : new Date()
		, active_end_date : new Date()
		, active_start_time : new Date()
		, active_end_time : new Date()
		
		, freq_subday_type : 0
		, freq_subday_interval : 0
		
		, duration_subday_type : 1 //duration in (hour, min, sec)		
		, duration_interval : 0 //duration value
};

//raise an event whenever any property in schedule object is changed
$scope.$watch('schedule',function(newForm, oldForm) {
				$scope.schedule.description = generateScheduleDescription();
             }, true);//deep watch

//raise an event whenever occuranceChoice property is changed			 
$scope.$watch('occuranceChoice',function(newForm, oldForm) {
				$scope.schedule.description = generateScheduleDescription();
             });//shhallow watch		 

//identify the checkbox that has been checked based on index and calculate freq_interval			 
$scope.checkboxChanged = function toggleSelection(e, c) {
	if($scope.weeks[c]==undefined || $scope.weeks[c] == false){
		$scope.weeks[c] = true;
		$scope.schedule.freq_interval += e;
	}
	else if($scope.weeks[c] == true){
		$scope.weeks[c] = false;
		$scope.schedule.freq_interval -= e;
	}
}

//evaluates description property of scheduler everything any UI property is changed
function generateScheduleDescription()
        {
            var desc = "Occurs";            
            var sch = $scope.schedule;
			
			var f = sch.freq_type;
            switch (f)
            {				
                case 1://FreqType.OneTimeOnly:
                    desc = desc + " on " + sch.active_start_date.toLocaleDateString() + " at " 
                        + sch.active_start_time.toLocaleTimeString();
                    break;
                case 4://FreqType.Daily:
                    desc = desc + " every " +sch.freq_interval + " day(s)";
                    break;
                case 8://FreqType.Weekly:
                    desc += " every " + sch.freq_recurrence_factor + " week(s) ";
                    var selectedWeekdays = '';
					//generate weekday list from freq_interval i.e. 3 = {Monday, Tuesday}, 7 = {Monday, Tuesday, Wednesday}
                    var loop = 1;
                    while (loop <= 7)
                    {
                        var power = Math.pow(2, loop - 1);
                        if ((sch.freq_interval & power) == power)
                        {
							var val = $scope.scheduler.freqIntervalWeekly.filter(function(f){if(f.key == power) return f;})[0].value;
                            selectedWeekdays += val + ", ";							
                        }
                        
                        loop++;
                    }
                    desc += "on " + selectedWeekdays;
                    if (desc.endsWith(", ") == true)
                    {
                        desc = desc.substr(0, desc.length - 2);
                    }
                    break;
                case 16://FreqType.Monthly:
                    desc += " every " + sch.freq_recurrence_factor + " month(s) on day " + sch.freq_interval + " of that month";
                    break;
                case 32://FreqType.MonthlyRelativeToFreqInterval:
                    desc += " every " + sch.freq_recurrence_factor + " month(s) on the ";

                    var freq_rel_intv = '';
                    var fri = sch.freq_relative_interval;
                    switch (fri)
                    {
                        case 1://FreqRelativeInterval.First:
                            sch.freq_rel_intv += "first";
                            break;
                        case 2://FreqRelativeInterval.Second:
                            sch.freq_rel_intv += "second";
                            break;
                        case 4://FreqRelativeInterval.Third:
                            sch.freq_rel_intv += "third";
                            break;
                        case 8://FreqRelativeInterval.Fourth:
                            sch.freq_rel_intv += "fourth";
                            break;
                        case 16://FreqRelativeInterval.Last:
                            sch.freq_rel_intv += "last";
                            break;
                    }

                    var freq_intv_str = '';
                    var fimr = sch.freq_interval;

					if (fimr >= 7 && fimr < 8)
                    //if (fimr >= FreqIntervalMonthlyRelative.Sunday && fimr < FreqIntervalMonthlyRelative.Day)
                    {
						sch.freq_intv_str = sch.freq_interval;
                        //$scope.freq_intv_str = DateTime.Parse("1996/12/0" + $scope.freq_interval).DayOfWeek.ToString();
                    }
                    else if (fimr == 8)//FreqIntervalMonthlyRelative.Day)
                    {
                        sch.freq_intv_str = "day";
                    }
                    else if (fimr == 9)//FreqIntervalMonthlyRelative.Weekday)
                    {
                        sch.freq_intv_str = "week day";
                    }
                    else if (fimr == 10)//FreqIntervalMonthlyRelative.WeekendDay)
                    {
                        sch.freq_intv_str = "weekend day";
                    }
                    desc += sch.freq_rel_intv + " " + sch.freq_intv_str + " of that month";
                    break;
            }//END SWITCH FreqType variations

            var freq_subday_type_str = '';
            var s = sch.freq_subday_type;
            switch (s)
            {
                case 1://FreqSubdayType.AtTheSpecifiedTime:
                    freq_subday_type_str = " at " +sch.active_start_time.toLocaleTimeString();
                    break;
                case 8://FreqSubdayType.Seconds:
                    freq_subday_type_str = " every " + sch.freq_subday_interval + " second(s)";
                    break;
                case 4://FreqSubdayType.Minutes:
                    freq_subday_type_str = " every " + sch.freq_subday_interval + " minute(s)";
                    break;
                case 2://FreqSubdayType.Hours:
                    freq_subday_type_str = " every " + sch.freq_subday_interval + " hour(s)";
                    break;
            }

            desc = desc + freq_subday_type_str;
			
			if($scope.occuranceChoice==true){
				desc += " once at " + sch.active_start_time.toLocaleTimeString();
			}
			
            if ($scope.occuranceChoice==false && (s == 8 || s == 4 || s == 2))//if (s == FreqSubdayType.Hours || s == FreqSubdayType.Minutes || s == FreqSubdayType.Seconds)
                desc +=  " between " + sch.active_start_time.toLocaleTimeString()
                    + " and " + sch.active_end_time.toLocaleTimeString();

            var d = sch.duration_subday_type;            
			if (d == 8 || d == 4 || d == 2){//if (d == FreqSubdayType.Hours || d == FreqSubdayType.Minutes || d == FreqSubdayType.Seconds)
				var freqSubdayType = $scope.scheduler.freqSubdayType.filter(function(f){if(f.key == d) return f;})[0].value;
				desc = desc + " for " + sch.duration_interval + " " + freqSubdayType;
			}
			
            if (f != 1)//FreqType.OneTimeOnly)
            {				
                desc += ". Schedule will be used";
                if (sch.active_end_date ==undefined || sch.active_end_date == 0){//if (sch.active_end_date == Convert.ToInt32(Common.ConvertDateToInt(DateTime.MaxValue)) || active_end_date == 0)				                
                    desc += " starting on " + sch.active_start_date.toLocaleDateString() + " with no end date";
                }
                else{
                    desc += " between " + sch.active_start_date.toLocaleDateString()
                        + " and " + sch.active_end_date.toLocaleDateString();
                }
            }

            desc += ".";
            return desc;
        };//end generateScheduleDescription
}]);