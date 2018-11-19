// JPHACKS 2018 KB_1808
//   TempTech software for ESP8266
//
//   written by Aonori
//      Special thanks tamtam

#include <WiFi.h>
#include <HTTPClient.h>
#include <WebServer.h>
#include <ESPmDNS.h>
#include <Adafruit_NeoPixel.h>

#include <Wire.h>
#include <SparkFunMLX90614.h>

// --- Wifi settings ---
const char* ssid = "JashiPhone";
const char* password = "WonderlandAlice";

// --- Full color LED array ---

#define MAX_VAL 25  // 0 to 255 for brightness
#define DELAY_TIME 30

Adafruit_NeoPixel strip = Adafruit_NeoPixel(9, 19, NEO_GRB + NEO_KHZ800);

// --- Switch array (Under LED) ---
#define SW_SAMPLE 1
#define NUM_OF_SW 8
const int sw_pins[NUM_OF_SW] = {25, 23, 18, 5, 17, 16, 4, 13};  // Switch pins
bool sw_pushed[NUM_OF_SW] = {false, false, false, false, false, false, false, false};  // LED status array
const float sw_detThreshold = 0.8;    // Switch detection threshold

// --- Mode Selection ---
int current_mode = 0;
const int longPushTime = 3;
int sw_push_counter[NUM_OF_SW] = {0, 0, 0, 0, 0, 0, 0, 0};
bool sw_long_pushed[NUM_OF_SW] = {false, false, false, false, false, false, false, false};

// --- Thermal sensor ---
int temp_target[NUM_OF_SW] = {35, 70, 10, 20, 40, 80, 20, 100};
#define TMP_RANGE   25

// --- notify ---
bool isFirstNotify = true;
bool isFirstStateCooler = false;
const char* host = "https://31j3bqwtu6.execute-api.us-west-2.amazonaws.com/shikuhack/device/notification?coaster_mac=8c-85-90-05-e1-0f";

IRTherm therm;

void setup() {
  // Init Serial Port
  Serial.begin(115200);
  delay(10);
  Serial.println();

  // GPIO Init for sw
  for (int i = 0; i < sizeof(sw_pins) / sizeof(sw_pins[0]); i++) {
    pinMode(sw_pins[i], INPUT_PULLUP);
  }

  // Init LED Array
  strip.begin();
  strip.show(); // Initialize all pixels to 'off'

  // Init Thermal Sensor
  therm.begin(); // Initialize thermal IR sensor
  therm.setUnit(TEMP_C);


  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  Serial.print("Connecting to ");
  Serial.println(ssid);

  while (WiFi.status() != WL_CONNECTED) {
    delay(250);
    colorWipe(strip.Color(0, 0, 0), DELAY_TIME);
    delay(250);
    colorWipe(strip.Color(MAX_VAL, MAX_VAL, 0), DELAY_TIME);

    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  // Show Wifi Connected rainbow
  rainbowCycle(5, 1);
  colorWipe(strip.Color(0, 0, 0), 30);
}

void loop() {
  // Read Thermal Sensor
  if (therm.read()) {
    // Current Tempreture
    int temp = therm.object();

    // Switch Status Detection
    getAllSwitchStatus(sw_pushed, SW_SAMPLE);
    detectLongPush(sw_pushed, sw_push_counter, sw_long_pushed);
    for (int i = 0; i < NUM_OF_SW; i++) {
      if (sw_long_pushed[i]) {
        // Change Target Tempreture in Current Mode
        changeTargetTemp(temp, i);

        //        Serial.println("Target temp changed to " +
        //                       String(temp_target[i]) +
        //                       "C in mode " + String(i)
        //                      );

        // enable notify
        isFirstNotify = true;

        // first cooler or hotter
        if (temp < temp_target[i]) {
          isFirstStateCooler = true;
        }
        else {
          isFirstStateCooler = false;
        }
      }
      else if (sw_push_counter[i] == 1) {
        // Change Current Mode
        current_mode = i;
        //        Serial.println("Mode changed to " + String(current_mode));

        // enable notify
        isFirstNotify = true;

        // first cooler or hotter
        if (temp < temp_target[i]) {
          isFirstStateCooler = true;
        }
        else {
          isFirstStateCooler = false;
        }
      }
    }

    // Tempreture Detection
    int ratio = 0;

    if (temp > temp_target[current_mode] + TMP_RANGE) {
      ratio = 100;
    }
    else if (temp < temp_target[current_mode] - TMP_RANGE) {
      ratio = -100;
    }
    else {
      ratio = (float)(temp - temp_target[current_mode]) / TMP_RANGE * 100;
    }

    // colorize
    int led_r, led_g, led_b;
    if (ratio > 0) led_r = MAX_VAL * ratio / 100;
    else led_r = 0;

    if (ratio >= 0 && ratio < 50) led_g = MAX_VAL * (1.0 - (abs(ratio) / 50.0));
    else if (ratio > -50 && ratio < 0) led_g = MAX_VAL * (1.0 - (abs(ratio) / 50.0));
    else led_g = 0;

    if (ratio < 0) led_b = MAX_VAL * abs(ratio) / 100;
    else led_b = 0;

    //printColorizeLog(temp, temp_target[current_mode], led_r, led_g, led_b);

    colorWipe(strip.Color(led_r, led_g, led_b), DELAY_TIME);

    // Notify
    if (isFirstNotify) {
      if ((isFirstStateCooler && ratio > 0 ) ||
          (!isFirstStateCooler && ratio < 0)) {
        // POST REQUEST
        HTTPClient http;
        http.begin(host);
        int httpCode = http.POST("");
        //Serial.println("HTTP REQ : " + String(httpCode));

        isFirstNotify = false;
      }
    }
  }
}

void changeTargetTemp(int temp, int c_mode) {
  strip.setPixelColor(getRealPos(8 - c_mode), strip.Color(0, 0, 0));
  strip.show();
  delay(20);

  int nyan_led = 1;
  for (int x = -93; x <= 120; x += ((float)200 / 7)) {
    int r, g, b;

    if (nyan_led > 7) {
      break;
    }

    if (x > 0) r = MAX_VAL * x / 100;
    else r = 0;

    if (x >= 0 && x < 50) g = MAX_VAL * (1.0 - (abs(x) / 50.0));
    else if (x > -50 && x < 0) g = MAX_VAL * (1.0 - (abs(x) / 50.0));
    else g = 0;

    if (x < 0) b = MAX_VAL * abs(x) / 100;
    else b = 0;

    strip.setPixelColor(getRealPos(8 - c_mode + nyan_led), strip.Color(r, g, b));
    strip.show();
    delay(20);

    nyan_led++;
  }

  bool is_pushed = false;
  while (!is_pushed) {
    // Switch Status Detection
    getAllSwitchStatus(sw_pushed, SW_SAMPLE);
    detectLongPush(sw_pushed, sw_push_counter, sw_long_pushed);

    for (int i = 0; i < NUM_OF_SW; i++) {
      if (sw_pushed[i] && i != c_mode) {
        is_pushed = true;
        break;
      }
    }
  }

  for (int i = 0; i < NUM_OF_SW; i++) {
    if (sw_pushed[i]) {
      temp_target[c_mode] = temp + (getRealPos(i - c_mode) - 4) * ((float)TMP_RANGE / 4);
      //Serial.println(getRealPos(i - c_mode) - 4);
      break;
    }
  }

  while (true) {
    getAllSwitchStatus(sw_pushed, SW_SAMPLE);
    detectLongPush(sw_pushed, sw_push_counter, sw_long_pushed);

    bool isAllReleased = true;
    for (int i = 0; i < NUM_OF_SW; i++) {
      if (sw_pushed[i]) {
        isAllReleased  = false;
      }
    }

    if (isAllReleased) break;
  }
}

int getRealPos(int val) {
  if (val > 7) {
    return val - 8;
  }
  else if (val < 0) {
    return val + 8;
  }
  else {
    return val;
  }
}

void getAllSwitchStatus(bool * _sw_status, int sample) {
  int sw_PushedCount[NUM_OF_SW];

  for (int i = 0; i < NUM_OF_SW; i++) {
    sw_PushedCount[i] = 0;
  }

  for (int t = 0; t < sample; t++) {
    for (int i = 0; i < NUM_OF_SW; i++) {
      if (digitalRead(sw_pins[i]) == LOW) {
        sw_PushedCount[i]++;
      }
    }
  }

  for (int i = 0; i < NUM_OF_SW; i++) {
    if ((float)sw_PushedCount[i] / sample >= sw_detThreshold) {
      _sw_status[i] = true;
    }
    else {
      _sw_status[i] = false;
    }
  }
}

void detectLongPush(bool * _sw_pushed, int *_sw_pushed_count, bool * _sw_long) {
  for (int i = 0; i < NUM_OF_SW; i++) {
    if (_sw_pushed[i]) {
      _sw_pushed_count[i]++;
      if (_sw_pushed_count[i] >= longPushTime) {
        _sw_long[i] = true;
      }
    }
    else {
      _sw_pushed_count[i] = 0;
      _sw_long[i] = false;
    }
  }
}

void printColorizeLog(int temp, int target, int led_r, int led_g, int led_b) {
  Serial.print(String(temp) + " ");
  Serial.print(String(target) + " ");
  Serial.print("[R:");
  Serial.print(led_r);
  Serial.print(" G:");
  Serial.print(led_g);
  Serial.print(" B:");
  Serial.print(led_b);
  Serial.println("]");
}

// Fill the dots one after the other with a color
void colorWipe(uint32_t c, uint8_t wait) {
  for (uint16_t i = 0; i < strip.numPixels(); i++) {
    strip.setPixelColor(i, c);
    strip.show();
    delay(wait);
  }
}

void rainbow(uint8_t wait) {
  uint16_t i, j;

  for (j = 0; j < 256; j++) {
    for (i = 0; i < strip.numPixels(); i++) {
      strip.setPixelColor(i, Wheel((i + j) & 255));
    }
    strip.show();
    delay(wait);
  }
}

// Slightly different, this makes the rainbow equally distributed throughout
void rainbowCycle(uint8_t wait, uint8_t cycle_count) {
  uint16_t i, j;

  for (j = 0; j < 256 * cycle_count; j++) { // n cycles of all colors on wheel
    for (i = 0; i < strip.numPixels(); i++) {
      strip.setPixelColor(i, Wheel(((i * 256 / strip.numPixels()) + j) & 255));
    }
    strip.show();
    delay(wait);
  }
}

// Input a value 0 to 255 to get a color value.
// The colours are a transition r - g - b - back to r.
uint32_t Wheel(byte WheelPos) {
  if (WheelPos < 85) {
    return strip.Color((WheelPos * 3) * MAX_VAL / 255, (255 - WheelPos * 3) * MAX_VAL / 255, 0);
  } else if (WheelPos < 170) {
    WheelPos -= 85;
    return strip.Color((255 - WheelPos * 3) * MAX_VAL / 255, 0, (WheelPos * 3) * MAX_VAL / 255);
  } else {
    WheelPos -= 170;
    return strip.Color(0, (WheelPos * 3) * MAX_VAL / 255, (255 - WheelPos * 3) * MAX_VAL / 255);
  }
}
