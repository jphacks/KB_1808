const int PIN = 4;
const float VOLT = 5;
const int ANALOG_MAX = 4096;

void setup(){
  Serial.begin(115200);
}

void loop(){
  //Analog Input
  int reading = analogRead(PIN);
  //Change to mV
  float voltage = (reading * VOLT * 1000) / ANALOG_MAX;
  //Temperature
  float tp = voltage / 10;
  //Offset
  tp += 5;
  Serial.print(tp);
  Serial.println("℃");
  
  delay(1000);
}
