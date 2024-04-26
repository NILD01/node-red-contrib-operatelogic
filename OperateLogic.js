var fs = require('fs');
var path = require('path');


module.exports = function(RED) {
    function OperateLogicNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        const checktime = config.checktime *1000
        const rulesconfig= config.rules
        const restartafterfault = config.restartafterfault;
        const savestate = config.savestate;
        const stateonm = config.stateon
        const stateontype= config.stateontype
        const stateoffm = config.stateoff
        const stateofftype= config.stateofftype

        const context = this.context();
        const stateon = convertState(stateontype, stateonm)
        const stateoff = convertState(stateofftype, stateoffm)

        var interval;

        startsetTimeout()

        function startsetTimeout() {  
            setTimeout(function() { 
                if (savestate === true){
                    const stateDir = path.join(RED.settings.userDir, 'operate-logic-node-state');
                    if (!fs.existsSync(stateDir)) {
                        fs.mkdirSync(stateDir);
                    }
                    const stateFile = path.join(stateDir, `${node.id}.json`)
                    // Load state from file during initialization
                    if (fs.existsSync(stateFile)) {
                        const savedState = JSON.parse(fs.readFileSync(stateFile))
                        context.set("mode", savedState.mode)
                        context.set("output", savedState.output)
                        context.set("operateState", savedState.operateState)
                    }
                }
                //No state from file? --> Init
                if (context.get("mode") === undefined || context.get("output") === undefined || context.get("operateState") === undefined || savestate === false){
                    ClearData()
                    context.set("mode", "manual")
                    context.set("output", stateoff)
                    context.set("operateState", "not running")
                    NodeStatusInit()
                }                   
                node.send([{payload:context.get("output")},null,{payload:context.get("mode")}]);

                startInterval();    

            }, 1000); 
        }  

        function startInterval() {            
            interval = setInterval(function() {
                let defaultRules = [];
                let rules = rulesconfig ? rulesconfig : defaultRules;
                var checkprerequisites = comparison(rules,context.get("mode"));
                var filteredrules= filterPayloadByMode(rules, context.get("mode"));
                node.send([null,{payload:filteredrules},{payload : context.get("mode")}])

                if (context.get("operateState") == "running"){
                    if (context.get("output") !== checkprerequisites){
                        context.set("output",checkprerequisites)
                        SaveData({output: checkprerequisites}) 
                        if (checkprerequisites == stateoff){
                            NodeStatusMissedPrerequisites()
                            if((restartafterfault==true)||(context.get("mode") == "manual")){
                                context.set("operateState", "not running")
                                SaveData({operateState: "not running"})  
                            }
                        }  
                        else{
                            NodeStatusRunning()
                        }                                             
                        node.send([{payload:checkprerequisites},{payload:filteredrules},{payload:context.get("mode")}]);
                    }
                }
            }, checktime);
        }

        this.on("input", function(msg) {

            if((msg.mode == "manual")||(msg.mode == "auto")){                
                context.set("mode", msg.mode);
                let defaultRules = [];
                let rules = rulesconfig ? rulesconfig : defaultRules;
                var checkprerequisites = comparison(rules,context.get("mode"));
                let filteredrules= filterPayloadByMode(rules, context.get("mode"));
                node.send([null,{payload:filteredrules},{payload:context.get("mode")}])
            }
            if (((msg.mode == "manual")||(msg.mode == "auto"))&&(context.get("output") == stateoff)){
                NodeStatusNotRunning()
                context.set("operateState", "not running")

            }
            if (((msg.mode == "manual")||(msg.mode == "auto"))&&(context.get("output") == stateon)&&(checkprerequisites == stateoff)){
                NodeStatusMissedPrerequisites()
                context.set("operateState", "not running")
                node.send([{payload: checkprerequisites},null,null])
            }
            if (context.get("operateState") == "running"){
                NodeStatusRunning()
            }

            msg.fault = false
 
            if ((context.get("mode") == "manual") && (msg.manual == true)) {
                msg.cmd = true
            } 
            if ((context.get("mode") == "manual") && (msg.manual == false)) {
                msg.cmd = false
            }      
            if ((context.get("mode") == "auto") && (msg.auto == true)) {
                msg.cmd = true
            }     
            if ((context.get("mode") == "auto") && (msg.auto == false)) {
                msg.cmd = false
            }    
       
            if (msg.fault == false) {
                if (msg.cmd == false){
                    context.set("operateState", "not running")
                    context.set("output",stateoff)
                    NodeStatusNotRunning()
                    node.send([{payload:stateoff},null],{payload:context.get("mode")});
                } else if ((msg.cmd == true) && (context.get("operateState") !== "running")) {
                    let defaultRules = [];
                    var rules = rulesconfig ? rulesconfig : defaultRules;
                    var checkprerequisites = comparison(rules,context.get("mode")) 
                    context.set("output",checkprerequisites)
                    if (checkprerequisites == stateoff){
                        NodeStatusMissedPrerequisites()
                    }
                    else{
                        context.set("operateState", "running")
                        clearInterval(interval);
                        startInterval();
                        NodeStatusRunning()
                        const filteredrules= filterPayloadByMode(rules, context.get("mode"));
                        node.send([{payload:checkprerequisites},{payload:filteredrules},{payload:context.get("mode")}]);
                    }
                    const filteredrules= filterPayloadByMode(rules, context.get("mode"));
                    node.send([null,{payload:filteredrules},null]);
                }
            }

            SaveData({mode: context.get("mode")}) 
            SaveData({output: context.get("output")}) 
            SaveData({operateState: context.get("operateState")})  
        });

        this.on("close", function() {
            clearInterval(interval);
        });

        function comparison (rules, mode){
            if (rules.length > 0){
                for (let i = 0; i < rules.length; i++) {
                    let rulecontext1 = (rules[i].propertyType === 'flow') ? node.context().flow : node.context().global;
                    rules[i].variable_value = rulecontext1.get(rules[i].property);
                    let rulecontext2 = (rules[i].vt === 'flow') ? node.context().flow : node.context().global;
                    rules[i].variable_check = rulecontext2.get(rules[i].v);
                }
                for (let i = 0; i < rules.length; i++) {
                    if ((rules[i].vt !== 'flow')&&(rules[i].vt !== 'global')){
                        rules[i].variable_check = convertState(rules[i].vt, rules[i].v)
                    }
                }
            }

            if (rules.length > 0) {
                for (let i = 0; i < rules.length; i++) {
                    switch (rules[i].t) {
                        case 'eq':
                            if (typeof rules[i].variable_value === typeof rules[i].variable_check) {
                                rules[i].comparison_result = (rules[i].variable_value === rules[i].variable_check);
                            } else {
                                rules[i].comparison_result = false;
                            }
                            break;
                        case 'neq':
                            if (typeof rules[i].variable_value === typeof rules[i].variable_check) {
                                rules[i].comparison_result = (rules[i].variable_value !== rules[i].variable_check);
                            } else {
                                rules[i].comparison_result = false;
                            }
                            break;
                        case 'gt':
                            if ((typeof rules[i].variable_value === typeof rules[i].variable_check) &&
                                (typeof rules[i].variable_value === 'number' || typeof rules[i].variable_check === 'string')) {
                                rules[i].comparison_result = (rules[i].variable_value > rules[i].variable_check);
                            } else {
                                rules[i].comparison_result = false;
                            }
                            break;
                        case 'lt':
                            if ((typeof rules[i].variable_value === typeof rules[i].variable_check) &&
                                (typeof rules[i].variable_value === 'number' || typeof rules[i].variable_check === 'string'))  {
                                rules[i].comparison_result = (rules[i].variable_value < rules[i].variable_check);
                            } else {
                                rules[i].comparison_result = false;
                            }
                            break;
                        case 'incl':
                            if (typeof rules[i].variable_value === 'string' && typeof rules[i].variable_check === 'string') {
                                rules[i].comparison_result = (rules[i].variable_value.includes(rules[i].variable_check));
                            } else {
                                rules[i].comparison_result = false;
                            }
                            break;
                        default:
                            rules[i].comparison_result = false;
                            break;
                    }            
                }
                for (let i = 0; i < rules.length; i++) {
                    if (mode == "manual"){
                        if (!rules[i].comparison_result && rules[i].checkboxmanual) {
                            return stateoff;
                        }
                    }
                    else if (mode == "auto"){
                        if (!rules[i].comparison_result && rules[i].checkboxauto) {
                            return stateoff;
                        }
                    }                 
                }
                return stateon 
            }
            else {
                return stateon
            }  
        }

        function convertState(type, value) {
            let returnvalue;        
            if (type === "num") {
                returnvalue = Number(value);
            } else if (type === "str") {
                returnvalue = String(value);
            } else if (type === "bool") {
                returnvalue = JSON.parse(value);
            }            
            return returnvalue;
        }

        // Functie om te filteren op basis van mode
        function filterPayloadByMode(array, mode) {
            if (mode === 'manual') {
                return array.filter(item => item.checkboxmanual === true);
            } else if (mode === 'auto') {
                return array.filter(item => item.checkboxauto === true);
            }
        }   

        function SaveData(state) {
            if (savestate === true){
                const stateFile = path.join(RED.settings.userDir, 'operate-logic-node-state', `${node.id}.json`);        
                let data = {};        
        
                if (fs.existsSync(stateFile)) {
                    const fileContent = fs.readFileSync(stateFile);
                    data = JSON.parse(fileContent);
                }        
        
                let isDifferent = false;
                for (let key in state) {
                    if (data[key] !== state[key]) {
                        data[key] = state[key];
                        isDifferent = true;
                    }
                }
        
                if (isDifferent) {
                    const content = JSON.stringify(data);         
        
                    try {
                        fs.writeFileSync(stateFile, content);
                    } catch (err) {
                        console.error(`Error creating or writing to ${stateFile}:`, err);
                    }
                }
            }
        }

        function ClearData() {
            const stateFile = path.join(RED.settings.userDir, 'operate-logic-node-state', `${node.id}.json`);        
        
            if (fs.existsSync(stateFile)) {
                try {
                    fs.unlinkSync(stateFile);
                    //console.log(`Successfully deleted ${stateFile}`);
                } catch (err) {
                    console.error(`Error deleting ${stateFile}:`, err);
                }
            }
        }

        function NodeStatusInit(){
            node.status({ fill: "blue", shape: "dot", text: "Initialised - waiting for trigger" }); 
        }
        function NodeStatusRunning(){
            node.status({ fill: "green", shape: "dot", text: "Running"  + " " + "in" + " " + context.get("mode")+ " " + "mode"});
        }
        function NodeStatusNotRunning(){
            node.status({ fill: "red", shape: "dot", text: "not running" });
        }
        function NodeStatusMissedPrerequisites(){
            node.status({ fill: "red", shape: "dot", text: "Missed" + " " + "prerequisites" + " " + "in" + " " + context.get("mode")+ " " + "mode" });
        }

    }
    RED.nodes.registerType("OperateLogic",OperateLogicNode);
};