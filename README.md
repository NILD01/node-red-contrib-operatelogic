# Node-RED OperateLogic Node

This Node-RED project contains a custom Node-RED node called **"OperateLogic"** used for controlling a device based on logical rules and operation modes (`manual` or `automatic`) and commands (`start` or `stop`).

## Inputs

### Mode:
Mode can be set if:
- `msg.mode = "manual"` or `"auto"`

### Start Commands
Start/stop command in manual mode:
- `msg.manual = true`/`false` (boolean)

Start/stop command in auto mode:
- `msg.auto = true`/`false` (boolean)

Start/stop commands will not be accepted from opposite modes. For example:
- In manual mode, a start/stop command from `msg.auto` will not be accepted.
- In auto mode, a start/stop command from `msg.manual` will not be accepted.

## Settings

### Rules
Rules can be added/removed. In these rules, you can check flow or global variables against string, number, boolean, flow, or globals with operators:

- `==`: equal
- `!=`: not equal
- `>`: greater
- `<`: less
- `incl`: includes

For every rule you can choose in which mode it has to be checked (`manual` or `auto`).

When a start command is issued, all specified rules will be checked according to the chosen mode. If all rules are true, the output (output 1) returns the "on" state specified in settings `state on`.
When a specific rule becomes false, an 'off' command is executed specified in settings `state off`.

### Settings

- **Restart After Fault**: 
  - Checked: When a specific rule becomes false, an 'off' command is executed. Once the rule (all rules) return to true, a new 'start' command can be initiated to restart.
  - Unchecked: The system will automatically restart when all rules are true.
- **Check Interval**: Time interval (in seconds) for checking the rules.
- **Initial Mode**: Initial operation mode (`manual` or `auto`). Restarts of Node-RED will keep the mode in memory. This is only for a complete restart of your Node-RED system.
- **State On/Off**: The output command `"on"`/`"off"` can be modified to any boolean, string, or number.

<img src='https://raw.githubusercontent.com/NILD01/node-red-contrib-operatelogic/main/img/rules2.png' >

All settings and rules can be adjusted at any time and will immediately take effect.

## Outputs

We have 3 outputs.

- **Output 1**: This output allows you to control your device based on the state specified in the settings (State On/Off).

- **Output 2**: Provides all rule information in the form of an array.

- **Output 3**: Displays the currently selected mode.


## Example Flow

Below is an example workflow demonstrating the use of the **"OperateLogic"** node:

<img src='https://raw.githubusercontent.com/NILD01/node-red-contrib-operatelogic/main/img/screenshot.png' >

```json
[
    {
        "id": "08b2a9db27f711d5",
        "type": "OperateLogic",
        "z": "47ba3e0620759d93",
        "name": "",
        "rules": [
            {
                "t": "eq",
                "v": "true",
                "vt": "bool",
                "propertyType": "global",
                "property": "test1",
                "checkboxmanual": true,
                "checkboxauto": false,
                "LogicText": "example1"
            },
            {
                "t": "lt",
                "v": "40",
                "vt": "num",
                "propertyType": "flow",
                "property": "test2",
                "checkboxmanual": true,
                "checkboxauto": false,
                "LogicText": "example2"
            },
            {
                "t": "gt",
                "v": "40",
                "vt": "num",
                "propertyType": "flow",
                "property": "test3",
                "checkboxmanual": false,
                "checkboxauto": true,
                "LogicText": ""
            },
            {
                "t": "incl",
                "v": "on",
                "vt": "str",
                "propertyType": "flow",
                "property": "test4",
                "checkboxmanual": false,
                "checkboxauto": true,
                "LogicText": "example4"
            }
        ],
        "restartafterfault": true,
        "checktime": 1,
        "initialisemode": "manual",
        "stateon": "on",
        "stateontype": "str",
        "stateoff": "off",
        "stateofftype": "str",
        "x": 1100,
        "y": 1180,
        "wires": [
            [
                "0ba9b502ad91cb0a",
                "b845057586a8bdb7"
            ],
            [
                "c94080596beb7116"
            ],
            [
                "f959261223a4bf35"
            ]
        ]
    },
    {
        "id": "d7e730c066b83e63",
        "type": "inject",
        "z": "47ba3e0620759d93",
        "name": "",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "false",
        "payloadType": "bool",
        "x": 670,
        "y": 620,
        "wires": [
            [
                "31fefdc4ee84f667"
            ]
        ]
    },
    {
        "id": "31fefdc4ee84f667",
        "type": "function",
        "z": "47ba3e0620759d93",
        "name": "test1",
        "func": "global.set(\"test1\", msg.payload);\nreturn msg;",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 850,
        "y": 640,
        "wires": [
            []
        ]
    },
    {
        "id": "f850912add4976ed",
        "type": "function",
        "z": "47ba3e0620759d93",
        "name": "test2",
        "func": "flow.set(\"test2\", msg.payload);\nreturn msg;",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 850,
        "y": 720,
        "wires": [
            []
        ]
    },
    {
        "id": "28d05662be3fdf66",
        "type": "inject",
        "z": "47ba3e0620759d93",
        "name": "",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": true,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "true",
        "payloadType": "bool",
        "x": 670,
        "y": 660,
        "wires": [
            [
                "31fefdc4ee84f667"
            ]
        ]
    },
    {
        "id": "89f392ffb154bbed",
        "type": "inject",
        "z": "47ba3e0620759d93",
        "name": "",
        "props": [
            {
                "p": "payload"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": true,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "30",
        "payloadType": "num",
        "x": 670,
        "y": 700,
        "wires": [
            [
                "f850912add4976ed"
            ]
        ]
    },
    {
        "id": "12284cc275c0052d",
        "type": "inject",
        "z": "47ba3e0620759d93",
        "name": "",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "50",
        "payloadType": "num",
        "x": 670,
        "y": 740,
        "wires": [
            [
                "f850912add4976ed"
            ]
        ]
    },
    {
        "id": "c94080596beb7116",
        "type": "ui_table",
        "z": "47ba3e0620759d93",
        "group": "3ca64bf4d64c922b",
        "name": "prerequisites",
        "order": 15,
        "width": 6,
        "height": 6,
        "columns": [
            {
                "field": "LogicText",
                "title": "Prerequisites",
                "width": "",
                "align": "left",
                "formatter": "plaintext",
                "formatterParams": {
                    "target": "_blank"
                }
            },
            {
                "field": "comparison_result",
                "title": "",
                "width": "1",
                "align": "right",
                "formatter": "tickCross",
                "formatterParams": {
                    "target": "_blank"
                }
            }
        ],
        "outputs": 0,
        "cts": false,
        "x": 1370,
        "y": 1180,
        "wires": []
    },
    {
        "id": "e775e2cd0af18fe2",
        "type": "function",
        "z": "47ba3e0620759d93",
        "name": "test3",
        "func": "flow.set(\"test3\", msg.payload);\nreturn msg;",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 850,
        "y": 800,
        "wires": [
            []
        ]
    },
    {
        "id": "3da64dab8606e62a",
        "type": "inject",
        "z": "47ba3e0620759d93",
        "name": "",
        "props": [
            {
                "p": "payload"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": true,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "50",
        "payloadType": "num",
        "x": 670,
        "y": 820,
        "wires": [
            [
                "e775e2cd0af18fe2"
            ]
        ]
    },
    {
        "id": "63ea8b05989c2e58",
        "type": "inject",
        "z": "47ba3e0620759d93",
        "name": "",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "30",
        "payloadType": "num",
        "x": 670,
        "y": 780,
        "wires": [
            [
                "e775e2cd0af18fe2"
            ]
        ]
    },
    {
        "id": "d53621fcd15ac283",
        "type": "inject",
        "z": "47ba3e0620759d93",
        "name": "auto true",
        "props": [
            {
                "p": "payload"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "true",
        "payloadType": "bool",
        "x": 660,
        "y": 1240,
        "wires": [
            [
                "c6ce90f0ff0aff6a"
            ]
        ]
    },
    {
        "id": "45f7af7eb96d0985",
        "type": "inject",
        "z": "47ba3e0620759d93",
        "name": "false",
        "props": [
            {
                "p": "payload"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "false",
        "payloadType": "bool",
        "x": 670,
        "y": 1280,
        "wires": [
            [
                "c6ce90f0ff0aff6a"
            ]
        ]
    },
    {
        "id": "c6aad0e7dc138bf2",
        "type": "ui_text",
        "z": "47ba3e0620759d93",
        "group": "3ca64bf4d64c922b",
        "order": 8,
        "width": 3,
        "height": 1,
        "name": "",
        "label": "Operation mode:  ",
        "format": "",
        "layout": "row-left",
        "className": "",
        "style": false,
        "font": "",
        "fontSize": 16,
        "color": "#000000",
        "x": 1550,
        "y": 1220,
        "wires": []
    },
    {
        "id": "3b3ffd7b6cd4575f",
        "type": "ui_button",
        "z": "47ba3e0620759d93",
        "name": "",
        "group": "3ca64bf4d64c922b",
        "order": 5,
        "width": 3,
        "height": 1,
        "passthru": false,
        "label": "Start",
        "tooltip": "",
        "color": "",
        "bgcolor": "",
        "className": "",
        "icon": "",
        "payload": "true",
        "payloadType": "bool",
        "topic": "topic",
        "topicType": "msg",
        "x": 670,
        "y": 1160,
        "wires": [
            [
                "ca72660986bbb348"
            ]
        ]
    },
    {
        "id": "bbf5f545a11e6193",
        "type": "ui_button",
        "z": "47ba3e0620759d93",
        "name": "",
        "group": "3ca64bf4d64c922b",
        "order": 6,
        "width": 3,
        "height": 1,
        "passthru": false,
        "label": "Stop",
        "tooltip": "",
        "color": "",
        "bgcolor": "",
        "className": "",
        "icon": "",
        "payload": "false",
        "payloadType": "bool",
        "topic": "topic",
        "topicType": "msg",
        "x": 670,
        "y": 1200,
        "wires": [
            [
                "ca72660986bbb348"
            ]
        ]
    },
    {
        "id": "ca72660986bbb348",
        "type": "function",
        "z": "47ba3e0620759d93",
        "name": "operate manual",
        "func": "\n\nmsg.manual = msg.payload\n\n\nreturn msg;\n",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 860,
        "y": 1180,
        "wires": [
            [
                "08b2a9db27f711d5"
            ]
        ]
    },
    {
        "id": "f959261223a4bf35",
        "type": "ui_text",
        "z": "47ba3e0620759d93",
        "group": "3ca64bf4d64c922b",
        "order": 9,
        "width": 2,
        "height": 1,
        "name": "",
        "label": "",
        "format": "{{msg.payload}}",
        "layout": "row-left",
        "className": "",
        "style": false,
        "font": "",
        "fontSize": 16,
        "color": "#000000",
        "x": 1350,
        "y": 1220,
        "wires": []
    },
    {
        "id": "f871ea486ef3a73a",
        "type": "function",
        "z": "47ba3e0620759d93",
        "name": "test4",
        "func": "flow.set(\"test4\", msg.payload);\nreturn msg;",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 850,
        "y": 880,
        "wires": [
            []
        ]
    },
    {
        "id": "27ee58c51701ab01",
        "type": "inject",
        "z": "47ba3e0620759d93",
        "name": "",
        "props": [
            {
                "p": "payload"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "TV is off.",
        "payloadType": "str",
        "x": 660,
        "y": 860,
        "wires": [
            [
                "f871ea486ef3a73a"
            ]
        ]
    },
    {
        "id": "c38979d5e22fa637",
        "type": "inject",
        "z": "47ba3e0620759d93",
        "name": "",
        "props": [
            {
                "p": "payload"
            },
            {
                "p": "topic",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": true,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "TV is on.",
        "payloadType": "str",
        "x": 660,
        "y": 900,
        "wires": [
            [
                "f871ea486ef3a73a"
            ]
        ]
    },
    {
        "id": "c5f4cd52877f4a74",
        "type": "ui_button",
        "z": "47ba3e0620759d93",
        "name": "",
        "group": "3ca64bf4d64c922b",
        "order": 2,
        "width": 3,
        "height": 1,
        "passthru": false,
        "label": "auto",
        "tooltip": "",
        "color": "",
        "bgcolor": "",
        "className": "",
        "icon": "",
        "payload": "auto",
        "payloadType": "str",
        "topic": "topic",
        "topicType": "msg",
        "x": 670,
        "y": 1080,
        "wires": [
            [
                "38dfcf65ab8c0b8a"
            ]
        ]
    },
    {
        "id": "c0ded006b33858c9",
        "type": "ui_button",
        "z": "47ba3e0620759d93",
        "name": "",
        "group": "3ca64bf4d64c922b",
        "order": 3,
        "width": 3,
        "height": 1,
        "passthru": false,
        "label": "manual",
        "tooltip": "",
        "color": "",
        "bgcolor": "",
        "className": "",
        "icon": "",
        "payload": "manual",
        "payloadType": "str",
        "topic": "topic",
        "topicType": "msg",
        "x": 660,
        "y": 1120,
        "wires": [
            [
                "38dfcf65ab8c0b8a"
            ]
        ]
    },
    {
        "id": "c6ce90f0ff0aff6a",
        "type": "function",
        "z": "47ba3e0620759d93",
        "name": "operate auto",
        "func": "\n\nmsg.auto = msg.payload\n\n\nreturn msg;\n",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 870,
        "y": 1260,
        "wires": [
            [
                "08b2a9db27f711d5"
            ]
        ]
    },
    {
        "id": "b845057586a8bdb7",
        "type": "ui_text",
        "z": "47ba3e0620759d93",
        "group": "3ca64bf4d64c922b",
        "order": 12,
        "width": 2,
        "height": 1,
        "name": "",
        "label": "",
        "format": "{{msg.payload}}",
        "layout": "row-left",
        "className": "",
        "style": false,
        "font": "",
        "fontSize": 16,
        "color": "#000000",
        "x": 1350,
        "y": 1140,
        "wires": []
    },
    {
        "id": "b24747fad861a389",
        "type": "ui_text",
        "z": "47ba3e0620759d93",
        "group": "3ca64bf4d64c922b",
        "order": 11,
        "width": 3,
        "height": 1,
        "name": "",
        "label": "State:  ",
        "format": "",
        "layout": "row-left",
        "className": "",
        "style": false,
        "font": "",
        "fontSize": 16,
        "color": "#000000",
        "x": 1510,
        "y": 1140,
        "wires": []
    },
    {
        "id": "38dfcf65ab8c0b8a",
        "type": "function",
        "z": "47ba3e0620759d93",
        "name": "operate mode",
        "func": "\n\nmsg.mode = msg.payload\n\n\nreturn msg;\n",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 860,
        "y": 1100,
        "wires": [
            [
                "08b2a9db27f711d5"
            ]
        ]
    },
    {
        "id": "37bc3f13c7379afa",
        "type": "comment",
        "z": "47ba3e0620759d93",
        "name": "I/O",
        "info": "",
        "x": 670,
        "y": 580,
        "wires": []
    },
    {
        "id": "e4ea15396167c799",
        "type": "comment",
        "z": "47ba3e0620759d93",
        "name": "Operate and Logic",
        "info": "",
        "x": 630,
        "y": 1020,
        "wires": []
    },
    {
        "id": "0ba9b502ad91cb0a",
        "type": "debug",
        "z": "47ba3e0620759d93",
        "name": "Output",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "payload",
        "targetType": "msg",
        "statusVal": "",
        "statusType": "auto",
        "x": 1350,
        "y": 1100,
        "wires": []
    },
    {
        "id": "3ca64bf4d64c922b",
        "type": "ui_group",
        "name": "Default",
        "tab": "99b6b837d20e34a1",
        "order": 1,
        "disp": true,
        "width": "6",
        "collapse": false,
        "className": ""
    },
    {
        "id": "99b6b837d20e34a1",
        "type": "ui_tab",
        "name": "Ventilator douche",
        "icon": "dashboard",
        "order": 12,
        "disabled": false,
        "hidden": false
    }
]
```