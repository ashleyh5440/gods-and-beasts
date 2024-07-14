import React, { useState } from 'react';
import '../Lore/style.css';
import 'bootstrap/dist/css/bootstrap.css';
import bookCover from '../../assets/book-cover.png';
import Nav from '../../components/Nav';
import HTMLFlipBook from "react-pageflip";

const BookCover = React.forwardRef((props, ref) => {
  return (
    <div
      // className="page page-cover"
      className="book-cover"
      ref={ref}
      data-density="hard"
      onClick={props.onClick}
      style={{ backgroundImage: `url(${props.backgroundImage})` }}
    >
      <div className="page-content">
        <h2>{props.children}</h2>
      </div>
    </div>
  );
});

const Page = React.forwardRef((props, ref) => {
  return (
    <div className={`page ${props.visible ? 'visible' : ''}`} ref={ref}>
      <div className="page-content">
        <div className="page-text">{props.children}</div>
      </div> 
    </div>
  );
});

class Book extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        page: 0,
        totalPage: 0,
        state: "",
        orientation: "",
        bookOpened: false
      };
  
      this.flipBookRef = React.createRef();
    }
  
    onPage = (e) => {
      this.setState({
        page: e.data,
      });
    };

    componentDidMount() {
      this.setState({
        // totalPage: this.flipBook.getPageFlip().getPageCount(),
      });
    }
  
    onLoad = () => {
      this.setState({
        totalPage: this.flipBookRef.current.pageFlip.getPageCount(),
      });
    };

    openBook = () => {
      this.setState({ bookOpened: true });
    };
  
    render() {
      return (
        <div style={{border: "4px solid green", height: "90vh"}}>
          <HTMLFlipBook className="book"
            width={550}
            height={700}
            size="stretch"
            minWidth={315}
            maxWidth={800}
            minHeight="90vh"
            maxHeight="90vh"
            maxShadowOpacity={0.5}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={this.onPage}
            onLoad={this.onLoad}
            // className="demo-book"
            ref={this.flipBookRef}>
            <BookCover onClick={this.openBook} ></BookCover>


            {/* pages */}
            <Page className="page" number={1} visible={this.state.bookOpened}>
                <div className="page-content">
                    <p>North America</p>
                    <p>South America</p>
                    <p>The Caribbean</p>
                    <p>The Pacific Islands</p>
                </div>
            </Page>
            <Page className="page" number={2} visible={this.state.bookOpened}>
                <div className="page-content">
                    <p>Africa</p>
                    <p>Europe</p>
                    <p>The Middle East</p>
                    <p>Asia</p>
                    <p>Australia</p>
                </div>
            </Page>
            <Page className="page" number={3} visible={this.state.bookOpened}>
                <div className="page-content">
                    <p>see me?</p>
                    <p>pantheon info page 1</p>
                </div>
            </Page>
            <Page className="page" number={4} visible={this.state.bookOpened}>
                <div className="page-content">
                <p>pantheon info page 2</p>
                </div>
            </Page>
            <BookCover>THE END</BookCover>
          </HTMLFlipBook>
        </div>
      );
    }
};
  
function Lore() {
  return (
    <section>
        <div className="book-container">
            <Book />
        </div>
    </section>
  );
};

export default Lore;


