# Project Structure and Description
The structure of the application is based on the MVC Design Pattern which divides the project files and its classes into 3 main parts, the Model, the Controller and the View. When each of them has a responsibility for a different part of the app while communicating with each other through *HTTP Request* and *HTTP Response*.

## View
#### index:
This page uses an HTML and CSS files which defines the application design. The JavaScript file defines the application functionality. The page includes 3 buttons for uploading files and send them to the Model. These files are the View, which is responsible for displaying the UI and collecting the user inputs (train file, test file, and the algorithm) then updates the Controller. For this purpose, the index.js knows the Controller.

## Controller
#### frontendController:
This file connects the backendController to the View. After the user inputs have changed, the view updates this Controller 
which decides to analyze the inputs or to send HTTP Request to the backendController using Ajax.

#### backendController:
This file connects the frontendController to the Model. This Controller is actually the server which waits for an HTTP Request according to the RESTful API.
After the frontendController sends HTTP Request to the backendController, the backendController uses the Model to learn and find anomalies in the test file and then sends HTTP Response to the frontendController.
## Model
#### AnomalyManager:
This class is one of the Models, it defines the functionality of the Model, like Facede Design Pattern. It calls the needed function for any request from the backendController. It contains an AnomalyDetector which responsible for files analysis, two TimeSeries (for the train and the test).
#### AnomalyDetectionUtil:
The class is a kind of library of mathematical operations such as average, correlation, variance and regression line creation. This class is used for learning and processing flight data.
#### SimpleAnomalyDetector:
The class that processes the TimeSeries files, calculates the correlation between the different features and creates a list of correlative features with their regression line.#### SimpleAnomalyDetector:
#### HybridAnomalyDetector:
The class that processes the TimeSeries files, calculates the correlation between the different features and creates a list of correlative features with their regression line or their minimum enclosing circle.
#### TimeSeries:
The class processes the CSV files and saves them in a dictionary for easy access to the various columns.
