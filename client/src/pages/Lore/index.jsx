// import React, { useState } from 'react';
// import '../Lore/style.css';
// import 'bootstrap/dist/css/bootstrap.css';
// import bookCover from '../../assets/book-cover.png';
// import Nav from '../../components/Nav';
// import HTMLFlipBook from "react-pageflip";

// const PageCover = React.forwardRef((props, ref) => {
//   return (
//     <div className="page page-cover" ref={ref} data-density="hard" onClick={props.onClick}>
//       <div className="page-content">
//         <h2>{props.children}</h2>
//       </div>
//     </div>
//   );
// });

// const Page = React.forwardRef((props, ref) => {
//   return (
//     <div className={`page ${props.visible ? 'visible' : ''}`} ref={ref}>
//       <div className="page-content">
//         <div className="page-text">{props.children}</div>
//       </div> 
//     </div>
//   );
// });

// class Book extends React.Component {
//     constructor(props) {
//       super(props);
  
//       this.state = {
//         page: 0,
//         totalPage: 0,
//         state: "", // Initialize state and orientation
//         orientation: "",
//         bookOpened: false // Track if the book is opened or not
//       };
  
//       this.flipBookRef = React.createRef(); // Create a ref for HTMLFlipBook
//     }
  
//     nextButtonClick = () => {
//       this.flipBookRef.current.flipNext(); // Access flipNext directly through ref
//     };
  
//     prevButtonClick = () => {
//       this.flipBookRef.current.flipPrev(); // Access flipPrev directly through ref
//     };
  
//     onPage = (e) => {
//       this.setState({
//         page: e.data,
//       });
//     };
  
//     onLoad = () => {
//       this.setState({
//         totalPage: this.flipBookRef.current.pageFlip.getPageCount(), // Access getPageCount directly through pageFlip
//       });
//     };

//     openBook = () => {
//       this.setState({ bookOpened: true });
//     };
  
//     render() {
//       return (
//         <div>
//           <HTMLFlipBook className="book"
//             width={550}
//             height={700}
//             size="stretch"
//             minWidth={315}
//             maxWidth={1000}
//             minHeight={400}
//             maxHeight={1533}
//             maxShadowOpacity={0.5}
//             showCover={true}
//             mobileScrollSupport={true}
//             onFlip={this.onPage}
//             onLoad={this.onLoad}
//             // className="demo-book"
//             ref={this.flipBookRef}>
//             <PageCover onClick={this.openBook}><img id="book-cover" src={bookCover} /></PageCover>

//             {/* pages */}
//             <Page className="page" number={1} visible={this.state.bookOpened}>
//                 <div className="page-content">
//                     <p>North America</p>
//                     <p>South America</p>
//                     <p>The Caribbean</p>
//                     <p>The Pacific Islands</p>
//                 </div>
//             </Page>
//             <Page className="page" number={2} visible={this.state.bookOpened}>
//                 <div className="page-content">
//                     <p>Africa</p>
//                     <p>Europe</p>
//                     <p>The Middle East</p>
//                     <p>Asia</p>
//                     <p>Australia</p>
//                 </div>
//             </Page>
//             <PageCover>THE END</PageCover>
//           </HTMLFlipBook>

//           {/* <div className="container">
//             <div>
//               <button type="button" onClick={this.prevButtonClick}>
//                 Previous page
//               </button>
//               [<span>{this.state.page}</span> of
//               <span>{this.state.totalPage}</span>]
//               <button type="button" onClick={this.nextButtonClick}>
//                 Next page
//               </button>
//             </div>
//           </div> */}
//         </div>
//       );
//     }
// };
  
// function Lore() {
//   return (
//     <div>
//         <div>
//             <Book />
//         </div>
//     </div>
//   );
// };

// export default Lore;

import React, { useState } from 'react';
import '../Lore/style.css';
import 'bootstrap/dist/css/bootstrap.css';
import bookCover from '../../assets/book-cover.png';
import Nav from '../../components/Nav';
import HTMLFlipBook from "react-pageflip";

const PageCover = React.forwardRef((props, ref) => {
  return (
    <div
      className="page page-cover"
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
            height={700}
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
            <PageCover onClick={this.openBook} backgroundImage="../../assets/book-cover.png">Cover Page</PageCover>


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
            <PageCover>THE END</PageCover>
          </HTMLFlipBook>

          {/* <div className="container">
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
          </div> */}
        </div>
      );
    }
};
  
function Lore() {
  return (
    <div>
        <div>
            <Book />
        </div>
    </div>
  );
};

export default Lore;
