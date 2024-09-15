import React, { useCallback, useEffect, useRef, useState } from "react";
import "./quoteList.css";
import { useNavigate } from "react-router-dom";
import { fetchQuotes } from "../../services/api";
import AddIcon from "@mui/icons-material/Add";
import Skeleton from "@mui/material/Skeleton";
import NavBar from "../../Components/NavBar/navBar";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Box from "@mui/material/Box";

const QuoteList = () => {
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isPreviewModal, setIsPreviewModal] = useState(false);
  const quoteListRef = useRef(null);
  const [previewImage, setPreviewImage] = useState("");
  const [imageStyle, setImageStyle] = useState({});

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
      setQuotes((prev) => {
        const newQuotes = [...prev, ...fetchedQuotes];
        const uniqueQuotes = Array.from(
          new Set(newQuotes.map((q) => q.id))
        ).map((id) => newQuotes.find((q) => q.id === id));
        return uniqueQuotes;
      });
      setOffset((prev) => prev + fetchedQuotes.length);
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
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetch();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const previewModalDetails = (info) => {
    console.log("details", info);
    setPreviewImage(info.mediaUrl);
    setIsPreviewModal(true);
  };

  const handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (width < height) {
      // If the width is smaller, set width to 100% and height to auto
      setImageStyle({
        width: "100%",
        height: "auto",
      });
    } else {
      // If the height is smaller, set height to 100% and width to auto
      setImageStyle({
        width: "auto",
        height: "100%",
      });
    }
  };

  useEffect(() => {
    fetch();

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="quote-body">
        {isPreviewModal && (
          <div className="previewImageModal">
            <div className="close" onClick={() => setIsPreviewModal(false)}>
              X
            </div>
            <div className="modal-image-preview">
              <img style={imageStyle} src={`${previewImage}`} />
            </div>
          </div>
        )}
        <NavBar title={title} />
        <div className="quote-container">
          <AddIcon className="float-button" onClick={createQuote} />

          <div className="quote-list" ref={quoteListRef}>
            {quotes.length && (
              <Box
                sx={{
                  width: "calc(100vw - 20px)",
                  padding: "10px",
                  height: "calc(100vh - 90px)",
                  overflowY: "scroll",
                }}
              >
                <ImageList variant="masonry" cols={3} gap={8}>
                  {quotes.map((item, index) => (
                    <ImageListItem
                      className="img-container"
                      key={index}
                      onClick={() => previewModalDetails(item)}
                    >
                      {item.mediaUrl ? (
                        <img
                          srcSet={`${item.mediaUrl}?w=248&fit=crop&auto=format&dpr=2 2x`}
                          src={`${item.mediaUrl}?w=248&fit=crop&auto=format`}
                          alt={item.text}
                          loading="lazy"
                          style={{ objectFit: "cover" }}
                        />
                      ) : (
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
                          alt="No media available"
                          style={{ objectFit: "cover" }}
                        />
                      )}

                      <div className="text_overlay">
                        <div className="username">
                          <div>{item.username}</div>
                        </div>

                        <div className="desc">{item.text}</div>
                        <div className="time-card">
                          createdAt : {item.createdAt}
                        </div>
                      </div>
                    </ImageListItem>
                  ))}
                </ImageList>

                {hasMore && <div ref={lastBookElementRef}>Loading...</div>}

                {hasMore && (
                  <div className="skeleton-container">
                    {Array.from({ length: 10 }, (_, index) => (
                      <div className="skeleton-card" key={index}>
                        <Skeleton
                          variant="rectangular"
                          className="image"
                          animation="wave"
                        />
                        <Skeleton
                          variant="text"
                          className="username"
                          animation="wave"
                        />
                        <Skeleton
                          variant="text"
                          className="createdAt"
                          animation="wave"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </Box>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default QuoteList;
