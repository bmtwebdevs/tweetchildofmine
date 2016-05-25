$(function () {

  'use strict';

  /* ChartJS
   * -------
   * Here we will create a few charts using ChartJS
   */


   // $('#search-btn').on('click', function(){
   //
   //     $.ajax({
   //       url: '/get-tweets?search=',
   //       dataType: 'json',
   //       success: function(data) {
   //         //data.then((result) => {
   //           console.log(data);
   //         //})
   //         showTweets(data);
   //       }
   //     });
   //    //showTweets();
   // });


  var tweetEvent = new EventSource("tweet-stream?search=brexit");

  tweetEvent.onmessage = function(e) {
    if(e.data) {
      var tweet = JSON.parse(e.data);
      var emotion = (tweet.faceEmotion) ? tweet.faceEmotion + " " + tweet.textScore : tweet.textScore;
      
      
      // it would be better to add the tweet to a json object that the table and other parts of the page can read from

      $("#media-body").prepend(
        "<img class='media-object'' src='" +tweet.media_url +
        "' alt=''>" +
        "</div>" +
        "<h4><b>" + tweet.text + 
        "</b></h4><h5>" + tweet.when + 
        "</h5><h6>" + tweet.userName +
        "</h6><h7>" + emotion +
        "</h7>"+
        "</div>");
        
       updateLocationTable(tweet.location, emotion);
    }
  } 
                                   
  // var locations = [
  //     { latitude: 53.483959, longitude: -2.244644},
  //     { latitude: 51.4545, longitude: 2.5879 },
  //     { latitude: 52.4862, longitude: 1.8904 }
  //     ];

  //     for (var index = 0; index < locations.length; index++) {
  //         var element = locations[index];

  //           $.ajax({
  //             url: '/get-tweets',
  //             data: element,
  //             dataType: 'json',
  //             success: function(data) {
  //               console.log(data);
  //               showTweets(data);
  //             }
  //         });

  //     }

function updateLocationTable(tweetlocation, emotion){
       
    var id;  

    if(!tweetlocation){
        if(emotion > 0){
        id = '#unknown-positive-value';
      }
      else if (emotion == 0){
        id = '#unknown-neutral-value';
      }
      else{
        id = '#unknown-negative-value';
      }        
    }

    else {
      
      var inLocation = isInLocationList(tweetlocation);
      
      if(inLocation){
        if(emotion >= 0){
          id = '#' + inLocation.replace(' ','-') + '-positive-value';  
        }
        else if (emotion == 0){
          id = '#' + inLocation.replace(' ','-') + '-neutral-value';
        }
        else{
          id = '#' + inLocation.replace(' ','-') + '-negative-value';
        }
      }
      
      else{
        
        var tweetlocationnospaces = tweetlocation.replace(' ','-').replace('\'','-');
        
        var tr = $('<tr>');
        tr.append('<td class="location-names">' + tweetlocation + '</td>');
        tr.append('<td id="' + tweetlocationnospaces +'-positive-value" class="positive-tweet">' + '0' + '</td>');
        tr.append('<td id="' + tweetlocationnospaces + '-negative-value" class="negative-tweet">' + '0' + '</td>');
        tr.append('<td id="' + tweetlocationnospaces +'-neutral-value" class="neutral-tweet">' + '0' + '</td>');
        tr.append('</tr>');
        $('#tweettable').append(tr);
        
        if(emotion >= 0){
          id = '#' + tweetlocationnospaces + '-positive-value';  
        }
        else if (emotion == 0){
          id = '#' + tweetlocationnospaces + '-neutral-value';
        }
        else{
          id = '#' + tweetlocationnospaces + '-negative-value';
        }
      }
      
    }
    
    
    var value = parseInt($(id).text()) + 1;
    $(id).text(value.toString());
    

    // $.ajax({
    //   url: '/get-tweets?search=manchester',
    //   dataType: 'json',
    //   success: function(data) {
    //     //data.then((result) => {
    //       console.log(data);
    //     //})
    //     showTweets(data);
    //   }
    // });
}

function isInLocationList(tweetlocation){
    var tweetlocations = ['Manchester','Bristol','Birmingham','Edinburgh','London']
    
    var existingLocations = $('.location-names').map(function(){
        return this.innerText;
      }
    ).get();
    
    for(var i = 0; i < existingLocations.length; i++){
        var id;
              
        if(tweetlocation && tweetlocation.indexOf(existingLocations[i]) > -1){
          return existingLocations[i];
        }        
    }    
    return false;
}

function showTweets(data) {

    var json = [
        {
            location: 'manchester',
            positive: '4',
            negative: '10'
        },
        {
            location: 'bristol',
            positive: '18',
            negative: '25'
        }
    ];
    //TODO need to get json and work out format, then process data into correct format
    var tr;
    for (var i = 0; i < json.length; i++) {
        tr = $('<tr>');
        tr.append("<td>" + json[i].location + "</td>");
        tr.append("<td>" + json[i].positive + "</td>");
        tr.append("<td>" + json[i].negative + "</td>");
        tr.append("</tr>");
        $('#tweettable').append(tr);
    }
}

  //-----------------------
  //- MONTHLY SALES CHART -
  //-----------------------

  // Get context with jQuery - using jQuery's .get() method.
  var salesChartCanvas = $("#salesChart").get(0).getContext("2d");
  // This will get the first returned node in the jQuery collection.
  var salesChart = new Chart(salesChartCanvas);

  var salesChartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Happy",
        fillColor: "red",
        strokeColor: "red",
        pointColor: "red",
        pointStrokeColor: "#c1c7d1",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgb(220,220,220)",
        data: [65, 59, 80, 81, 56, 55, 40]
      },
      {
        label: "Sad",
        fillColor: "green",
        strokeColor: "green",
        pointColor: "green",
        pointStrokeColor: "rgba(60,141,188,1)",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(60,141,188,1)",
        data: [28, 48, 40, 19, 86, 27, 90]
      }
    ]
  };

  var salesChartOptions = {
    //Boolean - If we should show the scale at all
    showScale: true,
    //Boolean - Whether grid lines are shown across the chart
    scaleShowGridLines: false,
    //String - Colour of the grid lines
    scaleGridLineColor: "rgba(0,0,0,.05)",
    //Number - Width of the grid lines
    scaleGridLineWidth: 1,
    //Boolean - Whether to show horizontal lines (except X axis)
    scaleShowHorizontalLines: true,
    //Boolean - Whether to show vertical lines (except Y axis)
    scaleShowVerticalLines: true,
    //Boolean - Whether the line is curved between points
    bezierCurve: true,
    //Number - Tension of the bezier curve between points
    bezierCurveTension: 0.3,
    //Boolean - Whether to show a dot for each point
    pointDot: false,
    //Number - Radius of each point dot in pixels
    pointDotRadius: 4,
    //Number - Pixel width of point dot stroke
    pointDotStrokeWidth: 1,
    //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
    pointHitDetectionRadius: 20,
    //Boolean - Whether to show a stroke for datasets
    datasetStroke: true,
    //Number - Pixel width of dataset stroke
    datasetStrokeWidth: 2,
    //Boolean - Whether to fill the dataset with a color
    datasetFill: true,
    //String - A legend template
    legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%=datasets[i].label%></li><%}%></ul>",
    //Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
    maintainAspectRatio: true,
    //Boolean - whether to make the chart responsive to window resizing
    responsive: true
  };

  //Create the line chart
  salesChart.Line(salesChartData, salesChartOptions);

  //---------------------------
  //- END MONTHLY SALES CHART -
  //---------------------------

  //-------------
  //- PIE CHART -
  //-------------
  // Get context with jQuery - using jQuery's .get() method.
  var pieChartCanvas = $("#pieChart").get(0).getContext("2d");
  var pieChart = new Chart(pieChartCanvas);
  var PieData = [
    {
      value: 700,
      color: "#f56954",
      highlight: "#f56954",
      label: "Negative"
    },
    {
      value: 500,
      color: "#00a65a",
      highlight: "#00a65a",
      label: "Positive"
    },
    {
      value: 400,
      color: "#f39c12",
      highlight: "#f39c12",
      label: "Neutral"
    },
    {
      value: 600,
      color: "#00c0ef",
      highlight: "#00c0ef",
      label: "Smiling"
    },
    {
      value: 300,
      color: "#3c8dbc",
      highlight: "#3c8dbc",
      label: "Angry"
    },
    {
      value: 100,
      color: "#d2d6de",
      highlight: "#d2d6de",
      label: "No Emotion"
    }
  ];
  var pieOptions = {
    //Boolean - Whether we should show a stroke on each segment
    segmentShowStroke: true,
    //String - The colour of each segment stroke
    segmentStrokeColor: "#fff",
    //Number - The width of each segment stroke
    segmentStrokeWidth: 1,
    //Number - The percentage of the chart that we cut out of the middle
    percentageInnerCutout: 50, // This is 0 for Pie charts
    //Number - Amount of animation steps
    animationSteps: 100,
    //String - Animation easing effect
    animationEasing: "easeOutBounce",
    //Boolean - Whether we animate the rotation of the Doughnut
    animateRotate: true,
    //Boolean - Whether we animate scaling the Doughnut from the centre
    animateScale: false,
    //Boolean - whether to make the chart responsive to window resizing
    responsive: true,
    // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
    maintainAspectRatio: false,
    //String - A legend template
    legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>",
    //String - A tooltip template
    tooltipTemplate: "<%=value %> <%=label%>"
  };
  //Create pie or douhnut chart
  // You can switch between pie and douhnut using the method below.
  pieChart.Doughnut(PieData, pieOptions);
  //-----------------
  //- END PIE CHART -
  //-----------------

  /* jVector Maps
   * ------------
   * Create a world map with markers
   */
  $('#world-map-markers').vectorMap({
      map: 'uk_countries_mill',
    normalizeFunction: 'polynomial',
    hoverOpacity: 0.7,
    hoverColor: false,
    backgroundColor: 'transparent',
    regionStyle: {
      initial: {
        fill: 'rgba(210, 214, 222, 1)',
        "fill-opacity": 1,
        stroke: 'none',
        "stroke-width": 0,
        "stroke-opacity": 1
      },
      hover: {
        "fill-opacity": 0.7,
        cursor: 'pointer'
      },
      selected: {
        fill: 'yellow'
      },
      selectedHover: {}
    },
    markerStyle: {
      initial: {
        fill: '#00a65a',
        stroke: '#111'
      }
    },
    markers: [
      {latLng: [51.45, -2.58], name: 'Bristol'},
      {latLng: [51.48, -0.11], name: 'London'},
      {latLng: [52.48, -1.89], name: 'Birmingham'},
      {latLng: [53.48, -2.24], name: 'Manchester'},
      {latLng: [54.98, -1.59], name: 'Newcastle'},
      {latLng: [55.95, -3.18], name: 'Edinburgh'},
      {latLng: [55.83, -4.24], name: 'Glasglow'},
    ]
  });

  /* SPARKLINE CHARTS
   * ----------------
   * Create a inline charts with spark line
   */

  //-----------------
  //- SPARKLINE BAR -
  //-----------------
  $('.sparkbar').each(function () {
    var $this = $(this);
    $this.sparkline('html', {
      type: 'bar',
      height: $this.data('height') ? $this.data('height') : '30',
      barColor: $this.data('color')
    });
  });

  //-----------------
  //- SPARKLINE PIE -
  //-----------------
  $('.sparkpie').each(function () {
    var $this = $(this);
    $this.sparkline('html', {
      type: 'pie',
      height: $this.data('height') ? $this.data('height') : '90',
      sliceColors: $this.data('color')
    });
  });

  //------------------
  //- SPARKLINE LINE -
  //------------------
  $('.sparkline').each(function () {
    var $this = $(this);
    $this.sparkline('html', {
      type: 'line',
      height: $this.data('height') ? $this.data('height') : '90',
      width: '100%',
      lineColor: $this.data('linecolor'),
      fillColor: $this.data('fillcolor'),
      spotColor: $this.data('spotcolor')
    });
  });
});
