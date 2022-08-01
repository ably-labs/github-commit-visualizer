import type { DataSet } from "vis-data";
import type { GraphNode, NodesAndEdges } from "../types";
import type * as vis from "vis-network";

export type DisplayedNodesAndEdges = {
    nodes: DataSet<GraphNode>;
    edges: DataSet<vis.Edge>;
}

export type VisDataCurrent ={
    nodes: DataSet<GraphNode>,
    edges: vis.DataSetEdges
}

export function diff(previous: VisDataCurrent, current: NodesAndEdges) {
    const { nodes, edges } = previous;

    const displayedNodesMap = new Map(
        nodes.getDataSet().map((data) => [<string>data.id, data])
    );

    const displayedEdgesArray = [...edges.getDataSet().map((x) => x)];

    const req: NodesAndEdges = {
        nodes: displayedNodesMap,
        edges: displayedEdgesArray,
    };

    return diffNodesAndEdges(req, current);
}

export function diffNodesAndEdges(current: NodesAndEdges, next: NodesAndEdges) {
    const { nodes: displayedNodes, edges: displayedEdges } = current;   
    const { nodes: nodeMap, edges } = next;
    const nodes = [...nodeMap.values()];
    
    const ids = [...displayedNodes.keys()];
    const edgeIds = displayedEdges.map(x => x.id);

    const nodesToAdd = nodes.filter((n) => !ids.includes(<string>n.id));

    // NOTE: This is the expensive line 50% runtime of the entire function
    const nodesToRemove = ids.filter((id) => !nodeMap.has(id)); 

    const edgesToAddWithDupes = [];
    for (const node of nodesToAdd) {
      const edgesConnectingNewNodes = edges.filter(
        (e) =>
          (e.from === node.id || e.to === node.id) &&
          !edgeIds.includes(<string>e.id)
      );

        edgesToAddWithDupes.push(...edgesConnectingNewNodes);
    }

    const edgesToAdd = [...new Set(edgesToAddWithDupes)];

    return {
        nodeAdditions: nodesToAdd,
        nodeRemovals: nodesToRemove,
        edgeAdditions: edgesToAdd,
    }
}