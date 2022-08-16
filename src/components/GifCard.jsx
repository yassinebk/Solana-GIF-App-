import React from "react";

const GifCard = ({
  gif,
  votes,
  upvote,
  downvote,
  removeVote,
  removeGif,
  isMyGif,
  walletAddress,
}) => {
  const myvote = () => {
    const filteredVotes = votes.filter((vote) => {
      console.log(vote.userAddress.toString(), walletAddress);
      return vote.userAddress.toString() === walletAddress;
    });
    const result =
      filteredVotes.length > 0 ? filteredVotes[0].voteValue.toString() : null;
    console.log("result", result, typeof result);

    return result;
  };

  return (
    <div className="gif-item" key={gif.gifId}>
      <div className="img-container">
        <img src={gif.gifLink} alt={gif.gifLink} />
        {isMyGif && (
          <div className="delete-icon" onClick={()=>removeGif(gif.gifId)}>
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-trash"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="#ff3300"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
              </svg>
            </button>
          </div>
        )}
      </div>
      <div className="card-controls">
        <div className="icon-section">
          <svg
            onClick={async () => {
              console.log(myvote);
              myvote() === "1"
                ? await removeVote(gif.gifId)
                : await upvote(gif.gifId);
            }}
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-thumb-up thumb-icon"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="#00abfb"
            fill={myvote() === "1" ? "#00abfb" : "none"}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3" />
          </svg>
          {"  "}
          {votes.filter((v) => v.voteValue.toString() === "1").length} {"  "}
          Votes
        </div>
        <div className="icon-section">
          <svg
            onClick={async () => {
              console.log("myvote", myvote);
              myvote() === "-1"
                ? await removeVote(gif.gifId)
                : await downvote(gif.gifId);
            }}
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-thumb-down thumb-icon"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="#00abfb"
            fill={myvote() === "-1" ? "#00abfb" : "none"}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M7 13v-8a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v7a1 1 0 0 0 1 1h3a4 4 0 0 1 4 4v1a2 2 0 0 0 4 0v-5h3a2 2 0 0 0 2 -2l-1 -5a2 3 0 0 0 -2 -2h-7a3 3 0 0 0 -3 3" />
          </svg>
          {votes.filter((v) => v.voteValue.toString() === "-1").length}
          {"   "}Votes
        </div>

        <div className="info-section"></div>
      </div>
    </div>
  );
};

export default GifCard;
