# Anomaly-Detection-WebApp

#### Contributes
* Amit Sharabi
* Roei Gida
* Shilat Givati
* Tomer Shay

This is a web application for flight anomalies detection.

1. [General](#General)
    - [Background](#background)
    - [Project Description](https://github.com/tomershay100/Anomaly-Detection-WebApp/blob/main/README.md#project-description)
    - [Project Stucture](https://github.com/tomershay100/Anomaly-Detection-WebApp/blob/main/README.md#project-stucture)
    - [Features](https://github.com/tomershay100/Anomaly-Detection-WebApp/blob/main/README.md#features)
    - [Web API]()
2. [Dependencies](#dependencies)  
3. [Installation](#installation)

## General
### Background
This a web interface for anomalies detections. The Users are flight reserches or company's automatic services.
The flight data includes the steering mode, speed, direction etc, and recorded into a csv file which can be loaded to the application.
Thhis web applications displays a view designed to find anomalies in the data.

### Project Description
The idea is that the user will upload a normal flight file (e.g. _train) file_. The program will learn the normal flight and then the user will upload any flight file (e.g. _test file_). The application presents important flight data (**yaw, pitch, airspeed** etc) and graphs, which represent the flight data of a specific chosen featre, from the beggining to the current time of the simulation. 

### Project Stucture
This project designed according to MVC architecture. The classes can be divided into 3 groups in order to divied the code into different layers.
The model implemented in:
* Model class
* AnomalyManager class
* TimeSeries class
* SimpleAnomalyDetector class
* HybridAnomalyDetector class
* CorrelatedFeatures class

The view implemented in:
* index HTML
* style CSS
* index JS


Those classes can communicate via the Controller classes (backendController and frontedController) that defines the policy by which we operate in the View and Model.
You can see more information about the class hierarchy in [UML](https://github.com/tomershay100/Anomaly-Detection-WebApp/blob/main/UML%20Diagram.pdf) and the [ProjectStructure]().

### Features
* **Upload CSV File:** When the user clicks the ```Upload CSV Test File```  and uploads CSV file, the flight will start and the flightgear simulator will show the flight according to the uploaded file. 
* **Flight Features Graphs:** The user can select a feature and its graph will be shown.
* **Upload Several Test Files:** The user can upload as many test files as he wants. The last flight will stop and the next will start.

For more features explanations, you can watch [this video](https://youtu.be/A17zRwg9bI0).

### Web API
The server-client communication is based on the following API:
##### VERB &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; PATH &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; QUERT &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; BODY
   POST &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /api/model &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; model_type: string &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ train_data: < data > } _ // sending data to server (train file), return value: Model_</br>
   GET &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /api/model &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; mode_id: int </br>
   DELETE  &nbsp;&nbsp;&nbsp; /api/model &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; mode_id: int </br>
   POST &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /api/anomaly &nbsp;&nbsp; mode_id: int &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; { predict_data: < data > }</br>
   GET &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /api/anomaly &nbsp;&nbsp; mode_id: int, feature: string </br>
   
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
