<script lang="ts">
  import { onMount } from "svelte";
  import { GitHubCommitHistory } from "./data/GitHubCommitHistory";
  import { DataSet } from "vis-data";
  import { styledNode } from "./StyledNodeFactory";
  import { defaultEdgeConfig } from "./StyledEdgeFactory";
  import { diff } from "./data/NodeAndEdgeDiff";
  import type { GraphNode } from "./types";
  import * as vis from "vis-network";

  export let history = new GitHubCommitHistory();

  let target: HTMLDivElement;

  let network: vis.Network;
  let displayedNodes: DataSet<GraphNode> = new DataSet({});
  let displayedEdges: vis.DataSetEdges = new DataSet({});
  let state: vis.Data = { nodes: displayedNodes, edges: displayedEdges };

  onMount(() => {
    const options: vis.Options = {
      autoResize: true,
      edges: defaultEdgeConfig(),
    };

    network = new vis.Network(target, state, options);

    setInterval(() => {
      network.fit({
        animation: { duration: 1500, easingFunction: "linear" },
      });
    }, 5000);
  });

  $: {
    history && updateNodes();
  }

  const updateNodes = () => {
    const previous = { nodes: displayedNodes, edges: displayedEdges };
    const current = history.toNodesAndEdges();

    const {
      nodeAdditions: nodesToAdd,
      nodeRemovals: nodesToRemove,
      edgeAdditions: edgesToAdd,
    } = diff(previous, current);

    nodesToAdd.forEach((n) => styledNode(n));

    displayedNodes.add(nodesToAdd);
    displayedEdges.add(edgesToAdd);
    displayedNodes.remove(nodesToRemove);

    const visibleNodes = displayedNodes.getIds().map((id) => <string>id);
    const edgesToRemove = current.edges.filter(
      (e) =>
        !visibleNodes.includes(<string>e.from) ||
        !visibleNodes.includes(<string>e.to)
    );

    displayedEdges.remove(edgesToRemove);
  };
</script>

Nodes: {history.nodes.size}

<div bind:this={target} style="width: 100%; height: 93vh;" />
