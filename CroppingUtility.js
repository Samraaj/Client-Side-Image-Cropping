/**
  * Converts inputted image object and dimensions to a DataURI format cropped file
  *
  * @param {imgObj}     javascript "Image" object holding the image that will be cropped
  * @param {cropX}      positive integer value holding X axis pixel count to upper left
  *                     corner of cropping area
  * @param {cropY}      positive integer value holding Y axis pixel count to upper left
  *                     corner of cropping area
  * @param {cropWidth}  positive integer value for pixel count of cropping area width
  * @param {cropHeight} positive integer value for pixed count of cropping area height
  * @param {outputInfo} Object with 3 possible settings determining output dimensions:
  *                     scale (positive integer): if set, scales natural crop area dim 
  *                                               by this factor. Top priority.
  *                     width (positive integer): if set, scales output dim to match
  *                                               value with natural Y to preserve 
  *                                               aspect ratio
  *                     height (positive integer):  if set, scales output dim to match
  *                                                 value with natural X to preserve 
  *                                                 aspect ratio
  *
  * @return             String representation of the of the resulting image dataURI
  */
function getCroppedDataURI(imgObj, cropX, cropY, cropWidth, cropHeight, outputInfo = {}) {
  var canvas = getImageCanvasObject(imgObj, cropX, cropY, cropWidth, cropHeight, outputInfo);
  var dataURLStr = canvas.toDataURL();
  // variable dataURL is a string holding the dataURI information for the cropped image

  return dataURLStr;
}

/**
  * Converts inputted image object and dimensions to a blob format cropped file
  *
  * @param {imgObj}     javascript "Image" object holding the image that will be cropped
  * @param {cropX}      positive integer value holding X axis pixel count to upper left
  *                     corner of cropping area
  * @param {cropY}      positive integer value holding Y axis pixel count to upper left
  *                     corner of cropping area
  * @param {cropWidth}  positive integer value for pixel count of cropping area width
  * @param {cropHeight} positive integer value for pixed count of cropping area height
  * @param {outputInfo} Object with 3 possible settings determining output dimensions:
  *                     scale (positive integer): if set, scales natural crop area dim 
  *                                               by this factor. Top priority.
  *                     width (positive integer): if set, scales output dim to match
  *                                               value with natural Y to preserve 
  *                                               aspect ratio. Mid priority.
  *                     height (positive integer):  if set, scales output dim to match
  *                                                 value with natural X to preserve 
  *                                                 aspect ratio. Low priority
  *
  * @return             Javascript "Blob" object repressenting resulting image
  */
function getCroppedDataBlob(imgObj, cropX, cropY, cropWidth, cropHeight, outputInfo) {
  var dataURI = getCroppedDataURI(imgObj, cropX, cropY, cropWidth, cropHeight, outputInfo);
  // There are functions to go directly from canvas to blob data, but lots of them are limiting
  // in terms of browser (mozilla) so it is more extendable to convert manually
  var blobObject = dataURItoBlob(dataURI);

  return blobObject;
}

/**
  * Converts inputted image object and dimensions to a DataURI format cropped file
  *
  * @param {imgObj}     javascript "Image" object holding the image that will be cropped
  * @param {cropX}      positive integer value holding X axis pixel count to upper left
  *                     corner of cropping area
  * @param {cropY}      positive integer value holding Y axis pixel count to upper left
  *                     corner of cropping area
  * @param {cropWidth}  positive integer value for pixel count of cropping area width
  * @param {cropHeight} positive integer value for pixed count of cropping area height
  * @param {outputInfo} Object with 3 possible settings determining output dimensions:
  *                     scale (positive integer): if set, scales natural crop area dim 
  *                                               by this factor. Top priority.
  *                     width (positive integer): if set, scales output dim to match
  *                                               value with natural Y to preserve 
  *                                               aspect ratio. Mid priority.
  *                     height (positive integer):  if set, scales output dim to match
  *                                                 value with natural X to preserve 
  *                                                 aspect ratio. Low priority
  *
  * @return             String representation of the of the resulting image dataURI
  */
function dataURItoBlob(data) {
  // Split the data info (mime type, encoding, etc) from encoded data
  var splitURI = data.split(',');
  // Decode based on representation
  var bStr = (splitURI[0].indexOf('base64') >= 0) ? atob(splitURI[1]) : unescape(splitURI[1]);
  // extracts mime information
  var mime = splitURI[0].split(':')[1].split(';')[0];

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(bStr.length);
  for (var i = 0; i < bStr.length; i++) {
    ia[i] = bStr.charCodeAt(i);
  }

  return new Blob([ia], {type:mime});
}

/**
  * Draws image object to an HTML canvas and returns the representing javascript object
  *
  * @param {imgObj}     javascript "Image" object holding the image that will be cropped
  * @param {cropX}      positive integer value holding X axis pixel count to upper left
  *                     corner of cropping area
  * @param {cropY}      positive integer value holding Y axis pixel count to upper left
  *                     corner of cropping area
  * @param {cropWidth}  positive integer value for pixel count of cropping area width
  * @param {cropHeight} positive integer value for pixed count of cropping area height
  * @param {outputInfo} Object with 3 possible settings determining output dimensions:
  *                     scale (positive integer): if set, scales natural crop area dim 
  *                                               by this factor. Top priority.
  *                     width (positive integer): if set, scales output dim to match
  *                                               value with natural Y to preserve 
  *                                               aspect ratio. Mid priority.
  *                     height (positive integer):  if set, scales output dim to match
  *                                                 value with natural X to preserve 
  *                                                 aspect ratio. Low priority.
  *
  * @return             Javascript Canvas object representing cropped image drawn to a
  *                     canvas
  */
function getImageCanvasObject (imgObj, cropX, cropY, cropWidth, cropHeight, outputInfo) {
  if (cropX < 0 || cropY < 0 || cropWidth <= 0 || cropHeight <= 0) {
    //throw a detailed exception
  }

  var canvas = document.createElement('canvas');
  if ('scale' in outputInfo) {
    if (outputInfo['scale'] <= 0) {
      // Throw an exception here
    }
    canvas.width = cropWidth * outputInfo['scale'];
    canvas.height = cropHeight * outputInfo['scale'];
  } else if ('width' in outputInfo) {
    if (outputInfo['width'] <= 0) {
      // Throw an exception here
    }
    canvas.width = outputInfo['width']
    canvas.height = (outputInfo['width'] * cropHeight) / cropWidth;
  } else if ('height' in outputInfo) {
    if (outputInfo['height'] <= 0) {
      // Throw an exception here
    }
    canvas.height = outputInfo['height'];
    canvas.width = (outputInfo['height'] * cropWidth) / cropHeight;
  } else {
    //throw an exception detailing proper usage of this thingy
  }

  var context = canvas.getContext('2d');
  imageObj.setAttribute('crossOrigin', 'anonymous');
  // draw cropped image
  context.drawImage(imageObj, cropX, cropY, cropWidth, cropHeight, 0, 0, canvas.width, canvas.height);

  return canvas;
  
}