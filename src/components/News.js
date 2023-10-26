import React, { useEffect , useState} from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";

import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";


const  News=(props)=> {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  
  const capitalizeFirstLetter=(string) =>{
    return string.charAt(0).toUpperCase() + string.slice(1);
}
 
  const  updateNews=async()=> {
    props.setProgress(10)
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;

    
    setLoading(true)
    let data = await fetch(url);
    props.setProgress(30)
    let parsedData = await data.json(); 
    props.setProgress(70)
   setArticles(parsedData.articles)
   setTotalResults(parsedData.totalResults)
   setLoading(false)
   
    props.setProgress(100)
  }
  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)}- News Monkey`
    updateNews();
    
    // eslint-disable-next-line 
}, [])

 
  // const handleNextClick = async () => {
  //   updateNews();
  //   setPage(page+1)
  // };
  // const handlePrevClick = async () => {
    
  //   updateNews();
  //   setPage(page-1)
  // };
   const fetchMoreData = async() => {
  

     const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
     setPage(page+1)

 
   let data = await fetch(url);
   let parsedData = await data.json(); // Correct the method name to 'json()'
   setArticles(articles.concat(parsedData.articles))
   setTotalResults(parsedData.totalResults)
  
  
  };

    
    return (
      <div className="container my-3">
        <h1 className="text-center " style={{marginTop:'90px'}}>NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines </h1>

        {loading && <Spinner />} 
        <InfiniteScroll
              dataLength={articles.length}
              next={fetchMoreData}
              hasMore={articles.length!==totalResults}
              loader={<Spinner/>}
            >
       <div className="container">

      

              
            <div className="row">
              {
                articles.map((element) => (
                  <div className="col-md-4" key={element.url}>
                    <NewsItem
                      title={element.title ? element.title.slice(0, 45) : "..."}
                      description={
                        element.description
                          ? element.title.slice(0, 88)
                          : "Tap to see the Description"
                      }
                      imageUrl={
                        element.urlToImage
                          ? element.urlToImage
                          : "https://cdn.wionews.com/sites/default/files/2023/10/22/388177-untitled-design-2023-10-21t235832865.png"
                      }
                      newsUrl={element.url}
                      author={element.author ? element.author : "Unknown"}
                      date={element.publishedAt ? element.publishedAt : "Unknown"}
                      source={element.source.name ? element.source.name : "Unknown"}
                    />
                  </div>
                ))}
            </div>
            </div>
        </InfiniteScroll>
   
      </div>
    );
  
}
News.defaultProps = {
  country: "in",
  pageSize: 8,
  category: "general",
};
News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,

  category: PropTypes.string,
};
export default News;
