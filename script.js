// Initialize video player with default video
const videoPlayer = document.getElementById("videoPlayer");
const defaultVideoSelect = document.getElementById("defaultVideoSelect");

// Function to change default video based on dropdown selection
function changeDefaultVideo() {
  const selectedVideo = defaultVideoSelect.value;
  videoPlayer.src = selectedVideo;
  videoPlayer.load();
  videoPlayer.play();
}

// Upload functionality remains the same
document.getElementById("uploadButton").addEventListener("click", function () {
  document.getElementById("videoUpload").click();
});

document
  .getElementById("videoUpload")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      videoPlayer.src = fileURL;
      videoPlayer.load();
      videoPlayer.play();
    }
  });

// Load default video when the page loads
window.addEventListener("load", function () {
  changeDefaultVideo(); // This will load the initial default video
});
