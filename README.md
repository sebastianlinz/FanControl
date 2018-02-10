# Fan Control node.js application

A web-application to control a fan by a photon. The web-application controls fan's state and provides it to photon. The photon makes a HTTP request and gets back a simple line of text containing the desired fan level. The line looks like this: 
> FCS4FLV1PWR0095HR110SPD027.3
At 8th position the fan level is tramitted.

'FCS' meens fan controller state. There are five states:
'0' fan off
'1' fan level one
'2' fan level two
'3' fan level three
'4' Zwift simulation: according to the nearly actual speed ridden in Zwift the fan level is set. Fan levels are configured in 'configure.js' 
'''
module.exports.speedLevel1
module.exports.speedLevel2
module.exports.speedLevel3
'''
'5' Zwift workout mode: the fan level is set dependent from power in Zwift if heartrate is above a defined level configured in 'configure.js'
'''
module.exports.heartrate = 125;

module.exports.powerLevel1 = 150;   
module.exports.powerLevel2 = 200;   
module.exports.powerLevel3 = 250;   
'''

The code for photon is in directory 'photon-src'. Here you define the IP address of host running the node.js-app and the port.

Thanks a lot to Just Vervaart and Ogadai. 

Configure the app in configure.js.
