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
    - [Web API](https://github.com/tomershay100/Anomaly-Detection-WebApp/blob/main/README.md#web-api)
2. [Dependencies](#dependencies)  
3. [Installation](#installation)

## General
### Background
This a web interface for anomalies detections. The Users are flight reserchers or company's automatic services.
The CSV file includes features and values which can be loaded to the application.
This web application displays on a graph the anomalies of a selected feature and the anomalies of the most correlative to t feature.

### Project Description
The idea is that the user will upload a normal file (e.g. _train file_) . The program will learn the normal file and then the user will upload any file (e.g. _test file_). The application presents graphs, which represent the file data of a specific chosen featre and shows anomalies if exists.

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
You can see more information about the class hierarchy in [UML](https://github.com/tomershay100/Anomaly-Detection-WebApp/blob/main/WebApp%20UML.pdf) and the [ProjectStructure](https://github.com/tomershay100/Anomaly-Detection-WebApp/blob/main/ProjectStructure.md). The backendController and the frontendController communicates according to the RESTful API that described [here](https://github.com/tomershay100/Anomaly-Detection-WebApp/blob/main/API.md). 

### Features
* **Train upload and Test upload buttons:** When the user clicks the ```Train upload``` or ```Test upload``` he will be able choose CSV file to upload for learning and detecting anomalies.
* **Radio buttons** let the user choose which algorithm he would like to detect anomalies with (```Regression``` or ```Hybrid```). 
* **Flight Features Graphs:** The user can select a feature and its graph will be shown.

For more features explanations, you can watch [this video](https://youtu.be/A17zRwg9bI0).


## Dependencies
1. [Node .js](https://nodejs.org/en/)
2. [Chart.js](https://www.chartjs.org/docs/latest/getting-started/installation.html)
3. [smallest-enclosing-circle](https://www.npmjs.com/package/smallest-enclosing-circle)

## Installation 
1. Clone the repository from command line:  
    ```
    $ git clone https://github.com/tomershay100/Anomaly-Detection-WebApp.git
    ```
2. Run the program: 
     ```
    $ cd Anomaly-Detection-WebApp
    $ node controller\backendController.js
    ```
3. Open broswer and write on the URL:
    ```
    localhost:8080
    ```
    or click [here](http://localhost:8080/)
