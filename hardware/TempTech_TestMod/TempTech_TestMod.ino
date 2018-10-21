// JPHACKS 2018 KB_1808
//   TempTech software for ESP8266
//
//   written by Aonori
//

#include <WiFi.h>
#include <WiFiClient.h>
#include <WebServer.h>
#include <ESPmDNS.h>
#include <Adafruit_NeoPixel.h>

#define DELAY_TIME 40

const char* ssid = "JashiPhone";
const char* password = "WonderlandAlice";

WebServer server(80);

#define MAX_VAL 32  // 0 to 255 for brightness

// Parameter 1 = number of pixels in strip
// Parameter 2 = pin number (most are valid)
// Parameter 3 = pixel type flags, add together as needed:
//   NEO_RGB     Pixels are wired for RGB bitstream
//   NEO_GRB     Pixels are wired for GRB bitstream
//   NEO_KHZ400  400 KHz bitstream (e.g. FLORA pixels)
//   NEO_KHZ800  800 KHz bitstream (e.g. High Density LED strip)
Adafruit_NeoPixel strip = Adafruit_NeoPixel(9, 19, NEO_GRB + NEO_KHZ800);

void handleRoot() {
  server.send(200, "text/html", "<a href='/red'>red</a><br><a href='/green'>green</a><br><a href='/blue'>blue</a><br>");
}

void setup() {
  Serial.begin(115200);
  delay(10);
  Serial.println();

  strip.begin();
  strip.show(); // Initialize all pixels to 'off'

  colorWipe(strip.Color(MAX_VAL, MAX_VAL, 0), DELAY_TIME);

  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

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

  server.on("/", handleRoot);

  server.on("/red", []() {
    // clear to RED
    colorWipe(strip.Color(MAX_VAL, 0, 0), DELAY_TIME);
    // response
    server.send(200, "text/html", "<a href='/'>RED OK</a>");
  });

  server.on("/green", []() {
    // move to green
    for(int j = 0; j<=MAX_VAL; j++) {
      colorWipe(strip.Color(MAX_VAL -j, j, 0), DELAY_TIME);
      delay(400);
    }
    // response
    server.send(200, "text/html", "<a href='/'>GREEN OK</a>");
  });

  server.on("/blue", []() {
    // move to blue
    for(int j = 0; j<=MAX_VAL; j++) {
      colorWipe(strip.Color(0, MAX_VAL -j, j), DELAY_TIME);
      delay(400);
    }
    // response
    server.send(200, "text/html", "<a href='/'>BLUE OK</a>");
  });

  server.on("/rainbow", []() {
    // clear to RED
    rainbowCycle(5, 1);
    // response
    server.send(200, "text/html", "<a href='/'>RAINBOW OK</a>");
  });


  server.begin();
  Serial.println("HTTP server started");

  rainbowCycle(5, 1);
  colorWipe(strip.Color(0, 0, 0), 30);
}

void loop() {
  server.handleClient();
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
