# Node-RED OperateLogic Node

This Node-RED project contains a custom Node-RED node called **"OperateLogic"** used for controlling a device based on logical rules and operation modes (`manual` or `automatic`) and commands (`start` or `stop`).

## Usage

The **"OperateLogic"** node can be configured via the Node-RED GUI. Drag the node into your flow and configure the settings as desired:

- **Check Interval**: Time interval (in seconds) for checking the rules.
- **Rules**: Logical rules to be evaluated on the given check interval.
- **Restart After Fault**: A new start command has to be given when checked. Unchecked it will automatically start again.
- **Initial Mode**: Initial operation mode (`manual` or `automatic`). Restarts of Node-RED will keep the mode in memory. This is only for a complete restart of your Node-RED system.
- **State On/Off**: The output command `"on"`/`"off"` can be modified to any boolean, string, or number.

All settings can be adjusted at any time and will immediately take effect.

## Operate Logic

### Mode Settings
Mode can be set if:
- `msg.mode = "manual"` or `"auto"`

### Start Commands
Start command in manual mode:
- `msg.manual = true` or `false` (boolean)

Start command in auto mode:
- `msg.auto = true` or `false` (boolean)

Stop commands will always be accepted. For example:
- In manual mode, you can give a stop command via `msg.manual`, but also a stop command via `msg.auto` will be accepted.
- In auto mode, you can give a stop command via `msg.auto`, but also a stop command via `msg.manual` will be accepted.

Start commands will not be accepted from opposite modes. For example:
- In manual mode, a start command from `msg.auto` will not be accepted.
- In auto mode, a start command from `msg.manual` will not be accepted.

You can change the mode to auto/manual only when the output/state is `"off"`.

## Rules

Rules can be added/removed. In these rules, you can check flow or global variables against string, number, boolean, flow variable, and global variable with operators. These operators are:
- `==`: equal
- `!=`: not equal
- `>`: greater
- `<`: less
- `incl`: includes

![rules.png](./img/rules.png)

For every rule, you can choose in which mode it has to be checked.

Connect the **"OperateLogic"** node with other nodes in your Node-RED flow. Send messages to the node to change the operation mode (`manual` or `automatic`) and give `start`/`stop` commands as in the example below.



## Example Flow

Below is an example flow demonstrating how to use the **"OperateLogic"** node:

```json
[
    {
        "id": "d7e730c066b83e63",
        "type": "inject",
        "z": "42a3344c7f839b4f",
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
        "x": 230,
        "y": 100,
        "wires": [
            [
                "31fefdc4ee84f667"
            ]
        ]
    },
    {
        "id": "31fefdc4ee84f667",
        "type": "function",
        "z": "42a3344c7f839b4f",
        "name": "test1",
        "func": "global.set(\"test1\", msg.payload);\nreturn msg;",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 410,
        "y": 120,
        "wires": [
            []
        ]
    },
    {
        "id": "f850912add4976ed",
        "type": "function",
        "z": "42a3344c7f839b4f",
        "name": "test2",
        "func": "flow.set(\"test2\", msg.payload);\nreturn msg;",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 410,
        "y": 200,
        "wires": [
            []
        ]
    },
    {
        "id": "28d05662be3fdf66",
        "type": "inject",
        "z": "42a3344c7f839b4f",
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
        "x": 230,
        "y": 140,
        "wires": [
            [
                "31fefdc4ee84f667"
            ]
        ]
    },
    {
        "id": "89f392ffb154bbed",
        "type": "inject",
        "z": "42a3344c7f839b4f",
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
        "x": 230,
        "y": 180,
        "wires": [
            [
                "f850912add4976ed"
            ]
        ]
    },
    {
        "id": "12284cc275c0052d",
        "type": "inject",
        "z": "42a3344c7f839b4f",
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
        "x": 230,
        "y": 220,
        "wires": [
            [
                "f850912add4976ed"
            ]
        ]
    },
    {
        "id": "c94080596beb7116",
        "type": "ui_table",
        "z": "42a3344c7f839b4f",
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
        "x": 930,
        "y": 660,
        "wires": []
    },
    {
        "id": "e775e2cd0af18fe2",
        "type": "function",
        "z": "42a3344c7f839b4f",
        "name": "test3",
        "func": "flow.set(\"test3\", msg.payload);\nreturn msg;",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 410,
        "y": 280,
        "wires": [
            []
        ]
    },
    {
        "id": "3da64dab8606e62a",
        "type": "inject",
        "z": "42a3344c7f839b4f",
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
        "x": 230,
        "y": 300,
        "wires": [
            [
                "e775e2cd0af18fe2"
            ]
        ]
    },
    {
        "id": "63ea8b05989c2e58",
        "type": "inject",
        "z": "42a3344c7f839b4f",
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
        "x": 230,
        "y": 260,
        "wires": [
            [
                "e775e2cd0af18fe2"
            ]
        ]
    },
    {
        "id": "d53621fcd15ac283",
        "type": "inject",
        "z": "42a3344c7f839b4f",
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
        "x": 220,
        "y": 720,
        "wires": [
            [
                "c6ce90f0ff0aff6a"
            ]
        ]
    },
    {
        "id": "45f7af7eb96d0985",
        "type": "inject",
        "z": "42a3344c7f839b4f",
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
        "x": 230,
        "y": 760,
        "wires": [
            [
                "c6ce90f0ff0aff6a"
            ]
        ]
    },
    {
        "id": "c6aad0e7dc138bf2",
        "type": "ui_text",
        "z": "42a3344c7f839b4f",
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
        "x": 1110,
        "y": 700,
        "wires": []
    },
    {
        "id": "3b3ffd7b6cd4575f",
        "type": "ui_button",
        "z": "42a3344c7f839b4f",
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
        "x": 230,
        "y": 640,
        "wires": [
            [
                "ca72660986bbb348"
            ]
        ]
    },
    {
        "id": "bbf5f545a11e6193",
        "type": "ui_button",
        "z": "42a3344c7f839b4f",
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
        "x": 230,
        "y": 680,
        "wires": [
            [
                "ca72660986bbb348"
            ]
        ]
    },
    {
        "id": "ca72660986bbb348",
        "type": "function",
        "z": "42a3344c7f839b4f",
        "name": "operate manual",
        "func": "\n\nmsg.manual = msg.payload\n\n\nreturn msg;\n",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 420,
        "y": 660,
        "wires": [
            [
                "0d62ff50dd417dc8"
            ]
        ]
    },
    {
        "id": "f959261223a4bf35",
        "type": "ui_text",
        "z": "42a3344c7f839b4f",
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
        "x": 910,
        "y": 700,
        "wires": []
    },
    {
        "id": "f871ea486ef3a73a",
        "type": "function",
        "z": "42a3344c7f839b4f",
        "name": "test4",
        "func": "flow.set(\"test4\", msg.payload);\nreturn msg;",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 410,
        "y": 360,
        "wires": [
            []
        ]
    },
    {
        "id": "27ee58c51701ab01",
        "type": "inject",
        "z": "42a3344c7f839b4f",
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
        "x": 220,
        "y": 340,
        "wires": [
            [
                "f871ea486ef3a73a"
            ]
        ]
    },
    {
        "id": "c38979d5e22fa637",
        "type": "inject",
        "z": "42a3344c7f839b4f",
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
        "x": 220,
        "y": 380,
        "wires": [
            [
                "f871ea486ef3a73a"
            ]
        ]
    },
    {
        "id": "c5f4cd52877f4a74",
        "type": "ui_button",
        "z": "42a3344c7f839b4f",
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
        "x": 230,
        "y": 560,
        "wires": [
            [
                "38dfcf65ab8c0b8a"
            ]
        ]
    },
    {
        "id": "c0ded006b33858c9",
        "type": "ui_button",
        "z": "42a3344c7f839b4f",
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
        "x": 220,
        "y": 600,
        "wires": [
            [
                "38dfcf65ab8c0b8a"
            ]
        ]
    },
    {
        "id": "c6ce90f0ff0aff6a",
        "type": "function",
        "z": "42a3344c7f839b4f",
        "name": "operate auto",
        "func": "\n\nmsg.auto = msg.payload\n\n\nreturn msg;\n",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 430,
        "y": 740,
        "wires": [
            [
                "0d62ff50dd417dc8"
            ]
        ]
    },
    {
        "id": "b845057586a8bdb7",
        "type": "ui_text",
        "z": "42a3344c7f839b4f",
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
        "x": 910,
        "y": 620,
        "wires": []
    },
    {
        "id": "b24747fad861a389",
        "type": "ui_text",
        "z": "42a3344c7f839b4f",
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
        "x": 1070,
        "y": 620,
        "wires": []
    },
    {
        "id": "38dfcf65ab8c0b8a",
        "type": "function",
        "z": "42a3344c7f839b4f",
        "name": "operate mode",
        "func": "\n\nmsg.mode = msg.payload\n\n\nreturn msg;\n",
        "outputs": 1,
        "timeout": 0,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "libs": [],
        "x": 420,
        "y": 580,
        "wires": [
            [
                "0d62ff50dd417dc8"
            ]
        ]
    },
    {
        "id": "0d62ff50dd417dc8",
        "type": "lower-case",
        "z": "42a3344c7f839b4f",
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
                "checkboxmanual": true,
                "checkboxauto": true,
                "LogicText": "example3"
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
        "x": 650,
        "y": 660,
        "wires": [
            [
                "b845057586a8bdb7",
                "0ba9b502ad91cb0a"
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
        "id": "37bc3f13c7379afa",
        "type": "comment",
        "z": "42a3344c7f839b4f",
        "name": "I/O",
        "info": "",
        "x": 230,
        "y": 60,
        "wires": []
    },
    {
        "id": "e4ea15396167c799",
        "type": "comment",
        "z": "42a3344c7f839b4f",
        "name": "Operate and Logic",
        "info": "",
        "x": 190,
        "y": 500,
        "wires": []
    },
    {
        "id": "0ba9b502ad91cb0a",
        "type": "debug",
        "z": "42a3344c7f839b4f",
        "name": "Output",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "payload",
        "targetType": "msg",
        "statusVal": "",
        "statusType": "auto",
        "x": 910,
        "y": 580,
        "wires": []
    },
    {
        "id": "3ca64bf4d64c922b",
        "type": "ui_group",
        "name": "Default",
        "tab": "410c94094f03e7a0",
        "order": 1,
        "disp": true,
        "width": "6",
        "collapse": false,
        "className": ""
    },
    {
        "id": "410c94094f03e7a0",
        "type": "ui_tab",
        "name": "Home",
        "icon": "dashboard",
        "disabled": false,
        "hidden": false
    }
]
