
import Page from 'components/Page';

import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  Row
} from 'reactstrap';
import { GiLaurelCrown, GiMoneyStack, GiPayMoney } from "react-icons/gi";
const HomePage = (props) => {
  var [modal, setModal] = useState(false);
  var [listNo, setListNo] = useState(0);
  //carousel
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [list, setList] = useState('');
  const [seniors, setSeniors] = useState([]);
  const [highWins, setHighWins] = useState([]);
  const [maxBets, setMaxBets] = useState([]);
  //products
  const [listVisible, setListVisible] = useState(list);
  const [items, setItems] = useState('');
  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  }

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  }

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  }
  const [slides, setSlides] = useState('');

  //products
  useEffect(() => {
    if (list == '' && items == '' && listVisible == '') {
      (async () => {
        const response = await fetch("/json/List", {
          "method": "GET",
          "headers": {
            "content-type": "application/json"
          }
        });
        const data = await response.json();
        await setList(data.items);
        await setListVisible(data.items);
        await setItems(data.carousel);
        setSlides(data.carousel.map((item) => {
          return (
            <CarouselItem
              onExiting={() => setAnimating(true)}
              onExited={() => setAnimating(false)}
              key={item.src}
            >
              <img src={item.src} alt={item.altText} style={{ width: "100%" }} />
            </CarouselItem>
          );
        }));
      })();
    }
  }, []);
  //products
  useEffect(() => {
    (async () => {
      const response = await fetch("/api/top-users", {
        "method": "GET",
        "headers": {
          "content-type": "application/json"
        }
      });
      const data = await response.json();
      setSeniors(data.seniors);
      setHighWins(data.highWins);
      setMaxBets(data.maxBets);
    })();
  }, []);
  return (

    <Page
      className="DashboardPage"
    >
      <div className='home-title'>
        <h1>Lucky Color</h1>
        <small>Make money everyday with you.</small>
      </div>
      {
        slides !== '' && slides.length !== 0 ? (
          <Carousel style={{ 'height': '300px', 'margin': '0 -16px' }}
            activeIndex={activeIndex}
            next={next}
            previous={previous}
          >
            <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} />
            {slides}
            <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
            <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
          </Carousel>
        ) : ''
      }
      <div className="section-title">
        <h4><span className='text-warning'><GiLaurelCrown /></span> <small>Senior Forecaster</small></h4>
      </div>
      <ul className="section-list">
        {
          seniors.map((ele, key) => (
            <li className="section-item" key={key}>
              <img src={"/uploads/avatars/" + (ele.avatar ? ele.id + "." + ele.avatar : "user.png")} className="section-avatar" />
              <ul className="section-item-name">
                <li>{ele.nickname}</li>
                <li className="item-phone">{ele.phone}</li>
              </ul>
              <div className="item-content">
                <div className="item-details">
                  <span className="item-details-name">
                    Total Bets:
              </span>
                  <span className="item-details-content">
                    <small>₹</small>{ele.bets}
                  </span>
                </div>
                <div className="item-details">
                  <span className="item-details-name">
                    Total Price:
              </span>
                  <span className="item-details-content">
                    <small>₹</small>{ele.prices}
                  </span>
                </div>
              </div>
            </li>
          ))
        }
      </ul>
      <div className="section-title">
        <h4><span className='text-warning'><GiMoneyStack /></span> <small>High Wins</small></h4>
      </div>
      <ul className="section-list">
        {
          highWins.map((ele, key) => (
            <li className="section-item" key={key}>
              <img src={"/uploads/avatars/" + (ele.user.avatar ? ele.user.id + "." + ele.user.avatar : "user.png")} className="section-avatar" />
              <ul className="section-item-name">
                <li>{ele.user.nickname}</li>
                <li className="item-phone">{ele.user.phone}</li>
              </ul>
              <div className="item-content">
                <div className="item-details">
                  <span className="item-details-name">
                    Round
                  </span>
                  <span className="item-details-content">
                    {ele.period}
                  </span>
                </div>
                <div className="item-details">
                  <span className="item-details-name">
                    Bets:
                  </span>
                  <span className="item-details-content">
                    <small>₹</small>{ele.contract}
                  </span>
                </div>
                <div className="item-details">
                  <span className="item-details-name">
                    Price:
              </span>
                  <span className="item-details-content">
                    <small>₹</small>{ele.amount}
                  </span>
                </div>
              </div>
            </li>
          ))
        }
      </ul>
      <div className="section-title">
        <h4><span className='text-warning'><GiPayMoney /></span> <small>Top Investors</small></h4>
      </div>
      <ul className="section-list">
        {
          maxBets.map((ele, key) => (
            <li className="section-item" key={key}>
              <img src={"/uploads/avatars/" + (ele.avatar ? ele.id + "." + ele.avatar : "user.png")} className="section-avatar" />
              <ul className="section-item-name">
                <li>{ele.nickname}</li>
                <li className="item-phone">{ele.phone}</li>
              </ul>
              <div className="item-content">
                <div className="item-details">
                  <span className="item-details-name">
                    Total Bets:
              </span>
                  <span className="item-details-content">
                    <small>₹</small>{ele.bets}
                  </span>
                </div>
                <div className="item-details">
                  <span className="item-details-name">
                    Total Price:
              </span>
                  <span className="item-details-content">
                    <small>₹</small>{ele.prices}
                  </span>
                </div>
              </div>
            </li>
          ))
        }
      </ul>




      <div style={{ height: "100px" }}>

      </div>

    </Page>
  );

}
export default HomePage;
