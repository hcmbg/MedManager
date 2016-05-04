
$(document).on('change', '.btn-file :file', function() {
  var input = $(this),
      numFiles = input.get(0).files ? input.get(0).files.length : 1,
      label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
  input.trigger('fileselect', [numFiles, label]);
});

$(document).ready( function() {
    $('.btn-file :file').on('fileselect', function(event, numFiles, label) {
        
        var input = $(this).parents('.input-group').find(':text'),
            log = numFiles > 1 ? numFiles + ' files selected' : label;
        
        if( input.length ) {
            input.val(log);
        } else {
            if( log ) alert(log);
        }
    });
    
    $('#saveAndExitBtn').click(function(e) {
      localStorage.setItem("newPatient", "true");
    });

    $('#saveNewMeds').click(function (e) {
      localStorage.setItem("newMeds", "true");
    });

    function getTime() {

      var today = new Date();
      var h = ('0'+today.getHours()).slice(-2);
      var m = ('0'+today.getMinutes()).slice(-2);
      var now = h+":"+m;

      return now;
    }

    function setTime() {
      console.log("sadfsA");
      var currentTime = getTime();
      
      if (currentTime.substring(0, 2) == 12) { // 12 noon
        currentTime = "12" + currentTime.substring(2) + "PM";
      } else if (currentTime.substring(0, 2) == 24) { // 12 midnight
        currentTime = "12" + currentTime.substring(2) + "AM";
      } else if (parseInt(currentTime.substring(0, 2)) > 12) {
        currentTime = String(parseInt(currentTime.substring(0, 2)) - 12) + currentTime.substring(2) + "PM";
      } else {
        currentTime += "AM";
      }
      document.getElementById('currentTime').innerHTML = '<span class="glyphicon glyphicon-time"></span>' + ' ' + currentTime;
      var t = setTimeout(setTime, 3000);
    }
    setTime();
});