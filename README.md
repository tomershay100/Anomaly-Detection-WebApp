# Anomaly-Detection-WebApp

#### Contributes
* Roei Gida
* Shilat Givati
* Tomer Shay
* Amit Sharabi

This is a desktop application for flight anomalies detection.

1. [General](#General)
    - [Background](#background)
    - [Project Description](https://github.com/tomershay100/Flight-Inspection-App/blob/main/README.md#project-description)
    - [Project Stucture](https://github.com/tomershay100/Flight-Inspection-App/blob/main/README.md#project-stucture)
    - [Features](https://github.com/tomershay100/Flight-Inspection-App/blob/main/README.md#features)
2. [Dependencies](#dependencies)  
3. [Installation](#installation)

## General
### Background
This application displays filght data on a simulator and investigates it. The Users are flight reserches or pilots who want to view data that sampled at certain rate during a flight.
The flight data includes the steering mode, speed, direction etc, and recorded into a csv file which can be loaded to the application.
Tha app plays the data like a movie. It graphically shows - the plane relative to earth (on FlightGear), the rudder status, and additional filght data, including a view designed to find anomalies in the data.

### Project Description
The application inerfaces with the FlightGear simulator (instruction for download at [Dependencies](#dependencies)) and they work side-by-side. The idea is that the user will upload a normal flight file (e.g. _train) file_. The program will learn the normal flight and then the user will upload any flight file (e.g. _test file_). The program will simulate the _test file_ as a movie on the screen through the FlightGear simulator. The application will display video pannel which gives the user the ability to control the flight simulation by pressing the play and pause buttons, change the playback speed and drag the slider to every part of the flight . Furthermore, the application presents important flight data (**yaw, pitch, airspeed** etc) and graphs, which represent the flight data of a specific chosen featre, from the beggining to the current time of the simulation. 

### Project Stucture
This project designed according to MVVM architecture. The classes can be divided into two groups in order to create total segregation between the presentation logic and the business logic.
The pressentation logic implemented in:
* MainWindow class
* MediaControls class
* GraphsUS class
* Joystick class
* Gauges class

The business logic implemented in:
* Client class
* FlightGearClient class
* Panel class
* AnnomlyData class


This classes can communicate via the ViewModel class that constitutes as an abstract Model layer to the View and as an abstract View layer to the Model.
You can see more information about the class hierarchy in [UML](https://github.com/tomershay100/Flight-Inspection-App/blob/main/UML%20Diagram.pdf).

### Features
* **Upload CSV File:** When the user clicks the ```Upload CSV Test File```  and uploads CSV file, the flight will start and the flightgear simulator will show the flight according to the uploaded file. 
* **Graphs Tab:** When the flight starts, a new tab opens. In this tab, the user can see graphs of every flight data feature and it's correlated feature.
* **DLL uploading:** The user can upload any annomly detection alogithem and the results will apear on a graph.
* **Flight Features Graphs:** The user can select a feature and its graph will be shown.
* **Joystick:** The ```Elevator``` and ```Aileron``` feature represented as joystick on Y-pos and X-pos **accordingly**.
* **Video panel:** The flight is shown as a movie:
  - Back Button:    Brings the flight to the start.
  - Rewind Button:  Brings the flight 7.5 seconds back.
  - Pause Button:   Stops the flight.
  - Play Button:    If paused or stopped, start playing from the same spot that stoped.
  - Stop Button:    Stops the flight and brings the flight to the start.
  - Forward Button: Brings the flight 7.5 seconds ahead.
  - Skip Button:    Brings the flight to the end.
  - Play Speed:     Enable the user to decide ehat speed hw eants to see the flight.
  - Slider:         Enable the user to jump forwards and backward.
* **Upload Several Test Files:** The user can upload as many test files as he wants. The last flight will stop and the next will start.

For more features explanations, you can watch [this video](https://youtu.be/t_-Bs4jf07Y).

### Create DLL
You can create annomly detection DLL according to the following API:
* The DLLs' namespace must have the same name as the DLLs' name.
* The Object that in charges of the anomalies must be called AnomalyManager and its class must contain the following functions:
```c#
public class AnomalyManager() {

    public AnomalyManager(); // Constructor to AnomalyManager class.

    public void UploadTrain(string file); // Uploads the normal flight.

    public void UploadTest(string file); // Uploads the test flight.

    public void Learn(); // Learns the normal flight.

    public void Detect(); // Detect anomalies from the test flight.

    public OxyPlot.PlotModel GetShape(string _currColumn); // Returns a PlotModel that emphasizes the anomalies points in a relation to your detection algorithm.
  
    public string GetCorrelated(string _currColumn); // Returns the most correlative column according to the algorithm.
  
    public Tuple<List<string>, List<int>> GetAnomalies(string _currColumn); // Returns a Tuple of Lists. The first will be the descriptions of the anomalies and the second will be the line numbers of the anomalies.
}
```
## Dependencies
1. [FlightGear](https://www.flightgear.org/download/)
2. [.NET 5.0](https://dotnet.microsoft.com/download/dotnet-framework/net48)
3. [Oxyplot](https://www.nuget.org/packages/OxyPlot.Wpf/2.1.0-Preview1)
4. [CircularGauge](https://www.nuget.org/packages/CircularGauge)

## Installation 
1. Open FlightGear from command line:
     ```
    $ cd C:\Program Files\FlightGear 2020.3.6
    $ cd bin
    $ start fgfs.exe --generic=socket,in,10,127.0.0.1,5400,tcp,playback_small --fdm=null
    ```
    Notice that ```C:\Program Files\FlightGear 2020.3.6``` is the path to the place where you download the FlightGear.

2. Click _fly_ on FlightGear.
    
3. Clone the repository from **another** command line:  
    ```
    $ git clone https://github.com/tomershay100/Flight-Inspection-App.git
    ```
4. Run the program: 
     ```
    $ cd Flight-Inspection-App
    $ cd bin
    $ start DesktopApp.exe
    ```
Notice it may take a while.
