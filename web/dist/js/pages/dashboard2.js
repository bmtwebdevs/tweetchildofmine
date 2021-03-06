$(function () {

  'use strict';

  var tweetStreamStopped = false;
  
  $('#toggleStream').click(function() {
    
    tweetStreamStopped = !tweetStreamStopped;
  })
  
  $('#search-btn').click(function(e) {   
      
      $('#total-tweets').text('0');
      $('#positive-overall').text('0');
      $('#percent-happy').text('0');
      $('#negative-overall').text('0');
      $('#neutral-overall').text('0');
      
      $('tweettable').innerHtml(
        
        '<tr>'+
          '<th class="col-md-3 col-sm-6 col-xs-12">Location</th>'+
              '<th class="col-md-3 col-sm-6 col-xs-12">Happy/Positive Tweets</th>'+
              '<th class="col-md-3 col-sm-6 col-xs-12">Angry/Negative Tweets</th>'+
              '<th class="col-md-3 col-sm-6 col-xs-12">Neutral Tweets</th>'+
          '</tr>'+
          '<tr>'+
              '<td class="location-names">Manchester</td>'+
              '<td id="manchester-positive-value" class="positive-tweet">0</td>'+
              '<td id="manchester-negative-value" class="negative-tweet">0</td>'+
              '<td id="manchester-neutral-value" class="neutral-tweet">0</td>'+
          '</tr>'+
          '<tr>'+
              '<td class="location-names">Bristol</td>'+
              '<td id="bristol-positive-value" class="positive-tweet">0</td>'+
              '<td id="bristol-negative-value" class="negative-tweet">0</td>'+
              '<td id="bristol-neutral-value" class="neutral-tweet">0</td>'+
          '</tr>'+
          '<tr>'+
              '<td class="location-names">Birmingham</td>'+
              '<td id="birmingham-positive-value" class="positive-tweet">0</td>'+
              '<td id="birmingham-negative-value" class="negative-tweet">0</td>'+
              '<td id="birmingham-neutral-value" class="neutral-tweet">0</td>'+
          '</tr>'+
          '<tr>'+
              '<td class="location-names">Edinburgh</td>'+
              '<td id="edinburgh-positive-value" class="positive-tweet">0</td>'+
              '<td id="edinburgh-negative-value" class="negative-tweet">0</td>'+
              '<td id="edinburgh-neutral-value" class="neutral-tweet">0</td>'+
          '</tr>'+
          '<tr>'+
              '<td class="location-names">London</td>'+
              '<td id="london-positive-value" class="positive-tweet">0</td>'+
              '<td id="london-negative-value" class="negative-tweet">0</td>'+
              '<td id="london-neutral-value" class="neutral-tweet">0</td>'+
          '</tr>'+
          '<tr>'+
              '<td>Unknown</td>'+
              '<td id="unknown-positive-value" class="positive-tweet">0</td>'+
              '<td id="unknown-negative-value" class="negative-tweet">0</td>'+
              '<td id="unknown-neutral-value" class="neutral-tweet">0</td>'+
          '</tr>'
        
      );
      
      
      e.preventDefault();                       
      var term = $('#searchTerm').val();           
      newSearch(term);
      return false;     
   });       
     
  
  function listenToMessages(e) {
        
    if(e.data) {
      var tweet = JSON.parse(e.data);

      var emotion = tweet.textScore;
      var emotionface = tweet.faceScore;
      
      var emotionface1 = "";
      
      if (tweet.faceScore && emotionface != "none") {
        var emoticon = emoticonStyle(emotionface);
        //console.log("emotion test:", emotionface, emoticon, "emoticon = empty?", emoticon=="")
        //if(emoticon != "") {
          emotionface1 = "<b><i>Tweet Picture Emotion Level: </b></i><h1>" + emoticon + "</h1></h5>"
        //}
      }
      
      var imagehtml = "";
      if (tweet.media_url) {  
        imagehtml = "<img class='media-object'' src='" +tweet.media_url + "' alt='' width='128px' height='128px'>";   
      }
      
      var bgHsl = scoreBg(parseInt(emotion, 10));

      // it would be better to add the tweet to a json object that the table and other parts of the page can read from
      if(!tweetStreamStopped) {
        $("#media-body").prepend(
          "<div class='tweet-panel' style='background-color:" + bgHsl + "'>" +
          "<h4><b>" + tweet.text + 
          "</b></h4><h5><b><i>Tweet Date & Time: </b></i>" + tweet.when + 
          "</h5><h5><b><i>User: </b></i>" + tweet.userName +
          "</h5>" + imagehtml +         
          "<h5><b><i>Tweet Text Emotion Level: </b></i>" + emotion +
          "</h5>"+
          "<h5>" + emotionface1 +        
          "</h5><hr size='3'/></div>");
      }  
    
      updateLocationTable(tweet.location, emotion);
    }
  
  }

  

var tweetEvent = new EventSource("tweet-stream?search=brexit");  
tweetEvent.addEventListener('message', listenToMessages);
    
  // 
  function newSearch(param) {     
    
    tweetEvent.close();     
    
    tweetEvent.removeEventListener('message', listenToMessages);
    
    tweetEvent = null;
    
    tweetEvent = new EventSource("tweet-stream?search=" + param);
    
    tweetEvent.addEventListener('message', listenToMessages)
    
  }
  //var tweetEvent = new EventSource("tweet-stream?search=brexit");

//   tweetEvent.onmessage = function(e) {
//     if(e.data) {
//       var tweet = JSON.parse(e.data);
//       var emotion = (tweet.faceEmotion) ? tweet.faceEmotion + " " + tweet.textScore : tweet.textScore;
//       
//       
//       // it would be better to add the tweet to a json object that the table and other parts of the page can read from
// 
//       $("#media-body").prepend(
//         "<img class='media-object'' src='" +tweet.media_url +
//         "' alt=''>" +
//         "</div>" +
//         "<h4><b>" + tweet.text + 
//         "</b></h4><h5>" + tweet.when + 
//         "</h5><h6>" + tweet.userName +
//         "</h6><h7>" + emotion +
//         "</h7>"+
//         "</div>");
//        updateLocationTable(tweet.location, emotion); 
//        
//     }
//   } 

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
      tweetlocation = tweetlocation.trim();
       
      var inLocation = isInLocationList(tweetlocation);
      
      if(inLocation){
        if(emotion >= 0){
          id = '#' + replaceIllegalCharacters(inLocation) + '-positive-value';  
        }
        else if (emotion == 0){
          id = '#' + replaceIllegalCharacters(inLocation) + '-neutral-value';
        }
        else{
          id = '#' + replaceIllegalCharacters(inLocation) + '-negative-value';
        }
      } 
      else{
        
        var tweetlocationnospaces = replaceIllegalCharacters(tweetlocation);
        
        var tr = $('<tr>');
        tr.append('<td class="location-names">' + tweetlocation + '</td>');
        tr.append('<td id="' + tweetlocationnospaces +'-positive-value" class="positive-tweet">' + '0' + '</td>');
        tr.append('<td id="' + tweetlocationnospaces + '-negative-value" class="negative-tweet">' + '0' + '</td>');
        tr.append('<td id="' + tweetlocationnospaces +'-neutral-value" class="neutral-tweet">' + '0' + '</td>');
        tr.append('</tr>');
        $('#tweettable').append(tr);
        
        if(emotion > 0){
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
    
    if(emotion > 0){
      var value = parseInt($('#positive-overall').text()) + 1;
      $('#positive-overall').text(value.toString());
    }
    else if (emotion == 0){
      var value = parseInt($('#neutral-overall').text()) + 1;
      $('#neutral-overall').text(value.toString());
    }
    
    else {
      var value = parseInt($('#negative-overall').text()) + 1;
      $('#negative-overall').text(value.toString());
    }
    
    var value = parseInt($('#total-tweets').text()) + 1;
    $('#total-tweets').text(value.toString());

    var numberofpositive = parseInt($('#positive-overall').text());
    var totalnumberoftweets = parseInt($('#total-tweets').text());
    var percenthappy = (numberofpositive / totalnumberoftweets) * 100;
    $('#percent-happy').text(percenthappy.toFixed(2).toString());
    
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
    
    var existingLocations = $('.location-names').map(function(){
        return this.innerText;
      }
    ).get();
    
    var tweetlocationwithcharacterfilter = replaceIllegalCharacters(tweetlocation);
    
    for(var i = 0; i < existingLocations.length; i++){
        var id;
              
        var existinglocationwithcharacterfilter = replaceIllegalCharacters(existingLocations[i]);
              
        if(tweetlocation && tweetlocationwithcharacterfilter.indexOf(existinglocationwithcharacterfilter) > -1){
          return existinglocationwithcharacterfilter;
        }        
    }    
    return false;
}

function replaceIllegalCharacters(text){
    return text.replace(/ /g,'-').replace(/\'/g,'-').replace(/\!/g,'').replace(/\,/g,'').replace(/\//g,'')
      .replace(/\\/g,'').replace(/\@/g,'at').replace(/\./g,'').replace(/\&/g,'and').replace(/\#/g,'').replace(/\?/,'')
      .replace(/\(/g, '').replace(/\)/g,'');
}

// function showTweets(data) {

//     var json = [
//         {
//             location: 'manchester',
//             positive: '4',
//             negative: '10'
//         },
//         {
//             location: 'bristol',
//             positive: '18',
//             negative: '25'
//         }
//     ];
//     //TODO need to get json and work out format, then process data into correct format
//     var tr;
//     for (var i = 0; i < json.length; i++) {
//         tr = $('<tr>');
//         tr.append("<td>" + json[i].location + "</td>");
//         tr.append("<td>" + json[i].positive + "</td>");
//         tr.append("<td>" + json[i].negative + "</td>");
//         tr.append("</tr>");
//         $('#tweettable').append(tr);
//     }
// }


function emoticonStyle(emotion) {
  
  switch(emotion) {
    case "anger": return "😡";
    case "contempt":  return "😤";
    case "disgust":  return "😷";
    case "fear":  return "🙀";
    case "happiness":  return "😀";
    case "sadness":  return "😓";
    case "surprise":  return "😯";
    case "neutral": return "😐";  
    default:
      return "";
  } 
}

function scoreBg(emotion) {
  var h = 0, s = 100, b = 50;
  
  h = (emotion + 10) * 5;
  //console.log(emotion, "hue:", h, "sat", s);
  var colour = "hsla(" + h + "," + s + "%,"+ b + "%, 1)";
  
  $("#tablecolours").append("<td style='background-color:" + colour +  "'>&nbsp;</td>");
  
  return colour
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
