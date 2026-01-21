import {
  ObjectDetector,
  FilesetResolver,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2";

const inputFile = document.querySelector("#ImageInput");
const showImage = document.querySelector("#ShowImage");
const getLabel = document.getElementsByTagName("label")[0];
const dropContainer = document.querySelector(".UplaodImageContainer");

inputFile.addEventListener("change", uplaodImage);

function uplaodImage() {
  const file = inputFile.files[0];

  if (file) {
    showImage.src = URL.createObjectURL(file);

    // 2. Hide the label immediately after upload
    getLabel.style.display = "none";

    // 3. Make the image visible (if it was hidden)
    showImage.style.display = "block";
  }
}
// drag and drop
dropContainer.addEventListener("dragover", function (e) {
  e.preventDefault();
});
dropContainer.addEventListener("drop", function (e) {
  e.preventDefault();
  inputFile.files = e.dataTransfer.files;
  uplaodImage();
});

const removeImgBtn = document
  .querySelector(".removeImageBtn")
  .addEventListener("click", function () {
    showImage.style.display = "none";
    getLabel.style.display = "flex";
  });

// AI Model CODE

const vision = await FilesetResolver.forVisionTasks(
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.2/wasm",
);

const objectdetect = await ObjectDetector.createFromOptions(vision, {
  baseOptions: {
    modelAssetPath: `efficientdet_lite0.tflite`,
    delegate: "GPU",
  },
  scoreThreshold: 0.5,
  runningMode: "IMAGE",
});



showImage.onload = async () => {
  const find = await objectdetect.detect(showImage);
  console.log(find);
  find.detections.forEach((result, index) => {
    let category = result.categories[0];
    let name = category.categoryName;
    const confidence = Math.round(category.score * 100);
    console.log(name, confidence);
  });
};
