const ZwiftAccount = require("zwift-mobile-api");
var logger = require('./logger');

class ZwiftAdapter {
    constructor(username, password, playerId) {
        logger.debug("ZwiftAdapter.constructor()");
        this.account = new ZwiftAccount(username, password);
        this.playerId = playerId;
        this.speed = 0;
        this.power = 0;
        this.heartrate = 0;

        this.account.getWorld(1).riders()
            .then(riders => {
                logger.debug('playerId: ' + JSON.stringify(riders.friendsInWorld[5].playerId));
            }).catch ( error => { 
                logger.error(JSON.stringify(error))
            });

    }

    getSpeed() {
        this.account.getWorld(1).riderStatus(this.playerId)
        .then(status => {
            // this.updateSpeed(status.speed); // status.riderStatus.speed
//            console.log(JSON.stringify(status));
            this.updateSpeed(status.speed/1000000, status.heartrate, status.power);
        })
        .catch(error => {
            logger.error("couldn't resolve promise riderStatus")
        });
        return this.speed;
    }

    getPower() {
        return this.power;
    }

    getHeartrate() {
        return this.heartrate;
    }

    updateSpeed(spd, hr, pwr) {
        logger.debug('updateSpeed() new speed: ' + spd + ' hr: ' + hr + ' pwr: ' + pwr);
        this.speed = spd;
        this.heartrate = hr;
        this.power = pwr;
    }

}

module.exports  = ZwiftAdapter