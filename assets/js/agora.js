/* global AgoraRTC */

const audioSelect = document.querySelector('select#audioSource');
const videoSelect = document.querySelector('select#videoSource');
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

let client;
let camera;
let microphone;
let localStream;
const APP_KEY = 'afe35da78e094bb0bad8a2778bf2397c';
let channelKey = null;
const channelValue = 'DEMO_CHANNEL';

const initClient = clientToInit => new Promise((resolve, reject) => clientToInit.init(APP_KEY, () => resolve()));
const joinChannel =
  (clientToJoinChannel, joinChannelKey, joinChannelValue) => new Promise((resolve, reject) => clientToJoinChannel.join(joinChannelKey, joinChannelValue, null, uid => resolve(uid)));

const join = async () => {
  client = AgoraRTC.createClient({mode: 'interop'});
  await initClient(client);
  const uid = await joinChannel(client, channelKey, channelValue);
  console.log('AgoraRTC client initialized');
  console.log('User ' + uid + ' join channel successfully');
  camera = videoSelect.value;
  microphone = audioSelect.value;
  localStream = AgoraRTC.createStream({
    streamID: uid,
    audio: true,
    cameraId: camera,
    microphoneId: microphone,
    video: true,
    screen: false
  });
  localStream.setVideoProfile('720p_3');
  // The user has granted access to the camera and mic.
  localStream.on('accessAllowed', () => {
    console.log('accessAllowed');
  });

  // The user has denied access to the camera and mic.
  localStream.on('accessDenied', () => {
    console.log('accessDenied');
  });

  localStream.init(() => {
    console.log('getUserMedia successfully');
    localStream.play('agora_local');

    client.publish(localStream, err => {
      console.log('Publish local stream error: ' + err);
    });

    client.on('stream-published', evt => {
      console.log('Publish local stream successfully');
    });
  }, err => {
    console.log('getUserMedia failed', err);
  });

  channelKey = '';
  client.on('error', err => {
    console.log('Got error msg:', err.reason);
    if (err.reason === 'DYNAMIC_KEY_TIMEOUT') {
      client.renewChannelKey(channelKey, () => {
        console.log('Renew channel key successfully');
      }, err => {
        console.log('Renew channel key failed: ', err);
      });
    }
  });


  client.on('stream-added', evt => {
    const stream = evt.stream;
    console.log('New stream added: ' + stream.getId());
    console.log('Subscribe ', stream);
    client.subscribe(stream, err => {
      console.log('Subscribe stream failed', err);
    });
  });

  client.on('stream-subscribed', evt => {
    const stream = evt.stream;
    console.log('Subscribe remote stream successfully: ' + stream.getId());
    if ($('div#video #agora_remote' + stream.getId()).length === 0) {
      $('div#video').append('<div id="agora_remote' + stream.getId() + '" style="float:left; width:810px;height:607px;display:inline-block;"></div>');
    }
    stream.play('agora_remote' + stream.getId());
  });

  client.on('stream-removed', evt => {
    const stream = evt.stream;
    stream.stop();
    $('#agora_remote' + stream.getId()).remove();
    console.log('Remote stream is removed ' + stream.getId());
  });

  client.on('peer-leave', evt => {
    const stream = evt.stream;
    if (stream) {
      stream.stop();
      $('#agora_remote' + stream.getId()).remove();
      console.log(evt.uid + ' leaved from this channel');
    }
  });
};

const joinButton = document.querySelector('#join');
joinButton.onclick = join;

/**
 * Initializes all the analytics setup. Creates trackers and sets initial
 * values on the trackers.
 */
export default async () => {
  if (!AgoraRTC.checkSystemRequirements()) alert('browser is no support webRTC');
  const devices = await getDevices;
  addDevicesToWebInterface(devices);
};
