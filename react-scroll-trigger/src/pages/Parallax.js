import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import styled from "styled-components";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";

import { removeMarkersFromDOM } from "../utils";

gsap.registerPlugin(ScrollTrigger);
const Spacer = styled.div`
  margin-bottom: 100vh;
`;
const Section = styled.div`
  position: relative;
  padding-top: 200px;
  padding-bottom: 300px;
`;
const Container = styled.div`
  padding: 20px;
  margin: 0 auto;
  max-width: 1070px;
  position: relative;
  z-index: 1;
`;
const Content = styled.div`
  width: 65%;
  background-color: rgba(152, 107, 21, 0.8);
  color: white;
  padding: 40px 60px;
`;

const Poop = styled.div`
  width: 70%;
  position: absolute;
  top: 0;
  right: -100px;
  height: 400px;
  font-size: 120px;
  text-align: center;
`;

const Question = styled.p`
  font-size: 60px;
`;

const Answer = styled.div`
  font-size: 30px;
  background-color: rgba(246, 243, 237, 0.8);
  display: inline-block;
  margin: 100px;
  padding: 20px;
`;

function Parallax() {
  const contentRef = useRef(null);
  const imageRef = useRef(null);
  const sectionRef = useRef(null);
  const answerRef = useRef(null);

  useEffect(() => {
    //on mount or update
    // You can use a ScrollTrigger in a tween or timeline
    const content = gsap.to(contentRef.current, {
      yPercent: -100,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        end: "bottom top",
        scrub: true,
        markers: true,
        id: "content",
      },
    });
    const answer = gsap.to(answerRef.current, {
      y: -window.innerHeight * 0.95,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,

        scrub: true,

        id: "answer",
      },
    });

    const image = gsap.to(imageRef.current, {
      yPercent: 50,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        // start: "top bottom", // the default values
        // end: "bottom top",
        // start: "center bottom",
        // end: "center top",
        scrub: 1,
        id: "image",
      },
    });

    return () => {
      content.kill(true);
      image.kill(true);
      answer.kill(true);
      ScrollTrigger.getById("content").kill(true);
      ScrollTrigger.getById("image").kill(true);
      ScrollTrigger.getById("answer").kill(true);
      removeMarkersFromDOM();
    };
  });

  return (
    <div className="App">
      <Spacer />

      <Section ref={sectionRef}>
        <Container>
          <Content ref={contentRef}>
            <Question>
              <strong>What did the poo say to the fart?</strong>
            </Question>
          </Content>
        </Container>

        <Poop ref={imageRef}>💩</Poop>
      </Section>
      <Answer ref={answerRef}>💨 You blow me away!💨</Answer>
    </div>
  );
}

export default Parallax;
