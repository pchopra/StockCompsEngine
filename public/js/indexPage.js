var recalculateHrefs = function () {
  var key = $('#key').val();
  var targets = $('#viewproducts').add('#testkey');
  $(targets).each(function () {
    var base = $(this).data('baseref');
    $(this).attr('href', base + '?key=' + key);
  })
};

$(function () {
  recalculateHrefs();
  $('#key').on('keydown keyup change', recalculateHrefs);
});
