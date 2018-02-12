// ------------
// Fan Controller
// ------------

#include <stdlib.h>
#include <string.h>

// This #include statement was automatically added by the Particle IDE.
#include <HttpClient.h>

/*-------------

We've heavily commented this code for you. If you're a pro, feel free to ignore it.

Comments start with two slashes or are blocked off by a slash and a star.
You can read them, but your device can't.
It's like a secret message just for you.

Every program based on Wiring (programming language used by Arduino, and Particle devices) has two essential parts:
setup - runs once at the beginning of your program
loop - runs continuously over and over

-------------*/

/**
 * Define your settings here
 */
#define RELAY2 D4
#define RELAY3 D5
#define RELAY4 D6
#define HOST_IP "192.168.178.115"
#define HOST_PORT 3000

/**
* Declaring the variables.
*/
unsigned int nextTime = 0;    // Next time to contact the server
int loopCounter = 0;
int fanLevel = 0;

HttpClient http;

// Headers currently need to be set at init, useful for API keys etc.
http_header_t headers[] = {
    { "Accept" , "*/*"},
    { NULL, NULL } // NOTE: Always terminate headers will NULL
};

http_request_t request;
http_response_t response;


// Having declared these variables, let's move on to the setup function.
// The setup function is a standard part of any microcontroller program.
// It runs only once when the device boots up or is reset.

void resetPins() {
    Serial.println("FanController.resetPins(): entry.");
    digitalWrite(RELAY2, LOW);
    digitalWrite(RELAY3, LOW);
    digitalWrite(RELAY4, LOW);
    Serial.println("FanController.resetPins(): entry.");
}

void httpRequestBodyHandler(const char *data) {
    char body[strlen(data)];
    strcpy(body, data);
    int flv = atoi(&body[7]);
    Serial.printlnf("httpRequestBodyHandler(data): fan-level  : %d", fanLevel);
    Serial.printlnf("httpRequestBodyHandler(data): bodyHandler: %d", flv);
    if (fanLevel != flv) {
        resetPins();
        switch ( flv ) {
            case 1 : 
                digitalWrite(RELAY2, HIGH);
                break;
            case 2 :
                digitalWrite(RELAY3, HIGH);
                break;
            case 3 :
                digitalWrite(RELAY4, HIGH);
        }
        fanLevel = flv;
    }
}

void setupPins() {
    Serial.println("FanController.setupPins(): entry.");
    
    pinMode(RELAY2, OUTPUT);
    Serial.println("FanController.setupPins(): RELAY2 mode OUTPUT");
    pinMode(RELAY3, OUTPUT);
    Serial.println("FanController.setupPins(): RELAY3 mode OUTPUT");
    pinMode(RELAY4, OUTPUT);
    Serial.println("FanController.setupPins(): RELAY4 mode OUTPUT");
    
    Serial.println("FanController.setupPins(): done.");
}

void setupHttpRequest() {
    Serial.println("FanController.setupHttpRequest(): entry."); 
    
    // Request path and body can be set at runtime or at setup.
    // IP of the host running the node.js app
    request.hostname = HOST_IP;  
    // port of the node.js express app
    request.port = HOST_PORT;
    request.path = "/getFanLevel";
    
    Serial.println("FanController.setupHttpRequest(): done.");
}
          


void setup() {

    // wait 3 seconds to read serial output if necessary
    delay(3000);
    // It's important you do this here, inside the setup() function rather than outside it or in the loop function.
    Serial.begin();
    Serial.println("FanController.setup()");
    setupPins();
    Serial.println("FanController.setup(): pins setup");
    setupHttpRequest();
    delay(5000);

}

// Next we have the loop function, the other essential part of a microcontroller program.
// This routine gets repeated over and over, as quickly as possible and as many times as possible, after the setup function is called.
// Note: Code that blocks for too long (like more than 5 seconds), can make weird things happen (like dropping the network connection).  The built-in delay function shown below safely interleaves required background activity, so arbitrarily long delays can safely be done if you need them.

void loop() {
    
    Serial.printlnf("loop(): number %d", ++loopCounter);
    
    if (nextTime > millis()) {
        return;
    }

    // Get request
    http.get(request, response, headers);
    Serial.printlnf("loop(): Response status: %d", response.status);
    if (response.status == 200) {
        Serial.print("loop(): HTTP Response Body: ");
        Serial.println(response.body);
        httpRequestBodyHandler(response.body);
    } else {
        resetPins();
    }

    // delay between HTTP requests
    nextTime = millis() + 5000;
}

