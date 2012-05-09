from lib.CrcMoose import *
import serial
import getopt, sys, os
import struct, math

class Plugwise:
    def __init__(self, port, macaddress):
        self.serial = serial.Serial(port, "115200")
        
        self.HEADER = '\x05\x05\x03\x03'
        self.ENDLINE = '\x0d\x0a'
        self.CALIBRATIONCODE = '0026'
        self.POWERCHANGECODE = '0017'
        self.POWERINFOCODE = '0012'
        self.CALIBRATIONRESPONSECODE = '0027'
        self.POWERINFORESPONSECODE = '0013'
        
        self.macaddress = macaddress
        self.gain_a = 0
        self.gain_b = 0
        self.offtot = 0
        self.offruis = 0
        self.correctedpulses = 0

    def GetCalibrationInfo(self):
        self.SendCommand("0026" +  self.macaddress)
        result = self.GetResult(self.CALIBRATIONRESPONSECODE)
        
        self.gain_a = self.hexToFloat(result[0:8])
        self.gain_b = self.hexToFloat(result[8:16])
        self.offtot = self.hexToFloat(result[16:24])
        self.offruis = self.hexToFloat(result[24:32])
        
    def PulseCorrection(self, pulses):
        value = pulses / 1.0;
        out = 1.0 * (((pow(value + self.offruis, 2.0) * self.gain_b) + ((value + self.offruis) * self.gain_a)) + self.offtot)
        return out

    def pulseToKWH(self, pulses):
        output = (pulses / 1) / 468.9385193;
        return output

    def pulseToWatt(self, pulses):
        result = self.pulseToKWH(pulses) * 1000
        return result

    def GetPowerInfo(self):
        self.GetCalibrationInfo()
        self.SendCommand(self.POWERINFOCODE + self.macaddress)
        result = self.GetResult(self.POWERINFORESPONSECODE)
        resultint = self.hexToInt(result[4:8])
        corrected = self.PulseCorrection(resultint)

        return self.pulseToWatt(corrected)

    def SetPowerState(self, newstate):
        self.SendCommand(self.POWERCHANGECODE + self.macaddress + newstate)
        self.serial.readline()

    def GetCRC16(self, value):
        value = CRC16X.calcString(value)
        format = ("%%0%dX" % ((CRC16X.width + 3) // 4))
        return format % value

    def hexToFloat(self, hexstr):
        intval = int(hexstr, 16)
        bits = struct.pack('L', intval)
        return struct.unpack('f', bits)[0]

    def hexToInt(self, hexstr):
        return int(hexstr, 16)

    def SendCommand(self, command):
        self.serial.write(self.HEADER + command + self.GetCRC16(command) + \
        self.ENDLINE )

    def GetResult(self, responsecode):
        readbytes = 0
        
        if responsecode == self.CALIBRATIONRESPONSECODE:
            readbytes = 52
        elif responsecode == self.POWERINFORESPONSECODE:
            readbytes = 37
        elif responsecode == "0000":
            readbytes = 0

        data = ''
        
        while 1:
            data += self.serial.read(1)
            if data.endswith(responsecode):
                data = self.serial.read(readbytes)
                return data[16:]

def main():
    try:
        opts, args = getopt.getopt(sys.argv[1:], "p:o:f:w:h",
                     ['port', 'on', 'off', 'help', 'watt'])
    except getopt.error, why:
        print_help()

    port = 16
    macaddress = ''
    newstate = ''
    command = ''

    for o, a in opts:
        if (o in ('-p', '--port')):
            port = a
        if (o in ('-o', '--on')):
            newstate = '01'
            macaddress = a
            command = "ON"
        if (o in ('-f', '--off')):
            newstate = '00'
            macaddress = a
            command = "OFF"
        if (o in ('-w', '--watt')):
            macaddress = a
            command = "POWERINFO"
        if (o in ('-h', '--help')):
            print_help()

    if port == '' or macaddress == '':
        print_help()
    else:
        plugwise = Plugwise(port, macaddress)
        if command == "ON":
            plugwise.SetPowerState("01")
        elif command == "OFF":
            plugwise.SetPowerState("00")
        elif command == "POWERINFO":
            print plugwise.GetPowerInfo()
        
def print_help():
    print
    print "POL (Plugwise on Linux) v0.2 / Maarten Damen"
    print
    print "Usage: pol <options>"
    print
    print "Options:"
    print "  -p  --port <port>  Serial port of the Plugwise stick, for example: /dev/ttyUSB0"
    print "  -o  --on <macaddress>  Power on plugwise device with specified MAC address"
    print "  -f  --off <macaddress>  Power off plugwise device with specified MAC address"
    print "  -w  --watt <macaddress>  Get current watt usage for device with specified MAC address"
    print "  -h  --help   This help text"
    exit(0)

main()