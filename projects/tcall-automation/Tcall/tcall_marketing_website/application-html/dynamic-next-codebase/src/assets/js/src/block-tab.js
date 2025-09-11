function tabOpen(evt, tabtarget) {
  var i, tabcontent, tablinks;
  
  // Hide all tab content
  tabcontent = document.getElementsByClassName("o-tab__content");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  
  // Remove the 'active' class from all tab links
  tablinks = document.getElementsByClassName("o-tab__button");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace("active", "");
  }
  
  // Display the current tab and add 'active' class to the clicked tab button
  document.getElementById(tabtarget).style.display = "block";
  evt.currentTarget.className += " active";
}

// Get the element with the class "js-open" and click on it
document.addEventListener('DOMContentLoaded', function() {
  var defaultTab = document.querySelector(".js-open");
  if (defaultTab) {
    defaultTab.click();
  } else {
    console.error('No element found with class "js-open"');
  }
});