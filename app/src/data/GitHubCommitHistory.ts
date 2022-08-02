import type { GitHubHook, GraphNode, NodesAndEdges } from "../types";
import type * as vis from "vis-network";

export class GitHubCommitHistory {
    private _nodesInOccuranceOrder: GraphNode[];
    private _nodes: Map<string, GraphNode>;
    private _edges: Set<vis.Edge>;
    private _bufferLength: number;

    public get nodes(): Map<string, GraphNode> {
        return this._nodes;
    }

    constructor(nodeBufferLength = 500) {
        this._nodesInOccuranceOrder = [];
        this._nodes = new Map<string, GraphNode>();
        this._edges = new Set<vis.Edge>();
        this._bufferLength = nodeBufferLength;
    }

    public push(hookData: GitHubHook) {
        this.processFilePaths(hookData);
        this.purgeOldNodes();
        return this;
    }

    private processFilePaths(message: GitHubHook) {
        const commits = message.commits || [];

        for (const commit of commits) {
            commit.added = commit.added || [];
            commit.modified = commit.modified || [];
            commit.removed = commit.removed || [];

            if (!message?.repository?.name) {
                continue;
            }
            
            this.ensureRepositoryNodeExists(message.repository.name);

            const touchedFiles = [...commit.added, ...commit.modified]; 

            for (const file of touchedFiles) {
                const id = `${message.repository.name}/${file}`;
                this.createNodesForPath(id, message.repository.name);
            }

            for (const file of commit.removed) {
                this.deleteNodeAndEdges(`${message.repository.name}/${file}`);                
            }
        }
    }

    private purgeOldNodes() {
        while(this._nodesInOccuranceOrder.length >= this._bufferLength) {
            const nodeToRemove = this._nodesInOccuranceOrder.shift();
            if (nodeToRemove) {
                this.deleteNodeAndEdges(<string>nodeToRemove.id);
            }
        }
    }

    private deleteNodeAndEdges(nodeId: string) {
        this._nodes.delete(nodeId);
                
        const edgesToDelete = [...this._edges].filter(e => e.from === nodeId || e.to === nodeId);
        for (const edge of edgesToDelete) {
            this._edges.delete(edge);
        }   
    }

    private createNodesForPath(id: string, group: string) {
        const partsSoFar = [];
        const parts = id.split("/");

        let current = this._nodes.get(parts[0]);

        for (const part of parts) {
            partsSoFar.push(part);
            const nodeId = partsSoFar.join("/");

            let thisNode: GraphNode;

            if (this._nodes.has(nodeId)) {
                thisNode = this._nodes.get(nodeId);

                this._nodesInOccuranceOrder = this._nodesInOccuranceOrder.filter(n => n.id !== nodeId);
                this._nodesInOccuranceOrder.push(thisNode);
            } else {
                const newNode = {
                    id: nodeId,
                    label: part,
                    group: group,
                    isFile: partsSoFar.length === parts.length,
                    isDirectory: false,
                    isRepository: false
                };

                this._nodes.set(nodeId, newNode);
                this._nodesInOccuranceOrder.push(newNode);

                thisNode = newNode;            

                if (partsSoFar.length > 1) {
                    this._edges.add({ id: `${current.id}=>${nodeId}`, from: current.id, to: nodeId });
                }
            }

            current = thisNode;
        }
    }

    public toNodesAndEdges(): NodesAndEdges {
        return { 
            nodes: this._nodes,
            edges: [...this._edges.values()]
        };
    }

    private ensureRepositoryNodeExists(repositoryId: string) {
        if(!this._nodes.has(repositoryId)) {
            const newRepo: GraphNode = {
                id: repositoryId,
                label: repositoryId,
                group: repositoryId,
                isFile: false,
                isDirectory: false,
                isRepository: true
            };

            this._nodes.set(repositoryId, newRepo);
        }
    }
        
}
