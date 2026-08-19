export default function (processId: string, processName: string): string {
  processId = `ProcessId_${processId}`
  return `
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
    xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
    id="Definitions_0pz95la"
    targetNamespace="http://bpmn.io/schema/bpmn">
    <bpmn:process id="${processId}" name="${processName}" isExecutable="true" />
    <bpmndi:BPMNDiagram id="BPMNDiagram_1">
        <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${processId}" />
    </bpmndi:BPMNDiagram>
</bpmn:definitions>
`
}
