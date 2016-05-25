   $('#search-btn').click(function(e) {   
     e.preventDefault();
                       
      var term = $('#searchTerm').val();           
      newSearch(term);
      return false;     
   });       
     
  
  function listenToMessages(e) {
        
    if(e.data) {
      var tweet = JSON.parse(e.data);
      var emotion = (tweet.faceEmotion) ? tweet.faceEmotion + " " + tweet.textScore : tweet.textScore;
            
      // it would be better to add the tweet to a json object that the table and other parts of the page can read from
      $("#media-body").prepend(
        "<class='media-left'><img class='media-object'' src='" + tweet.picture +
        "' alt='Img'>" +
        "</div>" +
        "<h4>" + tweet.text + 
        "</h4><h5>" + tweet.when + 
        "</h5><h6>" + tweet.who +
        "</h6>" +
        "</div>");
    }
  
  }
  
  var tweetEvent = new EventSource("tweet-stream?search=bristol");  
  tweetEvent.addEventListener('message', listenToMessages);
     
   // 
   function newSearch(param) {
     
     console.log('inside new search');
     
     tweetEvent.close();     
     
     tweetEvent.removeEventListener('message', listenToMessages);
     
     tweetEvent = null;
     
     tweetEvent = new EventSource("tweet-stream?search=" + param);
     
     tweetEvent.addEventListener('message', listenToMessages)
     
   }