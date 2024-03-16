import React, { useState } from 'react';
import '../Lore/style.css';
import 'bootstrap/dist/css/bootstrap.css';
import bookCover from '../../assets/book-cover.png';
import page from '../../assets/page.png';

import HTMLFlipBook from "react-pageflip";

const PageCover = React.forwardRef((props, ref) => {
  return (
    <div className="page page-cover" ref={ref} data-density="hard" onClick={props.onClick}>
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
        <h2 className="page-header">Page header - {props.number}</h2>
        <div className="page-image"></div>
        <div className="page-text">{props.children}</div>
        <div className="page-footer">{props.number + 1}</div>
      </div>
    </div>
  );
});

class DemoBook extends React.Component {
    constructor(props) {
      super(props);
  
      this.state = {
        page: 0,
        totalPage: 0,
        state: "", // Initialize state and orientation
        orientation: "",
        bookOpened: false // Track if the book is opened or not
      };
  
      this.flipBookRef = React.createRef(); // Create a ref for HTMLFlipBook
    }
  
    nextButtonClick = () => {
      this.flipBookRef.current.flipNext(); // Access flipNext directly through ref
    };
  
    prevButtonClick = () => {
      this.flipBookRef.current.flipPrev(); // Access flipPrev directly through ref
    };
  
    onPage = (e) => {
      this.setState({
        page: e.data,
      });
    };
  
    onLoad = () => {
      this.setState({
        totalPage: this.flipBookRef.current.pageFlip.getPageCount(), // Access getPageCount directly through pageFlip
      });
    };

    openBook = () => {
      this.setState({ bookOpened: true });
    };
  
    render() {
      return (
        <div>
          <HTMLFlipBook className="book"
            width={550}
            height={733}
            size="stretch"
            minWidth={315}
            maxWidth={1000}
            minHeight={400}
            maxHeight={1533}
            maxShadowOpacity={0.5}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={this.onPage}
            onLoad={this.onLoad}
            // className="demo-book"
            ref={this.flipBookRef}>
            <PageCover onClick={this.openBook}><img id="book-cover" src={bookCover} /></PageCover>
            <Page className="page" number={1} visible={this.state.bookOpened}>Lorem ipsu...</Page>
            <Page className="page" number={2} visible={this.state.bookOpened}>Lorem ipsum...</Page>
            <PageCover>THE END</PageCover>
          </HTMLFlipBook>

          <div className="container">
            <div>
              <button type="button" onClick={this.prevButtonClick}>
                Previous page
              </button>
              [<span>{this.state.page}</span> of
              <span>{this.state.totalPage}</span>]
              <button type="button" onClick={this.nextButtonClick}>
                Next page
              </button>
            </div>
            <div>
              State: <i>{this.state.state}</i>, orientation: <i>{this.state.orientation}</i>
            </div>
          </div>
        </div>
      );
    }
}
  
function Lore() {
  return (
    <div>
      <DemoBook />
    </div>
  );
}

export default Lore;

