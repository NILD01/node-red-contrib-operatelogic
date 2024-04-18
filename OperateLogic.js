module.exports = function(RED) {
    function OperateLogicNode(config) {
        RED.nodes.createNode(this, config);
        var checktime = config.checktime *1000
        var rulesconfig= config.rules
        var restartafterfault = config.restartafterfault;
        var initialisemode = config.initialisemode
        var stateonm = config.stateon
        var stateontype= config.stateontype
        var stateoffm = config.stateoff
        var stateofftype= config.stateofftype

        var node = this;
        var interval;
        var context = this.context().flow;
        var nodeId = node.id;

        var stateon = convertState(stateontype, stateonm)
        var stateoff = convertState(stateofftype, stateoffm)

        mode = context.get("mode" + nodeId) || initialisemode
        context.set("mode" + nodeId, mode);
        node.send([null,null,{payload:mode}]);
        node.status({ fill: "blue", shape: "dot", text: "waiting for trigger" });        

        function startInterval() {            
            interval = setInterval(function() {
                var defaultRules = [];
                var rules = rulesconfig ? rulesconfig : defaultRules;
                var checkprerequisites = comparison(rules,context.get("mode" + nodeId));
                const filteredrules= filterPayloadByMode(rules, context.get("mode" + nodeId));
                node.send([null,{payload:filteredrules},null])

                if (context.get("operateState" + nodeId) == "running"){
                    if (context.get("output" + nodeId) !== checkprerequisites){
                        context.set("output" + nodeId,checkprerequisites)
                        if (checkprerequisites == stateoff){
                            node.status({ fill: "red", shape: "dot", text: "Missed" + " " + "prerequisites" + " " + "in" + " " + context.get("mode" + nodeId)+ " " + "mode" });
                            if((restartafterfault==true)||(context.get("mode" + nodeId) == "manual")){
                                context.set("operateState" + nodeId, "not running")
                            }
                        }  
                        else{
                            node.status({ fill: "green", shape: "dot", text: "Running"  + " " + "in" + " " + context.get("mode" + nodeId)+ " " + "mode"});
                        }                     
                        const filteredrules= filterPayloadByMode(rules, context.get("mode" + nodeId));
                        node.send([{payload:checkprerequisites},{payload:filteredrules},{payload:context.get("mode" + nodeId)}]);
                    }
                }
            }, checktime);
        }

        startInterval();

        this.on("input", function(msg) {
            if((msg.mode == "manual")||(msg.mode == "auto")){                
                context.set("mode" + nodeId, msg.mode);
                var defaultRules = [];
                var rules = rulesconfig ? rulesconfig : defaultRules;
                var checkprerequisites = comparison(rules,context.get("mode" + nodeId));
                const filteredrules= filterPayloadByMode(rules, context.get("mode" + nodeId));
                node.send([null,{payload:filteredrules},{payload:context.get("mode" + nodeId)}])
            }
            if (((msg.mode == "manual")||(msg.mode == "auto"))&&(context.get("output" + nodeId) == stateoff)){
                node.status({ fill: "red", shape: "dot", text: "not running" });
                context.set("operateState" + nodeId, "not running")
            }
            if (((msg.mode == "manual")||(msg.mode == "auto"))&&(context.get("output" + nodeId) == stateon)&&(checkprerequisites == stateoff)){
                node.status({ fill: "red", shape: "dot", text: "Missed" + " " + "prerequisites" + " " + "in" + " " + context.get("mode" + nodeId)+ " " + "mode" });
                context.set("operateState" + nodeId, "not running")
                node.send([{payload: checkprerequisites},null,null])
            }
            if (context.get("operateState" + nodeId) == "running"){
                node.status({ fill: "green", shape: "dot", text: "Running"  + " " + "in" + " " + context.get("mode" + nodeId)+ " " + "mode"});
            }

            msg.fault = false

            mode = context.get("mode" + nodeId)
   
            if ((mode == "manual") && (msg.manual == true)) {
                msg.cmd = true
            } 
            if ((mode == "manual") && (msg.manual == false)) {
                msg.cmd = false
            }      
            if ((mode == "auto") && (msg.auto == true)) {
                msg.cmd = true
            }     
            if ((mode == "auto") && (msg.auto == false)) {
                msg.cmd = false
            }        
       
            if (msg.fault == false) {
                if (msg.cmd == false){
                    context.set("operateState" + nodeId, "not running")
                    context.set("output" + nodeId,stateoff)
                    node.status({ fill: "red", shape: "dot", text: "not running" });
                    node.send([{payload:stateoff},null],{payload:context.get("mode" + nodeId)});
                } else if ((msg.cmd == true) && (context.get("operateState" + nodeId) !== "running")) {
                    var defaultRules = [];
                    var rules = rulesconfig ? rulesconfig : defaultRules;
                    var checkprerequisites = comparison(rules,context.get("mode" + nodeId)) 
                    context.set("output" + nodeId,checkprerequisites)
                    if (checkprerequisites == stateoff){
                        node.status({ fill: "red", shape: "dot", text: "Missed" + " " + "prerequisites" + " " + "in" + " " + context.get("mode" + nodeId)+ " " + "mode" });
                    }
                    else{
                        context.set("operateState" + nodeId, "running")
                        clearInterval(interval);
                        startInterval();
                        node.status({ fill: "green", shape: "dot", text: "Running"  + " " + "in" + " " + context.get("mode" + nodeId)+ " " + "mode"});
                        const filteredrules= filterPayloadByMode(rules, context.get("mode" + nodeId));
                        node.send([{payload:checkprerequisites},{payload:filteredrules},{payload:context.get("mode" + nodeId)}]);
                    }
                    const filteredrules= filterPayloadByMode(rules, context.get("mode" + nodeId));
                    node.send([null,{payload:filteredrules},null]);
                }
            }
        });

        this.on("close", function() {
            clearInterval(interval);
        });

        function comparison (rules, mode){
            if (rules.length > 0){
                for (let i = 0; i < rules.length; i++) {
                    var rulecontext1 = (rules[i].propertyType === 'flow') ? node.context().flow : node.context().global;
                    rules[i].variable_value = rulecontext1.get(rules[i].property);
                    var rulecontext2 = (rules[i].vt === 'flow') ? node.context().flow : node.context().global;
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
    }
    RED.nodes.registerType("OperateLogic",OperateLogicNode);
};