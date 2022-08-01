import { expect, it, describe } from "vitest";
import type { GraphNode } from "../types";
import { diffNodesAndEdges } from "./NodeAndEdgeDiff";

describe("NodeAndEdgeDiff", () => {

    it("provided no nodes and edges, no items returned", () => {
        const current = {
            nodes: new Map(),
            edges: []
        };

        const result = diffNodesAndEdges(current, current);

        expect(result.nodeAdditions.length).toBe(0);
        expect(result.nodeRemovals.length).toBe(0);
        expect(result.edgeAdditions.length).toBe(0);
    });

    it("provided identical nodes and edges, no items returned", () => {
        const current = {
            nodes: new Map([
                ["a", { id: "a", label: "a" }],
            ]),
            edges: []
        };

        const result = diffNodesAndEdges(current, current);

        expect(result.nodeAdditions.length).toBe(0);
        expect(result.nodeRemovals.length).toBe(0);
        expect(result.edgeAdditions.length).toBe(0);
    });

    it("provided single addition, addition returned", () => {
        const current = {
            nodes: new Map([
                ["a", { id: "a", label: "a" }],
            ]),
            edges: []
        };

        const next = {
            nodes: new Map([
                ["a", { id: "a", label: "a" }],
                ["b", { id: "b", label: "b" }],
            ]),
            edges: []
        };

        const result = diffNodesAndEdges(current, next);

        expect(result.nodeAdditions.length).toBe(1);
        expect(result.nodeRemovals.length).toBe(0);
        expect(result.nodeAdditions[0].id).toBe("b");
    });

    it("provided single removal, removal id returned", () => {
        const current = {
            nodes: new Map([
                ["a", { id: "a", label: "a" }],
                ["b", { id: "b", label: "b" }],
            ]),
            edges: []
        };

        const next = {
            nodes: new Map([
                ["a", { id: "a", label: "a" }],
            ]),
            edges: []
        };

        const result = diffNodesAndEdges(current, next);

        expect(result.nodeAdditions.length).toBe(0);
        expect(result.nodeRemovals.length).toBe(1);
        expect(result.nodeRemovals[0]).toBe("b");
    });

    it("(performance) massive group of nodes, provided single addition, addition id returned", () => {
        // This test is for profiling.
        
        const current = {
            nodes: new Map<string, GraphNode>(lotsOfNodes(5000)),
            edges: []
        };

        const next = {
            nodes: new Map([
                ...lotsOfNodes(5000),
                ["a", { id: "a", label: "a" }],
            ]),
            edges: []
        };

        const result = diffNodesAndEdges(current, next);

        expect(result.nodeAdditions.length).toBe(1);
        expect(result.nodeRemovals.length).toBe(0);
    });

    it("(performance) massive group of nodes, provided single removal, removal id returned", () => {
        // This test is for profiling.

        const current = {
            nodes: new Map<string, GraphNode>(lotsOfNodes(5000)),
            edges: []
        };

        const next = {
            nodes: new Map<string, GraphNode>(lotsOfNodes(4999)),
            edges: []
        };

        const result = diffNodesAndEdges(current, next);

        expect(result.nodeAdditions.length).toBe(0);
        expect(result.nodeRemovals.length).toBe(1);
    });

});

const lotsOfNodes = (count: number = 5000): [string, GraphNode][]=> {
    const bigDataSet = [];
    for (let i = 0; i < count; i++) {
        const id = `${i}`;
        bigDataSet.push([id, { id: id, label: id }])
    }
    return bigDataSet;
};