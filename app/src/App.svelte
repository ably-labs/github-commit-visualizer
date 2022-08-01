<script lang="ts">
  import SourceGraph from "./SourceGraph.svelte";
  import { useChannel } from "./lifecycle-functions/actions/useChannel";
  import { exampleCommitMessageHook } from "./data/ExampleCommitHook";
  import { GitHubCommitHistory } from "./data/GitHubCommitHistory";
  import type { GitHubHook } from "./types";

  let history = new GitHubCommitHistory();

  useChannel("github-events", (message) => {
    onMessageReceived(message.data);
  });

  const onMessageReceived = (message: GitHubHook) => {
    history = history.push(message);
  };

  const sendFakeMessage = () => {
    const randomNumber = Math.floor(Math.random() * 1000).toString();
    const randomNumber10 = Math.floor(Math.random() * 15).toString();
    const randomNumber1to3 = Math.floor(Math.random() * 3).toString();
    const msg: GitHubHook = JSON.parse(exampleCommitMessageHook);
    msg.repository.name = `Repo-${randomNumber1to3}`;
    msg.commits = [
      {
        added: [`src/dir-${randomNumber10}/file-${randomNumber}.txt`],
        removed: [],
        modified: [],
      } as any,
    ];
    onMessageReceived(msg);
  };

  const setupFakeMessageTimer = () => {
    setInterval(() => {
      sendFakeMessage();
    }, 500);
  };
</script>

<header>
  <h1>
    <img
      src="/githubvis.png"
      alt="github commit visualiser logo"
      class="visualiser-logo"
    />GitHub Commit Visualiser
  </h1>
  <h2>
    by <svg
      class="ably-logo"
      width="120"
      height="52"
      viewBox="0 0 108 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M62.922 24.9786V4.08813H66.6933V11.6512C67.9709 10.435 69.6164 9.76044 71.3538 9.76044C75.4318 9.76044 79.0498 12.8674 79.0498 17.5484C79.0498 22.2293 75.4318 25.3465 71.3538 25.3465C69.5244 25.3465 67.7971 24.6209 66.5094 23.3024V24.9786H62.922ZM75.2785 17.5484C75.2785 14.932 73.4183 13.1025 70.9859 13.1025C68.6148 13.1025 66.7853 14.84 66.6933 17.3644V17.5484C66.6933 20.1648 68.5534 21.9942 70.9859 21.9942C73.4183 21.9942 75.2785 20.1648 75.2785 17.5484ZM80.7975 24.9786V4.08813H84.5688V24.9786H80.7975ZM89.8425 30.3954L92.0399 25.1523L86.0712 10.1284H90.1491L93.9511 20.6247L97.8144 10.1284H101.954L93.8591 30.4056H89.8425V30.3954ZM56.9329 10.1284V12.0191C55.6247 10.5883 53.7952 9.77066 51.9147 9.77066C47.8367 9.77066 44.2187 12.8777 44.2187 17.5586C44.2187 22.2497 47.8367 25.3465 51.9147 25.3465C53.8668 25.3465 55.7166 24.4982 57.0555 22.9754V24.9888H60.3465V10.1284H56.9329ZM56.5649 17.5484C56.5649 20.1341 54.7048 21.9942 52.2724 21.9942C49.8399 21.9942 47.9798 20.1341 47.9798 17.5484C47.9798 14.9626 49.8399 13.1025 52.2724 13.1025C54.6435 13.1025 56.473 14.8706 56.5649 17.3644V17.5484Z"
        fill="currentColor"
      />
      <path
        d="M19.2858 0L3.14788 29.5369L0 27.3293L14.932 0H19.2858ZM19.5107 0L35.6487 29.5369L38.7965 27.3293L23.8646 0H19.5107Z"
        fill="url(#paint_linear_102091a9-0bda-4a01-b3c6-5743819edc54)"
      />
      <path
        d="M35.4238 29.7107L19.3983 17.16L3.37271 29.7107L6.64323 32L19.3983 22.0147L32.1533 32L35.4238 29.7107Z"
        fill="url(#paint_linear_b9e79a98-76e0-4bd5-92bc-22033ca06329)"
      />
      <defs>
        <linearGradient
          id="paint_linear_102091a9-0bda-4a01-b3c6-5743819edc54"
          x1="5.47361"
          y1="37.4219"
          x2="32.4603"
          y2="7.45023"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FF5416" />
          <stop offset="0.2535" stop-color="#FF5115" />
          <stop offset="0.461" stop-color="#FF4712" />
          <stop offset="0.6523" stop-color="#FF350E" />
          <stop offset="0.8327" stop-color="#FF1E08" />
          <stop offset="1" stop-color="#FF0000" />
        </linearGradient>
        <linearGradient
          id="paint_linear_b9e79a98-76e0-4bd5-92bc-22033ca06329"
          x1="10.7084"
          y1="39.3593"
          x2="26.6583"
          y2="21.6452"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#FF5416" />
          <stop offset="0.2535" stop-color="#FF5115" />
          <stop offset="0.461" stop-color="#FF4712" />
          <stop offset="0.6523" stop-color="#FF350E" />
          <stop offset="0.8327" stop-color="#FF1E08" />
          <stop offset="1" stop-color="#FF0000" />
        </linearGradient>
      </defs>
    </svg>
  </h2>
</header>
<div class="App">
  {#if import.meta.env.MODE === "development"}
    <div class="button-container">
      <button on:click={sendFakeMessage}>Simulate Message Received</button><br
      />
      <button on:click={setupFakeMessageTimer}
        >Simulate Message Received On Timer</button
      >
    </div>
  {/if}

  <SourceGraph {history} />

  <ul class="key">
    <li class="repo key-item">repository</li>
    <li class="file key-item">file</li>
  </ul>
</div>

<style>
  header {
    display: flex;
    grid-template-columns: 100px 1fr 100px;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    color: #03020d;
    background-color: white;
  }

  .App {
    height: calc(100vh - 4rem);
  }
  h1 {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    font-size: 1.6rem;
  }

  h2 {
    font-size: 0.8em;
    display: flex;
    margin: 0;
  }

  .ably-logo {
    margin-left: 0.5rem;
    height: 3rem;
  }
  .visualiser-logo {
    height: 3rem;
    margin-right: 1rem;
  }

  .button-container {
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    z-index: 1;
  }

  .key {
    position: absolute;
    bottom: 0;
    right: 0;
    margin: 1rem;
    padding: 0;
    border-radius: 3px;
    list-style: none;
    background-color: rgba(255, 255, 255, 0.2);
    padding-bottom: 2.6em;
  }

  .key-item {
    display: flex;
    align-items: center;
    margin: 1rem;
  }

  .key-item::before {
    content: "";
    display: inline-block;
    width: 3rem;
    border: 2px solid #ff5416;
    background-color: #ff5416;
    height: 1.5rem;
    margin-right: 1rem;
    border-radius: 5px;
  }
  .file:before {
    border: 2px solid #dbdbdc;
    background-color: #292831;
  }

  @media (max-width: 600px) {
    h1 {
      font-size: 3vw;
    }
  }
</style>
