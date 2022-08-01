import type { GraphNode } from "./types";

export function styledNode(node: GraphNode) {
    node.borderWidth = 2;
    node.borderWidthSelected = 2,
    node.color = {
        border: "#DBDBDC",
        background: "#292831",
        highlight: {
            border: '#FF5416',
            background: "#292831",
        },
        hover: {
            border: "#FF5416"
        }
    }
    node.font = {
        color: "#DBDBDC",
        face: 'courier',
        strokeWidth: 0.5,
        strokeColor: "#DBDBDC" 
    }
    node.shadow = {
        enabled: true,
        color: "rgba(255,255,255,0.3)",
        size: 10,
        x: 0,
        y: 0
    }
    
    node.shape = "box";

    if (node.isRepository) {
        node.mass = 5;
        node.color.border = "#FF5416";
        node.color.background =  "#FF5416";

        node.font.color = "#ffffff";
        node.font.face = 'courier';
        node.font.strokeWidth = 0.5;
        node.font.strokeColor = "#ffffff";
    }
  
    return node;
}
