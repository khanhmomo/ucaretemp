const persons = ["180039_", "180040_"];
//number of photos for the training
const NUMBER_OF_PHOTOS = 5;

function getFaceImageUri(className, idx) {
  return `${className}/${className}${idx}.png`;
}

async function createFaceMatcher(numImagesForTraining = NUMBER_OF_PHOTOS) {
  const maxAvailableImagesPerClass = NUMBER_OF_PHOTOS;
  numImagesForTraining = Math.min(
    numImagesForTraining,
    maxAvailableImagesPerClass
  );

  const labeledFaceDescriptors = await Promise.all(
    persons.map(async className => {
      const descriptors = [];
      for (let i = 1; i < numImagesForTraining + 1; i++) {
        const img = await faceapi.fetchImage(getFaceImageUri(className, i));
        descriptors.push(await faceapi.computeFaceDescriptor(img));
      }

      return new faceapi.LabeledFaceDescriptors(className, descriptors);
    })
  );

  var faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);


  
  return faceMatcher;
}

async function createSingleFaceMatcher() {
  await changeFaceDetector(TINY_FACE_DETECTOR);
  changeInputSize(512);

  const referenceImage = await faceapi.fetchImage(
    getFaceImageUri(persons[0], NUMBER_OF_PHOTOS)
  );
  const results = await faceapi
    .detectAllFaces(referenceImage)
    .withFaceLandmarks()
    .withFaceDescriptors();

  if (!results.length) {
    return null;
  }

  // create FaceMatcher with automatically assigned labels
  // from the detection results for the reference image
  const faceMatcher = new faceapi.FaceMatcher(results);

  return faceMatcher;
}
