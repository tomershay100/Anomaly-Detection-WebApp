# Project Structure and Description
The structure of the application is based on the MVVM Design Pattern which divides the project files and its departments into 3 main parts, the Model, the ViewModel and the View. When each of them has a responsibility for a different part of the app while communicating with each other through *Binding* and through PropertyChanged.

## View
#### MainWindow:
This class uses a XMAL file which defines the application design. It includes several buttons for uploading files and UserControls such as Media Controls, Sliders, Indicators, Joysticks, etc. This class is the View which is responsible for displaying the main Tab in the app and therefore does nothing but update the ViewModel on changes that have come from the user (like button clicks). For this purpose, the class contains ViewModel. Like updating the ViewModel in the user actions, the class is responsible for displaying the information to the user and therefore receives PropertyChanged notifications from the ViewModel so that it can update the data values as soon as they change.
#### GraphsUC:
This class is a UserControl which is responsible for displaying the Graph Tab, which has 4 graphs, a list of the flight features, a button for uploading a DLL file, and a list of anomalies.

![Graphs](https://i.imgur.com/NYXzN35.png)
#### MediaControls:
This class is a UserControl which responsible for displaying the playback and handle events of click on button such as: stop, play, back etc. For more description about media controls features you can see [here at playback](https://github.com/tomershay100/Flight-Inspection-App/blob/main/README.md#features).

![Playback](https://i.imgur.com/GinKPMK.png)
#### Gauges:
This class is a UserControl which responsible for displaying gauges of the features **YAW, ROLL, and PITCH**. It uses the CircularGauge package and using binding in order to display the current value of every fearture.

![Gueges](https://i.imgur.com/RP0X1Fw.png)
#### Joystick:
This class is a UserControl which responsible for displaying the joystick. The joystick moves according to the **Aileron and Elevator** values at this moment.

![Joystick](https://i.imgur.com/v5NGTWj.png)

## View Model
#### ViewModel:
This class drives all the software, is responsible for the logic of the application and is the one who decides what to do and when, what functions to run and what to send to whom. The class holds various Models and receives from them PropertyChanged notifications when a certain statistic has changed. It also knows when the user performed actions in the application from the View and therefore knows how to synchronize all actions of the application. For example, when the user enters the play speed of the flight and presses submit, the View notifies the ViewModel and it decides to change the playspeed field in the Model.

## Model
#### AnomalyData:
This class is one of the Models, it responsibles for the flight data. Contains SimpleAnomalyDetector which is responsible for flight analysis. The model holds a List of the flight data to be displayed in the Graphs Tab, holds the column that the user has selected and knows how to analyze, process and notify the ViewModel of changes in the various graphs and some flight data that displayed in the Main Tab. This model also communicates with the DLL and knows how to send it the relevant flight files and receives from it the information about the graphs to be displayed. For example, when updating the selected column, the class knows how to change the values of the relevant point lists, change the regression line and ask the DLL for its new graph.
#### Client:
This class is a Client class that can connect to every TCP server given IP and Port. This class was created in order to keep _single responsibility_ principle.
#### FlightGearClient:
This class is a FlightGear client that inherits from Client class in order to keep _Open/Close_ principle.
#### Panel:
This class is on of the Models, it responsibles for sending the lines to the FlightGear server and the logic issues of pause and resume. This class contains a list ```lines``` of the file lines to send and a property of ```Num_line``` that indicates the number of lines it sends till this moment. It notify to almost every other class about a change in ```Num_line``` in order to combine all other pressentations.

## Other
#### XmlAnalyzer:
The class contains a static method that gets an XML file and analyze it. The return value is a feature list.
#### AnomalyDetectionUtil:
The class is a kind of library of mathematical operations such as average, correlation, variance and regression line creation. This class is used for learning and processing flight data.
#### SimpleAnomalyDetector:
The class that processes the Timeseries files of the flight, calculates the correlation between the different data and creates a list of correlative features with their regression line.
#### Timeseries:
The department processes the CSV files and saves them in a dictionary for easy access to the various columns.
#### IObservable:
This is an interface for objects that can be observed.
#### MediaEventARgs:
This is an Event of Media Controls that inherits from EventArgs.
#### GraphEventARgs:
This is an Event of Media Controls that inherits from EventArgs.
