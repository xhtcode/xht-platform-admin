export default {
  finishedNodes: ['START_1', 'TASK_1', 'Gateway_1'], // 已完成节点
  finishedLines: ['Line_1', 'Line_2', 'Line_3', 'Line_4'], //  已完成连线
  unfinishedTasks: ['TASK_2', 'TASK_3'], // 待办任务
  rejectedTasks: [], // 已驳回任务
  all: ['START_1', 'TASK_1', 'Gateway_1', 'Line_1', 'Line_2', 'Line_3', 'Line_4', 'TASK_2', 'TASK_3'],
  xml: `
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:flowable="http://flowable.org/bpmn" id="Definitions_10spe8o" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="Line1" name="测试流程" isExecutable="true">
    <bpmn:startEvent id="START_1" name="开始" flowable:initiator="initiator">
      <bpmn:outgoing>Line_1</bpmn:outgoing>
    </bpmn:startEvent>
    <bpmn:userTask id="TASK_1" name="任务1" flowable:assignee="{initiator}" flowable:skipExpression="{initiator == &#39;&#39;}">
      <bpmn:extensionElements>
        <flowable:assigneeType>static</flowable:assigneeType>
      </bpmn:extensionElements>
      <bpmn:incoming>Line_1</bpmn:incoming>
      <bpmn:outgoing>Line_2</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="Line_1" name="线1" sourceRef="START_1" targetRef="TASK_1" />
    <bpmn:exclusiveGateway id="Gateway_1" name="网关1">
      <bpmn:incoming>Line_2</bpmn:incoming>
      <bpmn:outgoing>Line_3</bpmn:outgoing>
      <bpmn:outgoing>Line_4</bpmn:outgoing>
    </bpmn:exclusiveGateway>
    <bpmn:userTask id="TASK_2" name="任务2" flowable:assignee="10000">
      <bpmn:extensionElements>
        <flowable:assigneeType>static</flowable:assigneeType>
        <flowable:staticAssigneeVariables>[{"name":"易烊千玺","tabKey":"person","value":"10000"}]</flowable:staticAssigneeVariables>
      </bpmn:extensionElements>
      <bpmn:incoming>Line_3</bpmn:incoming>
      <bpmn:outgoing>Line_5</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="Line_3" name="线3" sourceRef="Gateway_1" targetRef="TASK_2" />
    <bpmn:userTask id="TASK_3" name="任务3" flowable:skipExpression="NAME">
      <bpmn:extensionElements>
        <flowable:assigneeType>static</flowable:assigneeType>
      </bpmn:extensionElements>
      <bpmn:incoming>Line_4</bpmn:incoming>
      <bpmn:outgoing>Line_6</bpmn:outgoing>
    </bpmn:userTask>
    <bpmn:sequenceFlow id="Line_4" name="线4" sourceRef="Gateway_1" targetRef="TASK_3" />
    <bpmn:sequenceFlow id="Line_5" name="线5" sourceRef="TASK_2" targetRef="END_1" />
    <bpmn:sequenceFlow id="Line_6" name="线6" sourceRef="TASK_3" targetRef="END_2" />
    <bpmn:endEvent id="END_2" name="结束2">
      <bpmn:incoming>Line_6</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:endEvent id="END_1" name="结束1">
      <bpmn:incoming>Line_5</bpmn:incoming>
    </bpmn:endEvent>
    <bpmn:sequenceFlow id="Line_2" name="线2" sourceRef="TASK_1" targetRef="Gateway_1" />
  </bpmn:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Line1">
      <bpmndi:BPMNShape id="Event_0b0mrqz_di" bpmnElement="START_1">
        <dc:Bounds x="-328" y="-118" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="-321" y="-75" width="23" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0v4t4mk_di" bpmnElement="TASK_1">
        <dc:Bounds x="-200" y="-140" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_1xpl98i_di" bpmnElement="Gateway_1" isMarkerVisible="true">
        <dc:Bounds x="-25" y="-125" width="50" height="50" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="-14" y="-155" width="29" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0t14369_di" bpmnElement="TASK_2">
        <dc:Bounds x="90" y="-140" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0tr4d9i_di" bpmnElement="TASK_3">
        <dc:Bounds x="100" y="-20" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_0y4kn25_di" bpmnElement="END_2">
        <dc:Bounds x="282" y="2" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="287" y="45" width="28" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1cjx0pq_di" bpmnElement="END_1">
        <dc:Bounds x="292" y="-118" width="36" height="36" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="297" y="-75" width="28" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_1apj11k_di" bpmnElement="Line_1">
        <di:waypoint x="-292" y="-100" />
        <di:waypoint x="-200" y="-100" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="-254" y="-118" width="17" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_0yo0blq_di" bpmnElement="Line_3">
        <di:waypoint x="25" y="-100" />
        <di:waypoint x="90" y="-100" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="50" y="-118" width="17" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_06d1bbn_di" bpmnElement="Line_4">
        <di:waypoint x="0" y="-75" />
        <di:waypoint x="0" y="20" />
        <di:waypoint x="100" y="20" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="7" y="-30" width="17" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1301w4y_di" bpmnElement="Line_5">
        <di:waypoint x="190" y="-100" />
        <di:waypoint x="292" y="-100" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="233" y="-118" width="17" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1ulz6il_di" bpmnElement="Line_6">
        <di:waypoint x="200" y="20" />
        <di:waypoint x="282" y="20" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="233" y="2" width="17" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1fxzr68_di" bpmnElement="Line_2">
        <di:waypoint x="-100" y="-100" />
        <di:waypoint x="-25" y="-100" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="-70" y="-118" width="17" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
  `,
}
