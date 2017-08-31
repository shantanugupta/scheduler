'use strict';
app.controller('scheduleController', ['$scope', '$filter', 'moment', function scheduleController($scope, $filter, moment) {
	var timeFormat = "hh:mm A";
	var dateFormat = "YYYY/MM/DD";
	var dateTimeFormat = dateFormat + ' ' + timeFormat;
	
	$scope.date = new moment();	 
	 
    $scope.scheduler = {
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
		
	$scope.getGetOrdinal = function (n) {
		if (n == undefined) {
			return "Nth"
		}
		var s = ["th", "st", "nd", "rd"],
		v = n % 100;
		return n + (s[(v - 20) % 10] || s[v] || s[0]);
	}

	//default schedule for one time event only
	$scope.schedule = {
		name: 'Default schedule name',
		description: 'Description goes here',
		freq_type: 1, //onetime, daily, weekly, monthly, monthly relative
		freq_interval: 0,
		freq_relative_interval: 0,
		freq_recurrence_factor: 0,
		active_start_date: moment().startOf('day').toDate(),
		active_end_date: moment().startOf('day').toDate(),
		active_start_time: moment().startOf('hour').toDate(),
		active_end_time: moment().startOf('hour').toDate(),
		freq_subday_type: 0,
		freq_subday_interval: 0,
		duration_subday_type: 1, //duration in (hour, min, sec)
		duration_interval: 0 //duration value
	 };

	//raise an event whenever any property in schedule object is changed
	$scope.$watch('schedule', function (newForm, oldForm) {
		$scope.schedule.description = generateScheduleDescription();		
	}, true); //deep watch

	//raise an event whenever occuranceChoice property is changed			 
	$scope.$watch('occuranceChoice', function (newValue, oldValue) {
		$scope.schedule.description = generateScheduleDescription();
	}); //shhallow watch

	//raise an event whenever freq_type property is changed			 
	$scope.$watch('schedule.freq_type', function (newValue, oldValue) {
		var sc = $scope.schedule;
		$scope.events = '';

		switch (newValue) {
		case 1: //FreqType.OneTimeOnly:
			sc.freq_interval = 0;
			sc.freq_subday_type = 0;
			sc.freq_subday_interval = 0;
			sc.freq_relative_interval = 0;
			sc.freq_recurrence_factor = 0;

			sc.active_start_date = moment().startOf('day').toDate();
			sc.active_start_time = moment().startOf('hour').toDate();

			sc.active_end_date = moment().startOf('day').toDate();
			sc.active_end_time = moment().startOf('hour').toDate();

			break;
		case 4: //FreqType.Daily:
			sc.freq_interval = 1;
			sc.freq_relative_interval = 0;
			sc.freq_recurrence_factor = 0;
			break;
		case 8: //FreqType.Weekly:
			sc.freq_interval = 0;
			sc.freq_relative_interval = 0;
			sc.freq_recurrence_factor = 1;
			break;
		case 16: //FreqType.Monthly:
			sc.freq_relative_interval = 0;
			sc.freq_interval = 1;
			sc.freq_recurrence_factor = 1;
			break;
		case 32: //FreqType.MonthlyRelativeToFreqInterval:
			sc.freq_relative_interval = 1; //FreqRelativeInterval.First;
			sc.freq_interval = 8; //FreqIntervalMonthlyRelative.Day;
			sc.freq_recurrence_factor = 1;
			break;
		default:
			break;
		}

		sc.duration_interval = 1;
		sc.duration_subday_type = 2; //FreqSubdayType.Hours;
	}); //shhallow watch
				 
	//raise an event whenever freq_subday_type property is changed			 
	$scope.$watch('schedule.freq_subday_type', function (newValue, oldValue) {
		var sc = $scope.schedule;
		if (sc.freq_subday_type == 1) //(int)FreqSubdayType.AtTheSpecifiedTime)
		{
			sc.active_end_time = new Date();
			sc.freq_subday_interval = 0;
		}
	}); //shhallow watch
				 
	//identify the checkbox that has been checked based on index and calculate freq_interval			 
	$scope.checkboxChanged = function toggleSelection(e, c) {
		if ($scope.weeks[c] == undefined || $scope.weeks[c] == false) {
			$scope.weeks[c] = true;
			$scope.schedule.freq_interval += e;
		} else if ($scope.weeks[c] == true) {
			$scope.weeks[c] = false;
			$scope.schedule.freq_interval -= e;
		}
	}

//evaluates description property of scheduler everything any UI property is changed
	function generateScheduleDescription() {		
		var desc = "Occurs";
		var sch = $scope.schedule;

		var f = sch.freq_type;
		switch (f) {
		case 1: //FreqType.OneTimeOnly:
			desc = desc + " on " + sch.active_start_date.toLocaleDateString() + " at "
				 + moment(sch.active_start_time).format(timeFormat);
			break;
		case 4: //FreqType.Daily:
			desc = desc + " every " + sch.freq_interval + " day(s)";
			break;
		case 8: //FreqType.Weekly:
			desc += " every " + sch.freq_recurrence_factor + " week(s) ";
			var selectedWeekdays = '';
			//generate weekday list from freq_interval i.e. 3 = {Monday, Tuesday}, 7 = {Monday, Tuesday, Wednesday}
			var loop = 1;
			while (loop <= 7) {
				var power = Math.pow(2, loop - 1);
				if ((sch.freq_interval & power) == power) {
					var val = $scope.scheduler.freqIntervalWeekly.filter(function (f) {
							if (f.key == power)
								return f;
						})[0].value;
					selectedWeekdays += val + ", ";
				}

				loop++;
			}
			desc += "on " + selectedWeekdays;
			if (desc.endsWith(", ") == true) {
				desc = desc.substr(0, desc.length - 2);
			}
			break;
		case 16: //FreqType.Monthly:
			desc += " every " + sch.freq_recurrence_factor + " month(s) on day " + sch.freq_interval + " of that month";
			break;
		case 32: //FreqType.MonthlyRelativeToFreqInterval:
			desc += " every " + sch.freq_recurrence_factor + " month(s) on the ";

			//var fri = sch.freq_relative_interval;
			var freq_rel_intv ='';
			if(sch.freq_relative_interval!=undefined && sch.freq_relative_interval > 0){
				var x = $scope.scheduler.freqRelativeInterval.filter(function (f) {
							if (f.key == sch.freq_relative_interval)
								return f;
						});
				freq_rel_intv = x != undefined && x.length >0 ? x[0].value.toLowerCase() : '';
			}
			
			var freq_intv_str ='';
			if(sch.freq_interval!=undefined && sch.freq_interval > 0){
				var y = $scope.scheduler.freqIntervalMonthlyRelative.filter(function (f) {
								if (f.key == sch.freq_interval)
									return f;
							});
							
				freq_intv_str = y != undefined && y.length >0 ? y[0].value.toLowerCase() : '';
			}
			
			desc += freq_rel_intv + " " + freq_intv_str + " of that month";
			break;
		} //END SWITCH FreqType variations

		var s = sch.freq_subday_type;
		var freq_subday_type_str ='';
		if(sch.freq_subday_interval!=undefined && sch.freq_subday_interval >0 ){
			var z = $scope.scheduler.freqSubdayType.filter(function (f) {
							if (f.key == s)
								return f;
						});
						
			freq_subday_type_str = " every " + sch.freq_subday_interval + " " + (z != undefined && z.length >0 ? z[0].value.toLowerCase() : '');
		}		
		desc = desc + freq_subday_type_str;

		if ($scope.occuranceChoice == true) {
			desc += " once at " + moment(sch.active_start_time).format(timeFormat);			
		}

		if ($scope.occuranceChoice == false && (s == 2 || s == 4 || s == 8)) //if (s == FreqSubdayType.Hours || s == FreqSubdayType.Minutes || s == FreqSubdayType.Seconds)
			desc += " between " + moment(sch.active_start_time).format(timeFormat)
			 + " and " + moment(sch.active_end_time).format(timeFormat);

		var d = sch.duration_subday_type;
		if (d == 2 || d == 4 || d == 8) {  //d == FreqSubdayType.Hours || d == FreqSubdayType.Minutes || d == FreqSubdayType.Seconds
			var freqSubdayType = $scope.scheduler.freqSubdayType.filter(function (f) {
					if (f.key == d)
						return f;
				})[0].value;
			desc = desc + " for " + sch.duration_interval + " " + freqSubdayType;
		}

		if (f != 1) //FreqType.OneTimeOnly)
		{
			desc += ". Schedule will be used";
			if (sch.active_end_date == undefined || sch.active_end_date == 0) { //if (sch.active_end_date == Convert.ToInt32(Common.ConvertDateToInt(DateTime.MaxValue)) || active_end_date == 0)
				desc += " starting on " + sch.active_start_date.toLocaleDateString() + " with no end date";
			} else {
				desc += " between " + sch.active_start_date.toLocaleDateString()
				 + " and " + sch.active_end_date.toLocaleDateString();
			}
		}

		desc += ".";
		return desc;
	}; //end generateScheduleDescription

	$scope.generateEventsClick = function(){
		$scope.events  = generateEvents();
		/*var s='';
		var i=0;
		for(i=0;i<e.length;i++){
			s+='\nstart: ' + e[i].start.toISOString() + ', end: ' + e[i].end.toISOString();			
		}
		$scope.events = e;
		*/
	}
	
	 function generateEvents(){
	
		var events=[];
		var sch = $scope.schedule;

		var isValid = isScheduleValid(sch);
		
		var f = sch.freq_type;
		switch (f) {
		case 1: //FreqType.OneTimeOnly:
			
			var startDate = moment(moment(sch.active_start_date).format(dateFormat) 
									+ ' ' + moment(sch.active_start_time).format(timeFormat)
									, dateTimeFormat).toDate();
			var endDate = moment(moment(sch.active_end_date).format(dateFormat) 
									+ ' ' + moment(sch.active_end_time).format(timeFormat)
									, dateTimeFormat).toDate();
						
			if(sch.duration_interval > 0){
				if(sch.duration_subday_type == 2){
					endDate = moment(startDate).add(sch.duration_interval, 'hours');
				}
				else if(sch.duration_subday_type == 4){
					endDate = moment(startDate).add(sch.duration_interval, 'minutes');
				}
				else if(sch.duration_subday_type == 8){
					endDate = moment(startDate).add(sch.duration_interval, 'seconds');
				}
			}
			events.push({start:startDate, end:endDate});
			
			break;
		case 4: //FreqType.Daily:
		
			var nextDate = sch.active_start_date;
			var recurEveryNDays = sch.freq_interval;
			while(moment(nextDate).isAfter(sch.active_end_date) == false){
				
				var datePart = moment(nextDate).add(recurEveryNDays, 'days').format(dateFormat);
				var timePart = moment(sch.active_start_time).format(timeFormat);
				
				if ($scope.occuranceChoice == true) {
					nextDate =  moment(datePart + " " + timePart).toDate();
				}
				else if ($scope.occuranceChoice == false && (s == 2 || s == 4 || s == 8)){
					break;
				}
				else{
					break;
				}
			
				if(sch.duration_interval > 0){
					if(sch.duration_subday_type == 2){
						endDate = moment(nextDate).add(sch.duration_interval, 'hours');
					}
					else if(sch.duration_subday_type == 4){
						endDate = moment(nextDate).add(sch.duration_interval, 'minutes');
					}
					else if(sch.duration_subday_type == 8){
						endDate = moment(nextDate).add(sch.duration_interval, 'seconds');
					}
				}
			
				events.push({start:nextDate, end:endDate});
			}
			
			break;
		case 8: //FreqType.Weekly:
						
			break;
		case 16: //FreqType.Monthly:
			
			break;
		case 32: //FreqType.MonthlyRelativeToFreqInterval:
			
			break;
		} //END SWITCH FreqType variations

		
		return events;
	}
	
	function isScheduleValid(s){
		//validate schedule here
		return true;
	}
	
	$scope.init=function(){
		$scope.freq_type = 4;
		$scope.weeks = new Array(7);			
	}
	
	$scope.init();
}]);