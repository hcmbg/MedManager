
// $(document).on('change', '.btn-file :file', function() {
//   var input = $(this),
//       numFiles = input.get(0).files ? input.get(0).files.length : 1,
//       label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
//   input.trigger('fileselect', [numFiles, label]);
// });

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

    var data = $.parseJSON(patientData)
     $.each(data.patients, function(patientIndex, patient) {
       $.each(patient.meds, function(medIndex, med) {
        var tblRow = '<tr> <td>' + parseInt(7+parseInt(patientIndex)) + ':00 </td><td>' + patient.name + '</br> <a  href="sharon_lastname.html" type="button" class="btn btn-primary">View/Edit Patient Info</a></td>' +
         '<td>' + patient.room + '</td> <td>' + med.medName + '</br> <span style="font-style: italic;">' + med.dosage + '</span></td>' +
         '<td > <form id ="dosageForm"><input type="dosage" class="form-control" id="dosageConfirm1" placeholder="Dosage Delivered" style="width: 55%; font-size: 12;"> </div> <div id="errorMessage" style="color: red; display: none; padding-bottom: 10px; font-size: 10;">Incorrect dosage</div> <button type="submit" class="btn btn-success" id="confirm1">Confirm</button><input type="checkbox" class="deliveredBox" id="box1" style="display:none"></form></td> </tr>';
         $(tblRow).appendTo("#patientTable");
       });
     });

function submitButtonHandler(evt){
        this.removeEventListener('click', submitButtonHandler);
        var valid = true;
        if (document.getElementById('password').value != "med") {
          valid = false;
        }
        if (!valid) {
          $('#errorMessage').show();
          evt.preventDefault();
        } else {
          localStorage.setItem(checkbox.id.toString(), $(checkbox).is(':checked'));
          sortTable();
        }
      }

function confirmationButtonHandler(evt){
  var valid = true;
  if (document.getElementById('dosageConfirm1').value != "200"){
      valid = false;
  }
  if (!valid){
    evt.preventDefault();
    console.log(valid)
    $('#errorMessage').show();
    evt.preventDefault();
    document.getElementById('dosageForm').reset();
    }
  else{
    $('#errorMessage').hide();
    var checkbox = document.getElementById('box1');
    localStorage.setItem(checkbox.id.toString(), $(checkbox).is(':checked'));
    console.log(valid);
    sortTable();
    evt.preventDefault();
  }
    
  
}
    // var submitButton = document.getElementById('checkboxConfirmation');
    var submitButton = document.getElementById('submitPassword');
    submitButton.addEventListener('click', submitButtonHandler);
    var confirmButton = document.getElementById('confirm1');
    confirmButton.addEventListener('click', confirmationButtonHandler);



    // cancel does not change localStorage but changes temporary look, 
    // this does not work
    $("#cancelPassword").on("click", function (evt) {
      console.log("cancel");
    });


    // creates new table row with the added patient's information
    var newPatient = localStorage.newPatient;
    if (newPatient == "true") {
      var row = document.getElementById("patientTable").insertRow(-1);
      row.innerHTML = '<tr><td>7:30AM</td><td>Mary Jones</br><a  href="created_patient.html" type="button" class="btn btn-primary">View/Edit Patient Info</a></td><td>211</td><td>Medication X </br> 2 tablets</td><td style="text-align:center; vertical-align: middle;"><input type="checkbox" class="deliveredBox" id="box4"></td></tr>';
    }

    $(function(){
      var checkboxes = document.getElementsByClassName("deliveredBox");
      for (var i = 0; i < checkboxes.length; i++) {
        var boxID = checkboxes[i].id.toString();
        var test = localStorage.getItem(boxID) === 'true'? true: false;
        $(checkboxes[i]).prop('checked', test || false);
      }
    });



    // creates new table row with the added patient's information
    var newPatient = localStorage.newPatient;
    if (newPatient == "true") {
      var row = document.getElementById("patientTable").insertRow(-1);
      row.innerHTML = '<tr><td>12:00PM</td><td>Mary Jones</br><a  href="created_patient.html" type="button" class="btn btn-primary">View/Edit Patient Info</a></td><td>211</td><td>Medication X </br> 2 tablets</td><td style="text-align:center; vertical-align: middle;"><input type="checkbox" class="deliveredBox" id="box4"></td></tr>';
      // should be based on actual inputs
    }

    function refreshPage(){
      window.location.reload();
    } 

    $(function(){
      var checkboxes = document.getElementsByClassName("deliveredBox");
      for (var i = 0; i < checkboxes.length; i++) {
        var boxID = checkboxes[i].id.toString();
        var test = localStorage.getItem(boxID) === 'true'? true: false;
        $(checkboxes[i]).prop('checked', test || false);
      }
    });

    function sortTable(){ 
      var currentTime = getTime();
      currentTime = timeToString(currentTime);
      currentTime = timeToDecimal(currentTime);

      var tbl = document.getElementById("patientTable").tBodies[0];
      var store = [];
      for(var i=1, len=tbl.rows.length; i<len; i++){ //start at row one to preserve header
        var row = tbl.rows[i];
        var checkbox = document.getElementsByClassName("deliveredBox")[i-1];

        if (localStorage.getItem(checkbox.id.toString()) == 'true') {
          var sortnr = 25;
        } else {
          var stringTime = row.cells[0].textContent;
          var sortnr = timeToDecimal(stringTime) - parseInt(currentTime);
          if (sortnr < 0) {
            sortnr += 24;
          }
        }

        if(!isNaN(sortnr)) store.push([sortnr, row]);
      }
      store.sort(function(x,y){
        return x[0] - y[0];
      });
      for(var i=0, len=store.length; i<len; i++){
        tbl.appendChild(store[i][1]);
      }
      store = null;
    }
    sortTable();

    function timeToDecimal(stringTime){
      var plusTwelve = stringTime.substring(stringTime.length-2);

      stringTime = stringTime.substring(0, stringTime.length-2);
      var splitTime = stringTime.replace(/(^:)|(:$)/g, '').split(":");
      splitTime[0] = parseInt(splitTime[0]);

      if (plusTwelve == "PM" && splitTime[0] != 12){
        splitTime[0] += 12;
      } else if (plusTwelve == "AM" && splitTime[0] == 12) {
        splitTime[0] = 24;
      }

      var sortnr = splitTime[0] + parseInt(splitTime[1]) / 60
      return sortnr;
    }

    function timeToString(currentTime) {
      if (currentTime.substring(0, 2) == 12) { // 12 noon
        currentTime = "12" + currentTime.substring(2) + "PM";
      } else if (currentTime.substring(0, 2) == 24) { // 12 midnight
        currentTime = "12" + currentTime.substring(2) + "AM";
      } else if (parseInt(currentTime.substring(0, 2)) > 12) {
        currentTime = String(parseInt(currentTime.substring(0, 2)) - 12) + currentTime.substring(2) + "PM";
      } else {
        currentTime += "AM";
      }
      return currentTime;
    }

    function deliveryAlert(){
      var tbl = document.getElementById("patientTable").tBodies[0];
      var deliveryRows = [1];
      var firstRow = tbl.rows[1];
      var firstDelivery = firstRow.cells[0].textContent;
      var hours = parseInt(firstDelivery.substring(0, 2));
      var minutes = parseInt(firstDelivery.substring(3, firstDelivery.length - 2)) - 10;
      if (minutes < 0) {
        minutes = 60 + minutes;
        hours -= 1;
      }
      hours = String(hours);
      minutes = String(minutes);

      if(firstDelivery.substring(firstDelivery.length-2) == "PM") { //change to pm 
        hours = parseInt(hours) + 12;
        hours = hours.toString();
      } 

      if (hours.length == 1){
        hours = "0" + hours;
      }

      var delivery = hours + ":" + minutes;

      for(var i=2, len=tbl.rows.length; i<len; i++){ //start at row one to preserve header
        var row = tbl.rows[i];
        var deliveryTime = row.cells[0].textContent;
        if (deliveryTime == firstDelivery) {
          deliveryRows.push(i);
        }
      }

      var currentTime = getTime();

      //delivery = currentTime;
      if (currentTime == delivery) {
        var alert = document.getElementById('alertModal');
        var text = document.getElementById('modalText');
        var modalStart = '<p id = "modalText" style="font-size: 16; text-align: left;"><b>Reminder:</b> You have ten minutes to deliver:';
        var modalEnd = '</p>';
        var modalInner = '<span style="color: #990000;">';
        var modalMiddle = '';
        for (var i = 0; i < deliveryRows.length; i++) {
          var name = tbl.rows[deliveryRows[i]].cells[1].textContent;
          var med = tbl.rows[deliveryRows[i]].cells[3].textContent.split(' ')[0];

          modalMiddle += "<p style='text-align: center'>" + modalInner + med + "</span> to " + modalInner + name.substring(0, name.length - 22) + "</span></p>" ;
        }
        text.innerHTML = modalStart + modalMiddle + modalEnd;
        $('#alertModal').modal('show');
      }
    }
    deliveryAlert();

    function getTime() {

      var today = new Date();
      var h = ('0'+today.getHours()).slice(-2);
      var m = ('0'+today.getMinutes()).slice(-2);
      var now = h+":"+m;

      return now;
    }

    function setTime() {
      var currentTime = getTime();
      currentTime = timeToString(currentTime);
      document.getElementById('currentTime').innerHTML = 'Current Time: ' + currentTime;
      console.log("ran");
    }
    var t = setTimeout(setTime, 3000);
    setTime();

});

  var patientData = '{ "patients": \
    [ \
        { \
            "name" : "Sharon Lastname", \
            "room" : "503", \
            "meds" : [ \
                { \
                    "medName" : "Rivaroxaban", \
                    "dosage" : "200mg", \
                    "frequency" : "Once daily" \
                }, \
                { \
                    "medName" : "Nitroglycerin", \
                    "dosage" : "300mg", \
                    "frequency" : "Every 2-4 hours, daily" \
                } \
            ], \
            "patientInfo" : "<p>DOB: 11/3/1986</p><p> Height: 5ft 4in</p><p> Weight: 160 lb</p><p>Address: 123 Rainbow Road </br> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Boston, MA 02212</p><p> Allergies: Grass</p>", \
            "medicalInfo" : "<p>Lorem ipsum dolor sit amet, vim et legendos urbanitas, eu epicuri imperdiet eum. Ius lucilius constituto persequeris ex, mel ne constituto vituperata. Semper nonumes electram quo ne. Mandamus pericula usu ex, an sed wisi dicam. Suas noluisse hendrerit sit eu, eam epicurei erroribus at. </p><p>Cum docendi accommodare ad, ad debitis principes consetetur qui. Pro alterum sensibus ex, ut sit libris quaeque ancillae. Sea sint iudico doming cu, quaeque detracto cum id. Ludus lucilius ad duo, pri impetus accumsan detraxit id. At amet modo delicata vim, debitis nostrum convenire vis ei. Delenit dolorem conclusionemque te mei, an vim impedit disputationi. Mel natum scriptorem ei, ad dictas delectus has, sed oratio legimus te.</p><p>Ne stet dicam oportere qui, populo eruditi eu duo. Sed aliquam adolescens ullamcorper at. Dicam consulatu ne has, qui et tale atomorum persequeris. Ut voluptatibus signiferumque nec.</p><p>Nonumy legimus volumus usu eu. Persius mediocrem eu nam, te eos omnium facilis, sed idque graeci intellegebat ne. Qui simul integre democritum id, vim ei tantas ridens imperdiet. Et sale officiis conclusionemque mei. Per ea sint dolore singulis, simul vocent ei cum.</p><p>Mel simul munere no, elitr mnesarchum efficiantur no est. An urbanitas scripserit qui, vim simul decore everti ut, vel errem legere adipisci id. Mei ut enim aperiam, verear nonumes salutatus sed at. Vix te petentium assentior philosophia, mea et accusam splendide reprimique.</p>" \
        }, \
        { \
            "name" : "Ben Bitdiddle", \
            "room" : "621", \
            "meds" : [ \
                { \
                    "medName" : "MedicationB", \
                    "dosage" : "400mg", \
                    "frequency" : "Hourly" \
                } \
            ], \
            "patientInfo" : "<p>DOB: 06/06/1966</p><p> Height: 6ft 6in</p><p> Weight: 166 lb</p><p>Address: 666 Fire Road </br> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Boston, MA 06666</p><p> Allergies: Sun</p>", \
            "medicalInfo" : "<p>Lorem ipsum dolor sit amet, vim et legendos urbanitas, eu epicuri imperdiet eum. Ius lucilius constituto persequeris ex, mel ne constituto vituperata. Semper nonumes electram quo ne. Mandamus pericula usu ex, an sed wisi dicam. Suas noluisse hendrerit sit eu, eam epicurei erroribus at. </p><p>Cum docendi accommodare ad, ad debitis principes consetetur qui. Pro alterum sensibus ex, ut sit libris quaeque ancillae. Sea sint iudico doming cu, quaeque detracto cum id. Ludus lucilius ad duo, pri impetus accumsan detraxit id. At amet modo delicata vim, debitis nostrum convenire vis ei. Delenit dolorem conclusionemque te mei, an vim impedit disputationi. Mel natum scriptorem ei, ad dictas delectus has, sed oratio legimus te.</p><p>Ne stet dicam oportere qui, populo eruditi eu duo. Sed aliquam adolescens ullamcorper at. Dicam consulatu ne has, qui et tale atomorum persequeris. Ut voluptatibus signiferumque nec.</p><p>Nonumy legimus volumus usu eu. Persius mediocrem eu nam, te eos omnium facilis, sed idque graeci intellegebat ne. Qui simul integre democritum id, vim ei tantas ridens imperdiet. Et sale officiis conclusionemque mei. Per ea sint dolore singulis, simul vocent ei cum.</p><p>Mel simul munere no, elitr mnesarchum efficiantur no est. An urbanitas scripserit qui, vim simul decore everti ut, vel errem legere adipisci id. Mei ut enim aperiam, verear nonumes salutatus sed at. Vix te petentium assentior philosophia, mea et accusam splendide reprimique.</p>" \
        }, \
        { \
            "name" : "Pablo Sanchez", \
            "room" : "404", \
            "meds" : [ \
                { \
                    "medName" : "MedicationC", \
                    "dosage" : "300mg", \
                    "frequency" : "Once daily" \
                } \
            ], \
            "patientInfo" : "<p>DOB: 12/31/1999</p><p> Height: 4ft 11in</p><p> Weight: 100 lb</p><p>Address: 123 Milennium Road </br> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Boston, MA 02212</p><p> Allergies: None</p>", \
            "medicalInfo" : "<p>Lorem ipsum dolor sit amet, vim et legendos urbanitas, eu epicuri imperdiet eum. Ius lucilius constituto persequeris ex, mel ne constituto vituperata. Semper nonumes electram quo ne. Mandamus pericula usu ex, an sed wisi dicam. Suas noluisse hendrerit sit eu, eam epicurei erroribus at. </p><p>Cum docendi accommodare ad, ad debitis principes consetetur qui. Pro alterum sensibus ex, ut sit libris quaeque ancillae. Sea sint iudico doming cu, quaeque detracto cum id. Ludus lucilius ad duo, pri impetus accumsan detraxit id. At amet modo delicata vim, debitis nostrum convenire vis ei. Delenit dolorem conclusionemque te mei, an vim impedit disputationi. Mel natum scriptorem ei, ad dictas delectus has, sed oratio legimus te.</p><p>Ne stet dicam oportere qui, populo eruditi eu duo. Sed aliquam adolescens ullamcorper at. Dicam consulatu ne has, qui et tale atomorum persequeris. Ut voluptatibus signiferumque nec.</p><p>Nonumy legimus volumus usu eu. Persius mediocrem eu nam, te eos omnium facilis, sed idque graeci intellegebat ne. Qui simul integre democritum id, vim ei tantas ridens imperdiet. Et sale officiis conclusionemque mei. Per ea sint dolore singulis, simul vocent ei cum.</p><p>Mel simul munere no, elitr mnesarchum efficiantur no est. An urbanitas scripserit qui, vim simul decore everti ut, vel errem legere adipisci id. Mei ut enim aperiam, verear nonumes salutatus sed at. Vix te petentium assentior philosophia, mea et accusam splendide reprimique.</p>" \
        } \
    ] \
}';

