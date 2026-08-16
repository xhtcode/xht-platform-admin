/**
 * bpmn 面板数据
 */
const bpmnPanelData: Record<string, PanelElementType[]> = {
  'bpmn:Process': ['bpmn-panel-listener-execution', 'bpmn-panel-properties', 'bpmn-panel-document'],
  'bpmn:StartEvent': ['bpmn-panel-listener-execution', 'bpmn-panel-properties', 'bpmn-panel-document'],
  'bpmn:SequenceFlow': ['bpmn-panel-condition', 'bpmn-panel-listener-execution', 'bpmn-panel-properties', 'bpmn-panel-document'],
  'bpmn:Task': ['bpmn-panel-listener-task', 'bpmn-panel-properties', 'bpmn-panel-document'],
  'bpmn:UserTask': [
    'bpmn-panel-user',
    'bpmn-panel-user-copy',
    'bpmn-panel-listener-execution',
    'bpmn-panel-listener-task',
    'bpmn-panel-loop',
    'bpmn-panel-properties',
    'bpmn-panel-async',
    'bpmn-panel-document',
  ],
  'bpmn:ServiceTask': ['bpmn-panel-listener-task', 'bpmn-panel-properties', 'bpmn-panel-document'],
  'bpmn:ServiceTaskLike': ['bpmn-panel-listener-task', 'bpmn-panel-properties', 'bpmn-panel-document'],
  'bpmn:BusinessRuleTask': ['bpmn-panel-listener-task', 'bpmn-panel-properties', 'bpmn-panel-document'],
  'bpmn:SendTask': ['bpmn-panel-listener-task', 'bpmn-panel-properties', 'bpmn-panel-document'],
  'bpmn:ScriptTask': ['bpmn-panel-listener-task', 'bpmn-panel-properties', 'bpmn-panel-document'],
  'bpmn:ExclusiveGateway': ['bpmn-panel-listener-execution', 'bpmn-panel-properties', 'bpmn-panel-document'],
  'bpmn:ParallelGateway': ['bpmn-panel-listener-execution', 'bpmn-panel-properties', 'bpmn-panel-document'],
  'bpmn:InclusiveGateway': ['bpmn-panel-listener-execution', 'bpmn-panel-properties', 'bpmn-panel-document'],
  'bpmn:ComplexGateway': ['bpmn-panel-listener-execution', 'bpmn-panel-properties', 'bpmn-panel-document'],
  'bpmn:EventBasedGateway': ['bpmn-panel-listener-execution', 'bpmn-panel-properties', 'bpmn-panel-document'],
  'bpmn:EndEvent': ['bpmn-panel-listener-execution', 'bpmn-panel-properties', 'bpmn-panel-document'],
}

export default bpmnPanelData
