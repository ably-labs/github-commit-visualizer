import type * as vis from "vis-network";

export interface GraphNode extends vis.Node {
  isDirectory?: boolean;
  isFile?: boolean;
  isRepository?: boolean;
  
}

export interface NodesAndEdges {
  nodes: Map<string, GraphNode>;
  edges: vis.Edge[];
}

export interface GitHubHook { 
    ref: string;
    before: string;
    after: string;
    repository: Repository;
    pusher: Pusher;
    organization: Organization;
    sender: Sender;
    created: boolean;
    deleted: boolean;
    forced: boolean;
    base_ref?: null;
    compare: string;
    commits?: (Commits)[] | null;
    head_commit: HeadCommit;
  }

  export interface Repository { 
    id: number;
    node_id: string;
    name: string;
    full_name: string;
    private: boolean;
    owner: Owner;
    html_url: string;
    description?: null;
    fork: boolean;
    url: string;
    forks_url: string;
    keys_url: string;
    collaborators_url: string;
    teams_url: string;
    hooks_url: string;
    issue_events_url: string;
    events_url: string;
    assignees_url: string;
    branches_url: string;
    tags_url: string;
    blobs_url: string;
    git_tags_url: string;
    git_refs_url: string;
    trees_url: string;
    statuses_url: string;
    languages_url: string;
    stargazers_url: string;
    contributors_url: string;
    subscribers_url: string;
    subscription_url: string;
    commits_url: string;
    git_commits_url: string;
    comments_url: string;
    issue_comment_url: string;
    contents_url: string;
    compare_url: string;
    merges_url: string;
    archive_url: string;
    downloads_url: string;
    issues_url: string;
    pulls_url: string;
    milestones_url: string;
    notifications_url: string;
    labels_url: string;
    releases_url: string;
    deployments_url: string;
    created_at: number;
    updated_at: string;
    pushed_at: number;
    git_url: string;
    ssh_url: string;
    clone_url: string;
    svn_url: string;
    homepage?: null;
    size: number;
    stargazers_count: number;
    watchers_count: number;
    language?: null;
    has_issues: boolean;
    has_projects: boolean;
    has_downloads: boolean;
    has_wiki: boolean;
    has_pages: boolean;
    forks_count: number;
    mirror_url?: null;
    archived: boolean;
    disabled: boolean;
    open_issues_count: number;
    license?: null;
    allow_forking: boolean;
    is_template: boolean;
    web_commit_signoff_required: boolean;
    topics?: () => [] | null;
    visibility: string;
    forks: number;
    open_issues: number;
    watchers: number;
    default_branch: string;
    stargazers: number;
    master_branch: string;
    organization: string;
  }

  export interface Owner { 
    name: string;
    email: string;
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
  }

  export interface Pusher { 
    name: string;
    email: string;
  }

  export interface Organization { 
    login: string;
    id: number;
    node_id: string;
    url: string;
    repos_url: string;
    events_url: string;
    hooks_url: string;
    issues_url: string;
    members_url: string;
    public_members_url: string;
    avatar_url: string;
    description: string;
  }

  export interface Sender { 
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
  }

  export interface Commits { 
    id: string;
    tree_id: string;
    distinct: boolean;
    message: string;
    timestamp: string;
    url: string;
    author: Author;
    committer: Committer;
    added?: [] | null;
    removed?: [] | null;
    modified?: (string)[] | null;
  }

  export interface Author { 
    name: string;
    email: string;
    username: string;
  }

  export interface Committer { 
    name: string;
    email: string;
    username: string;
  }

  export interface HeadCommit { 
    id: string;
    tree_id: string;
    distinct: boolean;
    message: string;
    timestamp: string;
    url: string;
    author: Author;
    committer: Committer;
    added?: [] | null;
    removed?: [] | null;
    modified?: string[] | null;
  }
  