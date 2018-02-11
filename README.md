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
5. Open the app with a browser `http://localhost:3000` or use the IP of the host, if you want to call the app from your mobile phone from within the same network, which would be the case if your host and mobile phone are connected to same Wi-Fi network.

### Testing the app

1. Run the app with `npm start`.
2. Normaly you would test the app not riding on Zwift. You find the playerId of another rider from log file `./log/fancontrol.log` from within the folder where you cloned the respository. There's an line with `playerId: [5-6digits]`.
3. Copy the playerId from log-file to the configuration `configure.js`
4. Now restart the application.
5. Open the app with a browser `http://localhost:3000` or with an mobile phone.
6. Tap button `Get Fan State`.
7. You should see a string like this: `FCS4FLV1PWR0095HR110SPD027.3`. If all values are zero, stop the application and repeate from step 2.

## Installation photon app

This is a short description on how to install the particle app on the photon. Assumption you have a fan with different speeds, a photon, a particle relay shield and a DC adapter.

**Use these instruction at your own risk. Be carefull working with deadly currents**

The picture shows how the cabling of the relay shield could look:

![Picture of relay shield cabling](https://github.com/sebastianlinz/FanControl/blob/master/cabling_relay_shield.jpg)

The fan's power cables are connected to the DC adapter. Connect the DC adapter to feed the relay shield. Be aware of the polarization.  Furthermore the phase (brown) of the power feeding cable is connected with the relay's COMM ports. The neutral (blue) of the power feeding cable is connected with the neutral of the fan's electro motor. The fan motor cables of the different speed levels are connected each one to a NO (normally open) port of an relay. Remember which cable is connected to which relay. The relay shield connects each relay with a digital pin. You find the number of the digital pin next to the relay (eg. D4 next relay 2). Remember the pin numbers you choose.

1. Create an particle app in Web IDE (eg. "FanController").
2. Copy code from file `photon-src/fancontroller.ino` from repository to Web IDE.
3. Check and eventually replace D4, D5 and D6 according to your wiring (I'm going to refactor this :innocent: ).
4. Set `request.hostname` and `request.port` according to your settings. The choose the IP address of your host running the node.js app and port 3000 or the one you choosed.
5. Flash the code to the photon.

### Testing the photon

If the photon is connected to a PC by USB you can use Putty to see log statements.
