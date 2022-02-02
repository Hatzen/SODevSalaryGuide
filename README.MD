# SO Developer Salary Guide

StackOverflow annualy gives all registered users the possibility to create a good dataset which get released in raw data and processed with quite good and interesting results: https://insights.stackoverflow.com/survey    
But when coming to cross year perspective and especially to an interactive salary related tool it is not very handy. So that is what this project is intended for.  
We use the raw data and try not to process the data to much. Just give some filters and give developers an easy and free way to compare their salary and developement with these.  

## Demo

<div>
<img src="https://github.com/Hatzen/SODevSalaryGuide/blob/develop/docs/imgs/SOSalary-screenshot1.png?raw=true" width="1000">
<img src="https://github.com/Hatzen/SODevSalaryGuide/blob/develop/docs/imgs/SOSalary-screenshot2.png?raw=true" width="1000">
<img src="https://github.com/Hatzen/SODevSalaryGuide/blob/develop/docs/imgs/SOSalary-screenshot3.png?raw=true" width="1000">
</div>


It is highly recommended to checkout the repository and run the code locally for perfomance reasons.

Here you can see a full online demo of the current master deployment. 
*WARNING: Do not open the side with Mobile Data it will Download around 2 GB of Data!*

https://hatzen.github.io/SODevSalaryGuide/

## TODOs

- improve quality and amount of feature points
	- currently many information are considered invalid
	- some years might have similar infomations but with different column names
	- improve: check format and valid inputs per year

- Fix and add all Currencies to convert all salary informations correctly

- Make the enum values mostly unique for all years

- Filter or label all enum values (for countries, education, abiliteies etc.) for related Year

- Show table to see all related data 

- Plot different informations against another e.g "languages" and "average of expierience"

- Warning for Mobile Data as we download 1GB
	- Use caching to only download once?
	
- Allow import/ export of current settings

- Update UI only every x seconds dont react to every single data update

- Calculate own salary based on the data
	- Use weights on criterias (0.1* average of with Ability (sql, java, etc.) and 0.9*average of overall data)
	- Slider to place own "skill" to see which quartile to show the data from
	
- Fix Gender filter not working.

- Fix: Create artifical year by pushing all data to one list

- Refactore: 
	- Remove Commented out code
	- Remove code duplication
