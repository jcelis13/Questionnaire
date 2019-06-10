!function() {

    const today = moment().tz("Asia/Manila");

  function Calendar(selector, events, url, openCurrent, dayNames) {

    this.el = document.querySelector(selector);
    if (events == null) {

    } else {
        this.events = events;
       // console.log(this.events);
    }
    this.url = url;
    if(dayNames != null){
      this.dayNames = dayNames;
    }else{
      this.dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    }

    if (openCurrent == null) {
        this.openCurrent = true;
    }

    this.current = moment().tz("Asia/Manila").date(1);
    this.draw();
    var current = document.querySelector('.today');
    if(current) {
        var self = this
        if (this.openCurrent) {
            window.setTimeout(function () {

                self.openDay(current);
                // console.log("calendarr");
            }, 500);
        }
      
    }
  }

  Calendar.prototype.draw = function() {
    //Create Header
    this.drawHeader();

    //Draw Month
    this.drawMonth();

    //this.drawLegend();
  }

  Calendar.prototype.drawHeader = function() {
    var self = this;
    if(!this.header) {
      //Create the header elements
      this.header = createElement('div', 'header');
      this.header.className = 'header';

      this.title = createElement('h1');

      var right = createElement('div', 'right');
      right.innerHTML = "<i class='fa fa-angle-right'> </i>";
      right.addEventListener('click', function() { self.nextMonth(); });

      var left = createElement('div', 'left');
      left.innerHTML = "<i class='fa fa-angle-left'> </i>";
      left.addEventListener('click', function() { self.prevMonth(); });

      var header_week = createElement('div', 'header_week');
         this.dayNames.forEach(function (dname) {
             var day_name = "<div class='day'>" + dname + "</div>";
             header_week.innerHTML += day_name;
         });
     
      
      //Append the Elements
      this.header.appendChild(this.title); 
      this.header.appendChild(right);
      this.header.appendChild(left);
      this.header.appendChild(header_week);
      this.el.appendChild(this.header);
    }

    this.title.innerHTML = this.current.format('MMMM YYYY');

  }

  Calendar.prototype.drawMonth = function() {
    var self = this;
    
    if(this.events != null){
      this.events.forEach(function (ev) {
        //ev.date = self.current.clone().date(Math.random() * (29 - 1) + 1);
          ev.date_ev = moment(new Date(ev.start)).tz("Asia/Manila");
       // console.log(ev);

      }); 
    }
    
    if(this.month) {
      this.oldMonth = this.month;
      this.oldMonth.className = 'month out ' + (self.next ? 'next' : 'prev');
      this.oldMonth.addEventListener('webkitAnimationEnd', function() {
        self.oldMonth.parentNode.removeChild(self.oldMonth);
        self.month = createElement('div', 'month');
        self.backFill();
        self.currentMonth();
        self.fowardFill();
        self.el.appendChild(self.month);
        window.setTimeout(function() {
          self.month.className = 'month in ' + (self.next ? 'next' : 'prev');
        }, 16);
      });
    } else {
        this.month = createElement('div', 'month');
        this.el.appendChild(this.month);
        this.backFill();
        this.currentMonth();
        this.fowardFill();
        this.month.className = 'month new';
    }
  }

  Calendar.prototype.backFill = function() {
    var clone = this.current.tz("Asia/Manila").clone();
    var dayOfWeek = clone.day();

    if(!dayOfWeek) { return; }

    clone.subtract(dayOfWeek + 1, 'days');

    for(var i = dayOfWeek; i > 0 ; i--) {
      this.drawDay(clone.add(1, 'days'));
    }
  }

  Calendar.prototype.fowardFill = function() {
    var clone = this.current.clone().tz("Asia/Manila").add(1, 'months').subtract(1, 'days');
    var dayOfWeek = clone.day();

    if(dayOfWeek === 6) { return; }

    for(var i = dayOfWeek; i < 6 ; i++) {
      this.drawDay(clone.add(1, 'days'));
    }
  }

  Calendar.prototype.currentMonth = function() {
    var clone = this.current.tz("Asia/Manila").clone();

    while (clone.month() === this.current.month()) {
      this.drawDay(clone);
      clone.add(1, 'days');
    }
    
  }

  Calendar.prototype.getWeek = function(day) {
    if(!this.week || day.day() === 0) {
      this.week = createElement('div', 'week');
      this.month.appendChild(this.week);
    }
  }

  Calendar.prototype.drawDay = function(day) {
    var self = this;
    this.getWeek(day);

    //Outer Day
    var outer = createElement('div', this.getDayClass(day));
    outer.addEventListener('click', function() {
      self.openDay(this);
    });

    //Day Name
    var name = createElement('div', 'day-name', day.format('ddd'));

    //Day Number
    var number = createElement('div', 'day-number', day.format('D'));


    //Events
    var events = createElement('div', 'day-events');
    this.drawEvents(day, events, number);

   // outer.appendChild(name);
    outer.appendChild(number);
    outer.appendChild(events);
    this.week.appendChild(outer);
  }

  Calendar.prototype.drawEvents = function(day, element, num_element) {
      if (day.month() === this.current.month()) {
      classes = ['day'];
      var todaysEvents = this.events.reduce(function(memo, ev) {
        if (ev.date_ev.isSame(day, 'day')) {
            //num_element.className += " " + ev.color_class + '_day'; 
            if (ev.color_class == "log_absent") {
                var warning_log = createElement('span', 'fa fa-warning pull-right warning-log', "");
                num_element.appendChild(warning_log);
            }
          memo.push(ev);
        }
        return memo;
      }, []);
      
      todaysEvents.forEach(function(ev) {
        var evSpan = createElement('span', ev.color_class);
        element.appendChild(evSpan);
      });
    }
  }

  Calendar.prototype.getDayClass = function(day) {
    classes = ['day'];
    if(day.month() !== this.current.month()) {
      classes.push('other');
    } else if (today.isSame(day, 'day')) {
      classes.push('today');
    }
    return classes.join(' ');
  }

  Calendar.prototype.openDay = function(el) {
    var details, arrow;
    var dayNumber = +el.querySelectorAll('.day-number')[0].innerText || +el.querySelectorAll('.day-number')[0].textContent;
    var day = this.current.clone().date(dayNumber);

    var currentOpened = document.querySelector('.details');

    //Check to see if there is an open detais box on the current row
    if(currentOpened && currentOpened.parentNode === el.parentNode) {
      details = currentOpened;
      arrow = document.querySelector('.arrow');
    } else {
      //Close the open events on differnt week row
      //currentOpened && currentOpened.parentNode.removeChild(currentOpened);
        if (currentOpened) {
            //console.log(currentOpened);
        currentOpened.addEventListener('webkitAnimationEnd', function() {
          currentOpened.parentNode.removeChild(currentOpened);
        });
        currentOpened.addEventListener('oanimationend', function() {
          currentOpened.parentNode.removeChild(currentOpened);
        });
        currentOpened.addEventListener('msAnimationEnd', function() {
          currentOpened.parentNode.removeChild(currentOpened);
        });
        currentOpened.addEventListener('animationend', function() {
          currentOpened.parentNode.removeChild(currentOpened);
        });
        currentOpened.className = 'details out';
      }

      //Create the Details Container
        details = createElement('div', 'details in');
        details.setAttribute('rel', dayNumber);

      //Create the arrow
      var arrow = createElement('div', 'arrow');

      //Create the event wrapper

      details.appendChild(arrow);
      el.parentNode.appendChild(details);
    }

    var todaysEvents = this.events.reduce(function(memo, ev) {
      if(ev.date_ev.isSame(day, 'day')) {
        memo.push(ev);
      }
      return memo;
    }, []);

    this.renderEvents(todaysEvents, details);

    arrow.style.left = el.offsetLeft - el.parentNode.offsetLeft + 27 + 'px';
  }

  Calendar.prototype.renderEvents = function(events, ele) {
    //Remove any events in the current details element
    var currentWrapper = ele.querySelector('.events');
    var wrapper = createElement('div', 'events in' + (currentWrapper ? ' new' : ''));

    events.forEach(function(ev) {
        duration = "";
        if((ev.duration_start &&  ev.duration_end) && (ev.duration_start != '00:00:00' &&  ev.duration_end != '00:00:00') )
            duration = ev.duration_start +" - "+ ev.duration_end;
      var div = createElement('div', 'event');
      var square = createElement('div', 'event-category ' + ev.color_class);
      var span = createElement('span', '', ev.title + " " + duration );

      div.appendChild(square);
      div.appendChild(span);
      wrapper.appendChild(div);
    });

    if(!events.length) {
      var div = createElement('div', 'event empty');
      var span = createElement('span', '', 'No Events');

      div.appendChild(span);
      wrapper.appendChild(div);
    }

    if(currentWrapper) {
      currentWrapper.className = 'events out';
      currentWrapper.addEventListener('webkitAnimationEnd', function() {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
      });
      currentWrapper.addEventListener('oanimationend', function() {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
      });
      currentWrapper.addEventListener('msAnimationEnd', function() {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
      });
      currentWrapper.addEventListener('animationend', function() {
        currentWrapper.parentNode.removeChild(currentWrapper);
        ele.appendChild(wrapper);
      });
    } else {
      ele.appendChild(wrapper);
    }
  }

  Calendar.prototype.drawLegend = function() {
    var legend = createElement('div', 'legend');
    var calendars = this.events.map(function(e) {
      return e.calendar + '|' + e.color_class;
    }).reduce(function(memo, e) {
      if(memo.indexOf(e) === -1) {
        memo.push(e);
      }
      return memo;
    }, []).forEach(function(e) {
      var parts = e.split('|');
      var entry = createElement('span', 'entry ' +  parts[1], parts[0]);
      legend.appendChild(entry);
    });
    this.el.appendChild(legend);
  }

  Calendar.prototype.nextMonth = function() {
    this.current.add(1, 'months');
    this.next = true;
    if( this.url != null){
        var currMon = this.current.clone();
        var post_url = this.url;
        var data_param = {
                    start: currMon.startOf('month').unix(),
                    end: currMon.endOf('month').unix()
                };
        if(this.param != null){
            data_param = this.param;
        }
        var new_events = function () {
          var tmp = null;
          $.ajax({
                async: false,
                type: "POST",
                url: post_url,
                data: data_param,
                success: function (response) {
                    tmp = response;
                }
            });
          return tmp;
        }();
        if(new_events != null){
          this.events = new_events;
        }

    }
    this.draw();
  }

  Calendar.prototype.prevMonth = function() {
    this.current.subtract('months', 1);
    this.next = false;
    if( this.url != null){
        var currMon = this.current.clone();
        var post_url = this.url;
        var data_param = {
                    start: currMon.startOf('month').unix(),
                    end: currMon.endOf('month').unix()
                };
        if(this.param != null){
            data_param = this.param;
        }
        var new_events = function () {
          var tmp = null;
          $.ajax({
                async: false,
                type: "POST",
                url: post_url,
                data: data_param,
                success: function (response) {
                    tmp = response;
                }
            });
          return tmp;
        }();
        if(new_events != null){
          this.events = new_events;
        }

    }
   
    this.draw();
  }

  window.Calendar = Calendar;

  function createElement(tagName, className, innerText) {
    var ele = document.createElement(tagName);
    if(className) {
      ele.className = className;
    }
    if(innerText) {
      ele.innderText = ele.textContent = innerText;
    }
    return ele;
  }
}();

!function() {
    var data = [

        { title: 'Lunch Meeting w/ Mark', calendar: 'Work', color_class: 'orange', start: "2018-07-25" },
        { title: 'Interview - Jr. Web Developer', calendar: 'Work', color_class: 'orange', start: "2018-07-10" },

        { title: 'Game vs Portalnd', calendar: 'Sports', color_class: 'blue', start: "2018-07-27" },
        { title: 'Game vs Houston', calendar: 'Sports', color_class: 'blue', start: "2018-07-20" },

        { title: 'School Play', calendar: 'Kids', color_class: 'yellow', start: "2018-07-03" },
        { title: 'Parent/Teacher Conference', calendar: 'Kids', color_class: 'yellow', start: "2018-07-05" },

        { title: 'Teach Kids to Code', calendar: 'Other', color_class: 'green', start: "2018-07-02" },
        { title: 'Startup Weekend', calendar: 'Other', color_class: 'green', start: "2018-07-01" }
    ];

//       $.ajax({
//           async: false,
//           type: "POST",
//           url: site_url + 'ajax/profile_ajax/ajax_get_employee_logs',
//           data: {
//               start: moment().startOf('month').unix(),
//               end: moment().unix()
//           },
//           success: function (response) {
//               var data_ev = response;
//              var calendar = new Calendar('#attendance_cal', data_ev, site_url + 'ajax/profile_ajax/ajax_get_employee_logs');
             
//           }
//       });

// //var calendar = new Calendar('#attendance_cal', data);
//       $.ajax({
//           async: false,
//           type: "POST",
//           url: site_url + 'ajax/calendar_ajax/load_calendar_data',
//           data: {
//               start: moment().startOf('month').unix(),
//               end: moment().endOf('month').unix()
//           },
//           success: function (response) {
//               var data_cal = response;
//               var calendar2 = new Calendar('#events_cal', data_cal, site_url + 'ajax/calendar_ajax/load_calendar_data', ['S','M','T','W','T','F','S']);
             
//           }
//       });

    

}();
