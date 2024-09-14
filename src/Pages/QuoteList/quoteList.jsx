import React, { useCallback, useEffect, useRef, useState } from "react";
import "./quoteList.css";
import { useNavigate } from "react-router-dom";
import { fetchQuotes } from "../../services/api";
import AddIcon from "@mui/icons-material/Add";
import ImageIcon from "@mui/icons-material/Image";
import Skeleton from "@mui/material/Skeleton";
import NavBar from "../../Components/NavBar/navBar";

const QuoteList = () => {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  const title = "Quotes";

  const fetch = async () => {
    setLoading(true);
    const fetchedQuotes = await fetchQuotes(offset);

    if (fetchedQuotes === false) {
      setQuotes([]);
      navigate("/");
      return;
    }

    if (fetchedQuotes?.length === 0) {
      setHasMore(false);
    } else {
      setQuotes((prev) => [...prev, ...fetchedQuotes]);
      setOffset((prev) => prev + 20);
    }

    setLoading(false);
  };

  const createQuote = () => {
    navigate("/quotes/create-quote");
  };

  const observer = useRef();

  const lastBookElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetch();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    fetch();
  }, []);

  const renderSkeletonLoaders = () => {
    return Array.from({ length: 20 }, (_, index) => (
      <div className="skeleton-card" key={index}>
        <Skeleton variant="rectangular" className="image" animation="wave" />
        <Skeleton variant="text" className="username" animation="wave" />
        <Skeleton variant="text" className="createdAt" animation="wave" />
      </div>
    ));
  };

  return (
    <>
      <div className="quote-body">
        <NavBar title={title} />
        <div className="quote-container">
          <AddIcon className="float-button" onClick={createQuote} />

          <div className="quote-list">
            {loading ? (
              renderSkeletonLoaders()
            ) : quotes.length ? (
              quotes.map((quote, index) => (
                <div className="card" key={index}>
                  <div
                    className="img-container"
                    style={{ backgroundImage: `url(${quote.mediaUrl})` }}
                  >
                    {quote.mediaUrl ? (
                      <img
                        src={quote.mediaUrl}
                        alt="Quote visual"
                        onError={() =>
                          setQuotes((prev) =>
                            prev.map((q) =>
                              q.id === quote.id ? { ...q, imageError: true } : q
                            )
                          )
                        }
                      />
                    ) : (
                      <ImageIcon className="broken-image" />
                    )}
                    <div className="text_overlay">
                      <div className="username">
                        {quotes.length === index + 1 ? (
                          <div ref={lastBookElementRef}>{quote.username}</div>
                        ) : (
                          <div>{quote.username}</div>
                        )}
                      </div>

                      <div className="desc">{quote.text}</div>
                      <div className="time-card">
                        createdAt : {quote.createdAt}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-quotes">No quotes available</div>
            )}
          </div>
          {hasMore && !loading && <button onClick={fetch}>Load More</button>}
        </div>
      </div>
    </>
  );
};

export default QuoteList;
