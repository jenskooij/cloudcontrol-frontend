function showSchedulePublicationModal(path) {
  var schedulePublicationSlug = document.getElementById('schedulePublicationSlug');
  schedulePublicationSlug.setAttribute('value', path);
  toggleSchedulePublicationModal();
}

function toggleSchedulePublicationModal() {
  var schedulePublicationModel = document.getElementById('schedulePublication');
  if (schedulePublicationModel.className.indexOf('active') !== -1) {
    schedulePublicationModel.className = schedulePublicationModel.className.replace('active', '').trim();
  } else {
    schedulePublicationModel.className = schedulePublicationModel.className + ' active';
  }
}