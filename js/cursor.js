import { gsap } from 'gsap';
import { lerp, getMousePos, getSiblings } from './utils';

// Grab Mouse Position and set to mouse state
let mouse = { x: 0, y: 0 };
window.addEventListener("mousemove", (ev) => (mouse = getMousePos(ev)));

export default class Cursor {
  constructor(el) {
    // Vars
    this.Cursor = el;
    this.Cursor.style.opacity = 0;
    this.Item = document.querySelectorAll(".hero-inner-link-item");
    this.Hero = document.querySelector(".hero-inner");
    this.bounds = this.Cursor.getBoundingClientRect();
    this.cursorConfigs = {
      x: { previous: 0, current: 0, amt: 0.2 },
      y: { previous: 0, current: 0, amt: 0.2 },
    };
    // Define Mouse Move Function
    this.onMouseMoveEv = () => {
      this.cursorConfigs.x.previous = this.cursorConfigs.x.current = mouse.x;
      this.cursorConfigs.y.previous = this.cursorConfigs.y.previous = mouse.y;
      // Set cursor opacity to 1 when hovered on screen
      gsap.to(this.Cursor, {
        duration: 1,
        ease: 'Power3.easeOut',
        opacity: 1,
      });

      this.onScaleMouse();

      requestAnimationFrame(() => this.render());
      window.removeEventListener("mousemove", this.onMouseMoveEv);
    };
    window.addEventListener("mousemove", this.onMouseMoveEv);
  }

  onScaleMouse() {
    this.Item.forEach((link) => {
      if (link.matches(":hover")) {
        this.setVideo(link);
        this.scaleAnimation(this.Cursor.children[0], 0.8);
      }
      link.addEventListener("mouseenter", () => {
        // Gsap animation for scaling media
        this.setVideo(link);
        this.scaleAnimation(this.Cursor.children[0], 0.8);
      });
      // Scale down media on hover off
      link.addEventListener("mouseleave", () => {
        this.scaleAnimation(this.Cursor.children[0], 0);
      });
      // Hover on a tag and expand to 1.2
      link.children[1].addEventListener("mouseenter", () => {
        this.Cursor.classList.add("media-blend");
        this.scaleAnimation(this.Cursor.children[0], 1.2);
      });
      // Off Hover scale to .8
      link.children[1].addEventListener("mouseleave", () => {
        this.Cursor.classList.remove("media-blend");
        this.scaleAnimation(this.Cursor.children[0], 0.8);
      });
    });
  }

  scaleAnimation(el, amt) {
    gsap.to(el, {
      duration: 0.6,
      scale: amt,
      ease: "Power3.easeOut",
    });
  }

  setVideo(el) {
    // Grab the data-video-src and make sure it matches the video that should be shown in cursor
    let src = el.getAttribute("data-video-src");
    let video = document.querySelector(`#${src}`);
    let siblings = getSiblings(video);
    // console.log(src, "hovered")
    // console.log(siblings, "siblings")

    if (video.id == src) {
      gsap.set(video, { zIndex: 4, opacity: 1 });
      siblings.forEach((i) => {
        gsap.set(i, { zIndex: 1, opacity: 0 });
      });
    }
  }

  render() {
    this.cursorConfigs.x.current = mouse.x;
    this.cursorConfigs.y.current = mouse.y;

    // lerp
    for (const key in this.cursorConfigs) {
      // Lerp - A lerp returns the value between two numbers two numbers at a specified, decimal midpoint:
      this.cursorConfigs[key].previous = lerp(
        this.cursorConfigs[key].previous,
        this.cursorConfigs[key].current,
        this.cursorConfigs[key].amt
      );
    }
    // Setting the cursor x and y to our cursor html element
    this.Cursor.style.transform = `translateX(${this.cursorConfigs.x.previous}px) translateY(${this.cursorConfigs.y.previous}px)`;

    // RAF
    requestAnimationFrame(() => this.render());
  }
}