# Fan Control solution with optional Zwift connection

A web-application to control a fan by a photon. The web-application controls fan's state and provides it to photon. 

## Modes and configuration

The photon makes a HTTP request to the node.js-app and gets back a simple line of text containing the desired fan level. The line looks like this: 

```
FCS4FLV1PWR0095HR110SPD027.3
```

At 8th position the fan level is tramitted (eg. 1).

`FCS` meens fan controller state which represents one of different modes of operation:

`0` fan off

`1` fan level one

`2` fan level two

`3` fan level three

`4` Zwift simulation: according to the nearly actual speed ridden in Zwift the fan level is set. Fan levels are configured in `configure.js` 
```
module.exports.speedLevel1 = 10;
module.exports.speedLevel2 = 30;
module.exports.speedLevel3 = 40;
```

`5` Zwift workout mode: the fan level is set dependent from power in Zwift if heartrate is above a defined level configured in `configure.js`
```
module.exports.heartrate = 125;

module.exports.powerLevel1 = 150;   
module.exports.powerLevel2 = 200;   
module.exports.powerLevel3 = 250;   
```

Thanks a lot to Just Vervaart and Ogadai. 

Following sections describe how to install node.js app and photon firmware.

## Installation node.js app

1. Clone or download this repository to the host with node.js installed where you want to run the app.
2. Install dependent packages eg. npm install.
3. Configure the app with file `configure.js` as described above and you like. There are a few more comments inline in config file.
4. Run the app with npm start.
5. Open the app with a browser `http://localhost:3000` or use the IP of the host, if you want to call the app from your mobile phone from within the same network, which would be the case if your host and mobile phone are connected to same wifi.

### Testing the app

1. Run the app with `npm start`.
2. Normaly you would test the app not riding on Zwift. You find the playerId of another rider from log file `./log/fancontrol.log` from within the folder where you cloned the respository. There's an line with `playerId: [5-6digits]`.
3. Copy the playerId from log-file to the configuration `configure.js`
(If you aren't riding and want to test the app you find the playerId of another rider just riding in log-file `./log/fancontrol.log`
4. Now restart the application.
5. Open the app with a browser `http://localhost:3000` or with an mobile phone.
6. Tap button `Get Fan State`.
7. You should see a string like this: `FCS4FLV1PWR0095HR110SPD027.3`. If all values are zero, stop the application and repeate from step 2.

## Installation photon app

The code for photon is in directory `photon-src`. Here you define the IP address of host running the node.js-app and the port.
