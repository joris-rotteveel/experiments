import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import styled from "styled-components";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";

import { removeMarkersFromDOM } from "../utils";

gsap.registerPlugin(ScrollTrigger);
const Spacer = styled.div`
  margin-bottom: 100vh;
  background: red;
`;
const Section = styled.div`
  position: relative;
  padding-top: 200px;
  padding-bottom: 300px;
`;
const ScrollContainer = styled.div`
  padding: 20px;
  display: flex;
  align-items: flex-start;
`;
const ScrollItem = styled.div`
  flex: 1;
  background-color: grey;
  padding: 40px;
  margin: 10px;
  min-height: 100vh;
`;

function Scrollio() {
  const sectionRef = useRef(null);

  useEffect(() => {
    //on mount or update
    // You can use a ScrollTrigger in a tween or timeline
    const scrollItems = document.querySelectorAll(".js-content");
    // set to arbitrary amount of pixels that need to be scrolled
    const left = document.querySelector(".js-left");
    const sectionScrollHeight = left.getBoundingClientRect().height;
    const scrollOffsets = [...scrollItems].map((item) => {
      const totalHeightOfElement = item.getBoundingClientRect().height;
      const scrollHeight = sectionScrollHeight - totalHeightOfElement;
      return { item, scrollHeight };
    });

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      scrub: true,
      start: "top top",
      end: "+=" + sectionScrollHeight + "px",
      markers: true,

      onUpdate: (self) => {
        const progress = self.progress.toFixed(3);
        scrollOffsets.forEach(({ item, scrollHeight }) => {
          const offset = scrollHeight * progress;
          gsap.set(item, { y: offset, marginBottom: offset });
        });
      },
    });

    return () => {
      st.kill(true);
      removeMarkersFromDOM();
    };
  });

  return (
    <div className="App">
      <Section ref={sectionRef} className="about-content section-content">
        <ScrollContainer className="scroll-container about-content">
          <ScrollItem className="js-left js-content">
            <div>
              <p>
                Maecenas vulputate commodo nibh, eu interdum turpis condimentum
                sodales. Integer nec porta erat. Etiam in tempus elit. Proin
                ullamcorper mi sapien, ut elementum neque hendrerit id.
                Pellentesque euismod eros turpis, sit amet lacinia tellus
                placerat et. Aliquam aliquet diam eu convallis tristique. Nunc
                dui mauris, porta a ornare et, ornare nec erat. Nunc id leo eget
                ipsum lobortis lacinia. Proin purus tellus, interdum eu
                vestibulum tempus, dapibus sit amet erat. Ut id purus elementum,
                aliquam lectus bibendum, dictum neque. Donec facilisis nisi sit
                amet metus efficitur, non blandit mi blandit. Nullam finibus
                pharetra metus. Cras leo odio, suscipit non sollicitudin vitae,
                posuere at libero. Orci varius natoque penatibus et magnis dis
                parturient montes, nascetur ridiculus mus.
              </p>
              <p>
                Maecenas vulputate commodo nibh, eu interdum turpis condimentum
                sodales. Integer nec porta erat. Etiam in tempus elit. Proin
                ullamcorper mi sapien, ut elementum neque hendrerit id.
                Pellentesque euismod eros turpis, sit amet lacinia tellus
                placerat et. Aliquam aliquet diam eu convallis tristique. Nunc
                dui mauris, porta a ornare et, ornare nec erat. Nunc id leo eget
                ipsum lobortis lacinia. Proin purus tellus, interdum eu
                vestibulum tempus, dapibus sit amet erat. Ut id purus elementum,
                aliquam lectus bibendum, dictum neque. Donec facilisis nisi sit
                amet metus efficitur, non blandit mi blandit. Nullam finibus
                pharetra metus. Cras leo odio, suscipit non sollicitudin vitae,
                posuere at libero. Orci varius natoque penatibus et magnis dis
                parturient montes, nascetur ridiculus mus.
              </p>
              <p>
                Maecenas vulputate commodo nibh, eu interdum turpis condimentum
                sodales. Integer nec porta erat. Etiam in tempus elit. Proin
                ullamcorper mi sapien, ut elementum neque hendrerit id.
                Pellentesque euismod eros turpis, sit amet lacinia tellus
                placerat et. Aliquam aliquet diam eu convallis tristique. Nunc
                dui mauris, porta a ornare et, ornare nec erat. Nunc id leo eget
                ipsum lobortis lacinia. Proin purus tellus, interdum eu
                vestibulum tempus, dapibus sit amet erat. Ut id purus elementum,
                aliquam lectus bibendum, dictum neque. Donec facilisis nisi sit
                amet metus efficitur, non blandit mi blandit. Nullam finibus
                pharetra metus. Cras leo odio, suscipit non sollicitudin vitae,
                posuere at libero. Orci varius natoque penatibus et magnis dis
                parturient montes, nascetur ridiculus mus.
              </p>
              <p>
                Maecenas vulputate commodo nibh, eu interdum turpis condimentum
                sodales. Integer nec porta erat. Etiam in tempus elit. Proin
                ullamcorper mi sapien, ut elementum neque hendrerit id.
                Pellentesque euismod eros turpis, sit amet lacinia tellus
                placerat et. Aliquam aliquet diam eu convallis tristique. Nunc
                dui mauris, porta a ornare et, ornare nec erat. Nunc id leo eget
                ipsum lobortis lacinia. Proin purus tellus, interdum eu
                vestibulum tempus, dapibus sit amet erat. Ut id purus elementum,
                aliquam lectus bibendum, dictum neque. Donec facilisis nisi sit
                amet metus efficitur, non blandit mi blandit. Nullam finibus
                pharetra metus. Cras leo odio, suscipit non sollicitudin vitae,
                posuere at libero. Orci varius natoque penatibus et magnis dis
                parturient montes, nascetur ridiculus mus.
              </p>
              <p>
                Maecenas vulputate commodo nibh, eu interdum turpis condimentum
                sodales. Integer nec porta erat. Etiam in tempus elit. Proin
                ullamcorper mi sapien, ut elementum neque hendrerit id.
                Pellentesque euismod eros turpis, sit amet lacinia tellus
                placerat et. Aliquam aliquet diam eu convallis tristique. Nunc
                dui mauris, porta a ornare et, ornare nec erat. Nunc id leo eget
                ipsum lobortis lacinia. Proin purus tellus, interdum eu
                vestibulum tempus, dapibus sit amet erat. Ut id purus elementum,
                aliquam lectus bibendum, dictum neque. Donec facilisis nisi sit
                amet metus efficitur, non blandit mi blandit. Nullam finibus
                pharetra metus. Cras leo odio, suscipit non sollicitudin vitae,
                posuere at libero. Orci varius natoque penatibus et magnis dis
                parturient montes, nascetur ridiculus mus.
              </p>
              <p>
                Maecenas vulputate commodo nibh, eu interdum turpis condimentum
                sodales. Integer nec porta erat. Etiam in tempus elit. Proin
                ullamcorper mi sapien, ut elementum neque hendrerit id.
                Pellentesque euismod eros turpis, sit amet lacinia tellus
                placerat et. Aliquam aliquet diam eu convallis tristique. Nunc
                dui mauris, porta a ornare et, ornare nec erat. Nunc id leo eget
                ipsum lobortis lacinia. Proin purus tellus, interdum eu
                vestibulum tempus, dapibus sit amet erat. Ut id purus elementum,
                aliquam lectus bibendum, dictum neque. Donec facilisis nisi sit
                amet metus efficitur, non blandit mi blandit. Nullam finibus
                pharetra metus. Cras leo odio, suscipit non sollicitudin vitae,
                posuere at libero. Orci varius natoque penatibus et magnis dis
                parturient montes, nascetur ridiculus mus.
              </p>
              <p>
                Maecenas vulputate commodo nibh, eu interdum turpis condimentum
                sodales. Integer nec porta erat. Etiam in tempus elit. Proin
                ullamcorper mi sapien, ut elementum neque hendrerit id.
                Pellentesque euismod eros turpis, sit amet lacinia tellus
                placerat et. Aliquam aliquet diam eu convallis tristique. Nunc
                dui mauris, porta a ornare et, ornare nec erat. Nunc id leo eget
                ipsum lobortis lacinia. Proin purus tellus, interdum eu
                vestibulum tempus, dapibus sit amet erat. Ut id purus elementum,
                aliquam lectus bibendum, dictum neque. Donec facilisis nisi sit
                amet metus efficitur, non blandit mi blandit. Nullam finibus
                pharetra metus. Cras leo odio, suscipit non sollicitudin vitae,
                posuere at libero. Orci varius natoque penatibus et magnis dis
                parturient montes, nascetur ridiculus mus.
              </p>
            </div>
          </ScrollItem>
          <ScrollItem className=" js-content">
            <div className="js-move-me">
              <p>Cras eu lectus eu tortor eleifend molestie.</p>
              <p>Cras eu lectus eu tortor eleifend molestie.</p>
              <p>Cras eu lectus eu tortor eleifend molestie.</p>
              <p>Cras eu lectus eu tortor eleifend molestie.</p>
              <p>Cras eu lectus eu tortor eleifend molestie.</p>
              <p>Cras eu lectus eu tortor eleifend molestie.</p>
              <p>Cras eu lectus eu tortor eleifend molestie.</p>
              <p>Cras eu lectus eu tortor eleifend molestie.</p>
              <p>Cras eu lectus eu tortor eleifend molestie.</p>
              <p>Cras eu lectus eu tortor eleifend molestie.</p>
              <p>Cras eu lectus eu tortor eleifend molestie.</p>
              <p>Cras eu lectus eu tortor eleifend molestie.</p>
              <p>Cras eu lectus eu tortor eleifend molestie.</p>
              <p>Cras eu lectus eu tortor eleifend molestie.</p>
              <p>Cras eu lectus eu tortor eleifend molestie.</p>
              <p>Cras eu lectus eu tortor eleifend molestie.</p>
              <p>Cras eu lectus eu tortor eleifend molestie.</p>
              <p>Cras eu lectus eu tortor eleifend molestie.</p>
              <p>Cras eu lectus eu tortor eleifend molestie.</p>
            </div>
          </ScrollItem>
        </ScrollContainer>
        <Spacer>this is another section, no more scroll updates please</Spacer>
      </Section>
    </div>
  );
}

export default Scrollio;
