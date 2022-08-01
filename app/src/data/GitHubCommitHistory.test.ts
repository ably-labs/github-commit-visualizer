import { beforeEach, describe, expect, it } from "vitest";
import { GitHubCommitHistory } from "./GitHubCommitHistory";
import type { GitHubHook } from "../types";

describe("GitHubCommitHistory", () => {

    let sut: GitHubCommitHistory;
    beforeEach(() => {
        sut = new GitHubCommitHistory();
    });
    
    it("should be defined", () => {
        expect(GitHubCommitHistory).toBeDefined();
        expect(new GitHubCommitHistory()).toBeDefined();
    });

    it("toTree produces nodes from commits", () => {
        const tree = sut.toNodesAndEdges();
        expect(tree).toBeDefined();
    });

    it("toTree, single file committed, node present", () => {        
        sut.push(gitHookWith(["file.txt"]));

        const { nodes } = sut.toNodesAndEdges();

        expect([...nodes.values()].length).toBe(2);
        expect([...nodes.values()][0].label).toBe("test");
        expect([...nodes.values()][1].label).toBe("file.txt");
    });

    it("toTree, single file committed in sub-dir, node present", () => {
        sut.push(gitHookWith(["src/file.txt"]));       

        const { nodes } = sut.toNodesAndEdges();

        expect([...nodes.values()][1].label).toBe("src");
        expect([...nodes.values()][2].label).toBe("file.txt");
    });

    it("toTree, single file committed in sub-dir, then removed, node not present", () => {        
        sut.push(gitHookWith(["src/file.txt"]));        
        sut.push(gitHookWith([], ["src/file.txt"]));    
        
        const { nodes } = sut.toNodesAndEdges();

        expect([...nodes.values()].length).toBe(2);
        expect([...nodes.values()][0].label).toBe("test");
        expect([...nodes.values()][1].label).toBe("src");
    });

    it("toNodesAndEdges, root node is omitted", () => {
        const { nodes } = sut.toNodesAndEdges();

        expect([...nodes.values()].length).toBe(0);
    });

    it("toNodesAndEdges, a parent and child exist, nodes correct", () => {
        sut.push(gitHookWith(["file.txt"]));

        const { nodes } = sut.toNodesAndEdges();

        expect([...nodes.values()].length).toBe(2);
        expect([...nodes.values()][0].id).toBe("test");
        expect([...nodes.values()][1].id).toBe("test/file.txt");
    });

    it("toNodesAndEdges, a parent and child exist,edges correct", () => {
        sut.push(gitHookWith(["file.txt"]));

        const { edges } = sut.toNodesAndEdges();
        
        expect(edges.length).toBe(1);
        expect(edges[0].from).toBe("test");
        expect(edges[0].to).toBe("test/file.txt");
    });

    it("toNodesAndEdges, a parent and multiple children exist, correct number of nodes generated", () => {
        sut.push(gitHookWith(["file1.txt", "file2.txt"]));

        const { nodes } = sut.toNodesAndEdges();

        expect([...nodes.values()].length).toBe(3);
        expect([...nodes.values()][0].id).toBe("test");
        expect([...nodes.values()][1].id).toBe("test/file1.txt");
        expect([...nodes.values()][2].id).toBe("test/file2.txt");
    });

    it("toNodesAndEdges, a parent with multi-level nesting exist, correct nodes generated", () => {
        sut.push(gitHookWith(["src/foo/bar/file1.txt"]));

        const { nodes } = sut.toNodesAndEdges();

        expect([...nodes.values()].length).toBe(5);
        expect([...nodes.values()][0].id).toBe("test");
        expect([...nodes.values()][1].id).toBe("test/src");
        expect([...nodes.values()][2].id).toBe("test/src/foo");
        expect([...nodes.values()][3].id).toBe("test/src/foo/bar");
        expect([...nodes.values()][4].id).toBe("test/src/foo/bar/file1.txt");
    });
});

const gitHookWith = (added = [], removed = [], modified = []): GitHubHook => ({
    repository: {
        name: "test",
        full_name: "snakemode/test"
    },
    commits: [
        {
            added: added,
            removed: removed,
            modified: modified
        } as any
    ]
} as any);
