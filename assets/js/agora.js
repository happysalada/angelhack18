/* global AgoraRTC */

const audioSelect = document.querySelector('select#audioSource');
const videoSelect = document.querySelector('select#videoSource');
console.log(audioSelect);
console.log(videoSelect);
/**
 * Get the list of devices
 */
const getDevices = new Promise((resolve, reject) => AgoraRTC.getDevices(devices => resolve(devices)));

const addDevicesToWebInterface = devices => {
  devices.forEach(device => {
    const option = document.createElement('option');
    option.value = device.deviceId;
    if (device.kind === 'audioinput') {
      option.text = device.label || 'microphone ' + (audioSelect.length + 1);
      audioSelect.appendChild(option);
    } else if (device.kind === 'videoinput') {
      option.text = device.label || 'camera ' + (videoSelect.length + 1);
      videoSelect.appendChild(option);
    } else {
      console.log('Some other kind of source/device: ', device);
    }
  });
};

/**
 * Initializes all the analytics setup. Creates trackers and sets initial
 * values on the trackers.
 */
export default async () => {
  if (!AgoraRTC.checkSystemRequirements()) alert('browser is no support webRTC');
  const devices = await getDevices;
  addDevicesToWebInterface(devices);
};
