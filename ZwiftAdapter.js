const ZwiftAccount = require("zwift-mobile-api");

class ZwiftAdapter {
    constructor(username, password, playerId) {
        console.log("ZwiftAdapter.constructor()");
        this.account = new ZwiftAccount(username, password);
        this.playerId = playerId;
        this.speed = 0;
        this.power = 0;
        this.heartrate = 0;

        this.account.getWorld(1).riders()
            .then(riders => {
                console.log('playerId: ' + JSON.stringify(riders.friendsInWorld[5].playerId));
            }).catch ( error => { 
                console.log(JSON.stringify(error))
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
            console.log("couldn't resolve promise riderStatus")
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
        console.log('updateSpeed() new speed: ' + spd + ' hr: ' + hr + ' pwr: ' + pwr);
        this.speed = spd;
        this.heartrate = hr;
        this.power = pwr;
    }

}

module.exports  = ZwiftAdapter