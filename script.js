document.getElementById("uploadButton").addEventListener("click", function () {
  document.getElementById("videoUpload").click();
});

document
  .getElementById("videoUpload")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const videoPlayer = document.getElementById("videoPlayer");
      const fileURL = URL.createObjectURL(file);
      videoPlayer.src = fileURL;
      videoPlayer.load();
      videoPlayer.play();
    }
  });
