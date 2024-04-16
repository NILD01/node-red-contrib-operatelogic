# node-red-contrib-operatelogic

*Node-RED OperateLogic Node

This Node-RED project contains a custom Node-RED node called "OperateLogic" used for controlling a device based on logical rules and operation modes ('manual' or 'automatic') and commands ('start' or 'stop').

Usage:
The "OperateLogic" node can be configured via the Node-RED GUI. Drag the node into your flow and configure the settings as desired:

Check interval: Time interval (in seconds) for checking the rules.

Rules: Logical rules to be evaluated on the given check interval.

Restart After Fault: A new start command has to be given when checked. Unchecked it wil automatically start again.

Initial Mode: Initial operation mode ('manual' or 'automatic').Restarts of node-red will keep the mode in memory. This is only for a complete restart of your node-red system.

State on/off: The output command "on"/ "off" can be modified to any bool,string or number.

All settings can be adjusted at any time and will immediately take effect.


operate logic:
mode can be set if:
msg.mode = "manual" or "auto"

start command in manual mode:
msg.manual = true or false (bool)

start command in auto mode:
msg.auto = true or false (bool)

Stop commands will always be accepted.
For example:
In manual mode you can give a stop command via msg.manual but also a stop command via msg.auto will be accepted.
In auto mode you can give a stop command via msg.auto but also a stop command via msg.manual will be accepted.

Startcommands will not be accepted from opposite modes.
For example:
In manual mode a start command from msg.auto will not be accepted.
In auto mode a start command from msg.manual will not be accepted.

You can change mode auto/manual only when output/state is "off"

Rules:
Rules can be added/removed.
In these rules you can check flow or global variables against string,number,bool, flow variable and global variable with operators.

These operators are:
'==  : equal
'!=  : not equal
'>   : greather
'<   : less
'incl: Includes

![example usage](img/rules.png)

for every rule you can chose in wich mode it has to be checked or not checked. 


Connect the "OperateLogic" node with other nodes in your Node-RED flow. Send messages to the node to change the operation mode ('manual' or 'automatic') and give start/stop commands as in example below.


