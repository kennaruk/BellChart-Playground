$('.input-group.date').datepicker({
    autoclose: true,
    todayHighlight: true
});

function printDate() {
    var dateData = $('#date-picker-from').val();
    var dateData = $('#date-picker-to').val();
    
    console.log(dateData);
}