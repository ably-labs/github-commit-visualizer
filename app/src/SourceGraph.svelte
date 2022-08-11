<script lang="ts">
  import { afterUpdate, onMount } from "svelte";
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
    network?.fit({
      animation: false,
    });
  };
</script>

<div class="nodes"><span>{history.nodes.size}</span> nodes</div>

<div bind:this={target} style="width: 100%; height: 93vh;" />

<!-- delete this to remove explanation-->
<div class="what">
  <input type="checkbox" class="what-checkbox" id="checkbox">
  <label for="checkbox" class="what-label">What is this?</label>
  <div class="what-content">
    <h2>What is this?</h2>
    <p>This graph visualises the work of the Ably engineering team in realtime. Every node that you see is a commit that the developers have made to an Ably repository. It is written in Svelte, with VisJS and Ably. It would be perfect for large screens, lobby displays, and places where it might be useful to see your efforts being visualised!
    </p>
   <p>If you'd like to visualise your organization's work, you can deploy your own version of this application from the <a class="link" href="https://github.com/ably-labs/github-commit-visualizer">Visualizer GitHub repository</a>, and read about how this was built <a href="https://ably.com/blog/visualize-your-commits-in-realtime-with-ably-and-github-webhooks" class="link">over on the Ably Blog</a>.</p>
  </div>
</div>

<style>
  .nodes {
    position: absolute;
    bottom: 2.1em;
    right: 60px;
  }

  .nodes span {
    display: inline-block;
    width: 4rem;
    text-align: center;
    font-size: 1.4rem;
    font-weight: bold;
  }

  .what-checkbox {
    display: none;
  }

  .what-label {
    position: absolute;
    top: 5rem;
    right: 1rem;
    display: block;
    height: 24px;
    width: 24px;
    color: transparent;
    font-size: 1px;
    background: url("/what.png") no-repeat right center;
    background-size: contain;
    z-index: 2;
    cursor: pointer;
  }

  .what-content {
    position: absolute;
    top: 4rem;
    right: 0;
    max-height: 0;
    width: 100%;
    overflow: hidden;
    background-color: #fff;
    color: #03020D;
    transition: max-height 0.5s ease-in-out;
  }

  .what-content h2 {
    margin: 1rem 2rem;
    max-width: 800px;
  }

  .what-content p {
    margin: 1rem 2rem;
    max-width: 800px;
  }

  .what-checkbox:checked ~ .what-content {
    height: auto;
    max-height: 350px;
    padding-bottom: 1rem;
  }
  .link {
    margin-bottom: 2rem;
    color: #ff5416;
  }
</style>
