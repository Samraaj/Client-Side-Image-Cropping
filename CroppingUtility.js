function getCroppedDataURI(imgObj, cropX, cropY, cropWidth, cropHeight, outputInfo) {
  var canvas = getImageCanvasObject(imgObj, cropX, cropY, cropWidth, cropHeight, outputInfo);
  var dataURLStr = canvas.toDataURL();
  // variable dataURL is a string holding the dataURI information for the cropped image

  return dataURLStr;
}

function getCroppedDataBlob(imgObj, cropX, cropY, cropWidth, cropHeight, outputInfo) {
  var dataURI = getCroppedDataURI(imgObj, cropX, cropY, cropWidth, cropHeight, outputInfo);
  // There are functions to go directly from canvas to blob data, but lots of them are limiting
  // in terms of browser (mozilla) so it is more extendable to convert manually
  var blobObject = dataURItoBlob(dataURI);

  return blobObject;
}

//data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAAClCAYAAAC+7wThAAAgAElEQVR4Xly9B5xl11Xmu+6teyv

function dataURItoBlob(data) {
  // convert base64/URLEncoded data component to raw binary data held in a string

  var splitURI = data.split(',');
  var bStr = (splitURI[0].indexOf('base64') >= 0) ? atob(splitURI[1]) : unescape(splitURI[1]);
  var mime = splitURI[0].split(':')[1].split(';')[0];

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(bStr.length);
  for (var i = 0; i < bStr.length; i++) {
    ia[i] = bStr.charCodeAt(i);
  }

  return new Blob([ia], {type:mime});
}

function getImageCanvasObject (imgObj, cropX, cropY, cropWidth, cropHeight, outputInfo) {
  if (outputInfo.length != 3) {
    //throw an exception
  }
  if (cropX < 0 || cropY < 0 || cropWidth <= 0 || cropHeight <= 0) {
    //throw a detailed exception
  }

  var canvas = document.createElement('canvas');
  if (outputInfo[0] != 0) {
    canvas.width = cropWidth * outputInfo[0];
    canvas.height = cropHeight * outputInfo[0];
  } else if (outputInfo[1] != 0) {
    canvas.width = outputInfo[1]
    //TODO other one
  } else if (outputInfo[2] != 0) {
    canvas.height = outputInfo[2];
    //TODO other one
  } else {
    //throw an exception detailing proper usage of this thingy
  }

  var context = canvas.getContext('2d');
  imageObj.setAttribute('crossOrigin', 'anonymous');
  // draw cropped image
  context.drawImage(imageObj, cropX, cropY, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height);

  return canvas;
  
}